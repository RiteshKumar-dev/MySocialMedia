import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, Trash2, Settings, Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import useUserStore from '../../store/user/userStore';
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

export const UserAvatar = () => {
  const { logout, user } = useUserStore();
  const router = useRouter();
  const [actionType, setActionType] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    try {
      if (actionType === 'logout') {
        logout();
        toast.success('Logged out successfully!');
        router.push('/login');
      } else if (actionType === 'delete') {
        // Add delete profile API logic here
        console.log('Deleting profile...');
        toast.success('Profile deleted successfully!');
        router.push('/register');
      }
    } catch (error) {
      toast.error(`Failed to ${actionType}. Please try again.`);
      console.error(`${actionType} Error:`, error);
    } finally {
      setLoading(false);
      setActionType(null);
    }
  };

  const handleSettings = () => {
    router.push('/UpdateProfile');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0 rounded-full border">
            <Avatar>
              {user?.avatar ? (
                <AvatarImage src={user.avatar} alt="User Avatar" />
              ) : (
                <AvatarFallback className="bg-gray-200 text-gray-600">{user?.firstname?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-1">
          <DropdownMenuItem className="cursor-pointer flex items-center gap-2" onClick={handleSettings}>
            <Settings size={16} /> Settings
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-red-500" onClick={() => setActionType('delete')}>
            <Trash2 size={16} />
            Delete Profile
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-red-500" onClick={() => setActionType('logout')}>
            <LogOut size={16} />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Alert Dialog for Logout & Delete Account */}
      <AlertDialog open={!!actionType} onOpenChange={() => setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{actionType === 'logout' ? 'Confirm Logout' : 'Confirm Account Deletion'}</AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'logout'
                ? 'Are you sure you want to log out? You will need to log in again to access your account.'
                : 'This action is permanent and cannot be undone. Do you really want to delete your account?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAction} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={16} /> : actionType === 'logout' ? 'Logout' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
