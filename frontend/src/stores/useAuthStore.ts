import { create } from 'zustand';
import { toast } from 'sonner';
import { authService } from '../services/authService';
import type { AuthState } from '@/types/store';

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

    setAccessToken: (accessToken: string) => set({ accessToken }),

  clearState: () => set({
    accessToken: null,
    user: null,
    loading: false,
  }),

    signUp: async (email, password, displayName) => {
        try {
            set({ loading: true });
            // Goi API để đăng ký người dùng
            await authService.signUp(email, password, displayName);
            toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        } catch (error: any) {
            console.error("Signup error:", error);
            const serverMessage = error.response?.data?.message;
            toast.error(`Đăng ký thất bại: ${serverMessage || "Lỗi không xác định."}`);
            throw error;
        } finally {
            set({ loading: false });
        }
    },
    signIn: async (email, password) => {
        try {
            set({loading: true})
            const {access_token} = await authService.signIn(email, password)
            get().setAccessToken(access_token);

            get().fetchMe() // Lấy thông tin người dùng sau khi đăng nhập thành công
            console.log(`${get().user}`);

            toast.success("Đăng nhập thành công!")
        } catch (error: any) {
            console.error(error)
            const serverMessage = error?.data?.response?.message;
            toast.error(`Đăng nhập thất bại: ${serverMessage || "Lỗi không xác định"}`)
            throw error
        } finally {
            set({ loading: false });
        }
    },
    signOut: async () => {
        try {
            get().clearState();
            set({ loading: true });
            await authService.signOut();
            toast.success("Đăng xuất thành công!");
        } catch (error: any) {
            console.error("Signout error:", error);
            const serverMessage = error.response?.data?.message;
            toast.error(`Đăng xuất thất bại: ${serverMessage || "Lỗi không xác định."}`);
            throw error;
        } finally {
            set({ loading: false });
        }
    },
    fetchMe:  async () => {
        try {
            set({ loading: true });
            const user = await authService.fetchMe();
            set({ user });
        } catch (error: any) {
            console.error("Fetch user error:", error);
            set({ user: null, accessToken: null });
            const serverMessage = error.response?.data?.message;
            toast.error(`Lấy thông tin người dùng thất bại: ${serverMessage || "Lỗi không xác định."}`);
            throw error;
        } finally {
            set({ loading: false });
        }
    },
    refresh: async () => {
        try {
            set({ loading: true });
            const { user, fetchMe, setAccessToken } = get();
            const accessToken = await authService.refresh();
            console.log(`Access token refreshed: ${accessToken}`);
            setAccessToken(accessToken);

            console.log(`${get().accessToken}`);

            if (!user) {
                await fetchMe();
            }
        } catch (error: any) {
            console.error("Fetch user error:", error);
            get().clearState();
            toast.error("Phiên đã hết hạn, vui lòng đăng nhập lại.");
        } finally {
            set({ loading: false });
        }
    }
}));