import { client } from "./client";
import { BaseResult } from "./types/dtos/BaseResult";
import { UserDto } from "./types/dtos/UserDto";

const nonce = (params: any) =>
  client.get(`/account/api/authentication/nonce`, { params });
const login = (body: any) =>
  client.post(`/account/api/authentication/token`, body);

const profile = async (): Promise<UserDto> =>
  await client.get(`/account/api/profile`);

const profileByAddress = async (
  address: string
): Promise<BaseResult<UserDto>> =>
  await client.get(`/account/api/profile/${address}`);
export const accountService = {
  nonce,
  login,

  profile,
  profileByAddress,
};
