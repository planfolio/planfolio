import axios from "axios";

const DUMMY_TOKEN = "test-dummy-token"; // 실제 로그인 구현 전까지 사용

export const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${DUMMY_TOKEN}`,
  },
});
