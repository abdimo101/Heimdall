package dk.northtech.springskeleton.translators;

import dk.northtech.springskeleton.controllers.dtos.DocumentTypeDTO;
import dk.northtech.springskeleton.entities.DocumentTypeEntity;

import java.util.List;
import java.util.stream.Collectors;

public class DocumentTypeTranslator
{

    public static DocumentTypeDTO toDTO(DocumentTypeEntity entity) {
        return new DocumentTypeDTO(
                entity.getUuid(),
                entity.getOrganization_uuid(),
                entity.getOwner_team_uuid(),
                entity.getName(),
                entity.getDescription(),
                entity.getLink()
        );
    }

    public static DocumentTypeEntity toEntity(DocumentTypeDTO dto) {
        return new DocumentTypeEntity(
                dto.getUuid(),
                dto.getOrganization_uuid(),
                dto.getOwner_team_uuid(),
                dto.getName(),
                dto.getDescription(),
                dto.getSpecification_link()
        );
    }
    public static List<DocumentTypeDTO> toDTOs(List<DocumentTypeEntity> entities) {
        return entities.stream()
                .map(DocumentTypeTranslator::toDTO)
                .collect(Collectors.toList());
    }
}