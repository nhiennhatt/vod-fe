import React, { useEffect, useState } from 'react';
import { authorizedRequest } from '../../configs';
import { useUserInform } from '../../stores/useUserInform';

interface CommentItem {
  id: string;
  content: string;
  username: string;
  createdAt: string;
  isOwn: boolean;
}

interface ApiCommentItem {
  uid: string;
  user: {
    username: string;
    firstName: string | null;
    lastName: string | null;
    avatar: string | null;
  };
  content: string;
  createdOn: string;
  status: CommentStatus;
}

enum CommentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

interface CommentsProps {
  videoId: string;
}

const Comments: React.FC<CommentsProps> = ({ videoId }) => {
  const [commentInput, setCommentInput] = useState<string>('');
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { basicUserInform } = useUserInform();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      if (!videoId) return;
      setLoading(true);
      try {
        const res = await authorizedRequest.get<ApiCommentItem[]>(`/comments`, {
          params: { videoId },
        });
        const currentUsername = basicUserInform?.username ?? null;
        const normalized: CommentItem[] = Array.isArray(res.data)
          ? res.data
              .filter((c) => c.status === CommentStatus.ACTIVE)
              .map((c) => {
                const username = c.user?.username ?? 'Ẩn danh';
                return {
                  id: c.uid,
                  content: c.content,
                  username,
                  createdAt: c.createdOn,
                  isOwn: currentUsername ? username === currentUsername : false,
                };
              })
          : [];
        setComments(normalized);
      } catch {
        setComments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [videoId, basicUserInform?.username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = commentInput.trim();
    if (!content) return;
    try {
      const res = await authorizedRequest.post<{ uid: string }>(
        '/comments',
        { videoId, comment: content }
      );
      const newComment: CommentItem = {
        id: res?.data?.uid ?? Math.random().toString(36).slice(2),
        content,
        username: basicUserInform?.username ?? 'Bạn',
        createdAt: new Date().toISOString(),
        isOwn: true,
      };
      setComments((prev) => [newComment, ...prev]);
      setCommentInput('');
    } catch {
      // Có thể hiển thị thông báo lỗi nếu cần
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await authorizedRequest.delete(`/comments/${id}`);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch {
      // Có thể hiển thị thông báo lỗi nếu cần
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Bình luận</h2>
      <form onSubmit={handleSubmit} className="flex items-start space-x-3 mb-6">
        <input
          type="text"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          placeholder="Viết bình luận..."
          className="flex-1 px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-60"
          disabled={!commentInput.trim()}
        >
          Gửi
        </button>
      </form>

      {loading ? (
        <p className="text-gray-400">Đang tải bình luận...</p>
      ) : (
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-400">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-sm font-semibold">
                  {(c.username && c.username[0]) || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">{c.isOwn ? 'Bạn' : c.username}</span>
                    <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</span>
                    {c.isOwn && (
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="ml-2 text-xs text-red-400 hover:text-red-300 disabled:opacity-60 cursor-pointer hover:underline"
                        disabled={deletingId === c.id}
                        aria-label="Xóa bình luận"
                      >
                        {deletingId === c.id ? 'Đang xóa…' : 'Xóa'}
                      </button>
                    )}
                  </div>
                  <p className="text-gray-200">{c.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Comments;


