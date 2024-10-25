import axios from "axios";

// Express API 实例
const expressApi = axios.create({
  baseURL: "/blogServer/api/v1",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export { expressApi };
