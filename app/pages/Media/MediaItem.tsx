import { Link } from "react-router";
import type { VideoOverview as VideoOverviewType } from "~/types";
import { TrashIcon } from "~/components/icons/TrashIcon";
import { VideoStatus } from "~/types/Video";
import ArrowUpFromSquareIcon from "~/components/icons/ArrowUpFromSquareIcon";

interface MediaItemProps {
  video: VideoOverviewType;
  onDelete: (uid: string) => void;
  formattedCreatedOn: string;
}

export function MediaItem({
  video,
  onDelete,
  formattedCreatedOn,
}: MediaItemProps) {
  const renderStatusBadge = (status?: VideoStatus) => {
    if (!status) return null;
    let classes = "";
    let label: string = status;
    switch (status) {
      case VideoStatus.PROCESSING:
        classes = "bg-amber-100 text-amber-700 border-amber-200";
        label = "Đang xử lý";
        break;
      case VideoStatus.READY:
        classes = "bg-green-100 text-green-700 border-green-200";
        label = "Sẵn sàng";
        break;
      case VideoStatus.FAILED:
        classes = "bg-red-100 text-red-700 border-red-200";
        label = "Thất bại";
        break;
      case VideoStatus.INACTIVE:
        classes = "bg-neutral-100 text-neutral-700 border-neutral-200";
        label = "Tạm ngưng";
        break;
      case VideoStatus.VIOLATED:
        classes = "bg-red-100 text-red-700 border-red-200";
        label = "Vi phạm";
        break;
      default:
        classes = "bg-neutral-100 text-neutral-700 border-neutral-200";
        break;
    }
    return (
      <span
        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${classes}`}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="py-3">
      <div className="flex items-start gap-3">
        <Link to={`/media/manage/${video.uid}`} className="block shrink-0">
          <div className="relative w-44 aspect-video bg-gray-200 rounded-md overflow-hidden">
            <img
              src={"http://localhost:8080/static/" + video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={`/media/manage/${video.uid}`} className="block">
            <h3 className="font-medium text-gray-900 line-clamp-2 hover:text-blue-600">
              {video.title}
            </h3>
          </Link>
          <div className="mt-1 flex items-center gap-2">
            {renderStatusBadge((video as any).status)}
            <p className="text-sm text-gray-600">
              Đăng lúc {formattedCreatedOn}
            </p>
          </div>
          <Link
            to={`/video/${video.uid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-black/70 text-white hover:bg-black/80"
            title="Mở trình phát ở tab mới"
            aria-label="Mở trình phát ở tab mới"
            onClick={(e) => e.stopPropagation()}
          >
            Mở trình phát&nbsp;
            <ArrowUpFromSquareIcon className="size-2 stroke-3" />
          </Link>
        </div>
        <div className="shrink-0">
          <button
            onClick={() => onDelete(video.uid)}
            className="inline-flex items-center rounded-md border border-red-200 bg-white p-2 text-red-600 hover:bg-red-50"
            title="Xóa video"
            aria-label="Xóa video"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MediaItem;
