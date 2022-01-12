import axios, { AxiosRequestConfig } from 'axios';
import { configure, makeUseAxios } from 'axios-hooks';
// import createAuthRefreshInterceptor from 'axios-auth-refresh';
// import {AxiosAuthRefreshOptions} from 'axios-auth-refresh';

axios.defaults.baseURL = '/api/v1' //`${process.env.PUBLIC_URL}/api/v1`;

configure({ axios, cache: false });

// const options: AxiosAuthRefreshOptions = {
//   statusCodes: [ 401, 403 ]
// }

// const refreshAuthLogic = (failedRequest: any) => axios.get('/token').then(response => {

//   if (response.status == 200 && response.data.access_token == null) {
//       window.location.replace(response.data.login_url);
//       return Promise.resolve();
//   }
//   localStorage.setItem('token', response.data.access_token);

//   if (failedRequest != null)
//       failedRequest.response.config.headers['Authorization'] = 'Bearer ' + response.data.access_token;
//   return Promise.resolve();
// });

// createAuthRefreshInterceptor(axios, refreshAuthLogic, options);

function successInterceptor(request: AxiosRequestConfig) {
  // console.log("intercept")
  // console.log(window.location.origin)
  // console.log(process.env)

  const token = localStorage.getItem('token');
  request.headers['Authorization'] = 'Bearer ' +  token; 

  // console.log(axios.defaults.baseURL)//TODO remove
 
  return request;
}

function successResponse(response: any){
  // console.log("successResponse")
  // console.log(response)
  return response
}

// function errorResponse(error: any){
//   console.log("errorResponse")
//   return axios(error.config)
// }


function errorResponse(error: any){
  if (error.config && error.response && error.response.status === 401) {
      return axios.get('/token').then( (response: any) => {
        if (response.status == 200 && response.data.access_token == null) {
          window.location.replace(response.data.login_url);
        }
        localStorage.setItem('token', response.data.access_token);
        error.config.headers['Authorization'] = 'Bearer ' + response.data.access_token;
        return axios.request(error.config);
      });
  }

  return Promise.reject(error);
};

// function errorRequest(error: any){
//   console.log("errorREQUEST")
//   return axios(error.config)
// }


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

axiosPost.interceptors.response.use(successResponse, errorResponse);
axiosPostForm.interceptors.response.use(successResponse, errorResponse);
axiosPatch.interceptors.response.use(successResponse, errorResponse);
axiosGet.interceptors.response.use(successResponse, errorResponse);
axiosFileGet.interceptors.response.use(successResponse, errorResponse);
axiosDelete.interceptors.response.use(successResponse, errorResponse);


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
