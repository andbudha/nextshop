'use server';
import { cookies } from 'next/headers';
import { CartItem } from '@/types';
import { convertToPlainObject, formatError } from '../utils';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema } from '../validators';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function addItemToCart(data: CartItem) {
  try {
    //check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('No session cart ID found');
    //get session and the user-id
    const session = await auth();
    //if userid not found set it to undefined without throwing an error
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    //get cart
    const cart = await getMyCart;

    //pars and validate
    const item = cartItemSchema.parse(data);

    //find item in db
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });

    console.log({
      userId: userId,
      sessionCartId: sessionCartId,
      itemAdded: item,
      productFound: product,
    });

    return {
      success: true,
      message: 'Item added to cart',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

export async function getMyCart() {
  //check for cart cookie
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) throw new Error('No session cart ID found');
  //get session and the user-id
  const session = await auth();
  //if userid not found set it to undefined without throwing an error
  const userId = session?.user?.id ? (session.user.id as string) : undefined;
  console.log({ userId: userId, sessionCartId: sessionCartId });
  //get user cart from data base
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });
  if (!cart) return undefined;
  //convert decimal and return
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}
