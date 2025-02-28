import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import useUserStore from '../../store/user/userStore';

export function Widget() {
  const { user } = useUserStore();
  const [currentImage, setCurrentImage] = useState(0);
  const images = ['/Addvertisment.jpg', '/Addvertisment2.jpg'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === 0 ? 1 : 0));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[770px] sticky top-4 w-full bg-white rounded-lg shadow-lg overflow-hidden border flex flex-col gap-4 p-4">
      {/* Advertisement 1 */}
      <div className="w-full flex flex-col items-center text-center pb-8">
        <div className="relative w-[100%] h-[200px]">
          <Image
            src={images[currentImage]}
            alt="Advertisement 1"
            className="rounded-lg transition-opacity duration-500 ease-in-out"
            width={500}
            height={200}
            style={{ objectFit: 'cover', objectPosition: 'top left' }}
            priority
          />
        </div>
      </div>

      {/* Advertisement 2 */}
      <div className="w-full flex flex-col items-center text-center pb-8">
        <div className="relative w-[100%] h-[200px]">
          <Image
            src={'/Addvertisment3.jpg'}
            alt="Advertisement 2"
            className="rounded-lg transition-opacity duration-500 ease-in-out"
            width={500}
            height={200}
            style={{ objectFit: 'cover', objectPosition: 'top left' }}
            priority
          />
        </div>
      </div>

      {/* Motivational Message */}
      <div className="w-full flex flex-col items-center text-center bg-gradient-to-r from-blue-200 to-purple-300 p-6 rounded-lg shadow-md">
        <div className="w-[100%] h-[200px] flex items-center justify-center">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-300 leading-relaxed">
            "Believe in yourself, <span className="text-blue-600 font-bold">{user?.firstname}</span>! 🌟 The best deals are waiting just for
            you! 🎉 Start exploring now. 🚀"
          </p>
        </div>
      </div>
    </div>
  );
}
