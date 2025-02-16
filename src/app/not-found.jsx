'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="bg-white dark:bg-gray-900 min-h-screen flex flex-col justify-center items-center px-6">
      <div className="container flex flex-col items-center text-center lg:flex-row lg:items-center lg:gap-12">
        <div className="w-full lg:w-1/2">
          <p className="text-lg font-medium text-blue-500 dark:text-blue-400">404 error</p>
          <h1 className="mt-3 text-3xl font-bold text-gray-800 dark:text-white md:text-5xl">Oops! Page not found</h1>
          <p className="mt-4 text-gray-500 dark:text-gray-400 md:text-lg">
            Sorry, the page you are looking for doesn’t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center mt-6 gap-4">
            <Link href={'/'}>
              <button className="flex items-center px-6 py-3 text-sm font-medium text-gray-700 transition-all duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                </svg>
                <span>Go back</span>
              </button>
            </Link>

            <Link href={'/'}>
              <Button className="rounded-lg font-bold">Take me home</Button>
            </Link>
          </div>
        </div>
        <div className="relative w-full max-w-sm mt-12 lg:w-1/2 lg:mt-0">
          <Image className="w-full" src="/bgMainImg.png" alt="Not Found Illustration" width={500} height={500} priority />
        </div>
      </div>
    </section>
  );
}
