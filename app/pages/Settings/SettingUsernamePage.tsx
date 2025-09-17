import { useState } from "react";
import { useLoaderData, useRevalidator } from "react-router";
import { authorizedRequest } from "~/configs";
import type { BasicUserInform } from "~/types";
import { useUserInform } from "~/stores/useUserInform";
import { AxiosError } from "axios";

export async function clientLoader() {
  try {
    const response = await authorizedRequest.get<BasicUserInform>("/me/detail");
    return { user: response.data };
  } catch (error) {
    throw new Response("Không thể tải thông tin người dùng", { status: 404 });
  }
}

export default function SettingUsernamePage() {
  const loaderData = useLoaderData() as { user: BasicUserInform };
  const revalidator = useRevalidator();
  const { basicUserInform, setBasicUserInform } = useUserInform();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    username: loaderData.user.username || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Validation
    if (!formData.username.trim()) {
      setMessage({ type: "error", text: "Tên người dùng không được để trống" });
      setIsLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      setMessage({
        type: "error",
        text: "Tên người dùng phải có ít nhất 3 ký tự",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await authorizedRequest.put("/me/username", {
        username: formData.username.trim(),
      });

      const accessToken = (response as any)?.data?.accessToken;
      const refreshToken = (response as any)?.data?.refreshToken;
      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      }

      try {
        const meResponse = await authorizedRequest.get<BasicUserInform>("/me");
        if (meResponse?.data) {
          setBasicUserInform(meResponse.data);
        }
      } catch {}

      setMessage({
        type: "success",
        text: "Cập nhật tên người dùng thành công!",
      });
      revalidator.revalidate();
    } catch (error: any) {
      if (error instanceof AxiosError) {
        if (error.response?.data?.errorCode === "USER_CONFLICT") {
          setMessage({
            type: "error",
            text: "Tên người dùng đã tồn tại",
          });
        }
      } else {
        setMessage({
          type: "error",
          text:
            error.response?.data?.message ||
            "Có lỗi xảy ra khi cập nhật tên người dùng",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Cập nhật tên người dùng
      </h2>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tên người dùng
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            minLength={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nhập tên người dùng mới"
          />
          <p className="mt-1 text-sm text-gray-500">
            Tên người dùng phải có ít nhất 3 ký tự và chỉ chứa chữ cái, số, dấu
            gạch dưới và dấu gạch ngang.
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang cập nhật..." : "Cập nhật tên người dùng"}
          </button>
        </div>
      </form>
    </div>
  );
}
