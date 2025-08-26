import axios from 'axios';
import { Notify } from '../components/notification/Notify';

const axiosIntercepter = axios.create({ timeout: 30000 });

axiosIntercepter.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosIntercepter.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error?.response?.status === 401) {
      let authData = JSON.parse(sessionStorage.getItem('authentication'));
      await axios
        .post(`${import.meta.env.VITE_API_BASE_URL}/api/token/refresh/`, {
          refresh: authData?.refresh_token,
        })
        .then((data) => {
          const newAccessToken = data.data.access;

          error.config.headers = {
            Authorization: `Bearer ${newAccessToken}`,
          };
          if (error?.config?.data) {
            error.config.data = JSON.parse(error?.config?.data);
          }
          authData.access_token = newAccessToken;
          sessionStorage.setItem('authentication', JSON.stringify(authData));
        })
        .catch((refreshTokenApiError) => {
          Notify(`Token Expired. Please re-login`, `error`);
          return Promise.reject(refreshTokenApiError);
        });
      return axios(error.config);
    }
    return Promise.reject(error);
  }
);

// end of old method
export default axiosIntercepter;
