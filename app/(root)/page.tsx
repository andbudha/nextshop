import ProductList from '@/components/shared/product/product-list';
import sampleData from '@/db/sample-data';

const Home = () => {
  console.log('sampleData', sampleData);

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
