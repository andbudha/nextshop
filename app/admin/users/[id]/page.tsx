import { requireAdmin } from '@/lib/auth-guard';

const AdminUserUpdatePage = async () => {
  await requireAdmin();
  return <>Admin User Update Page</>;
};

export default AdminUserUpdatePage;
