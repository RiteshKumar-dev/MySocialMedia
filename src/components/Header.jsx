'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Briefcase, HomeIcon, MailOpen, MessagesSquare, Search, Users } from 'lucide-react';
import { UserAvatar } from './UserAvatar';
import { Button } from './ui/button';
import useUserStore from '../../store/user/userStore';
import { IconAuth2fa } from '@tabler/icons-react';

export default function Header() {
  const { user, isauthenticated } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [userSuggestions, setUserSuggestions] = useState([]);
  const pathname = usePathname();
  const router = useRouter();

  // Mock user data (Replace this with an API call)
  const mockUsers = ['John Doe', 'Jane Smith', 'Alex Johnson', 'Emily Davis', 'Michael Brown'];

  // Fetch user suggestions based on search input
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setUserSuggestions([]);
      return;
    }

    // Simulating API call (Replace with real API call)
    setUserSuggestions(mockUsers.filter((user) => user.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [searchTerm]);

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      await axios.post('/api/search', { query: searchTerm });
      setSearchTerm(''); // Reset input field
      setShowDropdown(false);
      router.refresh(); // Refresh the page
    } catch (error) {
      console.error('Search Error:', error);
    }
  };

  return (
    <div className="flex items-center p-2 max-w-6xl mx-auto">
      {/* Logo */}
      <div className="rounded-lg bg-black text-white font-bold p-2">DEV</div>

      {/* Search */}
      <div className="flex-1 relative">
        <form onSubmit={handleSearch} className="flex items-center space-x-1 bg-gray-100 p-2 rounded-md flex-1 mx-2 max-w-96">
          <Search className="h-5 text-gray-700 font-bold" />
          <input
            type="text"
            placeholder="Search users..."
            className="bg-transparent flex-1 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Close dropdown with delay
          />
        </form>

        {/* Dropdown for user suggestions */}
        {showDropdown && userSuggestions.length > 0 && (
          <div className="absolute top-full mt-1 w-full md:w-1/2 bg-white shadow-lg rounded-md border ml-2 z-10">
            {userSuggestions.map((user, index) => (
              <button
                key={index}
                className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                onMouseDown={() => setSearchTerm(user)}
              >
                <Search className="h-4 w-4 text-gray-500" /> {/* Search icon outside loop */}
                {user}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center space-x-6 px-6">
        <NavItem href="/" pathname={pathname} Icon={HomeIcon} label="Home" />
        <NavItem href="/network" pathname={pathname} Icon={Users} label="Network" />
        <NavItem href="/jobs" pathname={pathname} Icon={Briefcase} label="Jobs" />
        <NavItem href="/messages" pathname={pathname} Icon={MessagesSquare} label="Messaging" />
      </div>
      {isauthenticated ? (
        <div className="cursor-pointer">
          <UserAvatar />
        </div>
      ) : (
        <Link href={'/login'}>
          <Button className="rounded-lg font-bold flex items-center gap-2 px-2 sm:px-4">
            <IconAuth2fa className="h-5 w-5" />
            <span className="">Login</span>
          </Button>
        </Link>
      )}
    </div>
  );
}

// Navigation Item Component
function NavItem({ href, pathname, Icon, label }) {
  const isActive = pathname === href;
  return (
    <Link href={href} className={`icon flex flex-col items-center ${isActive ? 'text-black underline' : 'text-gray-700'}`}>
      <Icon className="h-5" />
      <p>{label}</p>
    </Link>
  );
}
