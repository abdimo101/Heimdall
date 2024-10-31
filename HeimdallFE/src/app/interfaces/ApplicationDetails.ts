import {LocalDate} from '@js-joda/core';
export interface ApplicationDetails {
  uuid: String;
  organization_uuid?: String;
  app_key?: String;
  name?: String;
  version?: String;
  phase_name?: String;
  phase_uuid?: string | String;
  next_phase_uuid?: string | String;
  state?: String;
  description?: string;
  po_id?: string;
  pm_id?: string;
  po_name?: string;
  pm_name?: string;

  documents?: Array<{
    uuid?: String;
    document_type_uuid?: String;
    type_name?: String;
    link?: String;
    ttl?: Date;
    approvals?: Array<{
      uuid?: String;
      status?: String;
      comment?: String;
      team_uuid?: String;
      team_name?: String;
    }>
  }>
  teams?: Array<{
    description?: String;
    name?: String;
    responsible_user?: String;
    responsible_user_name?: String;
    spoc?: String;
    type?: String;
    uuid?: String;
  }>

  tasks?: Array<{
    uuid?: string;
    description?: String;
    target_type?: String;
    target_uuid?: String;
    type?: String;
    status?: String;
    target_table?: String;
  }>
}
