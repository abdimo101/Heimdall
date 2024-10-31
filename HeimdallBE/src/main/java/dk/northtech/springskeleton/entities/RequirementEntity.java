package dk.northtech.springskeleton.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequirementEntity
{
    private UUID uuid;
    private UUID organization_uuid;
    private UUID team_uuid;
    private UUID document_type_uuid;
    private String estimated_wait_time;
    private UUID phase_uuid;
}
