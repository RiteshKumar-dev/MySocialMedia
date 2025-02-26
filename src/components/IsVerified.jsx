import { Megaphone, ShieldX } from 'lucide-react';
import Link from 'next/link';
import useUserStore from '../../store/user/userStore';

export const IsVerified = () => {
  const { user } = useUserStore();
  if (!user) {
    return null;
  }

  return (
    <div
      className={`w-full sticky top-0 z-50 flex items-center justify-center gap-2 px-2 sm:px-4 py-2 font-semibold tracking-tight text-center 
        ${user?.isVerified ? 'bg-green-50 text-green-600 shadow-[0_2px_8px_0_rgba(34,197,94,0.5)]' : 'bg-[#F0EEF4] text-red-500'}`}
    >
      {user?.isVerified ? (
        <>
          <Megaphone size={18} className="hidden sm:block text-red-500" />
          <span className="text-xs sm:text-sm">
            🚀 Welcome to the Ultimate Social Network Hub! <b className="text-black">DEV</b> – Your All-in-One Platform for a Seamless
            Social Experience.
            <Link href="/explore" className="text-blue-500 font-medium hover:underline ml-1">
              Join Now
            </Link>
          </span>
        </>
      ) : (
        <>
          <ShieldX size={18} className="text-red-600" />
          <span className="text-xs sm:text-sm">
            Your account is not verified. Please verify to access all features.
            <Link href="/verify-otp" className="text-blue-400 font-medium hover:underline ml-1">
              Verify
            </Link>
          </span>
        </>
      )}
    </div>
  );
};
