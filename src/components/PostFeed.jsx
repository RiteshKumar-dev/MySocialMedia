import { Post } from './Post';

export function PostFeed({ posts }) {
  return (
    <div className="space-y-2 pb-20">
      {posts?.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
}
