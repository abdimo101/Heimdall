package dk.northtech.springskeleton.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DocumentTypeEntity
{
    private UUID uuid;
    private UUID organization_uuid;
    private UUID owner_team_uuid;
    private String name;
    private String description;
    private String link;
}
