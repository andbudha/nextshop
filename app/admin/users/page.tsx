import DeleteDialog from '@/components/shared/delete-dialog';
import Pagination from '@/components/shared/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { deleteUser, getAllUsers } from '@/lib/actions/user.actions';
import { requireAdmin } from '@/lib/auth-guard';
import { formatId } from '@/lib/utils';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin Users',
};

const AdminUsersPage = async (props: {
  searchParams: Promise<{ page: string; query: string }>;
}) => {
  await requireAdmin();
  const { page = Number(1), query: searchText } = await props.searchParams;
  const users = await getAllUsers({ page: Number(page), query: searchText });
  if (!users) throw new Error('Users not found');

  return (
    <div className="space-y-2">
      <div className="flex flex-col items-start gap-3">
        <h1 className="h2-bold">Users</h1>
        {searchText && (
          <span className="text-muted-foreground">
            Filtered by: <i>&quot;{searchText}&quot;</i>
            <Link href={`/admin/users`} className="ml-2">
              <Button variant={'outline'} size={'sm'}>
                Remove Filter
              </Button>
            </Link>
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead className="text-right">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.data!.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">
                  {user.role === 'user' ? (
                    <Badge variant={'outline'}>user</Badge>
                  ) : (
                    <Badge>admin</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant={'outline'} size={'sm'}>
                    <Link href={`/admin/users/${user.id}`}>Details</Link>
                  </Button>
                  <DeleteDialog id={user.id} action={deleteUser} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users.totalPages! > 1 && (
          <Pagination page={Number(page) || 1} totalPages={users.totalPages!} />
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
