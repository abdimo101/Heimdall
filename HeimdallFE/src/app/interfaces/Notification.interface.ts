import {LocalDateTime} from "@js-joda/core";

export interface Notification {
  uuid: string;
  organization_uuid?: string;
  title?: string;
  type?: string;
  created_at?: LocalDateTime;
  app_name?: string;
  seen_at?: LocalDateTime;
}
