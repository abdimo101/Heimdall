package dk.northtech.springskeleton.entities;

import dk.northtech.springskeleton.enums.ApprovalStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ApprovalEntity
{
    private UUID uuid;
    private UUID organization_uuid;
    private UUID team_uuid;
    private ApprovalStatus status;
    private String comment;
}
