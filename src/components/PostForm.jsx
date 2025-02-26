'use client';

import { useState, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ImageIcon, Trash2, FileText, Send, VideoIcon } from 'lucide-react';
import useUserStore from '../../store/user/userStore';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { GlobalLoader } from './Loader';

export default function PostForm() {
  const { user, refreshData } = useUserStore();
  const [postText, setPostText] = useState('');
  // const [image, setImage] = useState(null);
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isArticle, setIsArticle] = useState(false);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const isDataHere = !postText.trim() && !media;
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeMedia = () => {
    setPreview(null);
    setMedia(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset file input
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postText.trim() && !media) {
      toast.error('Post content or media is required!');
      return;
    } else if (postText.trim() && (postText.length < 10 || postText.length > 2000)) {
      toast.error('Post content must be between 10 and 2000 characters!');
      return;
    }

    if (media && !postText.trim()) {
      toast.error('Text is required when uploading media!');
      return;
    }

    if (media) {
      const validMediaTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'video/mp4', 'video/webm'];
      if (!validMediaTypes.includes(media.type)) {
        toast.error('Only JPG, PNG, WEBP images, and MP4, WEBM videos are allowed!');
        return;
      }
      if (media.size > 20 * 1024 * 1024) {
        // 20MB size limit for media
        toast.error('Media size should not exceed 20MB!');
        return;
      }
    }

    const formData = new FormData();
    formData.append('text', postText);
    formData.append('isArticle', isArticle);
    formData.append('userId', user?._id);
    if (media) {
      formData.append('media', media);
      formData.append('mediaType', media.type.split('/')[0]);
    }

    try {
      setLoading(true);
      toast.loading('Creating post');
      await axios.post('/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.dismiss();
      toast.success('Post created successfully!');
      setPostText('');
      removeMedia();
      refreshData();
      <GlobalLoader />;
    } catch (error) {
      toast.dismiss();
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <GlobalLoader />
      ) : (
        <div className="mb-4 p-4 sm:p-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg border">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar & Input Field */}
            <div className="flex items-start space-x-2 sm:space-x-3">
              <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>

              <div className="w-full">
                {isArticle ? (
                  <Textarea
                    id="articleInput"
                    placeholder="Write your article..."
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg outline-none text-sm sm:text-base bg-gray-100 dark:bg-gray-700 dark:text-white"
                    rows={4}
                  />
                ) : (
                  <Input
                    id="postInput"
                    placeholder="What's on your mind?"
                    type="text"
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-full outline-none text-sm sm:text-base bg-gray-100 dark:bg-gray-700 dark:text-white"
                  />
                )}
              </div>
            </div>

            {/* Media Preview */}
            {preview && (
              <div className="relative mt-2">
                {media.type.startsWith('video/') ? (
                  <video src={preview} controls className="w-full rounded-lg shadow-md"></video>
                ) : (
                  <img src={preview} alt="Preview" className="w-full rounded-lg shadow-md object-cover" />
                )}
                <Trash2
                  size={18}
                  className="text-red-500 absolute top-2 right-2 cursor-pointer font-bold bg-white rounded-full p-1"
                  onClick={removeMedia}
                />
              </div>
            )}

            {/* Upload, Post, and Write Article Buttons */}
            <div className="flex justify-between items-center flex-wrap gap-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  variant={preview ? 'secondary' : 'outline'}
                  className="rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm"
                >
                  <ImageIcon className="mr-1 sm:mr-2 text-blue-500" size={14} />
                  {preview ? 'Change Media' : 'Add Media'}
                </Button>

                <Button
                  type="button"
                  onClick={() => setIsArticle(!isArticle)}
                  variant="outline"
                  className={`${isArticle ? 'text-black' : ''} rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm`}
                >
                  <FileText className="mr-1 sm:mr-2 text-orange-500" size={14} />
                  {isArticle ? 'Switch to Post' : 'Write an Article'}
                </Button>
              </div>

              {!isDataHere && (
                <Button type="submit" className="text-black rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm" variant="outline">
                  {isArticle ? 'Publish' : 'Post'}
                  <Send className="ml-1 sm:ml-2 text-gray-500" size={14} />
                </Button>
              )}
            </div>

            {/* Hidden File Input */}
            <input type="file" ref={fileInputRef} hidden accept="image/*,video/*" onChange={handleMediaChange} />
          </form>
        </div>
      )}
    </>
  );
}
