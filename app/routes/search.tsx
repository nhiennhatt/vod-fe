import type { Route } from "./+types/search";
import { SearchPage } from "~/pages/Search/SearchPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tìm kiếm video" },
    { name: "description", content: "Kết quả tìm kiếm video" },
  ];
}

export default function Search() {
  return (
    <SearchPage/>
  );
}



