import type { Route } from "./+types/notfound";

export function meta(): Route.MetaDescriptors {
  return [{ title: "404 - Không tìm thấy" }];
}

export default function NotFoundPage() {
  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1 className="text-3xl font-semibold">404</h1>
      <p className="text-neutral-700 mt-2">Trang bạn yêu cầu không tồn tại.</p>
    </main>
  );
}



