import { Outlet, useNavigate } from "react-router";
import { useUserInform } from "~/stores/useUserInform";
import { FullScreenLoading } from "../ui/CircularProgress";
import { useEffect } from "react";

export default function AuthenticatedProvider() {
  const userInform = useUserInform(state => state.basicUserInform);
  const isLoading = useUserInform(state => state.loading);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !userInform) {
      navigate("/login");
    }
  }, [isLoading, userInform, navigate]);

  return isLoading ? <FullScreenLoading /> : <Outlet />;
}
