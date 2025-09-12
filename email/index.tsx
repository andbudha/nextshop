import { Resend } from 'resend';
import { APP_NAME, EMAIL_SENDER } from '@/lib/constants';
import { Order } from '@/types';
import dotenv from 'dotenv';
import PurchaseReceit from './purchase-receit';
dotenv.config();

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY as string);

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  await resend.emails.send({
    from: `${APP_NAME} <${EMAIL_SENDER}>`,
    to: order.user.email,
    subject: `Order Confirmation ${order.id}`,
    react: <PurchaseReceit order={order} />,
  });
};
