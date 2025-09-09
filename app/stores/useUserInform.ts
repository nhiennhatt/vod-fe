import { create } from "zustand";
import type { BasicUserInform } from "../types";

interface UserInformStateInterface {
    basicUserInform: BasicUserInform | null;
    setBasicUserInform: (basicUserInform: BasicUserInform) => void;
    clearBasicUserInform: () => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const useUserInform = create<UserInformStateInterface>()((set) => ({
    basicUserInform: null,
    setBasicUserInform: (basicUserInform: BasicUserInform) => {
        set({ basicUserInform });
    },
    clearBasicUserInform: () => {
        set({ basicUserInform: null });
    },
    loading: true,
    setLoading: (loading: boolean) => {
        set({ loading });
    }
}))