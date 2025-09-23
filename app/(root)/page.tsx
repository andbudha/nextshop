import DealCountdown from '@/components/deal-countdown';
import IconBoxes from '@/components/icon-boxes';
import ProductCarousel from '@/components/shared/product/product-carousel';
import ProductList from '@/components/shared/product/product-list';
import ViewAllProducts from '@/components/view-all-products';
import {
  getFeaturedProducts,
  getLatestProducts,
} from '@/lib/actions/product.actions';
import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants';
import { Product } from '@/types';

const Home = async () => {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

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
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList
        data={products}
        title="Newest Arrivals"
        limit={LATEST_PRODUCTS_LIMIT}
      />
      <ViewAllProducts />
      <DealCountdown />
      <IconBoxes />
    </>
  );
};

export default Home;
