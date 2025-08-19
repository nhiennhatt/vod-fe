import { Login } from "../pages/Login";

export function meta() {
  return [
    { title: "Đăng nhập" },
    { name: "description", content: "Đăng nhập vào hệ thống" },
  ];
}

export default function LoginPage() {
  return <Login />;
}
