'use client';
import { Review } from '@/types';
import Link from 'next/link';
import { useState } from 'react';
import ReviewForm from './review-form';

const ReviewList = ({
  userId,
  productId,
  productSlug,
}: {
  userId: string;
  productId: string;
  productSlug: string;
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const reload = async () => {
    console.log('Rview list reloaded');
  };

  return (
    <div className="space-y-4">
      {reviews.length === 0 && (
        <div className=" text-md mt-4 italic">No reviews yet...</div>
      )}
      {userId ? (
        <ReviewForm
          userId={userId}
          productId={productId}
          onReviewSubmited={reload}
        />
      ) : (
        <div>
          Please{' '}
          <Link
            className="text-orange-700 px-2"
            href={`/sign-in?callbackUrl=/product/${productSlug}`}
          >
            sign in
          </Link>{' '}
          to leave a review.
        </div>
      )}
      <div className="flex flex-col gap-3">{/* Review List*/}</div>
    </div>
  );
};

export default ReviewList;
