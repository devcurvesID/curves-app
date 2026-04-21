import axios from "axios";

const BASE_URL = process.env.CMS_API_SERVICE as string;
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});
