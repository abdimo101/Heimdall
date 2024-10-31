import {LocalDate} from "@js-joda/core";

export interface Document {
  organization_uuid?: String;
  uuid?: String;
  document_type_name?: String;
  document_type_uuid?: String;
  link?: String;
  ttl?: Date;
  approvals?: Array<{
    uuid?: String;
    status?: String;
    comment?: String;
    team_uuid?: String;
  }>
  application_uuid?: String;
}
