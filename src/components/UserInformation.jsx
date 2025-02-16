'use client';
import useUserStore from '../../store/user/userStore';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
export default function UserInformation({ posts }) {
  const { user } = useUserStore();
  if (!user || !posts || posts.length === 0) return null;

  return (
    <div className="relative flex flex-col items-start bg-white rounded-lg shadow-lg overflow-hidden border w-full">
      <div className="w-full h-24 bg-gray-400">
        <Avatar className="w-full h-24 rounded-none">
          {user?._id ? <AvatarImage src={user?.bgImage} className="object-cover" /> : <AvatarImage src="https://github.com/shadcn.png" />}
        </Avatar>
      </div>

      <div className="-mt-12 ml-4">
        <Avatar className="h-20 w-20 border-4 border-white shadow-lg rounded-full">
          {user?._id ? <AvatarImage src={user?.avatar} className="object-cover" /> : <AvatarImage src="https://github.com/shadcn.png" />}
          <AvatarFallback className="bg-gray-200 text-gray-800 font-semibold">
            {user?.firstname?.charAt(0)}
            {user?.lastname?.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>

      <div
        className="text-start mt-4 px-4 pb-4"
        style={{ whiteSpace: 'pre-wrap' }} // Preserve spaces and line breaks
      >
        <h2 className="font-bold text-xl text-gray-900">
          {user?.firstname} {user?.lastname}
        </h2>
        <p className="text-sm text-gray-500">
          @{user.firstname}
          {user.lastname}-{user?._id?.slice(-4)}
        </p>
        <p className="text-sm text-gray-600 mt-1 tracking-tighter">{user?.bio}</p>
        <p className="text-sm text-gray-800 font-semibold tracking-tighter">{user?.profession}</p>
        <p className="text-sm text-gray-400 font-semibold tracking-tighter">{user?.location || 'Noida, Uttar Pradesh'}</p>
      </div>

      <div className="flex justify-around w-full border-t border-gray-200 bg-gray-50 py-3">
        <div className="text-center">
          <p className="text-gray-500 text-xs">Posts</p>
          <p className="text-black font-bold"> {posts?.filter((post) => post?.user?._id === user._id).length}</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-xs">Followers</p>
          <p className="text-black font-bold">1.2K</p>
        </div>
        <div className="text-center">
          <p className="text-gray-500 text-xs">Following</p>
          <p className="text-black font-bold">320</p>
        </div>
      </div>
    </div>
  );
}
