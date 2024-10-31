package dk.northtech.springskeleton.services.Impl;

import dk.northtech.springskeleton.controllers.dtos.ApprovalAuditInfoDTO;
import dk.northtech.springskeleton.entities.*;
import dk.northtech.springskeleton.enums.ApprovalStatus;
import dk.northtech.springskeleton.repositories.ApplicationDAO;
import dk.northtech.springskeleton.repositories.ApprovalDAO;
import dk.northtech.springskeleton.repositories.DocumentDAO;
import dk.northtech.springskeleton.repositories.RequirementDAO;
import dk.northtech.springskeleton.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class DocumentServiceImpl implements DocumentService {
    private final DocumentDAO documentDAO;
    private final RequirementDAO requirementDAO;
    private final RequirementService requirementService;
    private final ApplicationDAO applicationDAO;
    private final ApprovalDAO approvalDAO;
    private final ApprovalService approvalService;
    private final TaskService taskService;
    private TeamService teamService;

    @Autowired
    public DocumentServiceImpl(DocumentDAO documentDAO, RequirementDAO requirementDAO, RequirementService requirementService, ApplicationDAO applicationDAO, ApprovalDAO approvalDAO, TaskService taskService, @Lazy TeamService teamService, ApprovalService approvalService) {
        this.documentDAO = documentDAO;
        this.requirementDAO = requirementDAO;
        this.requirementService = requirementService;
        this.applicationDAO = applicationDAO;
        this.approvalDAO = approvalDAO;
        this.taskService = taskService;
        this.teamService = teamService;
        this.approvalService = approvalService;
    }

    @Override
    public DocumentEntity findByUuid(UUID uuid) {
        DocumentEntity document = documentDAO.findByUuid(uuid);
        if(document == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found");
        }
        return documentDAO.findByUuid(uuid);
    }

    @Override
    public void createOrUpdate(DocumentEntity documentEntity) {
        documentDAO.createOrUpdate(documentEntity);
        taskService.createDocumentTaskCompleted(documentEntity);
    }

    @Override
    public void delete(DocumentEntity document) {
        documentDAO.delete(document);
    }

    @Override
    public List<ApprovalEntity> getAllApprovalsByDocument(UUID uuid) {
        return documentDAO.getAllApprovalsByDocument(uuid);
    }

    @Override
    public List<UUID> checkDocumentsByRequirement(UUID application_uuid, UUID phase) {
        List<UUID> missingDocumentTypeUUIDs = new ArrayList<>();
        List<TeamEntity> teamEntities = applicationDAO.getTeams(application_uuid);
        List<UUID> teams = new ArrayList<>();
        for (TeamEntity team : teamEntities) {
            teams.add(team.getUuid());
        }
        List<UUID> applicationDocuments = documentDAO.findTypeByApplication(application_uuid);
        List<RequirementEntity> requirements = requirementService.findByTeamUuidsAndPhase(teams, phase);
        List<UUID> requirementDocumentTypes = requirementService.mergeRequirements(requirements);
        for (UUID documentType : requirementDocumentTypes) {
            if (!applicationDocuments.contains(documentType)) {
                missingDocumentTypeUUIDs.add(documentType);
            }
        }
        return missingDocumentTypeUUIDs;
    }

    @Override
    public List<DocumentEntity> checkApprovedDocuments(UUID application_uuid, UUID phase) {
        List<DocumentEntity> unapprovedDocuments = new ArrayList<>();
        List<UUID> appDocumentsUuids = documentDAO.findUUIDByApplication(application_uuid);
        List<TeamEntity> teamEntities = applicationDAO.getTeams(application_uuid);
        List<UUID> teams = new ArrayList<>();
        for (TeamEntity team : teamEntities) {
            teams.add(team.getUuid());
        }
        List<RequirementEntity> requirements = requirementService.findByTeamUuidsAndPhase(teams, phase);
        List<UUID> requirementDocumentTypes = requirementService.mergeRequirements(requirements);
        for (UUID appDocumentUuid : appDocumentsUuids) {
            DocumentEntity document = documentDAO.findByUuid(appDocumentUuid);
            if (requirementDocumentTypes.contains(document.getDocument_type_uuid())) {
                List<ApprovalEntity> approvals = approvalDAO.findByDocumentUuid(appDocumentUuid);
                boolean isApproved = !approvals.isEmpty() && approvals.stream().allMatch(approval -> approval.getStatus() == ApprovalStatus.approved);
                if (!isApproved) {
                    unapprovedDocuments.add(document);
                }
            }
        }
        return unapprovedDocuments;
    }

    public void initiateDocumentApproval(UUID documentUuid) {
        ApplicationEntity application = applicationDAO.findByDocumentUuid(documentUuid);
        UUID phase = application.getPhase_uuid();
        DocumentEntity document = documentDAO.findByUuid(documentUuid);
        UUID documentTypeUuid = document.getDocument_type_uuid();
        List<TeamEntity> teams = applicationDAO.getTeams(application.getUuid());
        List<UUID> teamUuids = teams.stream().map(TeamEntity::getUuid).toList();
        List<RequirementEntity> requirements = requirementDAO.findByTeamUuidsAndPhase(teamUuids, phase);
        requirements.removeIf(requirement -> !requirement.getDocument_type_uuid().equals(documentTypeUuid));
        List<ApprovalEntity> existingApprovals = approvalDAO.findByDocumentUuid(documentUuid);
        for (ApprovalEntity approval : existingApprovals) {
            requirements.removeIf(requirement -> requirement.getTeam_uuid().equals(
                    approval.getTeam_uuid())
                    && (approval.getStatus() == ApprovalStatus.approved
                    || approval.getStatus() == ApprovalStatus.pending));
        }
        if (requirements.isEmpty()) return;
        List<ApprovalEntity> approvals = new ArrayList<>();
        for (RequirementEntity requirement : requirements) {
            ApprovalEntity approval = new ApprovalEntity();
            approval.setUuid(UUID.randomUUID());
            approval.setOrganization_uuid(application.getOrganization_uuid());
            approval.setStatus(ApprovalStatus.pending);
            approval.setTeam_uuid(requirement.getTeam_uuid());
            approvals.add(approval);
        }
        approvalDAO.createOrUpdateBatch(approvals, documentUuid);
        teams.removeIf(team -> approvals.stream().noneMatch(approval -> approval.getTeam_uuid().equals(team.getUuid())));
        taskService.createAndAssignTaskToTeams(teams, approvals, application.getUuid());
    }

    @Override
    public DocumentEntity findByApprovalUUID(UUID approvalUuid)
    {
        return documentDAO.findByApprovalUUID(approvalUuid);
    }

    @Override
    public ApprovalAuditInfoDTO getLatestApprovalByDocument(UUID documentUuid) {
        return documentDAO.getLatestApprovalByDocument(documentUuid);
    }
}
