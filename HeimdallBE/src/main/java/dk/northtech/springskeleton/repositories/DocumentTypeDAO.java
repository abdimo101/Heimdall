package dk.northtech.springskeleton.repositories;

import dk.northtech.springskeleton.entities.DocumentTypeEntity;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.customizer.BindList;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
@RegisterBeanMapper(DocumentTypeEntity.class)
public interface DocumentTypeDAO
{

    @SqlQuery("SELECT * FROM document_type")
    List<DocumentTypeEntity> findAll();

    @SqlQuery("SELECT * FROM document_type WHERE uuid = :uuid")
    DocumentTypeEntity findByUuid(UUID uuid);

    @SqlUpdate("INSERT INTO document_type VALUES (:uuid::UUID, :organization_uuid::UUID, :owner_team_uuid::UUID, :name, :description, :link)")
    void create(@BindBean DocumentTypeEntity documentType);

    @SqlUpdate("UPDATE document_type SET organization_uuid = :organization_uuid::UUID, owner_team_uuid = :owner_team_uuid::UUID, name = :name, description = :description, link = :link WHERE uuid = :uuid")
    void update(DocumentTypeEntity documentType);

    @SqlUpdate("DELETE FROM document_type WHERE uuid = :uuid")
    void deleteByUuid(UUID uuid);

    @SqlQuery("SELECT EXISTS (SELECT 1 FROM document_type WHERE uuid = :uuid)")
    boolean existsByUuid(UUID uuid);

    @SqlQuery("SELECT dt.* FROM document_type dt " +
            "JOIN requirement r ON dt.uuid = r.document_type_uuid " +
            "WHERE r.team_uuid = :teamUuid")
    List<DocumentTypeEntity> findByTeamUuid(@Bind("teamUuid") UUID teamUuid);

    @SqlQuery("SELECT dt.* FROM document_type dt " +
            "JOIN requirement r ON dt.uuid = r.document_type_uuid " +
            "WHERE r.team_uuid = :teamUuid AND r.phase_uuid = :phaseUuid")
    List<DocumentTypeEntity> findByTeamUuidAndPhaseUuid(@Bind("teamUuid") UUID teamUuid, @Bind("phaseUuid") UUID phaseUuid);

    @SqlQuery("SELECT dt.* FROM document_type dt " +
            "JOIN requirement r ON dt.uuid = r.document_type_uuid " +
            "WHERE r.phase_uuid = :phaseUuid")
    List<DocumentTypeEntity> findByPhaseUuid(@Bind("phaseUuid") UUID phaseUuid);

    @SqlQuery("SELECT * FROM (" +
            "    SELECT *, similarity(name, :query) AS similarity_score " +
            "    FROM document_type WHERE similarity(name, :query) > 0.05" +
            ") subquery ORDER BY similarity_score DESC LIMIT 10")
    List<DocumentTypeEntity> search(@Bind("query") String query);

    @SqlQuery("SELECT * FROM document_type WHERE uuid IN (<uuids>)")
    List<DocumentTypeEntity> findByUuids(@BindList("uuids") List<UUID> uuids);
}
