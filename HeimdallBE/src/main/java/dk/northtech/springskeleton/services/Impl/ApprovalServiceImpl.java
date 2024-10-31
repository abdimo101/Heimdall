package dk.northtech.springskeleton.services.Impl;

import dk.northtech.springskeleton.entities.ApprovalEntity;
import dk.northtech.springskeleton.entities.TeamEntity;
import dk.northtech.springskeleton.enums.ApprovalStatus;
import dk.northtech.springskeleton.repositories.ApprovalDAO;
import dk.northtech.springskeleton.services.ApprovalService;
import dk.northtech.springskeleton.services.TaskService;
import dk.northtech.springskeleton.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ApprovalServiceImpl implements ApprovalService {
    private final ApprovalDAO approvalDAO;
    private final UserService userService;
    private final TaskService taskService;

    @Autowired
    public ApprovalServiceImpl(ApprovalDAO approvalDAO, UserService userService, TaskService taskService) {
        this.approvalDAO = approvalDAO;
        this.userService = userService;
        this.taskService = taskService;
    }

    @Override
    public ApprovalEntity findByUuid(UUID uuid) {
        return approvalDAO.findByUuid(uuid);
    }

    @Override
    public void createOrUpdate(ApprovalEntity approvalEntity, UUID documentUuid) {
        approvalDAO.createOrUpdate(approvalEntity, documentUuid);
    }

    @Transactional
    @Override
    public List<ApprovalEntity> createApprovalsForDocument(UUID documentUuid, List<TeamEntity> teamsToApprove) {
        if (teamsToApprove == null || teamsToApprove.isEmpty()) {
            return new ArrayList<>();
        }
        UUID organizationUuid = userService.getCurrentUserOrganizationUuid();
        List<ApprovalEntity> approvals = new ArrayList<>();
        for (TeamEntity team : teamsToApprove) {
            ApprovalEntity approval = new ApprovalEntity();
            approval.setUuid(UUID.randomUUID());
            approval.setOrganization_uuid(organizationUuid);
            approval.setTeam_uuid(team.getUuid());
            approval.setStatus(ApprovalStatus.pending);

            if(approvalDAO.exists(approval.getTeam_uuid(), documentUuid)) {
                continue;
            }
            createOrUpdate(approval, documentUuid);
            approvals.add(approval);
        }
        return approvals;
    }

    @Override
    public void setStatus(UUID approvalUuid, ApprovalStatus status, String comment)
    {
        approvalDAO.setStatus(approvalUuid, status, comment);
        taskService.approveDocumentTaskCompleted(approvalUuid);
    }
}