import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOutUser } from '@/lib/actions/user.actions';
import { User } from 'lucide-react';
import Link from 'next/link';

const UserButton = async () => {
  const session = await auth();
  const firstInitial = session?.user?.name?.charAt(0).toUpperCase() || 'U';

  return (
    <>
      {!session ? (
        <Button asChild>
          <Link href={'/sign-in'}>
            <User /> Sign In
          </Link>
        </Button>
      ) : (
        <div className="flex items-center gap-2 ">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center">
                <Button
                  variant={'ghost'}
                  className="relative w-8 h-8 rounded-full  ml-2 flex items-center justify-center bg-gray-200 hover:bg-gray-300"
                >
                  {firstInitial}
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <div className="text-sm font-medium leading-none">
                    {session?.user?.name}
                  </div>{' '}
                  <div className="text-sm text-muted-foreground leading-none">
                    {session?.user?.email}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuItem>
                <Link href={'/user/profile'} className="w-full">
                  User Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={'/user/orders'} className="w-full">
                  Order History
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0 mb-1">
                <form action={signOutUser} className="w-full">
                  <Button
                    className="border py-4 px-2 h-4 w-full"
                    variant={'ghost'}
                  >
                    Sign Out
                  </Button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </>
  );
};

export default UserButton;
