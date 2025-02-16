'use client';
import React, { useState, useRef, useEffect } from 'react';
import { IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { resendOtp, verifyOtp } from '@/lib/apiRoutes';
import useUserStore from '../../../../store/user/userStore';

export default function OTP() {
  const { isauthenticated } = useUserStore();
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const router = useRouter();
  // Redirect after component mounts
  useEffect(() => {
    if (isauthenticated) {
      router.push('/');
    }
  }, [isauthenticated, router]);
  const handleChange = (index, e) => {
    const value = e.target.value;
    if (!isNaN(value) && value.length <= 1) {
      let newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if filled
      if (value !== '' && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length < 6) {
      toast.error('Please enter the complete OTP');
      return;
    }

    setLoading(true);
    try {
      const email = localStorage?.getItem('tempEmail');
      const response = await axios.post(verifyOtp, { otp: otpCode, email: email });
      toast.success(response.data.message);
      localStorage.removeItem('tempEmail');
      router.push(`/login`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(resendOtp);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">Enter OTP</h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        We have sent a <b>6-digit verification code</b> to your registered email. Please enter it below to continue. Didn’t receive the
        code?{' '}
        <Link href="" className="text-red-500 hover:underline" onClick={handleResendOTP}>
          Resend
        </Link>
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex justify-center space-x-3">
          {otp.map((_, index) => (
            <Input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 text-center text-xl font-bold"
              type="text"
              maxLength="1"
              value={otp[index]}
              onChange={(e) => handleChange(index, e)}
            />
          ))}
        </div>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-lg disabled:cursor-not-allowed mt-6"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center mt-2">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            'Verify '
          )}
          &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <SocialButton icon={<IconBrandGithub />} text="GitHub" />
          <SocialButton icon={<IconBrandGoogle />} text="Google" />
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => (
  <>
    <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>
);

const SocialButton = ({ icon, text }) => (
  <button className="relative flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900">
    {icon}
    <span className="text-neutral-700 dark:text-neutral-300 text-sm">{text}</span>
    <BottomGradient />
  </button>
);
