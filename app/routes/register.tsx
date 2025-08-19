import { Register } from "../pages/Register";

export function meta() {
  return [
    { title: "Đăng ký" },
    { name: "description", content: "Tạo tài khoản mới" },
  ];
}

export default function RegisterPage() {
  return <Register />;
}
