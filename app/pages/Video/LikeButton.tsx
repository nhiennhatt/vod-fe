import React, { useEffect, useState } from 'react';
import { authorizedRequest } from '../../configs';

interface LikeButtonProps {
  videoId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ videoId }) => {
  const [liked, setLiked] = useState<boolean>(false);
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);

  useEffect(() => {
    const fetchLiked = async () => {
      if (!videoId) return;
      try {
        const res = await authorizedRequest.get<{ liked: boolean }>(`/likes`, {
          params: { videoId },
        });
        setLiked(Boolean(res.data?.liked));
      } catch {
        // ignore
      }
    };
    fetchLiked();
  }, [videoId]);

  useEffect(() => {
    const fetchLikeCount = async () => {
      if (!videoId) return;
      try {
        const res = await authorizedRequest.get<{ count: number }>(`/likes/count`, {
          params: { videoId },
        });
        setLikeCount(Number(res.data?.count ?? 0));
      } catch {
        setLikeCount(0);
      }
    };
    fetchLikeCount();
  }, [videoId]);

  const handleToggleLike = async () => {
    if (!videoId || likeLoading) return;
    setLikeLoading(true);
    try {
      if (!liked) {
        await authorizedRequest.post(`/likes`, { videoId });
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      } else {
        await authorizedRequest.delete(`/likes`, { data: { videoId } });
        setLiked(false);
        setLikeCount((prev) => (prev > 0 ? prev - 1 : 0));
      }
    } catch {
      // ignore
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={handleToggleLike}
        disabled={likeLoading}
        className={`px-4 py-2 rounded transition-colors ${liked ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'} disabled:opacity-60`}
        aria-pressed={liked}
        aria-label={liked ? 'Bỏ thích' : 'Thích'}
      >
        {likeLoading ? 'Đang xử lý...' : liked ? 'Đã thích' : 'Thích'}
      </button>
      <span className="text-sm text-gray-300">{likeCount}</span>
    </div>
  );
};

export default LikeButton;


