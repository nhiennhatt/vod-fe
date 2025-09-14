import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { VideoOverview, SmallCircularProgress } from "~/components";
import { authorizedRequest } from "~/configs";
import type { VideoOverview as VideoOverviewType } from "~/types";

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const keyword = useMemo(
    () => searchParams.get("q")?.trim() ?? "",
    [searchParams]
  );
  const [videos, setVideos] = useState<VideoOverviewType[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchVideos = useCallback(
    async (page: number, isLoadMore: boolean = false) => {
      if (!keyword) {
        setVideos([]);
        setHasMore(true);
        setCurrentPage(0);
        return;
      }

      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      try {
        const res = await authorizedRequest.get<VideoOverviewType[]>("/video", {
          params: { q: keyword, page },
        });

        if (isLoadMore) {
          setVideos((prev) => [...prev, ...res.data]);
        } else {
          setVideos(res.data);
        }

        setHasMore(res.data.length >= 10);
        setCurrentPage(page);
      } catch (e) {
        setError("Không thể tải kết quả tìm kiếm");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [keyword]
  );

  useEffect(() => {
    setVideos([]);
    setCurrentPage(0);
    setHasMore(true);
    fetchVideos(0, false);
  }, [keyword, fetchVideos]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          fetchVideos(currentPage + 1, true);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [currentPage, hasMore, loadingMore, loading, fetchVideos]);

  return (
    <div className="max-w-6xl mx-auto px-2.5 my-5">
      <h1 className="text-xl mb-4">
        Kết quả tìm kiếm{keyword ? ` cho "${keyword}"` : ""}
      </h1>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        </div>
      )}

      {error && <p className="text-red-600 text-center py-4">{error}</p>}

      {!loading && !error && keyword && videos.length === 0 && (
        <p className="text-center py-8 text-gray-500">
          Không tìm thấy video phù hợp.
        </p>
      )}

      <div className="grid grid-cols-3 gap-x-2 gap-y-3">
        {videos.map((video) => (
          <VideoOverview key={video.uid} video={video} />
        ))}
      </div>

      {loadingMore && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!hasMore && videos.length > 0 && !loading && (
        <p className="text-center py-4 text-gray-500">
          Đã hiển thị tất cả kết quả
        </p>
      )}

      <div ref={observerRef} className="h-4" />
    </div>
  );
}

export default SearchPage;
