import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import { ShoppingCart, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link href={'/'} className="flex-start">
            <Image
              src={'/images/logo.png'}
              width={40}
              height={40}
              alt={`${APP_NAME}`}
              priority={true}
            />
            <span className="hidden lg:block font-bold text-2xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>

        <div className="space-x-2">
          <Button asChild variant={'ghost'}>
            <Link href={'/cart'}>
              <ShoppingCart /> Cart
            </Link>
          </Button>
          <Button asChild variant={'ghost'}>
            <Link href={'/sign-in'}>
              <User /> Sign In
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
