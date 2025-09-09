import { authorizedRequest } from "~/configs";
import type { BasicUserInform } from "~/types";

export class AuthService {
    public static loadAccessToken() {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            return null;
        }
        return accessToken;
    }

    public static loadRefreshToken() {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            return null;
        }
        return refreshToken;
    }

    public static loadUserInform() {
        const accessToken = AuthService.loadAccessToken();
        if (!accessToken)
            return Promise.reject(new Error("No access token"));
        return authorizedRequest.get<BasicUserInform>("/me");
    }

    public static logout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }
}