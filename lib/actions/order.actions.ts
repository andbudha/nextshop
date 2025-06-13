'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { formatError } from '../utils';
import { auth } from '@/auth';
import { getMyCart } from './cart.actions';
import { getUserById } from './user.actions';
import { insertOrderSchema } from '../validators';
import { prisma } from '@/db/prisma';
import { CartItem } from '@/types';

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
      shipingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    });

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
