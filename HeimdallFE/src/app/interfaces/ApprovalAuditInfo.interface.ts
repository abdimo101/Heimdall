import {LocalDateTime} from "@js-joda/core";
export interface ApprovalAuditInfo {
    name: string;
    operation_user: string;
    operation_timestamp: LocalDateTime;
}