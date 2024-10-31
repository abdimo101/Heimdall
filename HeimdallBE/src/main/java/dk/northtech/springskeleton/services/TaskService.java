package dk.northtech.springskeleton.services;

import dk.northtech.springskeleton.entities.ApprovalEntity;
import dk.northtech.springskeleton.entities.DocumentEntity;
import dk.northtech.springskeleton.entities.TaskEntity;
import dk.northtech.springskeleton.entities.TeamEntity;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public interface TaskService
{

    TaskEntity findByUuid(UUID uuid);

    List<TaskEntity> findAll();

    void createOrUpdate(TaskEntity task);

    @Transactional
    void createOrUpdate(List<TaskEntity> tasks);

    void delete(UUID uuid);

    @Transactional
    void createTasksForMissingDocuments(UUID applicationUuid, UUID phase);

    void createAndAssignTaskToTeams(List<TeamEntity> teams, List<ApprovalEntity> approvals, UUID applicationUuid);

    void createDocumentTaskCompleted(DocumentEntity documentEntity);

    void approveDocumentTaskCompleted(UUID approvalUuid);
}
