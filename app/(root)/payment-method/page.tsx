import { auth } from '@/auth';
import { getUserById } from '@/lib/actions/user.actions';
import { Metadata } from 'next';
import Link from 'next/link';
import PaymentMethodForm from './payment-method-form';
import CheckoutSteps from '@/components/shared/checkout-steps';

export const metadata: Metadata = {
  title: 'Payment Method',
};
const PaymentMethodPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;
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
  const user = await getUserById(userId);
  return (
    <>
      {' '}
      <CheckoutSteps current={2} />
      <PaymentMethodForm paymentMethod={user.paymentMethod} />
    </>
  );
};

export default PaymentMethodPage;
