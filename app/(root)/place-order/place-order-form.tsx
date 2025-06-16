'use client';
import { useRouter } from 'next/navigation';
import { Check, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFormStatus } from 'react-dom';
import { createOrder } from '@/lib/actions/order.actions';
import { useToast } from '@/hooks/use-toast';

const PlaceOrderForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const PlaceOrderButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full">
        {pending ? (
          <Loader className=" h-4 w-4 animate-spin" />
        ) : (
          <Check className="h-4 w-4" />
        )}{' '}
        Place Order
      </Button>
    );
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const res = await createOrder();
    console.log(res);

    if (res.redirectTo) {
      router.push(res.redirectTo);
    }
    if (!res.success) {
      toast({
        variant: 'destructive',
        description: 'The order could not be placed. Please try again later.',
      });
    }
  };
  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <PlaceOrderButton />
    </form>
  );
};

export default PlaceOrderForm;
