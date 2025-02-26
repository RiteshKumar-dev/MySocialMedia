'use client';
import useUserStore from '../../store/user/userStore';
export default function UserPostInformation({ posts }) {
  const { user } = useUserStore();
  if (!user || !posts || posts.length === 0) return null;

  const userPostsCount = posts?.filter((post) => post?.user?._id === user._id).length;

  return (
    <div className="bg-white relative flex flex-col items-start rounded-lg shadow-lg overflow-hidden border w-full mt-4">
      <div className="flex justify-between w-full py-3 px-4">
        <h2 className="text-black font-semibold text-sm">User Insights</h2>
      </div>
      <div className="grid grid-cols-2 gap-y-3 w-full border-t border-gray-200 py-3 px-4">
        <div className="text-left text-gray-500 text-xs hover:underline">Posts</div>
        <div className="text-right text-gray-600 font-bold">{userPostsCount}</div>

        <div className="text-left text-gray-500 text-xs hover:underline">Followers</div>
        <div className="text-right text-gray-600 font-bold">1.2K</div>

        <div className="text-left text-gray-500 text-xs hover:underline">Following</div>
        <div className="text-right text-gray-600 font-bold">320</div>

        <div className="text-left text-gray-500 text-xs hover:underline">Profile Viewers</div>
        <div className="text-right text-gray-600 font-bold">5.6K</div>

        <div className="text-left text-gray-500 text-xs hover:underline">Post Impressions</div>
        <div className="text-right text-gray-600 font-bold">8.4K</div>
      </div>
    </div>
  );
}
