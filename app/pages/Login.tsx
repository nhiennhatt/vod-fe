import { useState } from "react";
import axios from "axios";
import { Link } from "react-router";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorUsername, setErrorUsername] = useState<string | null>(null);
  const [errorPassword, setErrorPassword] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setSubmitError(null);
    setErrorUsername(null);
    setErrorPassword(null);

    let hasError = false;
    if (username.trim() === "") {
      setErrorUsername("Tên đăng nhập không được để trống");
      hasError = true;
    }
    if (password.trim() === "") {
      setErrorPassword("Mật khẩu không được để trống");
      hasError = true;
    }
    if (hasError) return;

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/token/",
        {
          username,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Login success:", response.data);
      // TODO: Điều hướng hoặc lưu token nếu cần
    } catch (error) {
      console.error(error);
      setSubmitError("Đăng nhập thất bại. Vui lòng kiểm tra thông tin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="bg-white rounded-2xl px-10 py-6 shadow-xl flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-blue-500">Đăng nhập</h1>
        {submitError && (
          <div className="text-red-600 text-sm" role="alert">
            {submitError}
          </div>
        )}
        <div className="flex flex-col gap-2 my-2">
          <div>
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              className="w-full border-2 border-gray-300 rounded-md p-2"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (e.target.value.trim() !== "") setErrorUsername(null);
              }}
            />
            {errorUsername && (
              <div className="text-red-600 text-sm mt-1">{errorUsername}</div>
            )}
          </div>
          <div>
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              className="w-full border-2 border-gray-300 rounded-md p-2"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value.trim() !== "") setErrorPassword(null);
              }}
            />
            {errorPassword && (
              <div className="text-red-600 text-sm mt-1">{errorPassword}</div>
            )}
          </div>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-60"
          onClick={handleLogin}
          disabled={loading}
        >
          Đăng nhập
        </button>
        <div className="text-sm text-center mt-2">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
}
