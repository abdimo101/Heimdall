package dk.northtech.springskeleton.translators;

import dk.northtech.springskeleton.controllers.dtos.DocumentDTO;
import dk.northtech.springskeleton.entities.DocumentEntity;

import java.util.List;
import java.util.stream.Collectors;

public class DocumentTranslator {
    public static DocumentDTO toDto(DocumentEntity entity) {
        return new DocumentDTO(entity);
    }

    public static List<DocumentDTO> toDtos(List<DocumentEntity> entities) {
        return entities.stream().map(DocumentTranslator::toDto).collect(Collectors.toList());
    }

    public static DocumentEntity toEntity(DocumentDTO dto) {
        return new DocumentEntity(
                dto.getUuid(),
                dto.getOrganization_uuid(),
                dto.getDocument_type_uuid(),
                dto.getDocument_type_name(),
                dto.getLink(),
                dto.getApprovals(),
                dto.getApplication_uuid(),
                dto.getArtifact_uuid()
        );
    }
}
