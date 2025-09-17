import { useState, useEffect } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import { authorizedRequest } from "~/configs";
import type { BasicUserInform } from "~/types";
import { AxiosError } from "axios";

export async function clientLoader() {
  try {
    const response = await authorizedRequest.get<BasicUserInform>("/me/detail");
    return { user: response.data };
  } catch (error) {
    throw new Response("Không thể tải thông tin người dùng", { status: 404 });
  }
}

export default function SettingProfilePage() {
  const loaderData = useLoaderData() as { user: BasicUserInform };
  const revalidator = useRevalidator();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    firstName: loaderData.user.firstName || "",
    lastName: loaderData.user.lastName || "",
    middleName: loaderData.user.middleName || "",
    dateOfBirth: loaderData.user.dateOfBirth ? new Date(loaderData.user.dateOfBirth).toISOString().split('T')[0] : "",
    description: loaderData.user.description || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    try {
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString() : null,
        description: formData.description,
      };

      await authorizedRequest.put("/me", updateData);
      setMessage({ type: 'success', text: 'Cập nhật thông tin thành công!' });
      revalidator.revalidate();
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin cá nhân</h2>
      
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              Tên
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập tên của bạn"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Họ
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập họ của bạn"
            />
          </div>

          <div>
            <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-2">
              Tên đệm
            </label>
            <input
              type="text"
              id="middleName"
              name="middleName"
              value={formData.middleName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập tên đệm của bạn"
            />
          </div>

          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
              Ngày sinh
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>



          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập mô tả về bản thân"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
          </button>
        </div>
      </form>
    </div>
  );
}
