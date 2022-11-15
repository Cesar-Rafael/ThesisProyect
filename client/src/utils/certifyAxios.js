import axios from 'axios';
import { backendUrl } from 'src/config';

const certifyAxios = axios.create({
  baseURL: backendUrl
});

certifyAxios.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || 'There is an error!'
    )
);

export default certifyAxios;