import { Outlet } from "react-router";
import { Navbar } from "../ui";

export default function GeneralLayout() {
  return (
    <div className="w-full min-h-dvh">
      <Navbar />
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
}