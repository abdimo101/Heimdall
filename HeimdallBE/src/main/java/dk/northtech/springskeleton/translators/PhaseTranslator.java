package dk.northtech.springskeleton.translators;

import dk.northtech.springskeleton.controllers.dtos.PhaseDTO;
import dk.northtech.springskeleton.entities.PhaseEntity;

import java.util.List;
import java.util.stream.Collectors;

public class PhaseTranslator {

    public static PhaseDTO toDTO(PhaseEntity entity) {
        return new PhaseDTO(entity.getUuid(), entity.getOrganization_uuid(), entity.getName(), entity.getOrder_number());
    }

    public static PhaseEntity toEntity(PhaseDTO dto) {
        return new PhaseEntity(dto.getUuid(), dto.getOrganization_uuid(), dto.getName(), dto.getOrder_number());
    }

    public static List<PhaseDTO> toDTOs(List<PhaseEntity> entities) {
        return entities.stream().map(PhaseTranslator::toDTO).collect(Collectors.toList());
    }

    public static List<PhaseEntity> toEntities(List<PhaseDTO> dtos) {
        return dtos.stream().map(PhaseTranslator::toEntity).collect(Collectors.toList());
    }
}
