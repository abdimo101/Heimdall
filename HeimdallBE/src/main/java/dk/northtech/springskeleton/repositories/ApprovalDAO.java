package dk.northtech.springskeleton.repositories;

import dk.northtech.springskeleton.controllers.dtos.ApplicationDetailsDTO.ApplicationDetailsApprovalDTO;
import dk.northtech.springskeleton.entities.DocumentEntity;
import dk.northtech.springskeleton.enums.ApprovalStatus;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlBatch;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import dk.northtech.springskeleton.entities.ApprovalEntity;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
@RegisterBeanMapper(ApprovalEntity.class)
public interface ApprovalDAO {
    @SqlQuery("SELECT * FROM approval WHERE uuid = :uuid")
    ApprovalEntity findByUuid(@Bind UUID uuid);

    @SqlUpdate("WITH ins AS (" +
            "    INSERT INTO approval (uuid, status, comment, team_uuid, organization_uuid) VALUES (:uuid, :status::approval_status, :comment, :team_uuid, :organization_uuid) " +
            "    ON CONFLICT (uuid) DO UPDATE SET status = EXCLUDED.status, comment = EXCLUDED.comment, team_uuid = EXCLUDED.team_uuid, organization_uuid = EXCLUDED.organization_uuid " +
            "    RETURNING uuid" +
            ")" +
            "INSERT INTO approval_documents (approval_uuid, document_uuid) VALUES ((SELECT uuid FROM ins), :document_uuid) " +
            "ON CONFLICT (approval_uuid, document_uuid) DO NOTHING")
    void createOrUpdate(@BindBean ApprovalEntity approval, @Bind("document_uuid") UUID documentUuid);

    @SqlUpdate("UPDATE approval a "+
            "SET status = :status::approval_status, "+
            "comment = :comment "+
            "WHERE a.uuid = :uuid;")
    void setStatus(@Bind("uuid") UUID applicationUuid, @Bind("status") ApprovalStatus status, @Bind("comment") String comment);

    @SqlBatch("WITH ins AS (" +
            "    INSERT INTO approval (uuid, status, comment, team_uuid, organization_uuid) VALUES (:uuid, :status::approval_status, :comment, :team_uuid, :organization_uuid) " +
            "    ON CONFLICT (uuid) DO UPDATE SET status = EXCLUDED.status, comment = EXCLUDED.comment, team_uuid = EXCLUDED.team_uuid, organization_uuid = EXCLUDED.organization_uuid " +
            "    RETURNING uuid" +
            ")" +
            "INSERT INTO approval_documents (approval_uuid, document_uuid) VALUES ((SELECT uuid FROM ins), :document_uuid::uuid) " +
            "ON CONFLICT (approval_uuid, document_uuid) DO NOTHING")
    void createOrUpdateBatch(@BindBean List<ApprovalEntity> approvals, @Bind("document_uuid") UUID documentUuid);

    @SqlQuery("SELECT a.* FROM approval a " +
            "JOIN approval_documents ad ON a.uuid = ad.approval_uuid " +
            "WHERE ad.document_uuid = :document_uuid::uuid")
    List<ApprovalEntity> findByDocumentUuid(@Bind("document_uuid") UUID documentUuid);

    @SqlQuery("SELECT a.*, t.name as team_name FROM approval a " +
            "JOIN team t ON a.team_uuid = t.uuid " +
            "JOIN approval_documents ad ON a.uuid = ad.approval_uuid " +
            "WHERE ad.document_uuid = :document_uuid::uuid")
    @RegisterBeanMapper(ApplicationDetailsApprovalDTO.class)
    List<ApplicationDetailsApprovalDTO> findByDocumentUuidForDetails(@Bind("document_uuid") UUID documentUuid);

    // Check if an approval with the same team_uuid and document_uuid already exists.
    @SqlQuery("SELECT EXISTS (" +
            "    SELECT 1 " +
            "    FROM approval a " +
            "    JOIN approval_documents ad ON a.uuid = ad.approval_uuid " +
            "    WHERE a.team_uuid = :team_uuid " +
            "    AND ad.document_uuid = :document_uuid" +
            ") AS entry_exists")
    boolean exists(@Bind("team_uuid") UUID teamUuid, @Bind("document_uuid") UUID documentUuid);
}
