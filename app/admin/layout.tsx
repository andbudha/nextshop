import { APP_NAME } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import Menu from '@/components/shared/header/menu';
import MainNav from './main-nav';
import { Input } from '@/components/ui/input';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="flex flex-col">
        <div className="border-b container mx-auto">
          <div className="flex items-center h-16 px-4">
            <Link href={'/'} className="w-22">
              <Image
                src={'/images/logo.png'}
                width={40}
                height={40}
                alt={`${APP_NAME}`}
                priority={true}
              />
            </Link>
            <MainNav className="mx-6" title="Main-Nav" />
            <div className="ml-auto items-center flex space-x-4">
              <div>
                <Input
                  placeholder="Search..."
                  type="search"
                  className="md:w-[120px] lg:w-[300px]"
                />
              </div>
              <Menu />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
          {children}
        </div>
      </div>
    </>
  );
}
