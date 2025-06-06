import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//Convert prisma object to JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

//Format number wih decimal places
export function formatNumberWithDecimal(value: number): string {
  const [int, decimal] = value.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
}

//Format errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function formatError(error: any) {
  if (error.name === 'ZodError') {
    //handle zod error
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message
    );
    return fieldErrors.join(', ');
  } else if (
    error.name === 'PrismaClientKnownRequestError' &&
    error.code === 'P2002'
  ) {
    //handle prisma error
    const field = error.meta?.target?.[0] || 'Field';
    return `${
      field.charAt(0).toUpperCase() + field.slice(1)
    } already exists. Please choose a different value.`;
  } else {
    //handle other errors
    if (typeof error === 'string') {
      return error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      return (error as { message: string }).message;
    } else {
      return JSON.stringify(error);
    }
  }
}

//Round a number to two decimal places
export function roundToTwoDecimalPlaces(value: number | string) {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  } else if (typeof value === 'string') {
    return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
  } else {
    throw new Error('Value must be a number or a string');
  }
}
