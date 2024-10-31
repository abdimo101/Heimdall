package dk.northtech.springskeleton.controllers.dtos;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequirementDocumentTypeDTO
{
    private UUID uuid;
    private UUID organization_uuid;
    private UUID team_uuid;
    private UUID document_type_uuid;
    private String estimated_wait_time;
    private UUID phase_uuid;
    private UUID owner_team_uuid;
    private String owner_team_name;
    private String document_type_name;
    private String description;
    private String specification_link;
}
