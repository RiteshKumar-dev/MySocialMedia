'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useUserStore from '../../store/user/userStore';

export default function UsersStatusClips() {
  const { users, getAllUsers } = useUserStore();
  const [selectedUser, setSelectedUser] = useState(null);
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const statusImgs = ['/status1.png', '/stats2.jpg', '/stats3.jpg', '/stats4.png', '/stst5.jpg'];

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
            <img
              src={user.avatar || `https://source.unsplash.com/random/100x100?sig=${user._id}`}
              alt={user.firstname}
              className="w-full h-full object-cover"
            />
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
                className="w-full h-[500px] object-cover object-center transition duration-500 ease-in-out"
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
                  className="text-white hover:text-red-500 transition"
                >
                  ✕
                </button>
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
