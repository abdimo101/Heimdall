package dk.northtech.springskeleton.repositories;

import dk.northtech.springskeleton.controllers.dtos.teamdtos.TeamDetailsApplicationsDTO;
import dk.northtech.springskeleton.controllers.dtos.teamdtos.TeamDetailsDTO;
import dk.northtech.springskeleton.controllers.dtos.teamdtos.TeamDetailsTasksDTO;
import dk.northtech.springskeleton.controllers.dtos.teamdtos.TeamDetailsUserDTO;
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
@RegisterBeanMapper(TeamEntity.class)
public interface TeamDAO {

    @SqlQuery("SELECT EXISTS (SELECT 1 FROM team WHERE uuid = :uuid)")
    boolean existsByUuid(@Bind UUID uuid);

    // CRUD operations
    @SqlUpdate("INSERT INTO team (uuid, organization_uuid, name, type, description, spoc) VALUES (:uuid::UUID, CAST(:organization_uuid AS UUID), :name, CAST(:type AS team_type), :description, :spoc)")
    void create(@BindBean TeamEntity team);

    @SqlUpdate("UPDATE team SET organization_uuid = CAST(:organization_uuid AS UUID), name = :name, type = CAST(:type AS team_type), description = :description, spoc = :spoc WHERE uuid = :uuid")
    void update(@BindBean TeamEntity team);

    @SqlQuery("SELECT * FROM team WHERE organization_uuid = :organizationUuid")
    List<TeamEntity> findAllByOrganizationUuid(@Bind UUID organizationUuid);

    @SqlQuery("SELECT t.*, " +
            "ARRAY_AGG(DISTINCT at.application_uuid) AS applications, " +
            "ARRAY_AGG(DISTINCT ut.user_id) AS members, " +
            "ARRAY_AGG(DISTINCT tt.task_uuid) AS tasks " +
            "FROM team t " +
            "LEFT JOIN application_teams at ON t.uuid = at.team_uuid " +
            "LEFT JOIN user_teams ut ON t.uuid = ut.team_uuid " +
            "LEFT JOIN team_tasks tt ON t.uuid = tt.team_uuid " +
            "WHERE t.uuid = :uuid " +
            "GROUP BY t.uuid")
    TeamEntity findByUuid(@Bind UUID uuid);

    @SqlUpdate("DELETE FROM team WHERE uuid = :uuid")
    void deleteByUuid(@Bind UUID uuid);

    // Foreign key operations
    @SqlUpdate("UPDATE team SET spoc = :spocId WHERE uuid = :teamUuid")
    void addSPOC(@Bind UUID teamUuid, @Bind Long spocId);

    @SqlUpdate("UPDATE team SET spoc = NULL WHERE uuid = :teamUuid")
    void removeSPOC(@Bind UUID teamUuid);

    // Join table operations
    @SqlUpdate("INSERT INTO user_teams (team_uuid, user_id) VALUES (:teamUuid, :userId) ON CONFLICT DO NOTHING")
    void addMember(@Bind UUID teamUuid,@Bind Long userId);

    @SqlUpdate("DELETE FROM user_teams WHERE team_uuid = :teamUuid AND user_id = :userId")
    void removeMember(@Bind UUID teamUuid,@Bind Long userId);

    @SqlUpdate("INSERT INTO team_tasks (team_uuid, task_uuid) VALUES (:teamUuid, :taskUuid) ON CONFLICT DO NOTHING")
    void addTask(@Bind UUID teamUuid,@Bind UUID taskUuid);

    @SqlUpdate("DELETE FROM team_tasks WHERE team_uuid = :teamUuid AND task_uuid = :taskUuid")
    void removeTask(@Bind UUID teamUuid,@Bind UUID taskUuid);

    @SqlQuery("SELECT * FROM team WHERE uuid IN (SELECT team_uuid FROM user_teams WHERE user_id = :userId)")
    List<TeamEntity> findAllByUser(@Bind Long userId);

    @SqlQuery("SELECT t.uuid, t.organization_uuid, t.name, t.type, t.description, t.spoc, u.name AS spoc_name " +
            "FROM team t " +
            "LEFT JOIN users u ON t.spoc = u.id " +
            "WHERE t.uuid = :uuid")
    @RegisterBeanMapper(TeamDetailsDTO.class)
    TeamDetailsDTO findTeamDetails(@Bind UUID uuid);

    @SqlQuery("SELECT " +
            "t.*, " +
            "tt.team_uuid, " +
            "at.responsible_user_id, " +
            "u.name AS responsible_user_name, " +
            "dt.name AS document_type_name, " +
            "a.app_key " +
            "FROM task t " +
            "JOIN team_tasks tt ON t.uuid = tt.task_uuid " +
            "JOIN application_teams at ON tt.team_uuid = at.team_uuid " +
            "JOIN users u ON at.responsible_user_id = u.id " +
            "JOIN document_type dt ON t.document_type_uuid = dt.uuid " +
            "JOIN application a ON t.application_uuid = a.uuid " +
            "WHERE tt.team_uuid = :teamUuid " +
            "AND at.application_uuid = t.application_uuid")
    @RegisterBeanMapper(TeamDetailsTasksDTO.class)
    List<TeamDetailsTasksDTO> getTeamDetailsTaskDTOs(@Bind UUID teamUuid);
    @SqlQuery("SELECT " +
            "u.id AS id, " +
            "u.name AS name, " +
            "u.email AS email " +
            "FROM user_teams ut " +
            "JOIN users u ON ut.user_id = u.id " +
            "WHERE ut.team_uuid = :uuid")
    @RegisterBeanMapper(TeamDetailsUserDTO.class)
    List<TeamDetailsUserDTO> getTeamDetailsUserDTOs(@Bind UUID uuid);

    @SqlQuery("SELECT " +
            "a.uuid AS uuid, " +
            "a.app_key AS app_key, " +
            "a.name AS name, " +
            "a.version AS version, " +
            "at.responsible_user_id AS responsible_user_id, " +
            "u.name AS responsible_user_name " +
            "FROM application_teams at " +
            "JOIN application a ON at.application_uuid = a.uuid " +
            "LEFT JOIN users u ON at.responsible_user_id = u.id " +
            "WHERE at.team_uuid = :uuid")
    @RegisterBeanMapper(TeamDetailsApplicationsDTO.class)
    List<TeamDetailsApplicationsDTO> getTeamDetailsApplicationDTOs(@Bind UUID uuid);

    @SqlQuery("SELECT * FROM team")
    List<TeamEntity> findAll();
}
