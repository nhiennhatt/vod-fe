import type { Route } from "./+types/video";
import VideoPage from "../pages/Video/VideoPage";
import { authorizedRequest } from "../configs";
import type { VideoDetail } from "../types";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const { uid } = params;
  
  if (!uid) {
    throw new Response("Video ID không hợp lệ", { status: 400 });
  }

  try {
    const res = await authorizedRequest.get<VideoDetail>(`/video/${uid}`);
    return { video: res.data };
  } catch (error) {
    throw new Response("Không thể tải thông tin video", { status: 404 });
  }
}

export default function Video() {
  return <VideoPage />;
}
