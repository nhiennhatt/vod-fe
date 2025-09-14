import { Link } from "react-router";
import dayjs from "dayjs";
import type { VideoOverview as VideoOverviewType } from "../../types";

interface VideoOverviewProps {
  video: VideoOverviewType;
  className?: string;
}

export function VideoOverview({ video, className = "" }: VideoOverviewProps) {
  const getTimeDistance = (date: Date): string => {
    const now = dayjs();
    const videoDate = dayjs(date);
    const diffInMinutes = now.diff(videoDate, "minute");
    const diffInHours = now.diff(videoDate, "hour");
    const diffInDays = now.diff(videoDate, "day");
    const diffInWeeks = now.diff(videoDate, "week");
    const diffInMonths = now.diff(videoDate, "month");
    const diffInYears = now.diff(videoDate, "year");

    if (diffInMinutes < 1) {
      return "Vừa xong";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    } else if (diffInWeeks < 4) {
      return `${diffInWeeks} tuần trước`;
    } else if (diffInMonths < 12) {
      return `${diffInMonths} tháng trước`;
    } else {
      return `${diffInYears} năm trước`;
    }
  };

  return (
    <div className={`group cursor-pointer ${className}`}>
      <Link to={`/video/${video.uid}`} className="block">
        <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden mb-1.5">
          <img
            src={"http://localhost:8080/static/" + video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="px-0.5">
          <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {video.title}
          </h3>

          <p className="text-sm text-gray-600">
            {video.user.firstName || video.user.lastName ? `${video.user.firstName} ${video.user.lastName}` : video.user.username} •&nbsp;
            <span>{getTimeDistance(video.createdOn)}</span>
          </p>
        </div>
      </Link>
    </div>
  );
}
