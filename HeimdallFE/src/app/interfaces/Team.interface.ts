import {TeamType} from "../enums/TeamType.enum";

export interface Team{
  uuid: string
  organization_uuid?: string
  name: string
  type: TeamType
  description?: string
  spoc?: string
  members?: string[]
  applications?: string[]
  tasks?: string[]
}
