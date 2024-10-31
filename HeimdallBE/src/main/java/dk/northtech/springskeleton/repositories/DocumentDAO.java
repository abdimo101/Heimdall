package dk.northtech.springskeleton.repositories;

import dk.northtech.springskeleton.controllers.dtos.ApprovalAuditInfoDTO;
import dk.northtech.springskeleton.entities.ApprovalEntity;
import dk.northtech.springskeleton.entities.DocumentEntity;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
@RegisterBeanMapper(DocumentEntity.class)
public interface DocumentDAO {
    @SqlQuery("SELECT * FROM document WHERE uuid = :uuid")
    DocumentEntity findByUuid(@Bind UUID uuid);

    @SqlUpdate("WITH ins AS (" +
            "    INSERT INTO document (uuid, document_type_uuid, link, organization_uuid) VALUES (:uuid, :document_type_uuid, :link, :organization_uuid) " +
            "    ON CONFLICT (uuid) DO UPDATE SET document_type_uuid = EXCLUDED.document_type_uuid, link = EXCLUDED.link, organization_uuid = EXCLUDED.organization_uuid " +
            "    RETURNING uuid" +
            ")" +
            "INSERT INTO application_documents (application_uuid, document_uuid) VALUES (:application_uuid, (SELECT uuid FROM ins)) " +
            "ON CONFLICT (application_uuid, document_uuid) DO NOTHING")
    void createOrUpdate(@BindBean DocumentEntity document);

    @SqlUpdate("DELETE FROM application_documents WHERE document_uuid = :uuid; " +
            "DELETE FROM approval_documents WHERE document_uuid = :uuid; " +
            "DELETE FROM document WHERE uuid = :uuid")
    void delete(@BindBean DocumentEntity document);

    @SqlQuery("SELECT a.* FROM approval a " +
            "JOIN approval_documents ad ON a.uuid = ad.approval_uuid " +
            "WHERE ad.document_uuid = :document_uuid")
    @RegisterBeanMapper(ApprovalEntity.class)
    List<ApprovalEntity> getAllApprovalsByDocument(@Bind("document_uuid") UUID document_uuid);

    @SqlQuery("SELECT * FROM document WHERE type = :type")
    List<DocumentEntity> findByType(@Bind("type") String type);

    @SqlQuery("SELECT d.document_type_uuid " +
            "FROM document d " +
            "JOIN application_documents ad ON d.uuid = ad.document_uuid " +
            "WHERE ad.application_uuid = :application_uuid")
    List<UUID> findTypeByApplication(@Bind("application_uuid") UUID application_uuid);

    @SqlQuery("SELECT d.uuid from document d " +
            "JOIN application_documents ad ON d.uuid = ad.document_uuid " +
            "WHERE ad.application_uuid = :application_uuid")
    List<UUID> findUUIDByApplication(@Bind("application_uuid") UUID application_uuid);


    @SqlQuery("SELECT d.*, dt.name as document_type_name FROM document d " +
            "JOIN document_type dt on d.document_type_uuid = dt.uuid " +
            "JOIN approval_documents ad ON d.uuid = ad.document_uuid " +
            "WHERE ad.approval_uuid = :approvalUUID")
    DocumentEntity findByApprovalUUID(@Bind("approvalUUID") UUID approvalUUID);

    @SqlQuery("SELECT u.name, aa.operation_user, aa.operation_timestamp " +
            "FROM audit.approval aa " +
            "JOIN approval_documents ad ON aa.uuid = ad.approval_uuid " +
            "JOIN users u ON aa.operation_user = u.id " +
            "WHERE ad.document_uuid = :document_uuid " +
            "ORDER BY aa.operation_timestamp DESC " +
            "LIMIT 1")
    @RegisterBeanMapper(ApprovalAuditInfoDTO.class)
    ApprovalAuditInfoDTO getLatestApprovalByDocument(@Bind("document_uuid") UUID document_uuid);
}
