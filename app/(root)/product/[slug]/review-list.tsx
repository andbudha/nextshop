'use client';
import { Review } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ReviewForm from './review-form';
import { getReviewsByProductId } from '@/lib/actions/review.actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar, UserIcon } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import Rating from '@/components/shared/product/rating';

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
  useEffect(() => {
    const loadReviews = async () => {
      const res = await getReviewsByProductId(productId);
      if (res) {
        setReviews(res.data);
      }
    };

    loadReviews();
  }, [productId]);

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
      <div className="flex flex-col gap-3">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex-between">
                <CardTitle>{review.title}</CardTitle>
              </div>
              <CardDescription>{review.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 text-sm text-muted-foreground">
                <Rating value={review.rating} />
                <div className="flex items-center space-x-1.5">
                  <UserIcon className="h-4 w-4" />
                  <span>{review.user ? review.user.name : 'Anonymous'}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateTime(review.createdAt).dateTime}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
