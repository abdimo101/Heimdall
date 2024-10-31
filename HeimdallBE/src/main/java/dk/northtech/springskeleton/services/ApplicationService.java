package dk.northtech.springskeleton.services;

import dk.northtech.springskeleton.controllers.dtos.AppAuditInfoDTO;
import dk.northtech.springskeleton.controllers.dtos.ApplicationDetailsDTO.ApplicationDetailsDTO;
import dk.northtech.springskeleton.controllers.dtos.ApplicationListDTO;
import dk.northtech.springskeleton.entities.ApplicationEntity;
import dk.northtech.springskeleton.entities.DocumentEntity;
import dk.northtech.springskeleton.entities.TeamEntity;

import java.util.List;
import java.util.UUID;

public interface ApplicationService {
    void createOrUpdateApplication(ApplicationEntity application);

    List<ApplicationEntity> getAllApplications();

    ApplicationEntity getApplication(UUID uuid);

    List<TeamEntity> getTeams(UUID applicationUuid);

    void deleteApplication(UUID uuid);

    List<ApplicationListDTO> findAllApplicationsWithUserDetails();

    ApplicationDetailsDTO getApplicationDetails(UUID uuid);

    DocumentEntity getDocumentByApplicationAndType(UUID uuid, String type);

    void changePhase(UUID uuid, UUID phase);

    List<AppAuditInfoDTO> getAppAuditInfo(UUID uuid);

}
