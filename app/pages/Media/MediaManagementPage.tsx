import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { authorizedRequest } from "~/configs";
import type { VideoOverview as VideoOverviewType } from "~/types";
import { Link } from "react-router";
import dayjs from "dayjs";
import MediaItem from "./MediaItem";
import { UploadIcon } from "~/components/icons/UploadIcon";

export default function MediaManagementPage() {
  const [videos, setVideos] = useState<VideoOverviewType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.title = "Quản lý nội dung - VOD";
    return () => {
      document.title = "VOD";
    };
  }, []);

  const fetchMyVideos = useCallback(async (pageNum: number, reset = false) => {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const res = await authorizedRequest.get<VideoOverviewType[]>(`/me/videos?page=${pageNum}`);
      const newVideos = res.data;

      if (reset) {
        setVideos(newVideos);
      } else {
        setVideos(prev => [...prev, ...newVideos]);
      }

      setHasMore(newVideos.length === 12);
    } catch (error) {
      console.error("Error fetching my videos:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchMyVideos(page, true);
  }, [fetchMyVideos]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMyVideos(nextPage, false);
    }
  }, [page, loadingMore, hasMore, fetchMyVideos]);

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

  const handleDelete = useCallback(async (uid: string) => {
    try {
      await authorizedRequest.delete(`/video/${uid}`);
      setVideos(prev => prev.filter(v => v.uid !== uid));
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  }, []);

  const formatFullDateTime = useCallback((date: Date): string => {
    return dayjs(date).format("HH:mm DD/MM/YYYY");
  }, []);

  const renderVideoRow = useCallback((video: VideoOverviewType) => {
    return (
      <MediaItem
        key={video.uid}
        video={video}
        onDelete={handleDelete}
        formattedCreatedOn={formatFullDateTime(video.createdOn)}
      />
    );
  }, [handleDelete, formatFullDateTime]);

  return (
    <div className="max-w-6xl mx-auto px-2.5 my-5">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quản lý nội dung</h1>
        <Link
          to="/media/upload"
          className="inline-flex items-center gap-2 rounded-md border border-blue-600 bg-white px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
        >
          <UploadIcon className="h-4 w-4" />
          Tạo nội dung mới
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          <div className="divide-y divide-neutral-200">
            {videos.map(renderVideoRow)}
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


