'use client';
import logo from '../public/images/logo.png';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center p-6 rounded-lg shadow-md text-center sm:w-1/2 md:w-1/3 lg:w-1/4">
        <Image
          src={logo}
          height={50}
          width={50}
          alt={`${APP_NAME} logo`}
          priority={true}
        />
        <h1 className="text-3xl font-bold mt-4 mb-2">Not Found</h1>
        <p className="text-destructive mb-4">Could not find requested page</p>
        <Button
          className=" flex items-center justify-center"
          variant={'outline'}
          onClick={() => (window.location.href = '/')}
        >
          Back To Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
