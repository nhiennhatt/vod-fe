import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import ArrowLeft from "~/components/icons/ArrowLeft";
import { VideoPlayer } from "~/components";
import ChevronDown from "~/components/icons/ChevronDown";
import { authorizedRequest } from "~/configs";
import type { VideoDetail, VideoPrivacy, VideoStatus } from "~/types/Video";

export default function ManageVideoPage() {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [thumbSaving, setThumbSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [video, setVideo] = useState<VideoDetail | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState<VideoPrivacy>();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbOpen, setThumbOpen] = useState(false);

  useEffect(() => {
    document.title = "Quản lý video - VOD";
    return () => {
      document.title = "VOD";
    };
  }, []);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!uid) return;
      setLoading(true);
      setError(null);
      try {
        const res = await authorizedRequest.get<VideoDetail>(`/video/${uid}`);
        setVideo(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setPrivacy(res.data.privacy);
      } catch (e: any) {
        setError(
          e?.response?.data?.message || "Không tải được thông tin video"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [uid]);

  useEffect(() => {
    if (!thumbnailFile) {
      setThumbnailPreview(null);
      return;
    }
    const url = URL.createObjectURL(thumbnailFile);
    setThumbnailPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [thumbnailFile]);

  const isMetaValid = useMemo(() => !!title.trim(), [title]);

  const handleSaveMeta = useCallback(async () => {
    if (!uid || !isMetaValid) return;
    setSaving(true);
    setError(null);
    try {
      await authorizedRequest.put(`/video/${uid}`, {
        title: title.trim(),
        description,
        privacy,
      });
      //   navigate(`/video/${uid}`);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  }, [uid, title, description, privacy, isMetaValid, navigate]);

  const handleSaveThumb = useCallback(async () => {
    if (!uid || !thumbnailFile) return;
    setThumbSaving(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("thumbnail", thumbnailFile);
      await authorizedRequest.put(`/video/${uid}/thumbnail`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      //   navigate(`/video/${uid}`);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Cập nhật ảnh bìa thất bại");
    } finally {
      setThumbSaving(false);
    }
  }, [uid, thumbnailFile, navigate]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-2.5 my-5">
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="max-w-4xl mx-auto px-2.5 my-5">
        <p className="text-neutral-600">Không tìm thấy video.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-2.5 my-5 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Chỉnh sửa thông tin video</h1>
        <Link
          to="/media"
          className="inline-flex items-center gap-2 rounded-md border border-blue-600 bg-white px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại Quản lý nội dung
        </Link>
      </div>
      <VideoPlayer videoUrl={`http://localhost:8080/static/video/${video.uid}/manifest.mpd`} className="rounded-xl overflow-hidden" />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 px-4 py-3">
          <h2 className="text-base font-medium text-neutral-800">
            Chỉnh sửa thông tin
          </h2>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Tiêu đề
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Quyền riêng tư
            </label>
            <select
              value={privacy}
              onChange={(e) =>
                setPrivacy(e.target.value as VideoDetail["privacy"])
              }
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="PRIVATE">Riêng tư</option>
              <option value="LIMITED">Giới hạn</option>
              <option value="PUBLIC">Công khai</option>
            </select>
          </div>
          <div className="pt-1">
            <button
              onClick={handleSaveMeta}
              disabled={!isMetaValid || saving}
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
          <h2 className="text-base font-medium text-neutral-800">
            Cập nhật ảnh bìa
          </h2>
          <button
            type="button"
            onClick={() => setThumbOpen((v) => !v)}
            className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            aria-expanded={thumbOpen}
          >
            <ChevronDown
              className={`size-4 ${thumbOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
        {thumbOpen && (
          <div className="p-4 space-y-3">
            <div className="grid-cols-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
                className="mb-3 block w-full text-sm text-neutral-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-neutral-700 mb-2">Ảnh hiện tại</p>
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-md bg-neutral-100">
                  <img
                    src={"http://localhost:8080/static/" + video.thumbnail}
                    alt={video.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="text-sm text-neutral-700 mb-2">Ảnh mới</p>

                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-md bg-neutral-100">
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="Xem trước ảnh mới"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center text-xs text-neutral-400">
                      Chưa chọn ảnh
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="pt-1">
              <button
                onClick={handleSaveThumb}
                disabled={!thumbnailFile || thumbSaving}
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {thumbSaving ? "Đang cập nhật..." : "Cập nhật ảnh bìa"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
