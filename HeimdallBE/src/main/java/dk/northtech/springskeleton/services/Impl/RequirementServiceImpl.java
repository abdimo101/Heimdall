package dk.northtech.springskeleton.services.Impl;

import dk.northtech.springskeleton.controllers.dtos.RequirementDocumentTypeDTO;
import dk.northtech.springskeleton.controllers.dtos.RequirementWithNamesDTO;
import dk.northtech.springskeleton.entities.RequirementEntity;
import dk.northtech.springskeleton.repositories.RequirementDAO;
import dk.northtech.springskeleton.services.RequirementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
@Service
public class RequirementServiceImpl implements RequirementService
{

    private final RequirementDAO requirementDAO;

    @Autowired
    public RequirementServiceImpl(RequirementDAO requirementDAO) {
        this.requirementDAO = requirementDAO;
    }

    @Override
    public RequirementEntity findByUuid(UUID uuid) {
        return requirementDAO.findByUuid(uuid);
    }

    @Override
    public List<RequirementEntity> findAll() {
        List<RequirementEntity> requirements = requirementDAO.findAll();
        return requirements;
    }

    @Override
    public List<RequirementEntity> findByTeamUuid(UUID teamUuid) {
        List<RequirementEntity> requirements = requirementDAO.findByTeamUuid(teamUuid);
        return requirements;
    }

    @Override
    public void createOrUpdate(RequirementEntity requirement) {
        requirementDAO.createOrUpdate(requirement);
    }

    @Override
    public void delete(UUID uuid) {
        requirementDAO.delete(uuid);
    }

    @Override
    public List<RequirementEntity> findByTeamUuidsAndPhase(List<UUID> teamUuids, UUID phase)
    {
        if (teamUuids == null || teamUuids.isEmpty()) {
            return Collections.emptyList();
        }
        return requirementDAO.findByTeamUuidsAndPhase(teamUuids, phase);
    }

    @Override
    public List<UUID> mergeRequirements(List<RequirementEntity> requirements)
    {
        List<UUID> mergedRequirements = new ArrayList<>();

        for (RequirementEntity requirement : requirements) {
            if (mergedRequirements.stream().noneMatch(c -> c.equals(requirement.getDocument_type_uuid()))) {
                mergedRequirements.add(requirement.getDocument_type_uuid());
            }
        }
        return  mergedRequirements;
    }

    @Override
    public List<RequirementDocumentTypeDTO> findByTeamUuidWithDocumentTypeDetails(UUID teamUuid)
    {
        return requirementDAO.findByTeamUuidWithDocumentTypeDetails(teamUuid);
    }

    @Override
    public List<RequirementWithNamesDTO> getAllRequirementsExceptTeam(UUID teamUuid, UUID phase_uuid)
    {
        return requirementDAO.getAllRequirementsExceptTeam(teamUuid, phase_uuid);
    }
}
