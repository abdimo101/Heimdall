package dk.northtech.springskeleton.translators;

import dk.northtech.springskeleton.controllers.dtos.RequirementDTO;
import dk.northtech.springskeleton.entities.RequirementEntity;

import java.util.List;
import java.util.stream.Collectors;

public abstract class RequirementTranslator
{

    public static RequirementDTO translateToDTO(RequirementEntity requirementEntity) {
        RequirementDTO requirementDTO = new RequirementDTO();
        requirementDTO.setUuid(requirementEntity.getUuid());
        requirementDTO.setOrganization_uuid(requirementEntity.getOrganization_uuid());
        requirementDTO.setTeam_uuid(requirementEntity.getTeam_uuid());
        requirementDTO.setPhase_uuid(requirementEntity.getPhase_uuid());
        requirementDTO.setDocument_type_uuid(requirementEntity.getDocument_type_uuid());
        requirementDTO.setEstimated_wait_time(requirementEntity.getEstimated_wait_time());
        return requirementDTO;
    }

    public static RequirementEntity translateToEntity(RequirementDTO requirementDTO) {
        RequirementEntity requirementEntity = new RequirementEntity();
        requirementEntity.setUuid(requirementDTO.getUuid());
        requirementEntity.setOrganization_uuid(requirementDTO.getOrganization_uuid());
        requirementEntity.setTeam_uuid(requirementDTO.getTeam_uuid());;
        requirementEntity.setPhase_uuid(requirementDTO.getPhase_uuid());
        requirementEntity.setDocument_type_uuid(requirementDTO.getDocument_type_uuid());
        requirementEntity.setEstimated_wait_time(requirementDTO.getEstimated_wait_time());
        return requirementEntity;
    }

    public static List<RequirementDTO> translateToDTO(List<RequirementEntity> requirementEntities) {
        return requirementEntities.stream().map(RequirementTranslator::translateToDTO).collect(Collectors.toList());
    }
}
