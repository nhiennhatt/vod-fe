import SettingPasswordPage from "~/pages/Settings/SettingPasswordPage";

export const meta = () => [
  { title: "Đổi mật khẩu - VOD" },
  { name: "description", content: "Thay đổi mật khẩu tài khoản của bạn" }
];

export default function SettingsPassword() {
  return <SettingPasswordPage />;
}
