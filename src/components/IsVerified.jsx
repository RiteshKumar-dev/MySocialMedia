import { Megaphone, ShieldX } from 'lucide-react';
import Link from 'next/link';
import useUserStore from '../../store/user/userStore';

export const IsVerified = () => {
  const { user } = useUserStore();
  if (!user) {
    return;
  }
  return (
    <div
      className={`h-8 w-full sticky top-0 z-50 flex items-center justify-center gap-2 text-sm font-semibold tracking-tighter 
  ${user?.isVerified ? 'bg-green-50 text-green-600 shadow-[0_2px_8px_0_rgba(34,197,94,0.5)]' : 'bg-[#F0EEF4] text-red-500'}`}
    >
      {user?.isVerified ? (
        <>
          <Megaphone size={22} className="hidden md:block text-red-500" />
          <span>
            🚀 Experience the future of social networking! <b>MySocialMedia</b> – One platform for Reels, LinkedIn, and WhatsApp vibes.
            <Link href="/explore" className="text-blue-500 font-serif hover:underline ml-2">
              Join Now
            </Link>
          </span>
        </>
      ) : (
        <>
          <ShieldX size={20} className="text-red-600" />
          <span>
            Your account is not verified. Please verify to access all features.
            <Link href="/verify-otp" className="text-blue-400 font-serif hover:underline ml-2">
              Verify
            </Link>
          </span>
        </>
      )}
    </div>
  );
};
