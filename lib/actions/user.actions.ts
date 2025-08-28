'use server';
import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
} from '../validators';
import { auth, signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { prisma } from '../../db/prisma';
import { hashSync } from 'bcrypt-ts-edge';
import { formatError } from '../utils';
import { ShippingAddress } from '@/types';
import z from 'zod';
import { USERS_PER_PAGE } from '../constants';

//sign in with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });
    await signIn('credentials', user);
    return { success: true, message: 'Signed in successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: 'Invalid email or password',
    };
  }
}
//sign out
export async function signOutUser() {
  await signOut();
}

//sign user up
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });
    const plainPassword = formData.get('password') as string;
    user.password = hashSync(user.password, 10);
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    });
    return { success: true, message: 'Signed up successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatError(error) || 'An error occurred during sign up',
    };
  }
}

//get user by id
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!user) {
    throw new Error('User not found');
  }
  return user;
}

//update user address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });
    if (!currentUser) throw new Error('User not found');
    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        address,
      },
    });

    return {
      success: true,
      message: 'Both user and address updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error) || 'An error occurred while updating address',
    };
  }
}

//update user's payment method
export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>
) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });
    if (!currentUser) throw new Error('User not found!');
    const paymentMethod = paymentMethodSchema.parse(data);
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { paymentMethod: paymentMethod.type },
    });
    return {
      success: true,
      message: 'Payment method updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

//update user profile action
export async function updateUserProfile(user: { name: string; email: string }) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: { id: session?.user?.id },
    });
    if (!currentUser) throw new Error('User not found');
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { name: user.name, email: user.email },
    });
    return {
      success: true,
      message: 'User profile updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error) || 'An error occurred while updating profile',
    };
  }
}

//get all users
export async function getAllUsers({
  limit = USERS_PER_PAGE,
  page,
}: {
  limit?: number;
  page: number;
}) {
  try {
    const data = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    if (!data) throw new Error('Users not found');
    const dataCount = await prisma.user.count();

    return {
      data,
      totalPages: Math.ceil(dataCount / limit),
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error) || 'An error occurred while getting users',
    };
  }
}
