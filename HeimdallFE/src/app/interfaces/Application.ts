import {Team} from "./Team.interface";

export interface Application {
  uuid: string;
  organization_uuid?: string;
  app_key?: string;
  name?: string;
  version?: string;
  phase_name?: string;
  phase_uuid?: string;
  next_phase_uuid?: string;
  description?: string;
  pm?: string;
  po?: string;

  documents?: string[];
  teams?: string[];
  tasks?: string[];
}
