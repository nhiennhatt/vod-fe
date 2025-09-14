import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { unauthorizedRequest } from "~/configs";

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (formData.password !== formData.repeatPassword) {
      setError("Mật khẩu không khớp");
      return;
    }

    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    try {
      await unauthorizedRequest.post("/user", {
        username: formData.username,
        password: formData.password,
        email: formData.email,
      });

      // Redirect to login page after successful registration
      navigate("/login");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="bg-white rounded-2xl px-10 py-6 shadow-xl flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-blue-500">Đăng ký</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-2 my-2">
          <div>
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="repeatPassword">Nhập lại mật khẩu</label>
            <input
              type="password"
              id="repeatPassword"
              value={formData.repeatPassword}
              onChange={handleChange}
              className="w-full border-2 border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>
        
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


