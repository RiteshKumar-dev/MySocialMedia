'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useUserStore from '../../store/user/userStore';

export default function UsersStatusClips() {
  const { users, getAllUsers } = useUserStore();
  const [selectedUser, setSelectedUser] = useState(null);
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const statusImgs = ['/status1.png', '/sta1.webp', '/sta2.avif', '/sta3.png', '/status1.png'];

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    let timer;

    if (visible) {
      timer = setTimeout(() => {
        if (currentIndex < statusImgs.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          setVisible(false);
          setSelectedUser(null);
          setCurrentIndex(0);
        }
      }, 3000); // 3 seconds per image
    }

    return () => clearTimeout(timer);
  }, [visible, currentIndex]);

  return (
    <div>
      {/* Status Circles */}
      <div className="flex gap-4 overflow-x-auto">
        {users?.map((user) => (
          <div
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              setVisible(true);
              setCurrentIndex(0);
            }}
            className="cursor-pointer w-16 h-16 rounded-full border-4 border-purple-300 shadow-md overflow-hidden"
          >
            <img src={user.avatar || `/user6.webp`} alt={user.firstname} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Status Popup */}
      <AnimatePresence>
        {visible && selectedUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <div className="relative w-[90%] max-w-sm rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-zinc-900">
              <img
                src={statusImgs[currentIndex]}
                alt="Status"
                className="w-full h-[500px] object-cover transition duration-500 ease-in-out"
              />

              {/* Header */}
              <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-2 bg-black/40 text-white">
                <h2 className="font-semibold text-sm">{selectedUser.firstname}'s Status</h2>
                <button
                  onClick={() => {
                    setVisible(false);
                    setSelectedUser(null);
                    setCurrentIndex(0);
                  }}
                  className="text-white hover:text-red-500 transition bg-gray-300 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-400"
                >
                  ✕
                </button>
              </div>
              {/* Comment Input */}
              <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full px-4 py-2 pr-10 rounded-full border border-gray-300 dark:border-zinc-600 bg-gray-100 dark:bg-zinc-700 text-sm outline-none focus:ring-2 focus:ring-purple-400"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800 transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.752 11.168l-9.596-4.796a1 1 0 00-1.44.894v10.468a1 1 0 001.44.894l9.596-4.796a1 1 0 000-1.788z"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="absolute top-0 left-0 right-0 flex space-x-1 px-2 pt-1">
                {statusImgs.map((_, index) => (
                  <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                    {index === currentIndex ? (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 10, ease: 'linear' }}
                        className="h-full bg-white"
                      />
                    ) : (
                      <div className={`h-full ${index < currentIndex ? 'bg-white' : 'bg-transparent'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
