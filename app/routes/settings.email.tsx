import SettingEmailPage, { clientLoader } from "~/pages/Settings/SettingEmailPage";

export { clientLoader };

export const meta = () => [
  { title: "Cập nhật email - VOD" },
  { name: "description", content: "Thay đổi địa chỉ email của tài khoản" }
];

export default function SettingsEmail() {
  return <SettingEmailPage />;
}
