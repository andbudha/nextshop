import mySampleData from '@/db/my-data';
import { formatCurrency } from '@/lib/utils';

import { Order } from '@/types';
import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Heading,
  Img,
  Row,
} from '@react-email/components';
import dotenv from 'dotenv';
dotenv.config();

PurchaseReceit.PreviewProps = {
  order: {
    id: crypto.randomUUID(),
    userId: '123',
    user: {
      name: 'John Doe',
      email: 'F2t9d@example.com',
    },
    paymentMethod: 'Stripe',
    shippingAddress: {
      fullName: 'John Doe',
      street: '123 Main St',
      city: 'Anytown',
      country: 'USA',
      postalCode: '12345',
    },
    createdAt: new Date(),
    totalPrice: '100',
    taxPrice: '10',
    shippingPrice: '10',
    itemsPrice: '80',
    orderItems: mySampleData.products.map((product) => ({
      name: product.name,
      orderId: crypto.randomUUID(),
      productId: crypto.randomUUID(),
      slug: product.slug,
      qty: product.stock,
      image: product.images[0],
      price: product.price.toString(),
    })),
    isDelivered: true,
    deliveredAt: new Date(),
    isPaid: true,
    paidAt: new Date(),
    //if paymentResult throws error got to /types/index.ts and add to Order type  paymentResult: PaymentResult prop
    paymentResult: {
      id: crypto.randomUUID(),
      status: 'succeeded',
      email_address: 'F2t9d@example.com',
      pricePaid: '100',
    },
  },
} satisfies OrderInformationProps;

type OrderInformationProps = {
  order: Order;
};

const dateFormatter = new Intl.DateTimeFormat('en', {
  dateStyle: 'medium',
});
export default function PurchaseReceit({ order }: OrderInformationProps) {
  return (
    <Html>
      <Preview>View Order Details</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="mx-w-xl">
            <Heading>Purchase Reciept</Heading>
            <Section>
              <Row>
                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Order ID
                  </Text>
                  <Text className="mt-0 mr-4">{order.id.toString()}</Text>
                </Column>
                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Purchase Date
                  </Text>
                  <Text className="mt-0 mr-4">
                    {dateFormatter.format(order.createdAt)}
                  </Text>
                </Column>
                <Column>
                  <Text className="mb-0 mr-4 text-gray-500 whitespace-nowrap text-nowrap">
                    Price Paid
                  </Text>
                  <Text className="mt-0 mr-4">
                    {formatCurrency(order.totalPrice)}
                  </Text>
                </Column>
              </Row>
            </Section>
            <Section className="border border-solid border-gray-500 rounded-lg p-4 md:p-6 my-4">
              {order.orderItems.map((item) => (
                <Row key={item.productId}>
                  <Column className="w-20">
                    <Img
                      src={
                        item.image.startsWith('/')
                          ? `${process.env.NEXT_PUBLIC_SERVER_URL}${item.image}`
                          : `${item.image}`
                      }
                      alt={item.name}
                      width={80}
                      className="rounded"
                    />
                  </Column>
                  <Column className="align-top">
                    {item.name} x {item.qty}
                  </Column>
                  <Column className="align-top" align="right">
                    {formatCurrency(item.price)}
                  </Column>
                </Row>
              ))}
              {[
                { name: 'Items', price: order.itemsPrice },
                { name: 'Tax', price: order.taxPrice },
                { name: 'Shipping', price: order.shippingPrice },
                { name: 'Total', price: order.totalPrice },
              ].map(({ name, price }) => (
                <Row key={name} className="py-1">
                  <Column align="right">{name}: </Column>
                  <Column align="right" width={70} className="align-top">
                    <Text className="m-0">{formatCurrency(price)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
