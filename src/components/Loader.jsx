import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
export function Loader() {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 20 : 100));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F0EEF8] px-4 gap-y-6">
      {/* <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 animate-fade-in">
        <Image src="/bgImg.png" alt="Profile" width={320} height={320} className="w-full h-full object-contain" priority />
      </div> */}
      <div className="flex items-center gap-2">
        <Button className="rounded-lg font-bold">
          VibeSphere <Loader2 size={28} className="animate-spin" />
        </Button>
      </div>
      {/* <Progress value={progress} className="w-3/4 max-w-sm h-2 rounded-lg bg-gray-200 dark:bg-gray-700" /> */}
      {/* <h1 className="text-3xl md:text-4xl font-bold text-green-500 dark:text-white">MySocialMedia</h1> */}
    </div>
  );
}

// Global Minimal Loader
export function GlobalLoader() {
  return (
    <div className="flex flex-col items-center justify-center bg-[#F0EEF6] px-4">
      <Loader2 className="w-12 h-12 text-green-400 animate-spin mt-6" />
    </div>
  );
}
