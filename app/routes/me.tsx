import type { Route } from "./+types/me";
import { MePage } from "~/pages/Me/MePage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Hồ sơ của tôi" },
  ];
}

export default function Me() {
  return (
    <MePage />
  );
}



