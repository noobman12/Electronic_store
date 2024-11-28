import { create } from "zustand";
import { axiosClient } from "../lib/axiosClient";
import { devtools, persist } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware"; // Import createJSONStorage
import { SETTINGS } from "../constants/settings";

interface User {
  _id: string;
  avatar?: string;
  first_name: string;
  last_name: string;
  fullname: string;
  role: number;
}

interface Auth {
  user: User | null;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ isAuthenticated: boolean; error: string }>;
  logout: () => void;
}

const useAuth = create<Auth>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        setUser: (user: User) => set({ user }),
        login: async (email: string, password: string) => {
          try {
            const response = await axiosClient.post(
              `${SETTINGS.URL_API}/v1/auth/login`,
              { email, password }
            );
            if (response && response.data.statusCode === 200) {
              const responseProfile = await axiosClient.get(
                `${SETTINGS.URL_API}/v1/auth/profile`
              );

              set({
                user: responseProfile.data.data,
                isAuthenticated: true,
              });

              return { isAuthenticated: true, error: "" };
            } else {
              return {
                isAuthenticated: false,
                error: "Username or password is invalid",
              };
            }
          } catch (error) {
            return {
              isAuthenticated: false,
              error: (error as Error)?.message || "Login failed",
            };
          }
        },
        logout: () => {
          set({ user: null, isAuthenticated: false });
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        },
      }),
      {
        name: "auth-storage", // Tên của key lưu trữ
        storage: createJSONStorage(() => sessionStorage), // Lưu trữ trong sessionStorage (tuỳ chọn, mặc định là localStorage)
      }
    )
  )
);


export default useAuth;