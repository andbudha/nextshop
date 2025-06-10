import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.actions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.actions';
import ShippingAddressForm from './shiping-address-form';
import { ShippingAddress } from '@/types';
import CheckoutSteps from '@/components/shared/checkout-steps';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Shipping Address',
};

const ShippingAddressPage = async () => {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect('/cart');
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    if (!userId) {
      return (
        <div>
          <Link href={'/sign-in'} className="text-orange-500">
            Sign In
          </Link>{' '}
          to continue, please.
        </div>
      );
    }
  }
  const user = await getUserById(userId);

  return (
    <>
      <CheckoutSteps current={1} />
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </>
  );
};

export default ShippingAddressPage;
