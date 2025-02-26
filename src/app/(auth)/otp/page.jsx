'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { verifyOtprequest, verifyOtp } from '@/lib/apiRoutes';
import useUserStore from '../../../../store/user/userStore';

export default function OTP() {
  const { isauthenticated, isUserVerified, refreshData } = useUserStore();
  const isVerified = isUserVerified();
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [receivedOtp, setReceivedOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [timer, setTimer] = useState(60); // 1-minute timer
  const inputRefs = useRef([]);
  const router = useRouter();

  useEffect(() => {
    if (isVerified) {
      router.push('/');
    }
  }, [isauthenticated, router]);

  useEffect(() => {
    let interval;
    if (otpRequested && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setOtpRequested(false);
    }
    return () => clearInterval(interval);
  }, [otpRequested, timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleRequestOTP = async () => {
    const email = localStorage?.getItem('tempEmail');
    if (!email) {
      toast.error('Email not found in local storage');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(verifyOtprequest, { email });
      toast.success(response.data.message);
      setReceivedOtp(response.data.otp);
      setOtpRequested(true);
      setTimer(60);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (!isNaN(value) && value.length <= 1) {
      let newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
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
      const response = await axios.post(verifyOtp, { otp: otpCode, email });
      toast.success(response.data.message);
      localStorage.removeItem('tempEmail');
      refreshData();
      router.push(`/UpdateProfile`);
    } catch (error) {
      toast.error(error.response?.data?.error || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Verify Your Email</h2>
      {!otpRequested ? (
        <>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Click below to request an OTP for verification.</p>
          <button
            className="bg-gradient-to-br from-black to-neutral-600 dark:from-zinc-900 dark:to-zinc-900 block w-full text-white rounded-md h-10 font-medium shadow-lg disabled:cursor-not-allowed mt-4"
            onClick={handleRequestOTP}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Request OTP'}
          </button>
        </>
      ) : (
        <>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Enter the OTP sent to your email.</p>
          <p className="text-sm text-red-500 mt-1">OTP expires in: {formatTime(timer)}</p>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-2">
            Your OTP: <span className="text-red-500 tracking-widest">{receivedOtp}</span>
          </p>
          <form className="my-6" onSubmit={handleSubmit}>
            <div className="flex justify-center space-x-2">
              {otp.map((_, index) => (
                <Input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-10 h-12 text-center text-lg font-semibold border border-gray-300 rounded"
                  type="text"
                  maxLength="1"
                  value={otp[index]}
                  onChange={(e) => handleChange(index, e)}
                />
              ))}
            </div>
            <button
              className="bg-gradient-to-br from-black to-neutral-600 dark:from-zinc-900 dark:to-zinc-900 block w-full text-white rounded-md h-10 font-medium shadow-lg disabled:cursor-not-allowed mt-4"
              type="submit"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mx-auto" /> : 'Verify OTP'}
            </button>
          </form>
          {timer === 0 && (
            <button
              className="bg-gradient-to-br from-black to-neutral-600 dark:from-zinc-900 dark:to-zinc-900 block w-full text-white rounded-md h-10 font-medium shadow-lg disabled:cursor-not-allowed mt-4"
              onClick={handleRequestOTP}
              disabled={loading || timer > 0}
            >
              Resend OTP
            </button>
          )}
        </>
      )}
    </div>
  );
}
