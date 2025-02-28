'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Trash2, MapPin, Earth, User2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Image from 'next/image';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useRouter } from 'next/navigation';
import useUserStore from '../../store/user/userStore';
import { PostOptions } from './PostOptions';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FollowButton } from './FollowButton ';

export function Post({ post }) {
  const [expanded, setExpanded] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { user, refreshData } = useUserStore();
  const router = useRouter();
  const [expandedProfession, setExpandedProfession] = useState(false);
  const isAuthor = user?._id === post.user._id;
  const MAX_LENGTH = 180;
  const MAX_LENGTH_PROFESSION = 50;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handlePostDelete = async (postId) => {
    try {
      const response = await axios.delete(`/api/posts/${postId}/delete`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.statusText === 'OK') throw new Error('Failed to delete the post.');
      toast.success('Post deleted successfully!');
      refreshData();
    } catch (error) {
      toast.error(error.message || 'Something went wrong while deleting the post.');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const colorizeHashtags = (text) => {
    const parts = text.split(/(#\w+)/g);
    return parts.map((part, index) =>
      part.startsWith('#') ? (
        <span key={index} className="text-blue-500 hover:underline cursor-pointer">
          {part}{' '}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md border p-4 mb-4">
      <div className="flex items-start space-x-3">
        <Avatar className="w-12 h-12">
          <AvatarImage src={post.user.avatar} />
          <AvatarFallback>
            {post.user.firstname?.charAt(0)}
            {post.user.lastname?.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <p className="font-semibold text-gray-900 flex items-center">
            {post.user.firstname} {post.user.lastname}
            {isAuthor && <Badge className="ml-2 bg-blue-100 text-blue-600">Author</Badge>}
          </p>
          <p className="text-sm text-gray-500 tracking-tighter">
            {isMobile
              ? expandedProfession || post.user.profession.length <= MAX_LENGTH_PROFESSION
                ? post.user.profession
                : `${post.user.profession.slice(0, MAX_LENGTH_PROFESSION)}...`
              : post.user.profession}
            {isMobile && post.user.profession.length > MAX_LENGTH_PROFESSION && (
              <button
                onClick={() => setExpandedProfession(!expandedProfession)}
                className="text-blue-500 text-sm font-semibold hover:underline"
              >
                {expandedProfession ? '' : 'more'}
              </button>
            )}
          </p>
          <p className="text-xs text-gray-400 flex gap-1">
            {formatDistanceToNow(new Date(post.createdAt))}
            <Earth className="" size={16} />
          </p>
        </div>

        {isAuthor ? (
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 p-2">
                <Trash2 size={18} className="text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>This action cannot be undone. Do you really want to delete this post?</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handlePostDelete(post._id)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <FollowButton isFollowing={false} onFollowToggle={() => console.log('')} />
        )}
      </div>

      <div className="mt-3" style={{ whiteSpace: 'pre-wrap' }}>
        <p className="text-gray-800 tracking-tighter">
          {expanded || post.text.length <= MAX_LENGTH
            ? colorizeHashtags(post.text)
            : colorizeHashtags(`${post.text.slice(0, MAX_LENGTH)}...`)}
          {post.text.length > MAX_LENGTH && (
            <button onClick={() => setExpanded(!expanded)} className="text-blue-500 text-sm font-semibold hover:underline">
              {expanded ? '' : 'more'}
            </button>
          )}
        </p>
        {post?.mediaType && (
          <div className="mt-3">
            {post?.mediaType?.startsWith('video') ? (
              <video src={post?.videoUrl} controls loop muted priority className="w-full h-[500px] object-fit rounded-lg"></video>
            ) : (
              <Image
                src={post?.imageUrl}
                alt="Post Media"
                width={500}
                height={500}
                priority
                className="w-full h-[500px] object-fit rounded-lg"
              />
            )}
          </div>
        )}
      </div>
      <PostOptions postId={post._id} post={post} />
    </div>
  );
}
