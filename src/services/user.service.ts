import { client } from "./client";

const nonce = (params: any) =>
  client.get(`/account/api/authentication/nonce`, { params });
const login = (body: any) =>
  client.post(`/account/api/authentication/token`, body);

export const accountService = {
  nonce,
  login,
};
