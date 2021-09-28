import axios, { AxiosRequestConfig } from 'axios';
import { configure, makeUseAxios } from 'axios-hooks';
import keycloak from 'keycloak';

axios.defaults.baseURL = process.env.REACT_APP_API_HOST || '/api/v1';
configure({ axios, cache: false });

function successInterceptor(request: AxiosRequestConfig) {
  if (request.headers) {
    keycloak().updateToken(30);
    request.headers['Authorization'] = `Bearer ${keycloak()?.token}`;
  } else {
    request.headers = {
      Authorization: `Bearer ${keycloak()?.token}`,
    };
  }
  return request;
}

const axiosPost = axios.create({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
});

const axiosPostForm = axios.create({
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

const axiosPatch = axios.create({
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const axiosGet = axios.create({
  method: 'GET',
});

const axiosFileGet = axios.create({
  method: 'GET',
  responseType: 'blob',
});

const axiosDelete = axios.create({
  method: 'DELETE',
});

axiosPost.interceptors.request.use(successInterceptor);
axiosPostForm.interceptors.request.use(successInterceptor);
axiosPatch.interceptors.request.use(successInterceptor);
axiosGet.interceptors.request.use(successInterceptor);
axiosFileGet.interceptors.request.use(successInterceptor);
axiosDelete.interceptors.request.use(successInterceptor);

export function axiosGetter() {
  return {
    axiosGet,
    axiosPost,
    axiosPatch,
    axiosFileGet,
  };
}

export const useAxiosPost = makeUseAxios({
  cache: false,
  axios: axiosPost,
});

export const useAxiosPostFormData = makeUseAxios({
  cache: false,
  axios: axiosPostForm,
});

export const useAxiosPatch = makeUseAxios({
  cache: false,
  axios: axiosPatch,
});

export const useAxiosGet = makeUseAxios({
  cache: false,
  axios: axiosGet,
});

export const useAxiosFileGet = makeUseAxios({
  cache: false,
  axios: axiosFileGet,
});

export const useAxiosDelete = makeUseAxios({
  cache: false,
  axios: axiosDelete,
});
