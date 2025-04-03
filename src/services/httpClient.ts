import { useUserStore } from '@/stores/userStore';
import axios, { type AxiosInstance } from 'axios';
// import { useUserStore } from '@/stores/UserStore';

// Create an Axios instance with a base URL from environment variables
const instance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Add a request interceptor to include the Authorization header
instance.interceptors.request.use(
    async (config) => {
        const userStore = useUserStore();

        const token = userStore.token || sessionStorage.getItem('jwtToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
//REWORK
instance.interceptors.response.use(
    // (response) => {
    //     return response;
    // },
    // (error) => {
    //     const backendErrorMessage = error.response.data.message || error.response.data;

    //     switch (error.response.status) {
    //         case 400:
    //             error.message = `Bad request | ${backendErrorMessage}`;
    //             break;
    //         case 403:
    //             error.message = `Forbidden | ${backendErrorMessage}`;
    //             break;
    //         case 404:
    //             error.message = `Not found | ${backendErrorMessage}`;
    //             break;
    //         case 405:
    //             error.message = `Method not allowed | ${backendErrorMessage}`;
    //             break;
    //         case 408:
    //             error.message = `Request timeout | ${backendErrorMessage}`;
    //             break;
    //         case 422:
    //             error.message = `Unprocessable Entity | ${backendErrorMessage}`;
    //             break;
    //         case 429:
    //             error.message = `Too many requests | ${backendErrorMessage}`;
    //             break;
    //         case 500:
    //             error.message = `Internal server error | ${backendErrorMessage}`;
    //             break;
    //         case 502:
    //             error.message = `Bad gateway | ${backendErrorMessage}`;
    //             break;
    //         case 503:
    //             error.message = `Service unavailable | ${backendErrorMessage}`;
    //             break;
    //         case 504:
    //             error.message = `Gateway timeout | ${backendErrorMessage}`;
    //             break;
    //         default:
    //             error.message = `Unexpected error | ${backendErrorMessage}`;
    //             break;
    //     }
    //     return Promise.reject(error);
    // }
);

export default instance;
