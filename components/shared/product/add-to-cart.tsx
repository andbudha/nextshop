'use client';
import { Cart, CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { Plus, Minus, Loader } from 'lucide-react';
import { useTransition } from 'react';

const AddToCart = ({ item, cart }: { item: CartItem; cart?: Cart }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const addItemToCartHandler = async () => {
    startTransition(async () => {
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
        description: res.message,
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
    });
  };
  //remove item from cart handler
  const removeItemFromCartHandler = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);
      toast({
        variant: res.success ? 'default' : 'destructive',
        description: res.message,
      });
      return;
    });
  };

  //check if item already exists in cart
  const exitingItem =
    cart &&
    cart.items.find((itemInCart) => itemInCart.productId === item.productId);
  return exitingItem ? (
    <div>
      <Button
        type="button"
        variant={'outline'}
        onClick={removeItemFromCartHandler}
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{exitingItem.quantity}</span>
      <Button type="button" variant={'outline'} onClick={addItemToCartHandler}>
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <div className="w-full">
      <Button
        type="button"
        variant={'default'}
        className="w-full"
        onClick={addItemToCartHandler}
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
        Add to Cart
      </Button>
    </div>
  );
};

export default AddToCart;
