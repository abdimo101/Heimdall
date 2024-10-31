package dk.northtech.springskeleton.controllers.dtos;

import dk.northtech.springskeleton.enums.AuditOperation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AppAuditInfoDTO {
    private UUID phase_uuid;
    private AuditOperation operation_type;
    private LocalDateTime operation_timestamp;
}
