'use client';
import UserInformation from '@/components/UserInformation';
import useUserStore from '../../store/user/userStore';
import PostForm from '@/components/PostForm';
import { PostFeed } from '@/components/PostFeed';
import UserPostInformation from '@/components/UserPostInformation';
import { Widget } from '@/components/Widget';
import { Tooltip } from '@/components/Tooltip';
import UsersStatusClips from '@/components/UsersStatusClips';
import { HeroSection } from '@/components/HeroSection';
export default function Home() {
  const { isauthenticated, posts } = useUserStore();
  if (!isauthenticated) {
    return (
      // <div className="flex flex-col items-center justify-center min-h-screen px-4">
      //   <div className="p-6 text-center">
      //     <h2 className="text-3xl md:text-6xl font-semibold text-gray-800 tracking-tighter">Access Restricted</h2>
      //     <p className="mt-2 text-gray-700">
      //       Please <span className="font-semibold text-blue-500 underline">log in</span> to access the features of VibeSphere.
      //     </p>
      //   </div>
      // </div>
      <HeroSection />
    );
  }

  return (
    <div className="grid grid-cols-8 max-w-6xl mx-auto gap-6 px-4">
      <section className="hidden md:flex md:flex-col md:col-span-2 space-y-4">
        <UserInformation posts={posts} />
        <UserPostInformation posts={posts} />
        {/* <Tooltip /> */}
      </section>
      <section className="col-span-full md:col-span-6 xl:col-span-4 xl:max-w-xl mx-auto w-full space-y-4">
        <PostForm />
        <UsersStatusClips />
        <PostFeed posts={posts} />
      </section>
      <section className="hidden md:flex md:flex-col md:col-span-2 space-y-4">
        <Widget />
      </section>
    </div>
  );
}
