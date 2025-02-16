'use client';
import './globals.css';
import Header from '@/components/Header';
import Breadcrumbs from '@/components/Breadcrumb';
import { Toaster } from 'react-hot-toast';
import useUserStore from '../../store/user/userStore';
import { useEffect, useState } from 'react';
import { Loader } from '@/components/Loader';
import { IsVerified } from '@/components/IsVerified';

export default function ClientLayout({ children }) {
  const { fetchUser, isAuthenticated, isauthenticated, fetchAllPosts } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isauthenticated) {
      fetchUser();
      fetchAllPosts();
    }
    isAuthenticated();

    // Ensure loader is visible for at least 3 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isauthenticated]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Toaster
        position="bottom-left"
        toastOptions={{
          duration: 3000,
          // style: {
          //   background: '#333',
          //   color: '#fff',
          // },
        }}
      />
      <header className="border-b sticky top-0 bg-white z-50">
        <IsVerified />
        <Header />
      </header>
      <div className="bg-[#F0EEF8] flex-1 w-full">
        {/* <div className="fixed md:ml-[184px] right-0"> */}
        <Breadcrumbs />
        {/* </div> */}
        <main>{children}</main>
      </div>
    </>
  );
}
