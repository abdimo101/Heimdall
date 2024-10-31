package dk.northtech.springskeleton.services;

import dk.northtech.springskeleton.entities.ApprovalEntity;
import dk.northtech.springskeleton.entities.TeamEntity;
import dk.northtech.springskeleton.enums.ApprovalStatus;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public interface ApprovalService {
    ApprovalEntity findByUuid(UUID uuid);
    void createOrUpdate(ApprovalEntity approvalEntity, UUID documentUuid);

    @Transactional
    List<ApprovalEntity> createApprovalsForDocument(UUID documentUuid, List<TeamEntity> teamsToApprove);

    void setStatus(UUID applicationUuid, ApprovalStatus status, String comment);
}
