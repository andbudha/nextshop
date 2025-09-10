import { Resend } from 'resend';
import { EMAIL_SENDER, APP_NAME } from '@/lib/constants';
import { Order } from '@/types';
import dotenv from 'dotenv';
dotenv.config();
import PurchaseReceit from './purchase-receit';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY as string);

export const sendPurchaseReceit = async ({ order }: { order: Order }) => {
  await resend.emails.send({
    from: `${APP_NAME} <${EMAIL_SENDER}>`,
    to: order.user.email,
    subject: `Your order has been placed: ${order.id}`,
    react: <PurchaseReceit order={order} />,
  });
};
