import {Application} from "./Application";

export interface ApplicationHistory extends Application {
  operation_type: string;
  operation_timestamp: string;
  operation_user: string;
}
