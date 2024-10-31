package dk.northtech.springskeleton.controllers.dtos;
import dk.northtech.springskeleton.entities.ArtifactEntity;
import dk.northtech.springskeleton.enums.ArtifactType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArtifactDTO {
    private UUID uuid;
    private String name;
    private String description;
    private String environment;
    private String host;
    private String version;
    private ArtifactType type;
    private UUID application_uuid;
    private List<UUID> documents;
    private UUID organization_uuid;

}
