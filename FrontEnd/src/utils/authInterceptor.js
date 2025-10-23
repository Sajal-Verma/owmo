import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // ✅ send cookies with every request
});

// Request interceptor → no need to attach token manually
axiosInstance.interceptors.request.use((config) => {
  return config; // cookies are auto-included
});


// No need for request interceptor since cookies are auto sent

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Hit refresh endpoint → backend reads refreshToken cookie
        await axiosInstance.get("/user/refresh");
        console.log("the refresh run properly");

        // Retry original request with new access token
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("❌ Refresh failed:", err);

        // Optional: redirect to login page
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
