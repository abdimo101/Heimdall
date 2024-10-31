package dk.northtech.springskeleton.translators;

import dk.northtech.springskeleton.controllers.ArtifactController;
import dk.northtech.springskeleton.controllers.dtos.ArtifactDTO;
import dk.northtech.springskeleton.entities.ArtifactEntity;

import java.util.List;
import java.util.stream.Collectors;

public abstract class ArtifactTranslator {
    public static ArtifactEntity toEntity(ArtifactDTO artifactDTO) {
        ArtifactEntity artifactEntity = new ArtifactEntity();
        artifactEntity.setUuid(artifactDTO.getUuid());
        artifactEntity.setName(artifactDTO.getName());
        artifactEntity.setDescription(artifactDTO.getDescription());
        artifactEntity.setEnvironment(artifactDTO.getEnvironment());
        artifactEntity.setHost(artifactDTO.getHost());
        artifactEntity.setVersion(artifactDTO.getVersion());
        artifactEntity.setType(artifactDTO.getType());
        artifactEntity.setApplication_uuid(artifactDTO.getApplication_uuid());
        artifactEntity.setDocuments(artifactDTO.getDocuments());
        artifactEntity.setOrganization_uuid(artifactDTO.getOrganization_uuid());
        return artifactEntity;
    }

    public static ArtifactDTO toDTO(ArtifactEntity artifactEntity) {
        ArtifactDTO artifactDTO = new ArtifactDTO();
        artifactDTO.setUuid(artifactEntity.getUuid());
        artifactDTO.setName(artifactEntity.getName());
        artifactDTO.setDescription(artifactEntity.getDescription());
        artifactDTO.setEnvironment(artifactEntity.getEnvironment());
        artifactDTO.setHost(artifactEntity.getHost());
        artifactDTO.setVersion(artifactEntity.getVersion());
        artifactDTO.setType(artifactEntity.getType());
        artifactDTO.setApplication_uuid(artifactEntity.getApplication_uuid());
        artifactDTO.setDocuments(artifactEntity.getDocuments());
        artifactDTO.setOrganization_uuid(artifactEntity.getOrganization_uuid());
        return artifactDTO;
    }

    public static List<ArtifactDTO> toDTO(List<ArtifactEntity> artifactEntities) {
        return artifactEntities.stream().map(ArtifactTranslator::toDTO).collect(Collectors.toList());
    }

}
