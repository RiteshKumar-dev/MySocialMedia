import { useState } from 'react';
import { UserPlus, Check } from 'lucide-react';
import { Button } from './ui/button';

export function FollowButton({ isFollowing, onFollowToggle }) {
  const [following, setFollowing] = useState(isFollowing);

  const handleFollowClick = () => {
    setFollowing((prev) => !prev);
    onFollowToggle();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`p-2 flex items-center gap-1 transition-all duration-300 ${
        following ? 'bg-gray-100 text-black hover:bg-gray-300' : 'bg-gray-200 text-black hover:bg-gray-300'
      }`}
      onClick={handleFollowClick}
    >
      {following ? (
        <>
          <Check size={18} className="text-blue-400" />
          Following
        </>
      ) : (
        <>
          <UserPlus size={18} className="text-blue-500" />
          Follow
        </>
      )}
    </Button>
  );
}
