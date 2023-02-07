import { client } from "./client";
import { BaseResult } from "./types/dtos/BaseResult";
import { NotificationDto } from "./types/dtos/Notification.dto";
import { PaginationDto } from "./types/dtos/PaginationDto";
import { UserDto } from "./types/dtos/UserDto";
import { NotificationStatus } from "./types/enum";
import { GetNotificationsDto } from "./types/params/GetNotifications";
import { ProfileUploadFile } from "./types/params/ProfileUploadFile";
import { QueryAccounts } from "./types/params/QueryAccounts";

const nonce = (params: any) =>
  client.get(`/account/api/authentication/nonce`, { params });
const login = (body: any) =>
  client.post(`/account/api/authentication/token`, body);

const profile = async (): Promise<UserDto> =>
  await client.get(`/account/api/profile`);

const profiles = async (
  params: QueryAccounts
): Promise<BaseResult<PaginationDto<UserDto>>> =>
  await client.get(`/account/api/profiles`, { params });

const profileByAddress = async (
  address: string
): Promise<BaseResult<UserDto>> =>
  await client.get(`/account/api/profile/${address}`);

const uploadProfileFile = async (
  params: ProfileUploadFile
): Promise<UserDto> => {
  const formData = new FormData();
  if (params.avatar) {
    formData.append("avatar", params.avatar);
  }
  if (params.cover) {
    formData.append("cover", params.cover);
  }
  return await client.postForm("/account/api/updateFile", formData);
};
const updateProfile = async (body: UserDto): Promise<UserDto> => {
  return await client.post("/account/api/updateProfile", body);
};

const manageInfo = async (body: UserDto): Promise<UserDto> => {
  return await client.post("/account/api/manageInfo", body);
};
const getNotifications = async (
  params: GetNotificationsDto
): Promise<BaseResult<PaginationDto<NotificationDto>>> => {
  return await client.get("/account/api/notifications", { params });
};
const updateNotificationStatus = async (
  id: string,
  status: NotificationStatus
): Promise<BaseResult<string>> => {
  return await client.post("/account/api/notifications/status", {
    id,
    status,
  });
};
const seenAllNotification = async () => {
  return await client.post("/account/api/notifications/seenAll");
};

export const accountService = {
  nonce,
  login,

  profile,
  profileByAddress,
  profiles,

  uploadProfileFile,
  updateProfile,

  manageInfo,

  getNotifications,
  updateNotificationStatus,
  seenAllNotification,
};
