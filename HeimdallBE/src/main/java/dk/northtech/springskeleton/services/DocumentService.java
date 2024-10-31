package dk.northtech.springskeleton.services;

import dk.northtech.springskeleton.controllers.dtos.ApprovalAuditInfoDTO;
import dk.northtech.springskeleton.entities.ApprovalEntity;
import dk.northtech.springskeleton.entities.DocumentEntity;

import java.util.List;
import java.util.UUID;

public interface DocumentService {
    DocumentEntity findByUuid(UUID uuid);
    void createOrUpdate(DocumentEntity documentEntity);
    void delete(DocumentEntity document);
    List<ApprovalEntity> getAllApprovalsByDocument(UUID uuid);

    List<UUID> checkDocumentsByRequirement(UUID application_uuid, UUID phase);

    List<DocumentEntity> checkApprovedDocuments(UUID application_uuid, UUID phase);
    void initiateDocumentApproval(UUID documentUuid);

    DocumentEntity findByApprovalUUID(UUID approvalUuid);

    ApprovalAuditInfoDTO getLatestApprovalByDocument(UUID documentUuid);
}
