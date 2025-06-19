import { getOrderById } from '@/lib/actions/order.actions';
import { notFound } from 'next/navigation';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Details',
};
const OrderPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;

  const order = await getOrderById(id);
  if (!order) notFound();
  console.log('ORDER:::', order);

  return (
    <div>
      <h1>Order Page</h1>
      <p>{order.totalPrice.toString()}</p>
    </div>
  );
};

export default OrderPage;
