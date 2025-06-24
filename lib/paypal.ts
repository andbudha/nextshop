const base =
  process.env.NEXT_PUBLIC_PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

export const paypal = {
  baseUrl: base,
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
  secret: process.env.NEXT_PUBLIC_PAYPAL_SECRET_KEY || '',
};

//generate paypal access token
async function generateAccessToken() {
  const { NEXT_PUBLIC_PAYPAL_CLIENT_ID, NEXT_PUBLIC_PAYPAL_SECRET_KEY } =
    process.env;
  const auth = Buffer.from(
    `${NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${NEXT_PUBLIC_PAYPAL_SECRET_KEY}`
  ).toString('base64');
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  if (response.ok) {
    const jsonData = await response.json();
    return jsonData.access_token;
  } else {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

export { generateAccessToken };
