'use server';
import { prisma } from '@/db/prisma';
import { LATEST_PRODUCTS_LIMIT, PRODUCTS_PER_PAGE } from '../constants';
import { convertToPlainObject, formatError } from '../utils';
import { revalidatePath } from 'next/cache';
import { insertProductSchema, updateProductSchema } from '../validators';
import z from 'zod';
import { Prisma } from '@prisma/client';

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
  query,
  category,
  // sort,
  price,
  rating,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
  sort?: string;
  price?: string;
  rating?: string;
}) {
  // Query filter
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {};
  // Category filter
  const categoryFilter = category && category !== 'all' ? { category } : {};
  //Price Filter
  const priceFilter: Prisma.ProductWhereInput =
    price && price !== 'all'
      ? {
          price: {
            gte: Number(price.split('-')[0]),
            lte: Number(price.split('-')[1]),
          },
        }
      : {};
  //Rating Filter
  const ratingFilter: Prisma.ProductWhereInput =
    rating && rating !== 'all'
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      : {};

  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' },
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

//create product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    const product = insertProductSchema.parse(data);
    await prisma.product.create({
      data: product,
    });
    revalidatePath('/admin/products');
    return {
      success: true,
      message: 'Product created successfully!',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//get product by id
export async function getProductById(productId: string) {
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
    },
  });
  return convertToPlainObject(product);
}

//update product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    const product = updateProductSchema.parse(data);
    const productToUpdate = await prisma.product.findFirst({
      where: {
        id: product.id,
      },
    });
    if (!productToUpdate) throw new Error('Product not found');
    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: product,
    });
    revalidatePath('/admin/products');
    return {
      success: true,
      message: 'Product updated successfully!',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

//get all categories
export async function getAllCategories() {
  const data = await prisma.product.groupBy({
    by: ['category'],
    _count: {
      _all: true,
    },
  });
  const categoriesWithCount = data.map((item) => ({
    category: item.category,
    count: item._count._all,
  }));

  return categoriesWithCount;
}

//get featured products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: {
      isFeatured: true,
    },
    take: 4,
    orderBy: {
      createdAt: 'desc',
    },
  });
  return convertToPlainObject(data);
}
