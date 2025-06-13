import { Loader2 } from 'lucide-react';
import { Post } from './Post';

export function PostFeed({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center text-gray-500">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );
  }
  return (
    <div className="space-y-2 pb-20">
      {posts?.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
}
