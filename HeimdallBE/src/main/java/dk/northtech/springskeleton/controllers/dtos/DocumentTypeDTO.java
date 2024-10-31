package dk.northtech.springskeleton.controllers.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentTypeDTO
{
    private UUID uuid;
    private UUID organization_uuid;
    private UUID owner_team_uuid;
    private String name;
    private String description;
    private String specification_link;
}