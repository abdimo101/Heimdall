export interface RequirementDocument_type {

  uuid: String;
  organization_uuid?: String;
  team_uuid?: String;
  document_type_uuid?: String | string;
  document_type_name?: string;
  estimated_wait_time?: String;
  phase?: String;
  phase_uuid?: String;
  owner_team_uuid?: String;
  owner_team_name?: string;
  name?: string;
  description?: String;
  specification_link?: String;
}
