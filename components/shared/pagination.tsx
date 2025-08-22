'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../ui/button';
import { buildUrlQuery } from '@/lib/utils';

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};
const Pagination = ({ page, totalPages, urlParamName }: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageClick = (btnType: 'next' | 'prev') => {
    const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1;
    const newUrl = buildUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || 'page',
      value: pageValue.toString(),
    });

    router.push(newUrl);
  };
  return (
    <div className="flex gap-2">
      <Button
        disabled={Number(page) <= 1}
        size={'lg'}
        variant={'outline'}
        className="w-28"
        onClick={() => handlePageClick('prev')}
      >
        Previous
      </Button>
      <div className="flex items-center font-semibold">
        {page} of {totalPages}
      </div>
      <Button
        disabled={Number(page) >= totalPages}
        size={'lg'}
        variant={'outline'}
        className="w-28"
        onClick={() => handlePageClick('next')}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
