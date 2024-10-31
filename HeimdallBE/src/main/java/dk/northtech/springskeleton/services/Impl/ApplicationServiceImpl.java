package dk.northtech.springskeleton.services.Impl;

import dk.northtech.springskeleton.controllers.dtos.AppAuditInfoDTO;
import dk.northtech.springskeleton.controllers.dtos.ApplicationDetailsDTO.ApplicationDetailsDTO;
import dk.northtech.springskeleton.controllers.dtos.ApplicationDetailsDTO.ApplicationDetailsDocumentDTO;
import dk.northtech.springskeleton.controllers.dtos.ApplicationListDTO;
import dk.northtech.springskeleton.entities.ApplicationEntity;
import dk.northtech.springskeleton.entities.DocumentEntity;
import dk.northtech.springskeleton.entities.TeamEntity;
import dk.northtech.springskeleton.enums.NotificationType;
import dk.northtech.springskeleton.enums.TeamType;
import dk.northtech.springskeleton.repositories.ApplicationDAO;
import dk.northtech.springskeleton.repositories.ApprovalDAO;
import dk.northtech.springskeleton.services.ApplicationService;
import dk.northtech.springskeleton.services.NotificationService;
import dk.northtech.springskeleton.services.TaskService;
import dk.northtech.springskeleton.translators.ApprovalTranslator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class ApplicationServiceImpl implements ApplicationService
{

    private final ApplicationDAO applicationDao;
    private final ApprovalDAO approvalDAO;
    private final TaskService taskService;
    private final NotificationService notificationService;

    @Autowired
    public ApplicationServiceImpl(ApplicationDAO applicationDao, ApprovalDAO approvalDAO, TaskService taskService, NotificationService notificationService) {
        this.applicationDao = applicationDao;
        this.approvalDAO = approvalDAO;
        this.taskService = taskService;
        this.notificationService = notificationService;
    }


    @Transactional
    public void createOrUpdateApplication(ApplicationEntity application)
    {
        if (applicationDao.existsByUuid(application.getUuid()))
        {
            updateApplication(application);
        } else
        {
            createApplication(application);
        }
    }

    @Transactional
    protected void createApplication(ApplicationEntity application)
    {
        // TODO: Optimize this using batch insert
        applicationDao.create(application);
        for (UUID team : application.getTeams())
        {
            applicationDao.addTeam(application.getUuid(), team, null);
        }
        for (UUID task : application.getTasks())
        {
            applicationDao.addTask(application.getUuid(), task);
        }
        for (UUID document : application.getDocuments())
        {
            applicationDao.addDocument(application.getUuid(), document);
        }
    }

    @Transactional
    protected void updateApplication(ApplicationEntity application)
    {
        // Relationship lists are ignored, as they are not part of the application, and should be managed separately
        applicationDao.update(application);
    }

    public List<ApplicationEntity> getAllApplications()
    {
        return applicationDao.findAll();
    }

    public ApplicationEntity getApplication(UUID uuid)
    {
        ApplicationEntity application = applicationDao.findByUuid(uuid);
        if (application == null)
        {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found");
        }
        return application;
    }

    @Transactional
    public void deleteApplication(UUID uuid)
    {
        applicationDao.deleteByUuid(uuid);
    }

    @Override
    public List<ApplicationListDTO> findAllApplicationsWithUserDetails()
    {
        return applicationDao.findAllApplicationsWithUserDetails();
    }

    @Override
    public ApplicationDetailsDTO getApplicationDetails(UUID uuid)
    {
        ApplicationDetailsDTO applicationDetails = applicationDao.getApplicationDetailsByUuid(uuid);
        taskService.createTasksForMissingDocuments(uuid, applicationDetails.getPhase_uuid());
        applicationDetails.setTeams(applicationDao.getApplicationDetailsTeamDTO(uuid));
        applicationDetails.setTasks(applicationDao.getApplicationDetailsTaskDTO(uuid));
        List<ApplicationDetailsDocumentDTO> applicationDetailsDocumentDTO = applicationDao.getApplicationDetailsDocumentDTO(uuid);
        for (ApplicationDetailsDocumentDTO document : applicationDetailsDocumentDTO)
        {
            document.setApprovals(approvalDAO.findByDocumentUuidForDetails(document.getUuid()));
        }
        applicationDetails.setDocuments(applicationDetailsDocumentDTO);
        return applicationDetails;
    }

    @Override
    public DocumentEntity getDocumentByApplicationAndType(UUID uuid, String type)
    {
        return applicationDao.getDocumentByApplicationAndType(uuid, type);
    }


    @Transactional
    public void addPO(UUID applicationUuid, Long poId)
    {
        applicationDao.addPO(applicationUuid, poId);
    }

    @Transactional
    public void removePO(UUID applicationUuid)
    {
        applicationDao.removePO(applicationUuid);
    }

    @Transactional
    public void addPM(UUID applicationUuid, Long pmId)
    {
        applicationDao.addPM(applicationUuid, pmId);
    }

    @Transactional
    public void removePM(UUID applicationUuid)
    {
        applicationDao.removePM(applicationUuid);
    }

    @Transactional
    public void addTeam(UUID applicationUuid, UUID teamUuid, Long responsibleUserId)
    {
        applicationDao.addTeam(applicationUuid, teamUuid, responsibleUserId);
    }

    @Transactional
    public void removeTeam(UUID applicationUuid, UUID teamUuid)
    {
        applicationDao.removeTeam(applicationUuid, teamUuid);
    }

    public List<TeamEntity> getTeams(UUID applicationUuid)
    {
        return applicationDao.getTeams(applicationUuid);
    }

    @Transactional
    public void addTask(UUID applicationUuid, UUID taskUuid)
    {
        applicationDao.addTask(applicationUuid, taskUuid);
    }

    @Transactional
    public void removeTask(UUID applicationUuid, UUID taskUuid)
    {
        applicationDao.removeTask(applicationUuid, taskUuid);
    }

    @Transactional
    public void addDocument(UUID applicationUuid, UUID documentUuid)
    {
        applicationDao.addDocument(applicationUuid, documentUuid);
    }

    @Transactional
    public void removeDocument(UUID applicationUuid, UUID documentUuid)
    {
        applicationDao.removeDocument(applicationUuid, documentUuid);
    }

    public boolean hasTeamType(UUID applicationUuid, TeamType teamType)
    {
        List<TeamEntity> teams = applicationDao.getTeams(applicationUuid);
        for (TeamEntity team : teams)
        {
            if (team.getType() == teamType) return true;
        }
        return false;
    }

    @Override
    public void changePhase(UUID uuid, UUID phase)
    {
        ApplicationEntity application = applicationDao.findByUuid(uuid);

        UUID nextPhase = application.getNext_phase_uuid();
        UUID currentPhase = application.getPhase_uuid();
        if(currentPhase.equals(phase)){
           applicationDao.changeNextPhaseToNull(uuid);
        }

        else if (nextPhase == null || !nextPhase.equals(phase)){
            applicationDao.changeToTransitionPhase(uuid, phase);
        }
        else{
            applicationDao.changePhase(uuid, phase);
            notificationService.sendPhaseChangeNotification(uuid, NotificationType.phase, phase);
        }
    }

    @Override
    public List<AppAuditInfoDTO> getAppAuditInfo(UUID uuid) {
        return applicationDao.getAppAuditInfo(uuid);
    }
}
