import NextAuh from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './db/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';
import { cookies } from 'next/headers';
export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials.email === null) return null;
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });
        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );
          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, user, trigger, token }: any) {
      //set user-id from token
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;
      //if update, set user name
      if (trigger === 'update') {
        session.user.name = user.name;
      }
      return session;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, trigger, session }: any) {
      //assign user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;

        //if user has no name, set it from email
        if (user.name === 'NO_NAME') {
          token.name = user.email.split('@')[0];
          //update db to reflect the token name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
        if (trigger === 'signIn' || trigger === 'signUp') {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get('sessionCartId')?.value;
          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            });
            if (sessionCart) {
              //delete current user cart
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });
              //assign new cart to user
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              });
            }
          }
        }
      }

      //handle session updates
      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name;
      }
      return token;
    },

    // authorized({ request, auth }) {
    //   //array of regex patterns of paths we want to protect
    //   const protectedPaths = [
    //     /\/shipping-address/,
    //     /\/payment-method/,
    //     /\/place-order/,
    //     /\/profile/,
    //     /\/user\/(.*)/,
    //     /\/order\/(.*)/,
    //     /\/admin/,
    //   ];
    //   //get pathname from the req URL object
    //   const { pathname } = request.nextUrl;

    //   //check if user is not authenticated and accessing a protected path then redirect to sign-in page
    //   if (!auth && protectedPaths.some((pattern) => pattern.test(pathname)))
    //     return false;
    //   //check for session cart cookie
    //   if (!request.cookies.get('sessionCartId')) {
    //     //generate a new cart-id cookie
    //     const sessionCartId = crypto.randomUUID();

    //     //clone request headers
    //     const newRequestHeaders = new Headers(request.headers);
    //     //create new response and add the new headers
    //     const response = NextResponse.next({
    //       request: {
    //         headers: newRequestHeaders,
    //       },
    //     });
    //     //set newly generated session cart-id in the response cookies
    //     response.cookies.set('sessionCartId', sessionCartId);
    //     return response;
    //   } else {
    //     //if session cart cookie exists, return true
    //     return true;
    //   }
    // },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuh(config);
