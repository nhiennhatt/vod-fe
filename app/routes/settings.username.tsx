import SettingUsernamePage, { clientLoader } from "~/pages/Settings/SettingUsernamePage";

export { clientLoader };

export const meta = () => [
  { title: "Cập nhật tên người dùng - VOD" },
  { name: "description", content: "Thay đổi tên người dùng của tài khoản" }
];

export default function SettingsUsername() {
  return <SettingUsernamePage />;
}
