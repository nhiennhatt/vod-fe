import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Avatar } from "./Avatar";
import { CoverImage } from "./CoverImage";
import { UserVideos } from "./UserVideos";
import { authorizedRequest } from "~/configs";
import { useUserInform } from "~/stores/useUserInform";
import { AuthService } from "~/services/authService";
import type { PublicUserInform } from "~/types";

export function MePage() {
  const currentUser = useUserInform((state) => state.basicUserInform);
  const navigate = useNavigate();
  const [user, setUser] = useState<PublicUserInform | null>(null);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchUserInfo = async () => {
      setUserLoading(true);
      try {
        const res = await authorizedRequest.get<PublicUserInform>(
          `/user/${currentUser.username}`
        );
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
        navigate("/login");
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserInfo();
  }, [currentUser, navigate]);


  const handleUserUpdate = (updatedUser: PublicUserInform) => {
    setUser(updatedUser);
  };

  // Cập nhật document title khi user được load
  useEffect(() => {
    if (user && currentUser) {
      const displayName = [user.firstName, user.middleName, user.lastName]
        .filter(Boolean)
        .join(" ") || currentUser.username;
      document.title = `${displayName} - VOD`;
    }
    
    // Cleanup: reset title khi component unmount
    return () => {
      document.title = 'VOD';
    };
  }, [user, currentUser]);

  const displayName = useMemo(() => {
    if (!user) return "";
    const parts = [user.firstName, user.middleName, user.lastName].filter(
      Boolean
    ) as string[];
    return parts.length ? parts.join(" ") : currentUser?.username || "";
  }, [user, currentUser]);

  if (userLoading) {
    return (
      <div className="max-w-6xl mx-auto px-2.5 my-5">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-2.5 my-5">
      <div className="mb-8">
        <CoverImage
          user={user}
          currentUsername={currentUser?.username}
          onUserUpdate={handleUserUpdate}
        />
      </div>

      <div className="flex items-start gap-4 mb-8">
        <Avatar
          user={user}
          currentUsername={currentUser?.username}
          onUserUpdate={handleUserUpdate}
          size="md"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-neutral-900">
            {displayName}
          </h1>
          <p className="text-neutral-600">@{currentUser?.username}</p>
          {user.description && (
            <p className="text-neutral-700 mt-1 text-sm max-w-md">
              {user.description}
            </p>
          )}
        </div>
      </div>

      <UserVideos username={currentUser?.username} />
    </div>
  );
}

export default MePage;
