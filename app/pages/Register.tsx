import { Link } from "react-router";

export function Register() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="bg-white rounded-2xl px-10 py-6 shadow-xl flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-blue-500">Đăng ký</h1>
        <div className="flex flex-col gap-2 my-2">
          <div>
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              className="w-full border-2 border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="w-full border-2 border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              className="w-full border-2 border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="repeatPassword">Nhập lại mật khẩu</label>
            <input
              type="password"
              id="repeatPassword"
              className="w-full border-2 border-gray-300 rounded-md p-2"
            />
          </div>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Đăng ký
        </button>
        <div className="text-sm text-center mt-2">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}


