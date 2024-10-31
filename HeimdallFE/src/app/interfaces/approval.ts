export interface Approval {
  uuid?: String;
  status?: String;
  comment?: String;
  user?: {
    uuid?: String;
    username?: String;
  },
  document?: {
    uuid?: String;
    type?: String;
    link?: String;
    ttl?: String;
  },
  organization?: {
    id?: Number;
    name?: String;
  }
}
