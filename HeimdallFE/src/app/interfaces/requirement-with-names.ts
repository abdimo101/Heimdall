export interface RequirementWithNames {
    uuid: String;
    organization_uuid?: String;
    team_uuid?: String;
    team_name?: string;
    document_type_uuid?: String | string;
    document_type_name?: string;
    description?: String;
    link?: String;
    estimated_wait_time?: String;
    phase?: String;
    phase_uuid?: String;
}
