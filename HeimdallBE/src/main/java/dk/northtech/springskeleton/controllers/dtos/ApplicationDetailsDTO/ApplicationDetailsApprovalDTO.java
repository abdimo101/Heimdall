package dk.northtech.springskeleton.controllers.dtos.ApplicationDetailsDTO;

import dk.northtech.springskeleton.controllers.dtos.DocumentDTO;
import dk.northtech.springskeleton.controllers.dtos.TeamDTO;
import dk.northtech.springskeleton.enums.ApprovalStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ApplicationDetailsApprovalDTO
{
    private UUID uuid;
    private ApprovalStatus status;
    private String Comment;
    private UUID team_uuid;
    private String team_name;
}
