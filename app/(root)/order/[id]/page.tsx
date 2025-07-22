import { getOrderById } from '@/lib/actions/order.actions';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import OrderDetailsTable from './order-details-table';
import { ShippingAddress } from '@/types';

export const metadata: Metadata = {
  title: 'Order Details',
};
const OrderPage = async (props: { params: Promise<{ id: string }> }) => {
  const { id } = await props.params;

  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
      paypalClientId={process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb'}
    />
  );
};

export default OrderPage;
