import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLoaderData, Link } from 'react-router';
import { VideoPlayer, SubscribeButton } from '../../components/ui';
import Comments from './Comments';
import LikeButton from './LikeButton';
import type { VideoDetail } from '../../types';
import { authorizedRequest } from '../../configs';
import { useUserInform } from '../../stores/useUserInform';

const VideoPage: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const loaderData = useLoaderData() as { video: VideoDetail };
  const video = loaderData.video;
  const { basicUserInform } = useUserInform();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const historySent = useRef(false);

  useEffect(() => {
    if (video) {
      document.title = `${video.title} - VOD`;
    }
    
    return () => {
      document.title = 'VOD';
    };
  }, [video]);

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

    addToHistory();
  }, [uid, video]);


  const isProcessing = video.status === 'PROCESSING';
  const manifestUrl = `http://localhost:8080/static/video/${video.uid}/manifest.mpd`;
  const posterUrl = video.thumbnail ? `http://localhost:8080/static/${video.thumbnail}` : undefined;

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
              <Link to={`/profile/${video.user.username}`} className="w-12 h-12 bg-gray-700 rounded-full overflow-hidden flex items-center justify-center hover:opacity-80 transition-opacity">
                {video.user.userInform.avatar ? (
                  <img src={`http://localhost:8080/static/avatars/${video.user.userInform.avatar}`} alt={video.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg font-semibold">
                    {video.user.userInform.firstName?.[0]}{video.user.userInform.lastName?.[0]}
                  </span>
                )}
              </Link>
              <div className="flex items-center space-x-3">
                <Link to={`/profile/${video.user.username}`} className="block hover:opacity-80 transition-opacity">
                  <p className="font-semibold">
                    {video.user.userInform.firstName || video.user.userInform.lastName ? `${video.user.userInform.firstName} ${video.user.userInform.lastName}` : video.user.username}
                  </p>
                  <p className="text-gray-400 text-sm">@{video.user.username}</p>
                </Link>
                {basicUserInform?.username !== video.user.username && (
                  <SubscribeButton targetUsername={video.user.username} />
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <LikeButton videoId={uid as string} />
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
