'use client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';

const ProductImages = ({ images }: { images: string[] }) => {
  const [currentImage, setCurrentImage] = useState(0);
  return (
    <div className="space-y-6">
      <Image
        src={images[currentImage]}
        alt="Product Image"
        width={1000}
        height={1000}
        className="min-h-[300px] w-full object-cover object-center"
        priority
      />
      <div className="flex">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => setCurrentImage(index)}
            className={cn(
              'mr-2 cursor-pointer border border-orange-300 hover:border-orange-600',
              `${currentImage === index && 'border border-orange-600'}`
            )}
          >
            <Image src={image} alt="Product Image" width={100} height={100} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
