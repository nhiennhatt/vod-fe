import axios from "axios";
import { useEffect, useState } from "react";
import { VideoOverview } from "~/components";
import { unauthorizedRequest } from "~/configs";
import type { VideoOverview as VideoOverviewType } from "~/types";

export function NewestVideos() {
    const [videos, setVideos] = useState<VideoOverviewType[]>([]);

    useEffect(() => {
        const fetchVideos = async () => {
            const response = await unauthorizedRequest.get<VideoOverviewType[]>("/video/latest");
            setVideos(response.data);
        }
        fetchVideos();
    }, []);

  return (
    <div className="">
      <h1 className="text-xl">Video mới nhất</h1>
      <div className="grid grid-cols-3 gap-x-2 gap-y-3">
        {videos.map((video) => (
          <VideoOverview key={video.uid} video={video} />
        ))}
      </div>
    </div>
  );
}
