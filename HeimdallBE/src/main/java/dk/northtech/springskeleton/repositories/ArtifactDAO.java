package dk.northtech.springskeleton.repositories;

import dk.northtech.springskeleton.entities.ArtifactEntity;
import dk.northtech.springskeleton.entities.TaskEntity;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
@RegisterBeanMapper(ArtifactEntity.class)
public interface ArtifactDAO {

    @SqlQuery("SELECT * FROM artifact WHERE uuid = :uuid")
    ArtifactEntity findByUuid(UUID uuid);

    @SqlQuery("SELECT * FROM artifact ")
    List<ArtifactEntity> findAll();

    @SqlUpdate("WITH ins AS (" +
            "    INSERT INTO artifact (uuid, name, description, environment, host, version, type, application_uuid, organization_uuid) " +
            "    VALUES (:uuid, :name, :description, :environment, :host, :version, :type::artifact_type, :application_uuid, :organization_uuid) " +
            "    ON CONFLICT (uuid) DO UPDATE SET " +
            "        name = EXCLUDED.name, " +
            "        description = EXCLUDED.description, " +
            "        environment = EXCLUDED.environment, " +
            "        host = EXCLUDED.host, " +
            "        version = EXCLUDED.version, " +
            "        type = EXCLUDED.type, " +
            "        application_uuid = EXCLUDED.application_uuid, " +
            "        organization_uuid = EXCLUDED.organization_uuid " +
            "    RETURNING uuid" +
            ") SELECT uuid FROM ins")
    void createOrUpdate(@BindBean ArtifactEntity artifact);

    @SqlUpdate("DELETE FROM artifact WHERE uuid = :uuid")
    void delete(UUID uuid);

    // Join table operations
    @SqlUpdate("INSERT INTO artifact_documents (artifact_uuid, document_uuid) VALUES (:artifactUuid, :documentUuid) ON CONFLICT DO NOTHING")
    void addArtifactDocumentsRelation(UUID artifactUuid, UUID documentUuid);
}
