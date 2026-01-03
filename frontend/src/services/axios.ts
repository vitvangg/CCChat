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

// 

export default api;