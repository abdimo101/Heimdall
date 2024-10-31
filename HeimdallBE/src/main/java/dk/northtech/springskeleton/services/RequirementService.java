package dk.northtech.springskeleton.services;

import dk.northtech.springskeleton.controllers.dtos.RequirementDocumentTypeDTO;
import dk.northtech.springskeleton.controllers.dtos.RequirementWithNamesDTO;
import dk.northtech.springskeleton.entities.RequirementEntity;

import java.util.List;
import java.util.UUID;

public interface RequirementService
{
    RequirementEntity findByUuid(UUID uuid);
    List<RequirementEntity> findAll();
    List<RequirementEntity> findByTeamUuid(UUID teamUuid);
    void createOrUpdate(RequirementEntity requirement);
    void delete(UUID uuid);
    List<RequirementEntity> findByTeamUuidsAndPhase(List<UUID> teamUuids, UUID phase);
    List<UUID> mergeRequirements(List<RequirementEntity> requirements);

    List<RequirementDocumentTypeDTO> findByTeamUuidWithDocumentTypeDetails(UUID teamUuid);

    List<RequirementWithNamesDTO> getAllRequirementsExceptTeam(UUID teamUuid, UUID phase_uuid);
}
