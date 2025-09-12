'use client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { Order } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import {
  FUNDING,
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';

import {
  createPaypalOrder,
  approvePaypalOrder,
  updateOrderToPaidCOD,
  updateOrderToDelivered,
} from '@/lib/actions/order.actions';
import { useToast } from '@/hooks/use-toast';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import StripePayment from './stripe-payment';

const OrderDetailsTable = ({
  order,
  paypalClientId,
  isAdmin,
  stripeClientSecret,
}: {
  order: Omit<Order, 'paymentResult'>;
  paypalClientId: string;
  isAdmin: boolean;
  stripeClientSecret: string | null;
}) => {
  const {
    orderItems,
    shippingAddress,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    isDelivered,
    paidAt,
    deliveredAt,
  } = order;

  const { toast } = useToast();
  const PrintLoadingState = () => {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    let status = '';
    if (isPending) {
      status = 'Loading Paypal...';
    } else if (isRejected) {
      status = 'Error Loading Paypal';
    }

    return status;
  };

  const handleCreatePaypalOrder = async () => {
    const res = await createPaypalOrder(order.id);
    if (!res.success) {
      toast({
        variant: 'destructive',
        description: res.message,
      });
    }
    return res.data;
  };

  const handleApprovePaypalOrder = async (data: { orderID: string }) => {
    const res = await approvePaypalOrder(order.id, data);

    toast({
      variant: res.success ? 'default' : 'destructive',
      description: res.message,
    });
  };

  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    return (
      <Button
        size={'sm'}
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await updateOrderToPaidCOD(order.id);
            toast({
              variant: res.success ? 'default' : 'destructive',
              description: res.message,
            });
          })
        }
      >
        {isPending ? 'Processing...' : 'Mark As Paid'}
      </Button>
    );
  };
  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    return (
      <Button
        size={'sm'}
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await updateOrderToDelivered(order.id);
            toast({
              variant: res.success ? 'default' : 'destructive',
              description: res.message,
            });
          })
        }
      >
        {isPending ? 'Processing...' : 'Mark As Delivered'}
      </Button>
    );
  };
  return (
    <>
      <h1 className="py-4 text-2xl">Order {formatId(order.id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="col-span-2 space-y-4 overflow-x-auto mb-2">
          <Card>
            <CardContent className="p-4 gap-2">
              <h2 className="text-xl pb-4">Paymen Method</h2>
              <p className="text-slate-600">{paymentMethod}</p>
              {isPaid ? (
                <Badge variant={'secondary'} className="mt-2">
                  Paid on {formatDateTime(paidAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant={'destructive'} className="mt-2">
                  Not Paid
                </Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl  pb-4">Shipping Address</h2>
              <p className="text-slate-600">{shippingAddress.fullName}</p>
              <p className="text-slate-600">{shippingAddress.street}</p>
              <p className="text-slate-600">
                {shippingAddress.postalCode}, {shippingAddress.city}
              </p>
              <p className="text-slate-600">{shippingAddress.country}</p>
              {isDelivered ? (
                <Badge variant={'secondary'} className="mt-2">
                  Delivered on {formatDateTime(deliveredAt!).dateTime}
                </Badge>
              ) : (
                <Badge variant={'destructive'} className="mt-2">
                  Not Delivered
                </Badge>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 gap-4">
              <h2 className="text-xl pb-4">Order Items</h2>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Item</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderItems.map((item) => (
                    <TableRow key={item.slug}>
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="px-4">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="px-4">{item.qty}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="px-2">{item.price}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="w-full">
          <Card className="w-full overflow-x-auto">
            <CardContent className="p-4 gap-4 space-y-4">
              <div className="flex justify-between">
                <div>Items</div>
                <div>{formatCurrency(itemsPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Tax</div>
                <div>{formatCurrency(taxPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Shipping</div>
                <div>{formatCurrency(shippingPrice)}</div>
              </div>
              <div className="flex justify-between">
                <div>Total</div>
                <div>{formatCurrency(totalPrice)}</div>
              </div>
              {/*Paypal Payment*/}
              {!isPaid && paymentMethod === 'PayPal' && (
                <div>
                  <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                    <PrintLoadingState />
                    <PayPalButtons
                      createOrder={handleCreatePaypalOrder}
                      onApprove={handleApprovePaypalOrder}
                      fundingSource={FUNDING.PAYPAL}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
              {/* Cash On Delivery */}
              <div className="flex flex-row justify-between ">
                {isAdmin && !isPaid && paymentMethod === 'CashOnDelivery' && (
                  <MarkAsPaidButton />
                )}
                {isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
              </div>
              {/* Stripe Payment */}
              <div>
                {!isPaid &&
                  paymentMethod === 'Stripe' &&
                  stripeClientSecret && (
                    <StripePayment
                      priceInCents={Number(order.totalPrice)}
                      orderId={order.id}
                      clientSecret={stripeClientSecret}
                    />
                  )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsTable;
