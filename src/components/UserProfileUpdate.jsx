'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { updateProfile } from '@/lib/apiRoutes';
import useUserStore from '../../store/user/userStore';

export function UserProfileUpdate() {
  const { user, setUser } = useUserStore();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '', // Email is pre-filled and non-editable
    bio: '',
    profession: '',
  });
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [bgImage, setBgImage] = useState(null);

  // Update email when user data is available
  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [user?.email]); // Runs when user.email changes

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleBgImageChange = (e) => {
    setBgImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasChanges = Object.keys(formData).some((key) => key !== 'email' && formData[key].trim() !== '') || avatar || bgImage;

    if (!hasChanges) {
      toast.error('Please update at least one field.');
      return;
    }

    const updatedData = new FormData();
    Object.keys(formData).forEach((key) => {
      updatedData.append(key, formData[key]);
    });
    if (avatar) {
      updatedData.append('avatar', avatar);
    }
    if (bgImage) {
      updatedData.append('bgImage', bgImage);
    }
    try {
      setLoading(true);
      const res = await axios.put(updateProfile, updatedData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Profile updated successfully!');
      const updatedUserData = res?.data?.updatedUser?.user;
      setUser(updatedUserData);
      router.push('/');
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">Update Your Profile</h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Keep your profile up to date! Update your details easily and make sure your information is always current.
      </p>
      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input id="firstname" placeholder="Tyler" type="text" value={formData.firstname} onChange={handleChange} />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input id="lastname" placeholder="Durden" type="text" value={formData.lastname} onChange={handleChange} />
          </LabelInputContainer>
        </div>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" value={formData.email} disabled className="cursor-not-allowed bg-gray-200" />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="bio">Bio</Label>
          <Input id="bio" placeholder="Write something about yourself..." type="text" value={formData.bio} onChange={handleChange} />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="profession">Profession</Label>
          <Input id="profession" placeholder="Your profession" type="text" value={formData.profession} onChange={handleChange} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="avatar">Avatar</Label>
          <Input id="avatar" type="file" onChange={handleAvatarChange} />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="bgImage">Background Image</Label>
          <Input id="bgImage" type="file" onChange={handleBgImageChange} />
        </LabelInputContainer>
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-lg disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center mt-2">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            'Update '
          )}
          &rarr;
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return <div className={cn('flex flex-col space-y-2 w-full', className)}>{children}</div>;
};
