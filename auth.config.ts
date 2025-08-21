import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

export const authConfig = {
  providers: [], // Required by NextAuthConfig type
  callbacks: {
    authorized({ request, auth }) {
      //array of regex patterns of paths we want to protect
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];
      //get pathname from the req URL object
      const { pathname } = request.nextUrl;

      //check if user is not authenticated and accessing a protected path then redirect to sign-in page
      if (!auth && protectedPaths.some((pattern) => pattern.test(pathname)))
        return false;
      //check for session cart cookie
      if (!request.cookies.get('sessionCartId')) {
        //generate a new cart-id cookie
        const sessionCartId = crypto.randomUUID();

        //clone request headers
        const newRequestHeaders = new Headers(request.headers);
        //create new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });
        //set newly generated session cart-id in the response cookies
        response.cookies.set('sessionCartId', sessionCartId);
        return response;
      } else {
        //if session cart cookie exists, return true
        return true;
      }
    },
  },
} satisfies NextAuthConfig;
