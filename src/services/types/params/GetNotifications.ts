import { NotificationStatus } from "../enum";
import { BaseQueryParams } from "./BaseQueryParams";

export class GetNotificationsDto extends BaseQueryParams {
  status: NotificationStatus;
}
