import { requireAdmin } from '@/lib/auth-guard';

const CreateProductPage = async () => {
  await requireAdmin();
  return <>Create Product Page</>;
};

export default CreateProductPage;
