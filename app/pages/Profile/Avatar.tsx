import { useState } from "react";
import { authorizedRequest } from "~/configs";
import type { PublicUserInform } from "~/types";

interface AvatarProps {
  user: PublicUserInform;
  isCurrentUser: boolean;
  onUserUpdate: (user: PublicUserInform) => void;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-16 w-16",
  md: "h-24 w-24", 
  lg: "h-32 w-32"
};

export function Avatar({ user, isCurrentUser, onUserUpdate, size = "md" }: AvatarProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isCurrentUser) return;
    
    const file = event.target.files?.[0];
    if (!file) return;

    // Kiểm tra loại file
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh');
      return;
    }

    // Kiểm tra kích thước file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setIsUploading(true);
    try {
      const response = await authorizedRequest.post<{fileName: string}>('/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      onUserUpdate({ ...user, avatar: response.data.fileName });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Có lỗi xảy ra khi tải lên ảnh đại diện');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-neutral-200 flex items-center justify-center`}>
        {user.avatar ? (
          <img
            src={`http://localhost:8080/static/avatars/${user.avatar}`}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-neutral-500 text-2xl font-semibold">
            {[user.firstName, user.lastName]
              .filter(Boolean)
              .map(name => name?.[0])
              .join('')
              .toUpperCase() || user.username?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
          </div>
        )}
      </div>
      
      {isCurrentUser && (
        <div className="absolute inset-0 rounded-full flex items-center justify-center transition-all duration-200 group cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {isUploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Avatar;

