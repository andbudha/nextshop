export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'NextShop';
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'A modern e-commerce platform built with Next.js';
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
export const LATEST_PRODUCTS_LIMIT =
  Number(process.env.NEXT_PUBLIC_LATEST_PRODUCTS_LIMIT) || 8;
export const signInDefaultValues = {
  email: '',
  password: '',
};

export const signUpDefaultValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const PAYMENT_METHODS = process.env.NEXT_PUBLIC_PAYMENT_METHODS
  ? process.env.NEXT_PUBLIC_PAYMENT_METHODS.split(', ')
  : ['PaypPal', 'Stripe', 'CashOnDelivery'];

export const DEFAULT_PAYMENT_METHOD = PAYMENT_METHODS[0] || 'PaypPal';

export const ORDERS_PER_PAGE =
  Number(process.env.NEXT_PUBLIC_ORDERS_PER_PAGE) || 5;

export const PRODUCTS_PER_PAGE =
  Number(process.env.NEXT_PUBLIC_PRODUCTS_PER_PAGE) || 5;

export const USERS_PER_PAGE =
  Number(process.env.NEXT_PUBLIC_USERS_PER_PAGE) || 5;

export const productDefaultValues = {
  name: '',
  slug: '',
  images: [],
  category: '',
  brand: '',
  description: '',
  price: '0',
  stock: 0,
  rating: '0',
  numReviews: '0',
  isFeatured: false,
  banner: null,
};

export const USER_ROLES = process.env.NEXT_PUBLIC_USER_ROLES?.split(', ');
