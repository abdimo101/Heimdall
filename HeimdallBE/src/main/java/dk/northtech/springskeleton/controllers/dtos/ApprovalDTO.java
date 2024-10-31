package dk.northtech.springskeleton.controllers.dtos;

import dk.northtech.springskeleton.entities.ApprovalEntity;
import dk.northtech.springskeleton.enums.ApprovalStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ApprovalDTO {
    private UUID uuid;
    private UUID organization_uuid;
    private ApprovalStatus status;
    private String Comment;
    private UUID team_uuid;
    private TeamDTO team;
    private UUID document_uuid;
    private DocumentDTO document;

    //Simple DTO
    public ApprovalDTO(ApprovalEntity entity)
    {
        this.uuid = entity.getUuid();
        this.organization_uuid = entity.getOrganization_uuid();
        this.status = entity.getStatus();
        this.Comment = entity.getComment();
        this.team_uuid = entity.getTeam_uuid();
    }

    //Complex DTO

    public ApprovalDTO(ApprovalEntity entity, DocumentDTO document, TeamDTO team)
    {
        this.uuid = entity.getUuid();
        this.organization_uuid = entity.getOrganization_uuid();
        this.status = entity.getStatus();
        this.Comment = entity.getComment();
        this.team_uuid = entity.getTeam_uuid();
        this.document = document;
        this.team = team;
    }
}
