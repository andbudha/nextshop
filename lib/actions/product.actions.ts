'use server';
import { prisma } from '@/db/prisma';
import { LATEST_PRODUCTS_LIMIT, PRODUCTS_PER_PAGE } from '../constants';
import { convertToPlainObject, formatError } from '../utils';
import { revalidatePath } from 'next/cache';

//Get latest products from the database
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: 'desc',
    },
  });
  return convertToPlainObject(data);
}

//Get single product by slug
export async function getProductBySlug(slug: string) {
  const data = await prisma.product.findFirst({
    where: {
      slug,
    },
  });
  return convertToPlainObject(data);
}

//get all products
export async function getAllProducts({
  limit = PRODUCTS_PER_PAGE,
  page,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
}) {
  const data = await prisma.product.findMany({
    skip: (page - 1) * limit,
    take: limit,
  });
  const dataCount = await prisma.product.count();
  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

//delete product by id
export async function deleteProduct(productId: string) {
  try {
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });
    if (!existingProduct) {
      throw new Error('Product not found!');
    }
    await prisma.product.delete({
      where: {
        id: productId,
      },
    });
    revalidatePath('/admin/products');
    return {
      success: true,
      message: 'Product deleted successfully!',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
