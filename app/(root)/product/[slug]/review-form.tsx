'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { createUpdateReview } from '@/lib/actions/review.actions';
import { reviewFormDefaultValues } from '@/lib/constants';
import { insertReviewSchema } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { StarIcon } from 'lucide-react';
import { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';

const ReviewForm = ({
  userId,
  productId,
  onReviewSubmited,
}: {
  userId: string;
  productId: string;
  onReviewSubmited: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<z.infer<typeof insertReviewSchema>>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: reviewFormDefaultValues,
  });

  //open form handler
  const handleOpenForm = () => {
    form.setValue('productId', productId);
    form.setValue('userId', userId);
    setOpen(true);
  };

  //submit form handler
  const onSubmit: SubmitHandler<z.infer<typeof insertReviewSchema>> = async (
    values
  ) => {
    const res = await createUpdateReview({
      ...values,
      productId,
    });

    if (!res.success) {
      toast({
        variant: 'destructive',
        description: res.message,
      });
    }

    setOpen(false);
    onReviewSubmited?.();
    toast({
      description: res.message,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={handleOpenForm} variant={'default'}>
        Write a Review
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <FormProvider {...form}>
          <form method="post" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>
                Share your thoughts about this product
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter title" />
                    </FormControl>
                  </FormItem>
                )}
              />{' '}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter title" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="flex flex-row space-x-2 font-semibold">
                          {field.value === 0 ? (
                            <div className="text-gray-500">Select rating</div>
                          ) : (
                            ''
                          )}
                          <SelectValue className="flex flex-row space-x-2 font-semibold" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">
                          <span className="mr-2">1</span>⭐
                        </SelectItem>
                        <SelectItem value="2">
                          <span className="mr-2">2</span>⭐⭐
                        </SelectItem>
                        <SelectItem value="3">
                          <span className="mr-2">3</span>⭐⭐⭐
                        </SelectItem>
                        <SelectItem value="4">
                          <span className="mr-2">4</span>⭐⭐⭐⭐
                        </SelectItem>
                        <SelectItem value="5">
                          <span className="mr-2">5</span>⭐⭐⭐⭐⭐
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                size={'lg'}
                className="w-full mt-4"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    Submitting... <StarIcon className="h-4 w-4 animate-spin" />
                  </>
                ) : (
                  'Submit Review'
                )}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
