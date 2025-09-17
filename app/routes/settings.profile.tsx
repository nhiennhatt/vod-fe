import SettingProfilePage, { clientLoader } from "~/pages/Settings/SettingProfilePage";

export { clientLoader };

export const meta = () => [
  { title: "Cài đặt thông tin cá nhân - VOD" },
  { name: "description", content: "Cập nhật thông tin cá nhân của bạn" }
];

export default function SettingsProfile() {
  return <SettingProfilePage />;
}
