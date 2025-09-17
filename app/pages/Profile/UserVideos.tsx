import { useCallback, useEffect, useRef, useState } from "react";
import { VideoOverview } from "~/components";
import { authorizedRequest } from "~/configs";
import type { VideoOverview as VideoOverviewType } from "~/types";

interface UserVideosProps {
  username: string;
  className?: string;
}

export function UserVideos({ username, className = "" }: UserVideosProps) {
  const [videos, setVideos] = useState<VideoOverviewType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchUserVideos = useCallback(async (pageNum: number, reset = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const res = await authorizedRequest.get<VideoOverviewType[]>(`/user/${username}/videos?page=${pageNum}`);
      const newVideos = res.data;
      
      if (reset) {
        setVideos(newVideos);
      } else {
        setVideos(prev => [...prev, ...newVideos]);
      }
      
      setHasMore(newVideos.length === 12);
    } catch (error) {
      console.error("Error fetching user videos:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [username]);

  useEffect(() => {
    fetchUserVideos(page, true);
  }, [fetchUserVideos]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchUserVideos(nextPage, false);
    }
  }, [page, loadingMore, hasMore, fetchUserVideos]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMore, hasMore, loadingMore]);

  return (
    <div className={`mt-6 ${className}`}>
      <h2 className="text-xl mb-4">Video của {username}</h2>
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-x-2 gap-y-3">
            {videos.map((video) => (
              <VideoOverview key={video.uid} video={video} />
            ))}
          </div>
          
          {loadingMore && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
          )}
          
          {hasMore && !loadingMore && (
            <div ref={loadMoreRef} className="h-4" />
          )}
          
          {!hasMore && videos.length > 0 && (
            <div className="text-center py-4 text-neutral-500">
              Đã hiển thị tất cả video
            </div>
          )}
        </>
      )}
      {!loading && videos.length === 0 && (
        <p className="text-neutral-500">Chưa có video nào.</p>
      )}
    </div>
  );
}

export default UserVideos;

