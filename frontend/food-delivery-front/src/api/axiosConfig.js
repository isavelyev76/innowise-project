import axios from "axios";

export const authApi = axios.create({
  baseURL: "http://localhost:8081/api",
});

export const restaurantApi = axios.create({
  baseURL: "http://localhost:9090/api",
});

export const orderApi = axios.create({
  baseURL: "http://localhost:8080/api",
});

// добавляем токен в заголовок (interceptor = Spring Security filter)
const attachTokenInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
};

// применяем interceptor ко всем сервисам
attachTokenInterceptor(authApi);
attachTokenInterceptor(restaurantApi);
attachTokenInterceptor(orderApi);

export const userApi = authApi;
