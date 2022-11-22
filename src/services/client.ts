import axios from "axios";
import configs from "../configs";
import toast from "../hooks/useCustomToast";
import store from "../store";
import { logout } from "../store/profileSlice";

const onError = ({ response }: any) => {
  if (response) {
    const { data, status } = response;
    if (status === 404) {
      return Promise.reject(response);
    }
    if (status === 401) {
      store.dispatch(logout());
    } else {
      const msg =
        data.errors?.message &&
        data.errors?.message !== "null" &&
        data.errors?.message !== "undefined"
          ? data.errors?.message
          : null;
      if (msg) toast().error(`${status} - ${msg}`);
    }
  } else {
    toast().error(`Cannot connect to Server`);
  }
  return Promise.reject(response);
};

const beforeRequest = (config: any) => {
  const { isLoggedIn, accessToken } = store.getState().profile;
  if (isLoggedIn)
    Object.assign(config.headers, {
      Authorization: `Bearer ${accessToken}`,
    });
  if (config.data instanceof FormData) {
    Object.assign(config.headers, { "Content-Type": "multipart/form-data" });
  }
  return config;
};

const client = axios.create({
  baseURL: configs.API_URL,
  // paramsSerializer: (params) => stringify(params, { arrayFormat: "index" }),
});
client.interceptors.request.use(beforeRequest);

[client].forEach((client) => {
  client.interceptors.response.use(({ data }) => {
    const { success = true, errors } = data;
    if (success) return data;
    return Promise.reject(errors);
  }, onError);
});

export { client };
