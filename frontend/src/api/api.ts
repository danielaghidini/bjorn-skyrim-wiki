import axios from "axios";
import { API_URL } from "../config/apiConfig";

const api = axios.create({
	baseURL: API_URL,
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export default api;
