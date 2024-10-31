package dk.northtech.springskeleton.controllers.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequirementWithNamesDTO
{
    private UUID uuid;
    private UUID organization_uuid;
    private UUID team_uuid;
    private String team_name;
    private UUID document_type_uuid;
    private String document_type_name;
    private String estimated_wait_time;
    private UUID phase_uuid;
}
