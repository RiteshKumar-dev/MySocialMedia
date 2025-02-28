'use client';
import React, { useEffect } from 'react';
import useUserStore from '../../store/user/userStore';
import { AnimatedTooltip } from './ui/animated-tooltip';

export function Tooltip() {
  // const { users, getAllUsers, loading, error } = useUserStore();

  // useEffect(() => {
  //   getAllUsers();
  // }, []);

  // // Default image for users without an avatar
  // const defaultImage = 'bgImg.jpg';

  // // Function to truncate bio after 10 words
  // const truncateBio = (bio) => {
  //   if (!bio) return 'User';
  //   const words = bio.split(' ');
  //   return words.length > 10 ? words.slice(0, 5).join(' ') + ' ...' : bio;
  // };

  // const people = users?.map((user, index) => ({
  //   id: index + 1,
  //   name: `${user.firstname} ${user.lastname}`,
  //   designation: truncateBio(user.bio), // Truncate bio after 10 words
  //   image: user.avatar || defaultImage, // Set default image if missing
  // }));
  // if (loading) {
  //   return <p className="text-center text-gray-500">Loading users...</p>;
  // }

  // if (error) {
  //   return <p className="text-center text-red-500">Error fetching users: {error}</p>;
  // }

  const people = [
    {
      id: 1,
      name: 'Ram Shah',
      designation: 'Software Engineer',
      image: 'https://res.cloudinary.com/dx92c81cg/image/upload/v1739451509/mySocialMedia/fmkzszbl3hiz6qcs0aij.jpg',
    },
    {
      id: 2,
      name: 'Rohini Rajpoot',
      designation: 'React Native Developer',
      image: 'https://res.cloudinary.com/dx92c81cg/image/upload/v1739532657/mySocialMedia/r3yfqh6smmblksxplg9c.png',
    },
    {
      id: 3,
      name: 'Neha Shah',
      designation: 'Senior HR Associate',
      image: 'https://res.cloudinary.com/dx92c81cg/image/upload/v1739602367/mySocialMedia/ju21sg5qvtgpxcapcjmc.png',
    },
    {
      id: 4,
      name: 'Jhon Doe',
      designation: 'Software Tester',
      image: '/user6.webp',
    },
    {
      id: 5,
      name: 'Sohini Rajpoot',
      designation: 'Student',
      image: '/user7.jpg',
    },
  ];
  return <div className="flex flex-row items-center justify-center mb-10 w-full">{<AnimatedTooltip items={people} />}</div>;
}
