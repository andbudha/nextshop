'use client';
import { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { addItemToCart } from '@/lib/actions/cart.actions';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { Plus } from 'lucide-react';

const AddToCart = ({ item }: { item: CartItem }) => {
  const router = useRouter();
  const { toast } = useToast();
  const addItemToCartHandler = async () => {
    const res = await addItemToCart(item);
    // If the response is not successful, show an error toast
    if (!res.success) {
      toast({
        variant: 'destructive',
        description: res.message,
      });
      return;
    }
    //handle success
    toast({
      description: `${item.name} added to cart`,
      action: (
        <ToastAction
          className="bg-primary text-white hover:bg-gray-800"
          altText="Go To Cart"
          onClick={() => router.push('/cart')}
        >
          Go To Cart
        </ToastAction>
      ),
    });
  };
  return (
    <Button
      type="button"
      variant={'default'}
      className="w-full"
      onClick={addItemToCartHandler}
    >
      <Plus /> Add to Cart
    </Button>
  );
};

export default AddToCart;
