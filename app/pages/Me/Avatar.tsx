import { useRef, useState } from "react";
import { authorizedRequest } from "~/configs";
import type { PublicUserInform } from "~/types";

interface AvatarProps {
  user: PublicUserInform | null;
  currentUsername: string | undefined;
  onUserUpdate: (user: PublicUserInform) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ 
  user, 
  currentUsername, 
  onUserUpdate, 
  size = "md",
  className = ""
}: AvatarProps) {
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24", 
    lg: "h-32 w-32"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  const spinnerSizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      await authorizedRequest.post('/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (currentUsername) {
        const res = await authorizedRequest.get<PublicUserInform>(`/user/${currentUsername}`);
        onUserUpdate(res.data);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <>
      <div 
        className={`${sizeClasses[size]} rounded-full bg-neutral-300 overflow-hidden ring-4 ring-white border-2 border-neutral-200 cursor-pointer hover:ring-blue-400 hover:border-blue-300 transition-all duration-200 relative group ${className}`}
        onClick={handleAvatarClick}
      >
        {user?.avatar && (
          <img
            src={"http://localhost:8080/static/avatars/" + user.avatar}
            alt={currentUsername || "User"}
            className="h-full w-full object-cover"
          />
        )}
        {avatarUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className={`animate-spin rounded-full ${spinnerSizes[size]} border-b-2 border-white`}></div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
          <svg className={`${iconSizes[size]} text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        className="hidden"
      />
    </>
  );
}

export default Avatar;
