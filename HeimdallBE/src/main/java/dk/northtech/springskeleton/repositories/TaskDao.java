package dk.northtech.springskeleton.repositories;


import dk.northtech.springskeleton.entities.TaskEntity;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.springframework.scheduling.config.Task;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
@RegisterBeanMapper(TaskEntity.class)
public interface TaskDao {

    @SqlQuery("SELECT * FROM task WHERE uuid = :uuid")
    TaskEntity findByUuid(UUID uuid);

    @SqlQuery("SELECT * FROM task ")
    List<TaskEntity> findAll();

    @SqlUpdate("WITH ins AS (" +
            "    INSERT INTO task (uuid, type, target_table, document_type_uuid, target_uuid, status, description, organization_uuid, application_uuid) " +
            "    VALUES (:uuid::UUID, :type::task_type, :target_table::task_target_table, :document_type_uuid, :target_uuid::UUID, :status::task_status, :description, :organization_uuid::UUID, :application_uuid::UUID) " +
            "    ON CONFLICT (uuid) DO UPDATE SET " +
            "        type = EXCLUDED.type::task_type, " +
            "        target_table = EXCLUDED.target_table::task_target_table, " +
            "        document_type_uuid = EXCLUDED.document_type_uuid, " +
            "        target_uuid = EXCLUDED.target_uuid, " +
            "        status = EXCLUDED.status::task_status, " +
            "        description = EXCLUDED.description, " +
            "        organization_uuid = EXCLUDED.organization_uuid, " +
            "        application_uuid = EXCLUDED.application_uuid " +
            "    RETURNING uuid" +
            ") SELECT uuid FROM ins")
    void createOrUpdate(@BindBean TaskEntity task);

    @SqlUpdate("DELETE FROM task WHERE uuid = :uuid")
    void delete(UUID uuid);

    @SqlQuery("SELECT EXISTS (" +
            "    SELECT 1 " +
            "    FROM task " +
            "    WHERE type = :type::task_type " +
            "    AND application_uuid = :applicationUuid::UUID " +
            "    AND target_table = :targetTable::task_target_table " +
            "    AND document_type_uuid = :documentTypeUuid::UUID " +
            "    AND (target_uuid = :targetUuid::UUID OR (:targetUuid IS NULL AND target_uuid IS NULL)) " +
            "    AND status != 'completed'" +
            ") AS entry_exists")
    boolean existsAndIsNotCompleted(@Bind("type") String type,
                                    @Bind("applicationUuid") UUID applicationUuid,
                                    @Bind("targetTable") String targetTable,
                                    @Bind("documentTypeUuid") UUID documentTypeUuid,
                                    @Bind("targetUuid") UUID targetUuid);

    // Join table operations
    @SqlUpdate("INSERT INTO user_tasks (user_id, task_uuid) VALUES (:userId, :taskUuid) ON CONFLICT DO NOTHING")
    void addUserTaskRelation(@Bind("userId") Long userId, @Bind("taskUuid") UUID taskUuid);

    @SqlUpdate("INSERT INTO team_tasks (team_uuid, task_uuid) VALUES (:teamUuid, :taskUuid) ON CONFLICT DO NOTHING")
    void addTeamTaskRelation(@Bind("teamUuid") UUID teamUuid, @Bind("taskUuid") UUID taskUuid);

    @SqlQuery("SELECT * FROM task WHERE document_type_uuid = :documentTypeUuid AND application_uuid = :applicationUuid")
    List<TaskEntity> findByDocumentTypeAndApplication(@Bind("documentTypeUuid") UUID documentTypeUuid, @Bind("applicationUuid") UUID applicationUuid);

   @SqlUpdate("UPDATE task " +
   "SET status = 'completed' " +
   "WHERE target_uuid = :approval_uuid" )
    void completeByApprovalUUID(@Bind("approval_uuid") UUID approvalUuid);
}
