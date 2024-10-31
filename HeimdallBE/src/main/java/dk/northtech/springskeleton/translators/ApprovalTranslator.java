package dk.northtech.springskeleton.translators;

import dk.northtech.springskeleton.controllers.dtos.ApprovalDTO;
import dk.northtech.springskeleton.entities.ApprovalEntity;

import java.util.List;

public abstract class ApprovalTranslator {
    public static ApprovalDTO toDto(ApprovalEntity entity) {
        return new ApprovalDTO(entity);
    }

    public static List<ApprovalDTO> toDtos(List<ApprovalEntity> entities) {
        return entities.stream().map(ApprovalDTO::new).toList();
    }

    public static ApprovalEntity toEntity(ApprovalDTO dto) {
        return new ApprovalEntity(
                dto.getUuid(),
                dto.getOrganization_uuid(),
                dto.getTeam_uuid(),
                dto.getStatus(),
                dto.getComment()
        );
    }
}
