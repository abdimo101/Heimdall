package dk.northtech.springskeleton.controllers.dtos;

import dk.northtech.springskeleton.entities.DocumentEntity;
import dk.northtech.springskeleton.enums.DocumentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DocumentDTO
{
    private UUID uuid;
    private UUID document_type_uuid;
    private String document_type_name;
    private String link;
    private UUID organization_uuid;
    private UUID application_uuid;
    private ApplicationDTO applicationDTO;
    private UUID artifact_uuid;
    private ArtifactDTO artifactDTO;
    private List<UUID> approvals;
    private List<ApprovalDTO> approvalDTOs;

    //Simple DTO
    public DocumentDTO(DocumentEntity entity)
    {
        this.uuid = entity.getUuid();
        this.document_type_uuid = entity.getDocument_type_uuid();
        this.link = entity.getLink();
        this.organization_uuid = entity.getOrganization_uuid();
        this.application_uuid = entity.getApplication_uuid();
        this.artifact_uuid = entity.getArtifact_uuid();
        this.approvals = entity.getApprovals();
        this.document_type_name= entity.getDocument_type_name();
    }

    public DocumentDTO(DocumentEntity entity, ApplicationDTO applicationDTO, ArtifactDTO artifactDTO, List<ApprovalDTO> approvalDTOs)
    {
        this.uuid = entity.getUuid();
        this.document_type_uuid = entity.getDocument_type_uuid();
        this.link = entity.getLink();
        this.organization_uuid = entity.getOrganization_uuid();
        this.application_uuid = entity.getApplication_uuid();
        this.artifact_uuid = entity.getArtifact_uuid();
        this.approvals = entity.getApprovals();
        this.applicationDTO = applicationDTO;
        this.artifactDTO = artifactDTO;
        this.approvalDTOs = approvalDTOs;
    }



}
