import { getOrderById } from '@/lib/actions/order.actions';
import { notFound } from 'next/navigation';

import { Metadata } from 'next';
import { formatId } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Order Details',
};
const OrderPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;
  console.log('ID:::', formatId(id));

  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div>
      <h1>Order Page</h1>
      <p>{order.totalPrice}</p>
    </div>
  );
};

export default OrderPage;
