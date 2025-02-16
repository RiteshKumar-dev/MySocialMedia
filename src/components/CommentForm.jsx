'use client';
import { useRef, useState } from 'react';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import useUserStore from '../../store/user/userStore';
import { Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

function CommentForm({ postId }) {
  const { user, refreshData } = useUserStore();
  const ref = useRef(null);
  const [commentText, setCommentText] = useState('');

  const handleCommentAction = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      toast.error('User not authenticated');
      return;
    }

    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    if (commentText.length < 10) {
      toast.error('Comment must be at least 10 characters long');
      return;
    }

    if (commentText.length > 450) {
      toast.error('Comment cannot exceed 450 characters');
      return;
    }

    const commentData = {
      user: {
        userId: user?._id,
        avatar: user?.avatar,
        firstname: user?.firstname,
        lastname: user?.lastname,
      },
      text: commentText,
    };

    try {
      const promise = axios.post(`/api/posts/${postId}/comments`, commentData);
      toast.promise(promise, {
        loading: 'Posting comment',
        success: 'Comment Posted!',
        error: 'Error creating comment',
      });
      await promise;
      setCommentText('');
      refreshData();
    } catch (error) {
      console.error(`Error creating comment: ${error}`);
    }
  };

  return (
    <form ref={ref} onSubmit={handleCommentAction} className="flex items-center space-x-1">
      <Avatar className="w-12 h-12">
        <AvatarImage src={user?.avatar} />
        <AvatarFallback className="bg-gray-500 text-white font-semibold">
          {user?.firstname?.charAt(0)}
          {user?.lastname?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 items-center bg-white dark:bg-gray-700 border rounded-full px-4 py-2 shadow-sm">
        <input
          type="text"
          name="commentInput"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 outline-none text-sm bg-transparent text-gray-900 dark:text-gray-200"
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-all">
          <Send size={18} />
        </button>
      </div>
    </form>
  );
}

export default CommentForm;
