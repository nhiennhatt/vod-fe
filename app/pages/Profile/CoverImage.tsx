import { useState } from "react";
import { authorizedRequest } from "~/configs";
import type { PublicUserInform } from "~/types";

interface CoverImageProps {
  user: PublicUserInform;
  isCurrentUser: boolean;
  onUserUpdate: (user: PublicUserInform) => void;
}

export function CoverImage({
  user,
  isCurrentUser,
  onUserUpdate,
}: CoverImageProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!isCurrentUser) return;

    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Kích thước file không được vượt quá 10MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    try {
      const response = await authorizedRequest.post<{fileName: string}>(
        "/me/cover",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onUserUpdate({ ...user, coverImg: response.data.fileName });
    } catch (error) {
      console.error("Error uploading cover image:", error);
      alert("Có lỗi xảy ra khi tải lên ảnh bìa");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg overflow-hidden">
      {(user.coverImg) && (
        <img
          src={`http://localhost:8080/static/covers/${user.coverImg}`}
          alt="Cover"
          className="w-full h-full object-cover"
        />
      )}

      {isCurrentUser && (
        <div className="absolute inset-0 flex items-center justify-center transition-all duration-200 group cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            ) : (
              <div className="text-white text-center">
                <svg
                  className="h-8 w-8 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-sm font-medium">Thay đổi ảnh bìa</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CoverImage;
