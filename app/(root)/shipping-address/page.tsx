import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.actions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getUserById } from '@/lib/actions/user.actions';
import ShippingAddressForm from './shiping-address-form';
import { ShippingAddress } from '@/types';

export const metadata: Metadata = {
  title: 'Shipping Address',
};

const ShippingAddressPage = async () => {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect('/cart');
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error('User not authenticated. No user ID found.');
  const user = await getUserById(userId);

  return (
    <>
      <ShippingAddressForm address={user.address as ShippingAddress} />
    </>
  );
};

export default ShippingAddressPage;
