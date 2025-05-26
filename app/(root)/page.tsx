import ProductList from '@/components/shared/product/product-list';
import sampleData from '@/db/my-data';

const Home = () => {
  return (
    <>
      <ProductList
        data={sampleData.products}
        title="Newest Arrivals"
        limit={6}
      />
    </>
  );
};

export default Home;
