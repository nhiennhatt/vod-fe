import { useRef, useState } from "react";
import { authorizedRequest } from "~/configs";
import type { PublicUserInform } from "~/types";

interface CoverImageProps {
  user: PublicUserInform | null;
  currentUsername: string | undefined;
  onUserUpdate: (user: PublicUserInform) => void;
  className?: string;
}

export function CoverImage({ 
  user, 
  currentUsername, 
  onUserUpdate, 
  className = ""
}: CoverImageProps) {
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleCoverClick = () => {
    coverInputRef.current?.click();
  };

  const handleCoverChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      return;
    }

    setCoverUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      await authorizedRequest.post('/me/cover', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (currentUsername) {
        const res = await authorizedRequest.get<PublicUserInform>(`/user/${currentUsername}`);
        onUserUpdate(res.data);
      }
    } catch (error) {
      console.error('Error uploading cover:', error);
    } finally {
      setCoverUploading(false);
    }
  };

  return (
    <>
      <div 
        className={`h-48 w-full bg-neutral-200 overflow-hidden rounded-xl cursor-pointer hover:opacity-90 transition-opacity duration-200 relative group ${className}`}
        onClick={handleCoverClick}
      >
        {user?.coverImg && (
          <img
            src={"http://localhost:8080/static/covers/" + user.coverImg}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        {coverUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
          <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
      </div>
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        onChange={handleCoverChange}
        className="hidden"
      />
    </>
  );
}

export default CoverImage;
