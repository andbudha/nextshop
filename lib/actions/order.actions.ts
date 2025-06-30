'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { convertToPlainObject, formatError } from '../utils';
import { auth } from '@/auth';
import { getMyCart } from './cart.actions';
import { getUserById } from './user.actions';
import { insertOrderSchema } from '../validators';
import { prisma } from '@/db/prisma';
import { CartItem } from '@/types';
import { paypal } from '../paypal';

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
    console.log('User address:', user.address);
    console.log('User cart:', cart);
    console.log('User payment method:', user.paymentMethod);
    console.log('User id:', user.id);

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
