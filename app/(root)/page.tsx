import ProductList from '@/components/shared/product/product-list';
import { getLatestProducts } from '@/lib/actions/product.actions';
import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants';
import { Product } from '@/types';

const Home = async () => {
  const latestProducts = await getLatestProducts();

  //Converting both price&rating from decimal to string
  const products = latestProducts.map((product: Product) => {
    return {
      ...product,
      price: product.price.toString(),
      rating: product.rating.toString(),
    };
  });
  return (
    <>
      <ProductList
        data={products}
        title="Newest Arrivals"
        limit={LATEST_PRODUCTS_LIMIT}
      />
    </>
  );
};

export default Home;
