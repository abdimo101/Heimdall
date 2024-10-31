export interface UserDetails{
    uuid: number
    name?: String
    email?: String
    organization_uuid?: number
    teams?: Array<{
        description?: String;
        name?: String;
        type?: String;
        uuid?: String;
      }>
}
