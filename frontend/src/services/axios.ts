import { useAuthStore } from '@/stores/useAuthStore';
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:3000/api' : '/api',
    withCredentials: true, // Gửi cookie cùng với các yêu cầu
});

// gán access token vào header của mỗi request nếu có
api.interceptors.request.use(
    (config) => {
        const { accessToken } = useAuthStore.getState();

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    }
)

// Tự động tạo lại access token khi nhận được phản hồi 403 (Forbidden)
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        // Nhung api không cần kiểm tra refresh token
        if (originalRequest.url.includes("/auth/signin") 
            || originalRequest.url.includes("/auth/signup") 
            || originalRequest.url.includes("/auth/refresh")) {
            return Promise.reject(error);
        }

        originalRequest._retryCount = originalRequest._retryCount || 0;
        // Kiem tra nếu lỗi là 403 và chưa retry
        if (error.response?.status === 403 && originalRequest._retryCount < 4) {
            originalRequest._retryCount++;

            console.log("refresh", originalRequest._retryCount);
            try {
                const res = await api.post('/auth/refresh', { withCredentials: true });
                const newAccessToken = res.data.access_token;

                useAuthStore.getState().setAccessToken(newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().clearState();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)

export default api;