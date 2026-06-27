import axios from 'axios';

const apiClient = axios.create({
	baseURL: '/api',
});

apiClient.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

apiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const response = await axios.post(
					'/api/refresh',
					{},
					{ withCredentials: true },
				);

				const { access_token } = response.data;

				localStorage.setItem('token', access_token);

				originalRequest.headers['Authorization'] = `Bearer ${access_token}`;

				return apiClient(originalRequest);
			} catch (refreshError) {
				localStorage.removeItem('token');
				window.location.href = '/login';
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);

export default apiClient;
