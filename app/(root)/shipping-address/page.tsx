import { auth } from '@/auth';
import { getMyCart } from '@/lib/actions/cart.actions';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ShippingAddress } from '@/types';
import { getUserById } from '@/lib/actions/user.actions';

export const metadata: Metadata = {
  title: 'Shipping Address',
};

const ShippingAddress = async () => {
  const cart = await getMyCart();
  if (!cart || cart.items.length === 0) redirect('/cart');
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error('User not authenticated. No user ID found.');
  const user = await getUserById(userId);

  return <div>Shipping Address</div>;
};

export default ShippingAddress;
