'use server';

import { z } from 'zod';
import { insertReviewSchema } from '../validators';
import { formatError } from '../utils';
import { auth } from '@/auth';
import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';

//create and update review
export async function createUpdateReview(
  data: z.infer<typeof insertReviewSchema>
) {
  try {
    const session = await auth();
    if (!session) throw new Error('User is not authorized');
    //validate and store the review
    const review = insertReviewSchema.parse({
      ...data,
      userId: session.user.id,
    });

    //get the product being reviewed
    const product = await prisma.product.findFirst({
      where: { id: review.productId },
    });
    if (!product) {
      throw new Error('Product not found');
    }

    //check if the user has already reviewed the product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId: review.productId,
        userId: review.userId,
      },
    });

    await prisma.$transaction(async (tx) => {
      if (existingReview) {
        //update the review
        await tx.review.update({
          where: { id: existingReview.id },
          data: {
            title: review.title,
            description: review.description,
            rating: review.rating,
          },
        });
      } else {
        //create a new review
        await tx.review.create({ data: review });
      }

      //get the average rating of the product
      const averageRating = await tx.review.aggregate({
        _avg: { rating: true },
        where: { productId: review.productId },
      });

      //get number of reviews for the product
      const numReviews = await tx.review.count({
        where: { productId: review.productId },
      });

      //update the product with the average rating and review count
      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: averageRating._avg.rating || 0,
          numReviews,
        },
      });
    });
    revalidatePath(`/product/${product.slug}`);
    return {
      success: true,
      message: 'Review updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error) || 'An error occurred while creating review',
    };
  }
}
