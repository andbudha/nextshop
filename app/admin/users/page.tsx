import { requireAdmin } from '@/lib/auth-guard';

const AdminUsersPage = async () => {
  await requireAdmin();
  return <>AdminUsersPage</>;
};

export default AdminUsersPage;
