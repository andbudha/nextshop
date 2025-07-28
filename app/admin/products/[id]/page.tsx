import { requireAdmin } from '@/lib/auth-guard';

const AdminProductUpdatePage = async () => {
  await requireAdmin();
  return <>AdminProductUpdatePage</>;
};

export default AdminProductUpdatePage;
