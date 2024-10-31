package dk.northtech.springskeleton.controllers.dtos;

import dk.northtech.springskeleton.enums.AuditOperation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ApprovalAuditInfoDTO {
    private String name;
    private Long operation_user;
    private LocalDateTime operation_timestamp;
}
