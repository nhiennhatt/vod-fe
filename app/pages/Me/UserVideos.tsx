import { useEffect, useState } from "react";
import { VideoOverview } from "~/components";
import { authorizedRequest } from "~/configs";
import type { VideoOverview as VideoOverviewType } from "~/types";

interface UserVideosProps {
  username: string | undefined;
  className?: string;
}

export function UserVideos({ username, className = "" }: UserVideosProps) {
  const [videos, setVideos] = useState<VideoOverviewType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!username) {
      return;
    }

    const fetchUserVideos = async () => {
      setLoading(true);
      try {
        const res = await authorizedRequest.get<VideoOverviewType[]>(`/me/videos`);
        setVideos(res.data);
      } catch (error) {
        console.error("Error fetching user videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserVideos();
  }, [username]);

  return (
    <div className={`mt-6 ${className}`}>
      <h2 className="text-xl mb-4">Video của tôi</h2>
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-x-2 gap-y-3">
          {videos.map((video) => (
            <VideoOverview key={video.uid} video={video} />
          ))}
        </div>
      )}
      {!loading && videos.length === 0 && (
        <p className="text-neutral-500">Chưa có video nào.</p>
      )}
    </div>
  );
}

export default UserVideos;
