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
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status !== 200) throw new Error('Failed to delete the comment.');
      toast.success('Comment deleted successfully!');
      refreshData();
    } catch (error) {
      toast.error(error.message || 'Something went wrong while deleting the comment.');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      {post?.comments?.map((comment, index) => {
        const isAuthor = comment.user.userId === user?._id;

        return (
          <div key={comment._id} className="w-full max-w-2xl">
            <div className="flex items-start space-x-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
              {/* User Avatar */}
              <Avatar className="w-10 h-10">
                <AvatarImage src={comment.user.avatar} />
                <AvatarFallback className="bg-gray-300 dark:bg-gray-700">
                  {comment.user.firstname?.charAt(0)}
                  {comment.user.lastname?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* Comment Content */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  {/* User Info */}
                  <div>
                    <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                      {comment.user.firstname} {comment.user.lastname}
                    </p>
                    <p className="text-xs text-gray-500">{post?.user?.bio ? post.user.bio.slice(0, 45) + '...' : ''}</p>
                  </div>

                  {/* Time & Visibility Icon */}
                  <div className="flex flex-wrap items-center gap-x-1 text-gray-500 text-xs min-w-0">
                    <span className="truncate">{formatDistanceToNow(new Date(comment.createdAt))} ago</span>
                    <Earth size={14} className="shrink-0" />
                  </div>
                </div>

                {/* Comment Text */}
                <p className="mt-2 text-sm text-gray-800 dark:text-gray-300 leading-relaxed">{comment.text}</p>

                {/* Delete Button (Only for Comment Author) */}
                {isAuthor && (
                  <div className="flex justify-end mt-2">
                    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500 p-2 transition-all">
                          <Trash2 size={18} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white dark:bg-gray-900 shadow-lg opacity-100">
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

            {/* Underline after each comment except the last one */}
            {index !== post.comments.length - 1 && <hr className="border-t border-gray-300 dark:border-gray-700 mt-3 w-4/5 mx-auto" />}
          </div>
        );
      })}
    </div>
  );
}

export default CommentFeed;
