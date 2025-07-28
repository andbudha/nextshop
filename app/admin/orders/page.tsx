import { requireAdmin } from '@/lib/auth-guard';

const AdminOrdersPage = async () => {
  await requireAdmin();
  return <>AdminOrdersPage</>;
};

export default AdminOrdersPage;
