'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { convertToPlainObject, formatError } from '../utils';
import { auth } from '@/auth';
import { getMyCart } from './cart.actions';
import { getUserById } from './user.actions';
import { insertOrderSchema } from '../validators';
import { prisma } from '@/db/prisma';
import { CartItem, PaymentResult } from '@/types';
import { paypal } from '../paypal';
import { revalidatePath } from 'next/cache';
import { ORDERS_PER_PAGE } from '../constants';

//create order and order items
export async function createOrder() {
  try {
    const session = await auth();
    if (!session || !session.user) throw new Error('User not authenticated');
    const cart = await getMyCart();
    const userId = session.user.id;
    if (!userId) throw new Error('User not found');
    const user = await getUserById(userId);

    //this prevents creating an order when there is nothing to order.
    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: 'Your cart is empty',
        redirectTo: '/cart',
      };
    }
    //this prevents creating an order when there is no shipping address.
    if (!user.address) {
      return {
        success: false,
        message: 'Shipping address is required',
        redirectTo: '/shipping-address',
      };
    }
    //this prevents creating an order when there is no payment method.
    if (!user.paymentMethod) {
      return {
        success: false,
        message: 'Payment method is required',
        redirectTo: '/payment-method',
      };
    }

    //create order object
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });
    console.log('Order:::', order);

    //prisma transaction use to create order and order items at the same time in database
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      //create order
      const insertedOrder = await tx.order.create({
        data: order,
      });
      //create order items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id,
          },
        });
      }
      //having placed the order we have to clear the cart and set the prices to 0
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          itemsPrice: 0,
          shippingPrice: 0,
          taxPrice: 0,
          totalPrice: 0,
        },
      });
      return insertedOrder.id;
    });
    if (!insertedOrderId) throw new Error('Order not created');
    return {
      success: true,
      message: 'Order created successfully',
      redirectTo: `/order/${insertedOrderId}`,
    };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return {
      success: false,
      message: formatError(error) || 'An error occurred while creating order',
    };
  }
}

//get order by id
export async function getOrderById(orderId: string) {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });
  return convertToPlainObject(data);
}

//create new paypal order
export async function createPaypalOrder(orderId: string) {
  try {
    //get order from database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (order) {
      //create paypal order
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice));
      //update order with paypal order id
      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          paymentResult: {
            id: paypalOrder.id,
            status: '',
            email_address: '',
            pricePaid: '',
          },
        },
      });
      return {
        success: true,
        message: 'Paypal order created successfully',
        data: paypalOrder.id,
      };
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error) || 'An error occurred while creating order',
    };
  }
}

//approve paypal order and update to paid
export async function approvePaypalOrder(
  orderId: string,
  data: { orderID: string }
) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) throw new Error('Order not found');

    const captureData = await paypal.capturePayment(data.orderID);
    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult)?.id ||
      captureData.status !== 'COMPLETED'
    ) {
      throw new Error('Error in Paypal payment');
    }
    //update order status to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        status: captureData.status,
        email_address: captureData.payer.email_address,
        pricePaid:
          captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    });

    revalidatePath(`/order/${orderId}`);
    return {
      success: true,
      message: 'Paypal order approved successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error) || 'An error occurred while creating order',
    };
  }
}

//update order status to paid
async function updateOrderToPaid({
  orderId,
  paymentResult,
}: {
  orderId: string;
  paymentResult?: PaymentResult;
}) {
  //get order from db
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderItems: true,
    },
  });
  if (!order) throw new Error('Order not found');
  if (order.isPaid) throw new Error('Order already paid');

  //transaction to update order and the account for the order stock
  await prisma.$transaction(async (tx) => {
    //iterate over products and update stock
    for (const item of order.orderItems) {
      await tx.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            increment: -item.qty,
          },
        },
      });
    }
    //set the order to paid
    await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    });
  });
  //get updated order after transaction
  const updatedOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!updatedOrder) throw new Error('Order not found');
}

//get user's orders
export async function getMyOrders({
  limit = ORDERS_PER_PAGE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  const session = await auth();
  if (!session) throw new Error('User is not authorized');

  const data = await prisma.order.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });
  const dataCount = await prisma.order.count({
    where: { userId: session?.user?.id },
  });
  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}
