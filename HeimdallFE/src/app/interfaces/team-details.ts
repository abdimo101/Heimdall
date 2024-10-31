import {TeamType} from "../enums/TeamType.enum";

export interface TeamDetails {
  uuid: String;
  organization_uuid?: String;
  name: String;
  type: TeamType;
  description?: String;
  spoc?: String;
  spoc_name?: String;
  applications?: Array<{
    uuid: String;
    app_key?: String;
    name?: String;
    version?: String;
    responsible_user_name?: String;
    responsible_user_id?: String;
  }>
  tasks?: Array<{
    uuid?: String;
    type?: String;
    description?: String;
    target_table?: String;
    document_type_name?: String;
    status?: String;
    target_uuid?: String;
    app_key?: String;
    responsible_user_name?: String;
    responsible_user_id?: String;
    application_uuid?: String;
    document_type_uuid?: String;
  }>
  users?: Array<{
    email?: string;
    name?: string;
    id?: string;
  }>
}
