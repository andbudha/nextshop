import ProductCard from '@/components/shared/product/product-card';
import { Button } from '@/components/ui/button';
import {
  getAllCategories,
  getAllProducts,
} from '@/lib/actions/product.actions';
import { priceFilters, ratingFilters } from '@/lib/constants';
import { Product } from '@/types';
import Link from 'next/link';

const SearchPage = async (pros: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    sort?: string;
    page?: string;
    rating?: string;
  }>;
}) => {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  } = await pros.searchParams;

  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };
    if (c) params.category = c;
    if (s) params.sort = s;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;
    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  });

  const categories = await getAllCategories();

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        {/* Categories */}
        <div className="text-xl mb-2 mt-2 font-bold">Categories</div>
        <div>
          <ul className="space-y-2">
            <li key="all-categories">
              <Link
                href={getFilterUrl({ c: 'all' })}
                className={`${
                  (category === 'all' || category === '') && 'font-bold'
                }`}
              >
                Any
              </Link>
            </li>
            {categories.map((x: { category: string; count: number }) => {
              return (
                <>
                  <li key={x.category}>
                    <Link
                      href={getFilterUrl({ c: x.category })}
                      className={`${x.category === category && 'font-bold'}`}
                    >
                      {x.category}
                    </Link>
                  </li>
                </>
              );
            })}
          </ul>
        </div>
        {/* Price */}
        <div className="text-xl mb-2 mt-5 font-bold">Price</div>
        <div>
          <ul className="space-y-2">
            <li key="all-prices">
              <Link
                href={getFilterUrl({ p: 'all' })}
                className={`${price === 'all' && 'font-bold'}`}
              >
                Any
              </Link>
            </li>
            {priceFilters.map((x: { price: string; value: string }) => {
              return (
                <>
                  <li key={x.value}>
                    <Link
                      href={getFilterUrl({ p: x.value })}
                      className={`${x.value === price && 'font-bold'}`}
                    >
                      {x.price}
                    </Link>
                  </li>
                </>
              );
            })}
          </ul>
        </div>
        {/* Customer Rating */}
        <div className="text-xl mb-2 mt-3 font-bold">Ratings</div>
        <div>
          <ul className="space-y-2">
            <li key="all-ratings">
              <Link
                href={getFilterUrl({ r: 'all' })}
                className={`${rating === 'all' && 'font-bold'}`}
              >
                Any
              </Link>
            </li>
            {ratingFilters.map((x: { rating: string; value: string }) => {
              return (
                <>
                  <li key={x.value}>
                    <Link
                      href={getFilterUrl({ r: x.value })}
                      className={`${x.value === rating && 'font-bold'}`}
                    >
                      {x.rating}
                    </Link>
                  </li>
                </>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="space-y-4 md:col-span-4">
        <div className="flex-between flex-col my-4 md:flex-row ">
          <div className="flex flex-col w-full space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
            {(q !== 'all' && q !== '') ||
            (category !== 'all' && category !== '') ||
            price !== 'all' ||
            rating !== 'all' ? (
              <div>
                <Button asChild variant={'outline'} className="mr-2">
                  <Link href={'/search'}>Clear Filters</Link>
                </Button>
              </div>
            ) : null}
            {q !== 'all' && q !== '' && (
              <div>
                <span className="text-muted-foreground mr-2">Qeury:</span>
                <span className="font-bold mr-3">{q}</span>
              </div>
            )}
            {category !== 'all' && category !== '' && (
              <div>
                <span className="text-muted-foreground mr-2">Category:</span>
                <span className="font-bold mr-3">{category}</span>
              </div>
            )}
            {price !== 'all' && price !== '' && (
              <div>
                <span className="text-muted-foreground mr-2">Price:</span>
                <span className="font-bold mr-3">{price}</span>
              </div>
            )}
            {rating !== 'all' && rating !== '' && (
              <div>
                <span className="text-muted-foreground mr-2">Rating:</span>
                <span className="font-bold mr-3">{`${rating} & Up`}</span>
              </div>
            )}
            &nbsp;
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 && (
            <div className="h3-bold">No products found</div>
          )}
          {products.data.map((product: Product) => {
            return (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
