import { useState } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import { authorizedRequest } from "~/configs";
import type { BasicUserInform } from "~/types";

export async function clientLoader() {
  try {
    const response = await authorizedRequest.get<BasicUserInform>("/me/detail");
    return { user: response.data };
  } catch (error) {
    throw new Response("Không thể tải thông tin người dùng", { status: 404 });
  }
}

export default function SettingEmailPage() {
  const loaderData = useLoaderData() as { user: BasicUserInform };
  const revalidator = useRevalidator();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    email: loaderData.user.email || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Validation
    if (!formData.email.trim()) {
      setMessage({ type: 'error', text: 'Email không được để trống' });
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: 'error', text: 'Email không hợp lệ' });
      setIsLoading(false);
      return;
    }

    try {
      await authorizedRequest.put("/me/email", {
        email: formData.email.trim()
      });
      
      setMessage({ type: 'success', text: 'Cập nhật email thành công!' });
      revalidator.revalidate();
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật email' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Cập nhật email</h2>
      
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nhập email mới"
          />
          <p className="mt-1 text-sm text-gray-500">
            Email sẽ được sử dụng để đăng nhập và nhận thông báo từ hệ thống.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang cập nhật...' : 'Cập nhật email'}
          </button>
        </div>
      </form>
    </div>
  );
}
