'use client';
import Link from 'next/link';
import { Button } from './ui/button';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const TARGET_DATE = new Date('2025-10-01T00:00:00');
//function to calculate the remaining time
const getRemainingTime = (targetDate: Date) => {
  const currentTime = new Date();
  const difference = Math.max(Number(targetDate) - Number(currentTime), 0);
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};
const StatBox = ({ label, value }: { label: string; value: number }) => {
  return (
    <li className="p-4 w-full text-center" key={label}>
      <p className="text-3xl font-bold">{value}</p>
      <p>{label}</p>
    </li>
  );
};

const DealCountdown = () => {
  const [time, setTime] = useState<ReturnType<typeof getRemainingTime>>();

  useEffect(() => {
    //calculate initial time
    setTime(getRemainingTime(TARGET_DATE));

    //update time every second
    const interval = setInterval(() => {
      const newTime = getRemainingTime(TARGET_DATE);
      setTime(newTime);
      if (newTime.days === 0 && newTime.hours === 0 && newTime.minutes === 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 my-20">
        <div className="flex flex-col gap-2 justify-center">
          <h3 className="text-3xl font-bold">Loading Countdown...</h3>
        </div>
      </section>
    );
  }

  if (time.days === 0 && time.hours === 0 && time.minutes === 0) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 my-20">
        <div className="flex flex-col gap-2 justify-center">
          <h3 className="text-3xl font-bold">Deal Has Ended</h3>
          <p>
            This deal is no longer available. Check back later for a new deal.
          </p>

          <div className="text-center">
            <Button asChild>
              <Link href={'/search'}>View Products</Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <Image
            src={'/images/promo.jpg'}
            alt="promotion"
            width={300}
            height={200}
          />
        </div>
      </section>
    );
  }
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 my-20">
      <div className="flex flex-col gap-2 justify-center">
        <h3 className="text-3xl font-bold">Deal Of The Month</h3>
        <p>
          Get ready to refresh your wardrobe with our amazing Deal of the Month!
          We are offering a fantastic 40% discount on all spring and summer
          {/* Display the value of the stat box. */}
          dresses. Whether you&apos;re looking for a casual sundress or an
          {/* Display the label of the stat box. */}
          elegant maxi dress, we have the perfect style for you. Our dresses are
          crafted from high-quality fabrics, ensuring comfort and style all day
          long. Don&apos;t miss out on this limited-time offer. Shop now and
          find your new favorite dress at an unbeatable price!
        </p>
        <ul className="grid grid-cols-4">
          <StatBox label="Days" value={time.days} />
          <StatBox label="Hours" value={time.hours} />
          <StatBox label="Minutes" value={time.minutes} />
          <StatBox label="Seconds" value={time.seconds} />
        </ul>
        <div className="text-center">
          <Button asChild variant={'outline'} className="w-full">
            <Link href={'/search'}>View Products</Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <Image
          src={'/images/promo.jpg'}
          alt="promotion"
          width={300}
          height={200}
        />
      </div>
    </section>
  );
};

export default DealCountdown;
