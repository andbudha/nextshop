import { generateAccessToken, paypal } from '../lib/paypal';

test('generates access token', async () => {
  const token = await generateAccessToken();

  expect(typeof token).toBe('string');
  expect(token.length).toBeGreaterThan(0);
});

//test creating a paypal order
test('create order', async () => {
  //add sample price
  const price = 15.0;

  const orderResponse = await paypal.createOrder(price);
  console.log('OrderResponse:::', orderResponse);

  expect(orderResponse).toHaveProperty('id');
  expect(orderResponse).toHaveProperty('status');
  expect(orderResponse.status).toBe('CREATED');
});

//test capture payment with a mock order
test('simulate capturing payment from an order', async () => {
  const orderId = '100';
  const mockCapturePayment = jest
    .spyOn(paypal, 'capturePayment')
    .mockResolvedValue({
      status: 'COMPLETED',
    });

  const captureResponse = await paypal.capturePayment(orderId);
  expect(captureResponse).toHaveProperty('status', 'COMPLETED');
  mockCapturePayment.mockRestore();
});
