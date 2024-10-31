package dk.northtech.springskeleton.translators;

import dk.northtech.springskeleton.controllers.dtos.OrganizationDTO;
import dk.northtech.springskeleton.entities.OrganizationEntity;

import java.util.List;
import java.util.stream.Collectors;

public abstract class OrganizationTranslator {
    public static OrganizationDTO toDto(OrganizationEntity entity) {
        OrganizationDTO dto = new OrganizationDTO();
            dto.setUuid(entity.getUuid());
            dto.setName(entity.getName());
        return dto;
    }

    public static OrganizationEntity toEntity(OrganizationDTO dto) {
        OrganizationEntity entity = new OrganizationEntity();
            entity.setUuid(dto.getUuid());
            entity.setName(dto.getName());
        return entity;
    }

    public static List<OrganizationDTO> toDTOs(List<OrganizationEntity> entities) {
        return entities.stream().map(OrganizationTranslator::toDto).collect(Collectors.toList());
    }

    public static List<OrganizationEntity> toEntities(List<OrganizationDTO> dtos) {
        return dtos.stream().map(OrganizationTranslator::toEntity).collect(Collectors.toList());
    }
}
