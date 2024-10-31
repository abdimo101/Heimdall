package dk.northtech.springskeleton.repositories;

import dk.northtech.springskeleton.controllers.dtos.RequirementDTO;
import dk.northtech.springskeleton.controllers.dtos.RequirementDocumentTypeDTO;
import dk.northtech.springskeleton.controllers.dtos.RequirementWithNamesDTO;
import dk.northtech.springskeleton.entities.RequirementEntity;
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
@RegisterBeanMapper(RequirementEntity.class)
public interface RequirementDAO
{

    @SqlQuery("SELECT * FROM requirement WHERE uuid = :uuid")
    RequirementEntity findByUuid(@Bind("uuid") UUID uuid);

    @SqlQuery("SELECT * FROM requirement ")
    List<RequirementEntity> findAll();

    @SqlQuery("SELECT * FROM requirement WHERE team_uuid = :teamUuid")
    List<RequirementEntity> findByTeamUuid(@Bind("teamUuid") UUID teamUuid);

    @SqlQuery("SELECT * FROM requirement WHERE team_uuid IN (<teamUuids>) AND phase_uuid = :phase_uuid::UUID")
    List<RequirementEntity> findByTeamUuidsAndPhase(@BindList("teamUuids") List<UUID> teamUuids, @Bind("phase_uuid") UUID phase_uuid);

    @SqlQuery("SELECT r.*, dt.name as document_type_name, dt.description, dt.specification_link, dt.owner_team_uuid, t.name as owner_team_name " +
            "FROM requirement r " +
            "JOIN document_type dt ON r.document_type_uuid = dt.uuid " +
            "JOIN team t ON dt.owner_team_uuid = t.uuid " +
            "WHERE r.team_uuid = :teamUuid")
    @RegisterBeanMapper(RequirementDocumentTypeDTO.class)
    List<RequirementDocumentTypeDTO> findByTeamUuidWithDocumentTypeDetails(@Bind("teamUuid") UUID teamUuid);

    @SqlUpdate("INSERT INTO requirement (uuid, organization_uuid, team_uuid, document_type_uuid, estimated_wait_time, phase_uuid) " +
            "VALUES (:uuid, :organization_uuid, :team_uuid, :document_type_uuid::UUID, :estimated_wait_time, :phase_uuid::UUID) " +
            "ON CONFLICT (uuid) DO UPDATE SET " +
            "    organization_uuid = EXCLUDED.organization_uuid, " +
            "    team_uuid = EXCLUDED.team_uuid, " +
            "    document_type_uuid = EXCLUDED.document_type_uuid, " +
            "    estimated_wait_time = EXCLUDED.estimated_wait_time, " +
            "    phase_uuid = EXCLUDED.phase_uuid::UUID")
    void createOrUpdate(@BindBean RequirementEntity requirement);

    @SqlUpdate("DELETE FROM requirement WHERE uuid = :uuid")
    void delete(@Bind("uuid") UUID uuid);

    @SqlQuery("SELECT r.*, t.name as team_name, dt.name as document_type_name " +
            "FROM requirement r " +
            "JOIN team t ON r.team_uuid = t.uuid " +
            "JOIN document_type dt ON r.document_type_uuid = dt.uuid " +
            "WHERE r.phase_uuid = :phase_uuid::UUID " +
            "AND r.team_uuid != :teamUuid::UUID")
    @RegisterBeanMapper(RequirementWithNamesDTO.class)
    List<RequirementWithNamesDTO> getAllRequirementsExceptTeam(@Bind("teamUuid") UUID teamUuid, @Bind("phase_uuid") UUID phase_uuid);
}
