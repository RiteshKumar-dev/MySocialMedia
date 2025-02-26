'use client';
import { useState, useEffect } from 'react';
import useUserStore from '../../store/user/userStore';

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  const { isauthenticated } = useUserStore();

  useEffect(() => {
    if (!isauthenticated) return;

    const isAccepted = localStorage.getItem('isAcceptCookie');
    if (!isAccepted) {
      setShow(true);
    }
  }, [isauthenticated]);

  const handleAccept = () => {
    localStorage.setItem('isAcceptCookie', 'true');
    setShow(false);
  };

  if (!isauthenticated || !show) return null;

  return (
    <section className="fixed max-w-md p-4 mx-auto bg-white border border-gray-300 dark:bg-gray-800 z-50 right-0 bottom-0 md:bottom-4 dark:border-gray-700 rounded-lg shadow-lg">
      <h2 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">🍪 Your Privacy Matters</h2>

      <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        We use cookies to enhance your browsing experience, analyze site traffic, and deliver personalized content. By clicking{' '}
        <strong>Accept</strong>, you consent to our cookie policy.{' '}
        <a href="#" className="text-blue-500 hover:underline">
          Learn more
        </a>
        .
      </p>

      <div className="flex items-center justify-between mt-4 gap-x-4">
        <button className="text-xs text-red-500 underline transition-colors duration-300 hover:text-red-600 focus:outline-none">
          Manage Preferences
        </button>

        <button
          className="text-xs bg-gray-900 font-medium rounded-lg hover:bg-gray-700 text-white px-4 py-2.5 duration-300 transition-colors focus:outline-none"
          onClick={handleAccept}
        >
          Accept Cookies
        </button>
      </div>
    </section>
  );
}
