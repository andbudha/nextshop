import { requireAdmin } from '@/lib/auth-guard';

const ProductsAdminPage = async () => {
  await requireAdmin();
  return <>ProductsAdminPage</>;
};

export default ProductsAdminPage;
