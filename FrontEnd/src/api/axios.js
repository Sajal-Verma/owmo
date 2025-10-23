import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // <-- important! for cookes
});

export default axiosInstance;

