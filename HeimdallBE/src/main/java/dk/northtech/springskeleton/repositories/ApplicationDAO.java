package dk.northtech.springskeleton.repositories;

import dk.northtech.springskeleton.controllers.dtos.*;
import dk.northtech.springskeleton.controllers.dtos.ApplicationDetailsDTO.ApplicationDetailsDTO;
import dk.northtech.springskeleton.controllers.dtos.ApplicationDetailsDTO.ApplicationDetailsDocumentDTO;
import dk.northtech.springskeleton.controllers.dtos.ApplicationDetailsDTO.ApplicationDetailsTaskDTO;
import dk.northtech.springskeleton.controllers.dtos.ApplicationDetailsDTO.ApplicationDetailsTeamDTO;
import dk.northtech.springskeleton.entities.ApplicationEntity;
import dk.northtech.springskeleton.entities.DocumentEntity;
import dk.northtech.springskeleton.entities.TeamEntity;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
@RegisterBeanMapper(ApplicationEntity.class)
public interface ApplicationDAO {

    @SqlQuery("SELECT EXISTS (SELECT 1 FROM application WHERE uuid = :uuid)")
    boolean existsByUuid(@Bind UUID uuid);

    // CRUD operations
    @SqlUpdate("INSERT INTO application (uuid, organization_uuid, app_key, name, version, phase_uuid, next_phase_uuid, po, pm, description) VALUES (:uuid::UUID, CAST(:organization_uuid as UUID), :app_key, :name, :version, :phase_uuid::UUID, :next_phase_uuid::UUID, :po, :pm, :description)")
    void create(@BindBean ApplicationEntity application);

    @SqlUpdate("UPDATE application SET organization_uuid = CAST(:organization_uuid AS UUID), app_key = :app_key, name = :name, version = :version, phase_uuid = :phase_uuid, next_phase_uuid = :next_phase_uuid, po = :po, pm = :pm, description = :description WHERE uuid = :uuid")
    void update(@BindBean ApplicationEntity application);

    @SqlQuery("SELECT * FROM application")
    List<ApplicationEntity> findAll();

    @SqlQuery("SELECT * FROM application WHERE uuid = :uuid")
    ApplicationEntity findByUuid(@Bind UUID uuid);

    @SqlUpdate("DELETE FROM application WHERE uuid = :uuid")
    void deleteByUuid(@Bind UUID uuid);

    // Foreign key operations
    @SqlUpdate("UPDATE application SET po = :poId WHERE uuid = :applicationUuid")
    void addPO(@Bind UUID applicationUuid, @Bind Long poId);

    @SqlUpdate("UPDATE application SET po = NULL WHERE uuid = :applicationUuid")
    void removePO(@Bind UUID applicationUuid);

    @SqlUpdate("UPDATE application SET pm = :pmId WHERE uuid = :applicationUuid")
    void addPM(@Bind UUID applicationUuid, @Bind Long pmId);

    @SqlUpdate("UPDATE application SET pm = NULL WHERE uuid = :applicationUuid")
    void removePM(@Bind UUID applicationUuid);

    // Join table operations
    @SqlUpdate("INSERT INTO application_teams (application_uuid, team_uuid, responsible_user_id) VALUES (:applicationUuid::UUID, :teamUuid::UUID, :responsibleUserId) ON CONFLICT DO NOTHING")
    void addTeam(@Bind UUID applicationUuid, @Bind UUID teamUuid, @Bind Long responsibleUserId);

    @SqlUpdate("DELETE FROM application_teams WHERE application_uuid = :applicationUuid AND team_uuid = :teamUuid")
    void removeTeam(@Bind UUID applicationUuid, @Bind UUID teamUuid);

    @SqlUpdate("INSERT INTO application_tasks (application_uuid, task_uuid) VALUES (:applicationUuid, :taskUuid) ON CONFLICT DO NOTHING")
    void addTask(@Bind UUID applicationUuid, @Bind UUID taskUuid);

    @SqlUpdate("DELETE FROM application_tasks WHERE application_uuid = :applicationUuid AND task_uuid = :taskUuid")
    void removeTask(@Bind UUID applicationUuid, @Bind UUID taskUuid);

    @SqlUpdate("INSERT INTO application_documents (application_uuid, document_uuid) VALUES (:applicationUuid, :documentUuid) ON CONFLICT DO NOTHING")
    void addDocument(@Bind UUID applicationUuid, @Bind UUID documentUuid);

    @SqlUpdate("DELETE FROM application_documents WHERE application_uuid = :applicationUuid AND document_uuid = :documentUuid")
    void removeDocument(@Bind UUID applicationUuid, @Bind UUID documentUuid);

    @RegisterBeanMapper(TeamEntity.class)
    @SqlQuery("SELECT t.* FROM team t JOIN application_teams at ON t.uuid = at.team_uuid WHERE at.application_uuid = :applicationUuid")
    List<TeamEntity> getTeams(UUID applicationUuid);

    @SqlQuery("SELECT " +
            "a.uuid, " +
            "a.organization_uuid, " +
            "a.app_key, " +
            "a.name, " +
            "a.version, " +
            "a.phase_uuid, " +
            "a.next_phase_uuid, " +
            "p.name AS phase_name, " +
            "a.po, " +
            "po_user.id AS po_id, " +
            "po_user.name AS po_name, " +
            "a.pm, " +
            "pm_user.id AS pm_id, " +
            "pm_user.name AS pm_name, " +
            "a.description " +
            "FROM application a " +
            "LEFT JOIN phase p ON p.uuid = a.phase_uuid " +
            "LEFT JOIN users po_user ON a.po = po_user.id " +
            "LEFT JOIN users pm_user ON a.pm = pm_user.id")
    @RegisterBeanMapper(ApplicationListDTO.class)
    List<ApplicationListDTO> findAllApplicationsWithUserDetails();

    @SqlQuery("SELECT " +
            "a.uuid AS uuid, " +
            "a.organization_uuid, " +
            "a.app_key, " +
            "a.name, " +
            "a.version, " +
            "a.phase_uuid, " +
            "a.next_phase_uuid, " +
            "p.name AS phase_name, " +
            "a.po AS po_id, " +
            "po_user.name AS po_name, " +
            "a.pm AS pm_id, " +
            "pm_user.name AS pm_name, " +
            "a.description " +
            "FROM application a " +
            "LEFT JOIN phase p ON p.uuid = a.phase_uuid " +
            "LEFT JOIN users po_user ON a.po = po_user.id " +
            "LEFT JOIN users pm_user ON a.pm = pm_user.id " +
            "WHERE a.uuid = :uuid")
    @RegisterBeanMapper(ApplicationDetailsDTO.class)
    ApplicationDetailsDTO getApplicationDetailsByUuid(@Bind("uuid") UUID uuid);

    @SqlQuery("SELECT " +
            "t.uuid AS uuid, " +
            "t.name AS name, " +
            "t.type AS type, " +
            "t.description AS description, " +
            "t.spoc AS spoc, " +
            "spoc_user.name AS spoc_name, " +
            "at.responsible_user_id AS responsible_user, " +
            "ru.name AS responsible_user_name " +
            "FROM team t " +
            "JOIN application_teams at ON t.uuid = at.team_uuid " +
            "LEFT JOIN users ru ON at.responsible_user_id = ru.id " +
            "LEFT JOIN users spoc_user ON t.spoc = spoc_user.id " +
            "WHERE at.application_uuid = :uuid " +
            "GROUP BY t.uuid, at.responsible_user_id, ru.name, spoc_user.name")
    @RegisterBeanMapper(ApplicationDetailsTeamDTO.class)
    List<ApplicationDetailsTeamDTO> getApplicationDetailsTeamDTO(@Bind("uuid") UUID uuid);

    @SqlQuery("SELECT " +
            "t.uuid AS uuid, " +
            "t.type AS type, " +
            "t.target_table AS target_table, " +
            "t.target_uuid AS target_uuid, " +
            "t.status AS status, " +
            "t.description AS description " +
            "FROM task t " +
            "WHERE t.application_uuid = :uuid")
    @RegisterBeanMapper(ApplicationDetailsTaskDTO.class)
    List<ApplicationDetailsTaskDTO> getApplicationDetailsTaskDTO(@Bind("uuid") UUID uuid);

    @SqlQuery("SELECT " +
            "d.uuid AS uuid, " +
            "d.document_type_uuid, " +
            "d.link AS link, " +
            "dt.name as type_name " +
            "FROM document d " +
            "JOIN document_type dt ON d.document_type_uuid = dt.uuid " +
            "JOIN application_documents ad ON d.uuid = ad.document_uuid " +
            "WHERE ad.application_uuid = :uuid ")
    @RegisterBeanMapper(ApplicationDetailsDocumentDTO.class)
    List<ApplicationDetailsDocumentDTO> getApplicationDetailsDocumentDTO(@Bind("uuid") UUID uuid);

    @SqlQuery("SELECT d.*, dt.name as document_type_name " +
            "FROM document d " +
            "JOIN application_documents ad ON d.uuid = ad.document_uuid " +
            "JOIN document_type dt ON d.document_type_uuid = dt.uuid " +
            "WHERE ad.application_uuid = :uuid AND d.document_type_uuid = :document_type_uuid::UUID")
    @RegisterBeanMapper(DocumentEntity.class)
    DocumentEntity getDocumentByApplicationAndType(@Bind("uuid") UUID uuid, @Bind("document_type_uuid") String document_type_uuid);

    @SqlUpdate("UPDATE application_teams SET responsible_user_id = :userId WHERE application_uuid = :applicationUuid::UUID AND team_uuid = :teamUuid::UUID")
    void assignUserToApplication(UUID applicationUuid, UUID teamUuid, Long userId);

    @SqlUpdate("UPDATE application " +
            "SET phase_uuid = CASE " +
            "    WHEN next_phase_uuid = :phase_uuid THEN :phase_uuid " +
            "    ELSE phase_uuid " +
            "END, " +
            "next_phase_uuid = CASE " +
            "    WHEN next_phase_uuid IS NULL THEN :phase_uuid " +
            "    WHEN next_phase_uuid = :phase_uuid THEN NULL " +
            "    ELSE next_phase_uuid " +
            "END " +
            "WHERE uuid = :applicationUuid " +
            "AND (phase_uuid != :phase_uuid OR next_phase_uuid IS NULL OR next_phase_uuid = :phase_uuid)")
    void changePhase(@Bind UUID applicationUuid, @Bind UUID phase_uuid);

    @SqlUpdate("UPDATE application SET next_phase_uuid = :phase_uuid::UUID WHERE uuid = :applicationUuid")
    void changeToTransitionPhase(@Bind UUID applicationUuid, @Bind UUID phase_uuid);

    @SqlQuery("SELECT a.* FROM application a JOIN application_documents ad ON a.uuid = ad.application_uuid WHERE ad.document_uuid = :documentUuid")
    ApplicationEntity findByDocumentUuid(@Bind UUID documentUuid);

    @SqlUpdate("UPDATE application SET next_phase_uuid = null WHERE uuid = :applicationUuid")
    void changeNextPhaseToNull(@Bind UUID applicationUuid);

    @SqlQuery("SELECT phase_uuid, operation_type, operation_timestamp " +
            "FROM audit.application " +
            "WHERE operation_type != 'DELETE' " +
            "AND next_phase_uuid IS NULL " +
            "AND uuid = :applicationUuid")
    @RegisterBeanMapper(AppAuditInfoDTO.class)
    List<AppAuditInfoDTO> getAppAuditInfo(@Bind UUID applicationUuid);

}
