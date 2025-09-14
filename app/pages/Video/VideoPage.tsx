import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router';
import { VideoPlayer } from '../../components/ui';
import Comments from './Comments';
import LikeButton from './LikeButton';
import type { VideoDetail } from '../../types';
import { authorizedRequest } from '../../configs';

const VideoPage: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const [video, setVideo] = useState<VideoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const historySent = useRef(false);


  useEffect(() => {
    const fetchVideo = async () => {
      if (!uid) {
        setError('Video ID không hợp lệ');
        setLoading(false);
        return;
      }
      try {
        const res = await authorizedRequest.get<VideoDetail>(`/video/${uid}`);
        setVideo(res.data);
      } catch (err) {
        setError('Không thể tải thông tin video');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [uid]);

  // Cập nhật document title khi video được load
  useEffect(() => {
    if (video) {
      document.title = `${video.title} - VOD`;
    }
    
    // Cleanup: reset title khi component unmount
    return () => {
      document.title = 'VOD';
    };
  }, [video]);

  // Gửi request đến history khi video được tải thành công (chỉ một lần)
  useEffect(() => {
    const addToHistory = async () => {
      if (!uid || !video || historySent.current) return;
      
      try {
        await authorizedRequest.post('/history', {
          videoId: uid
        });
        historySent.current = true;
      } catch (err) {
        console.error('Không thể thêm video vào lịch sử:', err);
      }
    };

    if (video) {
      addToHistory();
    }
  }, [video]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Đang tải video...</p>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-red-500 mb-4">{error || 'Không tìm thấy video'}</p>
          <button 
            onClick={() => window.history.back()} 
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const isProcessing = video.status === 'PROCESSING';
  const manifestUrl = `http://localhost:8080/static/video/${video.uid}/manifest.mpd`;
  const posterUrl = video.thumbnail ? `http://localhost:8080/static/${video.thumbnail}` : undefined;

  // Description logic
  const maxLength = 200;
  const shouldTruncate = video.description && video.description.length > maxLength;
  const displayDescription = shouldTruncate && !isDescriptionExpanded 
    ? video.description.substring(0, maxLength) + '...'
    : video.description;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 max-w-5xl mx-auto w-full">
          {isProcessing ? (
            <div className="relative bg-black w-full aspect-video rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Video đang được xử lý. Vui lòng quay lại sau.</p>
              </div>
            </div>
          ) : (
            <VideoPlayer 
              videoUrl={manifestUrl}
              poster={posterUrl}
              className="w-full aspect-video rounded-lg overflow-hidden"
            />
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden flex items-center justify-center">
                {video.user.userInform.avatar ? (
                  <img src={`http://localhost:8080/static/avatars/${video.user.userInform.avatar}`} alt={video.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-semibold">
                    {video.user.userInform.firstName?.[0]}{video.user.userInform.lastName?.[0]}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold">
                  {video.user.userInform.firstName || video.user.userInform.lastName ? `${video.user.userInform.firstName} ${video.user.userInform.lastName}` : video.user.username}
                </p>
                <p className="text-gray-400 text-sm">@{video.user.username}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <LikeButton videoId={uid as string} />
              <span className="px-2 py-1 rounded text-xs font-medium bg-gray-800 border border-gray-700">
                {video.privacy}
              </span>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Mô tả</h2>
            <p className="text-gray-300 whitespace-pre-line">
              {displayDescription}
            </p>
            {shouldTruncate && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                {isDescriptionExpanded ? 'Thu gọn' : 'Xem thêm'}
              </button>
            )}
          </div>

          <Comments videoId={uid as string} />
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
