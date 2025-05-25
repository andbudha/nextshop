import Image from 'next/image';
import loader from '../assets/loader.gif';

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Image src={loader} height={120} width={120} alt="Loading..." />
    </div>
  );
};

export default LoadingPage;
