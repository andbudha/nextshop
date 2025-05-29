import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';

const SignIn = () => {
  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href={'/'} className="flex-center">
            <Image
              src={'/images/logo.png'}
              alt={`${APP_NAME} logo`}
              width={50}
              height={50}
              priority={true}
            />
          </Link>
          <CardTitle className="text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Sign In To Your Account
          </CardDescription>
        </CardHeader>
        <CardContent>Form Here</CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
