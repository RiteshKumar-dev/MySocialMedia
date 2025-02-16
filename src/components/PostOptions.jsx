'use client';
import { useEffect, useState } from 'react';
import useUserStore from '../../store/user/userStore';
import axios from 'axios';
import { Button } from './ui/button';
import { Heart, MessageCircle, MessageCircleCodeIcon, Repeat2, Send, Facebook, Twitter, Linkedin, Link, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import CommentForm from './CommentForm';
import CommentFeed from './CommentFeed';
import toast from 'react-hot-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function PostOptions({ postId, post }) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const { user } = useUserStore();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || []);
  const [totalLikes, setTotalLikes] = useState(post?.likes?.length || 0);
  const [repost, setRepost] = useState(0);

  useEffect(() => {
    if (user?._id && post.likes?.includes(user._id)) {
      setLiked(true);
    }
  }, [post, user]);

  const likeOrUnlikePost = async () => {
    if (!user?._id) {
      toast.error('Please log in to like this post.');
      return;
    }

    const newLikedStatus = !liked;
    setLiked(newLikedStatus);
    setTotalLikes(newLikedStatus ? totalLikes + 1 : totalLikes - 1);

    try {
      await axios.post(`/api/posts/${postId}/like`, { userId: user._id });

      // Fetch updated likes
      const { data } = await axios.get(`/api/posts/${postId}/like`);
      setTotalLikes(data?.totalLikes || 0);
      setLikes(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to like/unlike post.');
      setLiked(!newLikedStatus);
      setTotalLikes(newLikedStatus ? totalLikes - 1 : totalLikes + 1);
    }
  };
  const handleRepost = () => {
    try {
      toast.success('Repost created successfully.');
      setRepost((prev) => prev + 1);
    } catch (error) {
      toast.error('Please log in to repost this post.');
    }
  };
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-4">
      {/* Likes & Comments Count */}
      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
        {totalLikes > 0 && (
          <p className="cursor-pointer hover:underline">
            {totalLikes} {totalLikes === 1 ? 'Like' : 'Likes'}
          </p>
        )}
        {post?.comments?.length > 0 && (
          <p onClick={() => setIsCommentsOpen(!isCommentsOpen)} className="cursor-pointer hover:underline">
            {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
          </p>
        )}
        {repost > 0 && <p className="cursor-pointer hover:underline">{repost} reposts</p>}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
        <Button
          variant="ghost"
          className="flex items-center gap-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 px-2 py-1 md:px-3 md:py-2 text-sm md:text-base"
          onClick={likeOrUnlikePost}
        >
          <Heart
            className={cn('transition-all w-4 h-4 md:w-5 md:h-5', liked ? 'text-red-500 fill-red-500' : 'text-gray-500 dark:text-gray-400')}
          />
          {liked ? 'Liked' : 'Like'}
        </Button>

        <Button
          variant="ghost"
          className="flex items-center gap-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 px-2 py-1 md:px-3 md:py-2 text-sm md:text-base"
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
        >
          <MessageCircle
            className={cn(
              'transition-all w-4 h-4 md:w-5 md:h-5',
              isCommentsOpen ? 'text-gray-200 fill-gray-700' : 'text-gray-500 dark:text-gray-400'
            )}
          />
          Comment
        </Button>

        <Button
          variant="ghost"
          className="flex items-center gap-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 px-2 py-1 md:px-3 md:py-2 text-sm md:text-base"
          onClick={handleRepost}
        >
          <Repeat2 className="w-4 h-4 md:w-5 md:h-5 text-gray-500 dark:text-gray-400" />
          Repost
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 px-2 py-1 md:px-3 md:py-2 text-sm md:text-base"
            >
              <Send className="w-4 h-4 md:w-5 md:h-5 text-gray-500 dark:text-gray-400" />
              Share
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-1">
            {/* Message Share */}
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
              <MessageCircle size={16} /> Message
            </DropdownMenuItem>

            {/* Facebook Share */}
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
            >
              <Facebook size={16} className="text-blue-600" /> Facebook
            </DropdownMenuItem>

            {/* Twitter Share */}
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`, '_blank')}
            >
              <Twitter size={16} className="text-blue-400" /> Twitter
            </DropdownMenuItem>

            {/* LinkedIn Share */}
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank')}
            >
              <Linkedin size={16} className="text-blue-700" /> LinkedIn
            </DropdownMenuItem>

            {/* Copy Link */}
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2" onClick={handleCopyLink}>
              <Copy size={16} /> Copy Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Comment Section */}
      {isCommentsOpen && (
        <div className="mt-4">
          {user?._id && <CommentForm postId={postId} />}
          <CommentFeed post={post} />
        </div>
      )}
    </div>
  );
}
