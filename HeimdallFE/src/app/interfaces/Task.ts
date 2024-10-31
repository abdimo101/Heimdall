import {LocalDate} from "@js-joda/core";

export interface Task {
  uuid?: String;
  type?: String;
  description?: String;
  target_table?: String;
  document_type_uuid?: String;
  status?: String;
  target_uuid?: String;
  app_key?: String;
  application_uuid?: String;
  organization_uuid?: String;
}
