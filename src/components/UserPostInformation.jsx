'use client';
import useUserStore from '../../store/user/userStore';

export default function UserPostInformation({ posts }) {
  const { user } = useUserStore();
  if (!user || !posts || posts.length === 0) return null;

  const userPostsCount = posts.filter((post) => post?.user?._id === user._id).length;

  return (
    <div className="bg-white relative flex flex-col items-start rounded-lg shadow-lg overflow-hidden border w-full mt-4">
      <div className="flex justify-between w-full py-3 px-4">
        <h2 className="text-black font-semibold text-sm">User Insights</h2>
      </div>
      <div className="grid grid-cols-2 gap-y-4 w-full border-t border-gray-200 py-4 px-4 text-sm">
        {/* Posts */}
        <div className="text-left text-gray-500 font-medium">Posts</div>
        <div className="text-right text-gray-700 font-semibold">{userPostsCount}</div>

        {/* Followers */}
        <div className="text-left text-gray-500 font-medium">Followers</div>
        <div className="text-right text-gray-400 italic truncate">Coming soon</div>

        {/* Following */}
        <div className="text-left text-gray-500 font-medium">Following</div>
        <div className="text-right text-gray-400 italic truncate">Feature in progress</div>

        {/* Profile Viewers */}
        <div className="text-left text-gray-500 font-medium">Profile Views</div>
        <div className="text-right text-gray-400 italic truncate">Tracking not enabled</div>

        {/* Post Impressions */}
        <div className="text-left text-gray-500 font-medium">Post Impressions</div>
        <div className="text-right text-gray-400 italic truncate">Coming with analytics</div>
      </div>
    </div>
  );
}
