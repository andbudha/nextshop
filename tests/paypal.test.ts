import { generateAccessToken } from '../lib/paypal';

test('generates access token', async () => {
  const token = await generateAccessToken();

  expect(typeof token).toBe('string');
  expect(token.length).toBeGreaterThan(0);
});
