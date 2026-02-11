import { toast } from "sonner";
import { persistor } from "@/store/store";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/store/slice/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

import api from "@/api/api";

export function useAuth() {
  const { refreshToken } = useSelector((state) => state.authStore);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/auth/logout", {
        refreshToken: refreshToken,
      });

      return response;
    },
    onSuccess: (response) => {
      toast.success(response?.message || "Signout successful!");
    },
    onError: (error) => {
      console.log("Signout Error: ", error);
      const errorMsg = error.response.data.message || "An error occurred";
      toast.error(`Signout message. ${errorMsg}`);
    },
    onSettled: async () => {
      dispatch(logout());

      // 2. Clear persisted storage
      await persistor.purge();

      // 3. Optional: redirect user
      navigate("/signin", { replace: true });
    },
  });

  const handleLogout = logoutMutation.mutate;

  return { logout: handleLogout };
}
