import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL, // Vite 환경변수 사용
  withCredentials: true, // 쿠키 자동 첨부 (필수!)
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
