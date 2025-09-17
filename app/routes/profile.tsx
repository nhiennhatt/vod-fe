import type { Route } from "./+types/profile";
import { redirect, useLoaderData } from "react-router";
import { ProfilePage } from "~/pages/Profile/ProfilePage";
import { authorizedRequest } from "~/configs";
import type { PublicUserInform } from "~/types";
import { AuthService } from "~/services/authService";

export function meta({ params }: Route.MetaArgs) {
  const { username } = params;
  return [
    { title: username ? `Hồ sơ của ${username}` : "Hồ sơ của tôi" },
  ];
}

export async function clientLoader({ params }: Route.LoaderArgs) {
  let { username } = params;

  if (!username) {
    try {
      const me = await AuthService.loadUserInform();
      username = me.data.username;
    } catch {
      throw redirect("/");
    }
  }

  try {
    const res = await authorizedRequest.get<PublicUserInform>(`/user/${username}`);
    console.log(res.data);
  
    return res.data;
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 404) {
      throw new Response("Not Found", { status: 404 });
    }
    throw error;
  }
}

export default function Profile() {
  const user = useLoaderData<typeof clientLoader>();
  return <ProfilePage user={user as PublicUserInform} username={(user as PublicUserInform).username} />;
}
