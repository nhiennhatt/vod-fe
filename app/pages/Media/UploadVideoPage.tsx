import { useCallback, useEffect, useMemo, useState } from "react";
import { authorizedRequest } from "~/configs";
import { useNavigate } from "react-router";

type Privacy = "PRIVATE" | "LIMITED" | "PUBLIC";

export default function UploadVideoPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState<Privacy>("PRIVATE");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(
    null
  );
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Tải lên video - VOD";
    return () => {
      document.title = "VOD";
    };
  }, []);

  useEffect(() => {
    if (thumbnail) {
      const url = URL.createObjectURL(thumbnail);
      setThumbnailPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setThumbnailPreviewUrl(null);
    }
  }, [thumbnail]);

  useEffect(() => {
    if (video) {
      const url = URL.createObjectURL(video);
      setVideoPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setVideoPreviewUrl(null);
    }
  }, [video]);

  useEffect(() => {
    if (!videoPreviewUrl) return;
    const el = document.createElement("video");
    el.preload = "metadata";
    el.src = videoPreviewUrl;
    return () => {
      el.src = "";
    };
  }, [videoPreviewUrl]);

  const isValid = useMemo(() => {
    return title.trim().length > 0 && !!thumbnail && !!video;
  }, [title, thumbnail, video]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isValid || submitting) return;
      setSubmitting(true);
      setError(null);

      try {
        const form = new FormData();
        form.append("title", title.trim());
        form.append("description", description);
        form.append("privacy", privacy);
        if (thumbnail) form.append("thumbnail", thumbnail);
        if (video) form.append("video", video);

        await authorizedRequest.post("/video", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        navigate("/media");
      } catch (err: any) {
        setError(
          err?.response?.data?.message || "Tải lên thất bại. Vui lòng thử lại."
        );
      } finally {
        setSubmitting(false);
      }
    },
    [
      title,
      description,
      privacy,
      thumbnail,
      video,
      isValid,
      submitting,
      navigate,
    ]
  );

  return (
    <div className="max-w-6xl mx-auto px-2.5 my-5">
      <h1 className="text-2xl font-semibold mb-4">Tải lên video</h1>

      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Tiêu đề
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              placeholder="Nhập tiêu đề video"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              placeholder="Mô tả nội dung video"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Quyền riêng tư
            </label>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value as Privacy)}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
            >
              <option value="PRIVATE">Riêng tư</option>
              <option value="LIMITED">Giới hạn</option>
              <option value="PUBLIC">Công khai</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Ảnh bìa
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-neutral-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
              required
            />
            {thumbnailPreviewUrl && (
              <div className="mt-3">
                <div className="rounded-lg border border-neutral-200 bg-white shadow-sm">
                  <div className="p-4">
                    <div className="w-full max-w-xl aspect-[16/9] overflow-hidden rounded-md bg-neutral-100 mx-auto">
                      <img
                        src={thumbnailPreviewUrl}
                        alt="Xem trước ảnh bìa"
                        className="h-full w-full object-cover mx-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Video
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-neutral-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
              required
            />
            {videoPreviewUrl && (
              <div className="mt-3">
                <div className="rounded-lg border border-neutral-200 bg-white shadow-sm">
                  <div className="p-4">
                    <div className="w-full max-w-xl aspect-[16/9] overflow-hidden rounded-md bg-neutral-100 mx-auto">
                      <video
                        src={videoPreviewUrl}
                        className="h-full w-full object-cover mx-auto"
                        controls
                        playsInline
                        muted
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={!isValid || submitting}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Đang tải lên..." : "Tải lên"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
