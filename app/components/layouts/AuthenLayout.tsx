import { Outlet } from "react-router";
import bgVideo from "../../../public/videos/authen-bg.mp4";

export default function AuthenLayout() {
  return (
    <div className="w-dvw h-dvh">
      <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop>
        <source src={bgVideo} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/30">
        <Outlet />
      </div>
    </div>
  );
}
