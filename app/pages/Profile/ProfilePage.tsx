import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { Avatar } from "./Avatar";
import { CoverImage } from "./CoverImage";
import { UserVideos } from "./UserVideos";
import { SubscribeButton } from "~/components/ui";
import { useUserInform } from "~/stores/useUserInform";
import { authorizedRequest } from "~/configs";
import type { PublicUserInform } from "~/types";

interface ProfilePageProps {
  user: PublicUserInform;
  username: string;
}

export function ProfilePage({ user: initialUser, username }: ProfilePageProps) {
  const currentUser = useUserInform((state) => state.basicUserInform);
  const [user, setUser] = useState<PublicUserInform | null>(initialUser);
  const [userLoading] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState<number>(0);
  const [subscriberLoading, setSubscriberLoading] = useState(true);
  const targetUsername = username;

  const handleUserUpdate = (updatedUser: PublicUserInform) => {
    setUser(updatedUser);
  };

  const handleSubscribeChange = async () => {
    if (!targetUsername) return;
    
    try {
      const response = await authorizedRequest.get<{count: number}>(`/subscribe/count/${targetUsername}`);
      setSubscriberCount(response.data.count);
    } catch (error) {
      console.error('Error fetching updated subscriber count:', error);
    }
  };

  useEffect(() => {
    if (user && targetUsername) {
      const displayName = [user.firstName, user.middleName, user.lastName]
        .filter(Boolean)
        .join(" ") || targetUsername;
      document.title = `${displayName} - VOD`;
    }
    
    return () => {
      document.title = 'VOD';
    };
  }, [user, targetUsername]);

  // Fetch subscriber count
  useEffect(() => {
    const fetchSubscriberCount = async () => {
      if (!targetUsername) return;
      
      setSubscriberLoading(true);
      try {
        const response = await authorizedRequest.get<{count: number}>(`/subscribe/count/${targetUsername}`);
        setSubscriberCount(response.data.count);
      } catch (error) {
        console.error('Error fetching subscriber count:', error);
        setSubscriberCount(0);
      } finally {
        setSubscriberLoading(false);
      }
    };

    fetchSubscriberCount();
  }, [targetUsername]);

  const displayName = useMemo(() => {
    if (!user) return "";
    const parts = [user.firstName, user.middleName, user.lastName].filter(
      Boolean
    ) as string[];  
    return parts.length ? parts.join(" ") : targetUsername || "";
  }, [user, targetUsername]);

  const isCurrentUser = currentUser?.username === targetUsername;

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
          isCurrentUser={isCurrentUser}
          onUserUpdate={handleUserUpdate}
        />
      </div>

      <div className="flex items-start gap-4 mb-8">
        <Avatar
          user={user}
          isCurrentUser={isCurrentUser}
          onUserUpdate={handleUserUpdate}
          size="lg"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-neutral-900">
            {displayName}
          </h1>
          <div className="flex items-center gap-2">
            <p className="text-neutral-400 text-sm">@{targetUsername}</p>
            {!subscriberLoading && (
              <span className="text-neutral-500 text-sm">
                • {subscriberCount} người đăng ký
              </span>
            )}
          </div>
          {user.description && (
            <p className="text-neutral-700 mt-1 text-sm max-w-md">
              {user.description}
            </p>
          )}
          {!isCurrentUser && (
            <div className="my-2">
              <SubscribeButton 
                targetUsername={targetUsername} 
                onSubscribeChange={handleSubscribeChange}
              />
            </div>
          )}
        </div>
      </div>

      <UserVideos 
        username={targetUsername} 
      />
    </div>
  );
}

export default ProfilePage;
