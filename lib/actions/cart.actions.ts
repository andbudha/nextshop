'use server';
import { cookies } from 'next/headers';
import { CartItem } from '@/types';
import {
  convertToPlainObject,
  formatError,
  roundToTwoDecimalPlaces,
} from '../utils';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { cartItemSchema, insertCartSchema } from '../validators';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

//calculate cart prices
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = roundToTwoDecimalPlaces(
    items.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0)
  );
  const shippingPrice = roundToTwoDecimalPlaces(itemsPrice > 100 ? 0 : 10);
  const taxtPrice = roundToTwoDecimalPlaces(itemsPrice * 0.15);
  const totalPrice = roundToTwoDecimalPlaces(
    itemsPrice + shippingPrice + taxtPrice
  );
  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxtPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

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
    const cart = await getMyCart();

    //pars and validate
    const item = cartItemSchema.parse(data);

    //find item in db
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    //if product not found throw error
    if (!product) {
      throw new Error('Product not found');
    }
    //if there is no cart, create one
    if (!cart) {
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });
      //add cart to db
      await prisma.cart.create({
        data: newCart,
      });
      //revalidate product page
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      //check if item is already in the cart
      const existingItem = (cart.items as CartItem[]).find(
        (x) => x.productId === item.productId
      );
      if (existingItem) {
        //check stock
        if (product.stock < existingItem.quantity + 1) {
          throw new Error('Not enough stock available');
        }
        //increase quantity
        (cart.items as CartItem[]).find(
          (x) => x.productId === item.productId
        )!.quantity = existingItem.quantity + 1;
      } else {
        //if item is not in the cart
        //check stock
        if (product.stock < 1) throw new Error('Not enough stock available');
        //add item to cart
        cart.items.push(item);
      }
      //save to db
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          items: cart.items as Prisma.CartUpdateitemsInput[],
          ...calcPrice(cart.items as CartItem[]),
        },
      });
      //revalidate product page
      revalidatePath(`/product/${product.slug}`);
      return {
        success: true,
        message: `${product.name} ${
          existingItem ? 'updated in' : 'added to'
        } cart`,
      };
    }
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

export async function removeItemFromCart(productId: string) {
  try {
    //check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('No session cart ID found');
    //get product
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) {
      throw new Error('Product not found');
    }

    //get user's cart
    const cart = await getMyCart();
    if (!cart) {
      throw new Error('Cart not found');
    }
    //find item in cart
    const existingItem = (cart.items as CartItem[]).find(
      (x) => x.productId === productId
    );
    //if item not found, throw error
    if (!existingItem) {
      throw new Error('Item not found in cart');
    }
    //check if one in quantity
    if (existingItem.quantity === 1) {
      //remove from cart
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId !== productId
      );
    } else {
      //decrease quantity
      (cart.items as CartItem[]).find(
        (x) => x.productId === productId
      )!.quantity = existingItem.quantity - 1;
    }
    //update cart in db
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: cart.items as Prisma.CartUpdateitemsInput[],
        ...calcPrice(cart.items as CartItem[]),
      },
    });
    //revalidate product page
    revalidatePath(`/product/${product.slug}`);
    return {
      success: true,
      message: `${product.name} removed from cart`,
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
