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
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import useUserStore from '../../store/user/userStore';
import { Earth, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useState } from 'react';

function CommentFeed({ post }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { user, refreshData } = useUserStore();
  const handleCommentDelete = async (commentId) => {
    try {
      const response = await axios.delete(`/api/posts/${post._id}/comments`, {
        data: { commentId },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      if (!response.statusText === 'OK') throw new Error('Failed to delete the comment.');
      toast.success('Comment deleted successfully!');
      refreshData();
    } catch (error) {
      toast.error(error.message || 'Something went wrong while deleting the comment.');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="mt-4 space-y-3">
      {post?.comments?.map((comment) => {
        // ✅ Each comment will check its own author
        const isAuthor = comment.user.userId === user?._id;

        return (
          <div key={comment._id} className="flex items-start justify-center space-x-3">
            {/* User Avatar */}
            <Avatar className="w-9 h-9">
              <AvatarImage src={comment.user.avatar} />
              <AvatarFallback>
                {comment.user.firstname?.charAt(0)}
                {comment.user.lastname?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            {/* Comment Box */}
            <div className="p-3 rounded-lg w-full max-w-lg shadow-sm">
              <div className="flex justify-between items-center">
                {/* User Info */}
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    {comment.user.firstname} {comment.user.lastname}
                  </p>
                  {/* <p className="text-xs text-gray-500">
                    @{comment.user.firstname.toLowerCase()}
                    {comment.user.lastname.toLowerCase()}-{comment.user.userId.toString().slice(-4)}
                  </p> */}
                  <p className="text-xs text-gray-500">{post?.user?.bio ? post.user.bio.slice(0, 45) + '...' : ''}</p>
                </div>

                {/* Time & Visibility Icon */}
                <div className="flex items-center space-x-1 text-gray-500 text-xs">
                  <span>{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                  <Earth size={14} />
                </div>
              </div>

              {/* Comment Text */}
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>

              {/* ✅ Delete Button (Only for Comment Author) */}
              {isAuthor && (
                <div className="flex justify-end items-end">
                  <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 p-2">
                        <Trash2 size={18} className="text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. Do you really want to delete this comment?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleCommentDelete(comment._id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CommentFeed;
