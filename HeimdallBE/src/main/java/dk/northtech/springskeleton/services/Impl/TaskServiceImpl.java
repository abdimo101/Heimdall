package dk.northtech.springskeleton.services.Impl;

import dk.northtech.springskeleton.entities.*;
import dk.northtech.springskeleton.enums.TaskStatus;
import dk.northtech.springskeleton.enums.TaskTargetTable;
import dk.northtech.springskeleton.enums.TaskType;
import dk.northtech.springskeleton.repositories.*;
import dk.northtech.springskeleton.services.DocumentService;
import dk.northtech.springskeleton.services.TaskService;
import dk.northtech.springskeleton.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class TaskServiceImpl implements TaskService {


    private final TaskDao taskDao;
    private final DocumentDAO documentDAO;
    private final DocumentTypeDAO documentTypeDAO;
    private final UserService userService;
    private DocumentService documentService;


    @Autowired
    public TaskServiceImpl(TaskDao taskDao, DocumentTypeDAO documentTypeDAO, UserService userService, @Lazy DocumentService documentService, DocumentDAO documentDAO) {
        this.taskDao = taskDao;
        this.documentDAO = documentDAO;
        this.documentTypeDAO = documentTypeDAO;
        this.userService = userService;
        this.documentService = documentService;
    }

    @Override
    public TaskEntity findByUuid(UUID uuid) {
        return taskDao.findByUuid(uuid);
    }

    @Override
    public List<TaskEntity> findAll() {
        List<TaskEntity> tasks = taskDao.findAll();
        return tasks;
    }

    @Transactional
    @Override
    public void createOrUpdate(TaskEntity task) {

        taskDao.createOrUpdate(task);

        if (task.getUsers() != null) {
            for (Long userId : task.getUsers()) {
                taskDao.addUserTaskRelation(userId, task.getUuid());
            }
        }

        if (task.getTeams() != null) {
            for (UUID teamUuid : task.getTeams()) {
                taskDao.addTeamTaskRelation(teamUuid, task.getUuid());
            }
        }
    }

    @Transactional
    @Override
    public void createOrUpdate(List<TaskEntity> tasks) {
        for (TaskEntity task : tasks) {
            createOrUpdate(task);
        }
    }

    @Transactional
    @Override
    public void delete(UUID uuid) {
        taskDao.delete(uuid);
    }

    @Transactional
    @Override
    public void createTasksForMissingDocuments(UUID applicationUuid, UUID phase) {

        List<UUID> missingDocumentTypes = documentService.checkDocumentsByRequirement(applicationUuid, phase);
        if (missingDocumentTypes.isEmpty()) return;
        UUID organizationUuid = userService.getCurrentUser().getOrganization_uuid();

        List<TaskEntity> tasksToCreateOrExist = new ArrayList<>();

        for (UUID missingDocumentType : missingDocumentTypes) {
            DocumentTypeEntity documentType = documentTypeDAO.findByUuid(missingDocumentType);

            TaskEntity task = new TaskEntity();
            task.setUuid(UUID.randomUUID());
            task.setType(TaskType.non_existent);
            task.setTarget_table(TaskTargetTable.document);
            task.setDocument_type_uuid(missingDocumentType);
            task.setTarget_uuid(null);
            task.setStatus(TaskStatus.created);
            task.setDescription("Missing document of type: " + documentType.getName());
            task.setApplication_uuid(applicationUuid);
            task.setOrganization_uuid(organizationUuid);
            tasksToCreateOrExist.add(task);
        }
        tasksToCreateOrExist.removeIf(task -> existsAndIsNotCompleted(task.getType().name(), task.getApplication_uuid(), task.getTarget_table().name(), task.getDocument_type_uuid(), null));
        createOrUpdate(tasksToCreateOrExist);
    }

    public boolean existsAndIsNotCompleted(String type, UUID applicationUuid, String targetTable, UUID documentTypeUuid, UUID targetUuid) {
        return taskDao.existsAndIsNotCompleted(type, applicationUuid, targetTable, documentTypeUuid, targetUuid);
    }

    @Transactional
    public void createAndAssignTaskToTeams(List<TeamEntity> teams, List<ApprovalEntity> approvals, UUID applicationUuid)
    {
        List<TaskEntity> tasksToCreate = new ArrayList<>();
        for(TeamEntity team : teams)
        {
            ApprovalEntity approval = approvals.stream().filter(a -> a.getTeam_uuid().equals(team.getUuid())).findFirst().orElse(null);
            if (approval != null)
            {
                UUID documentUuid = documentDAO.findByApprovalUUID(approval.getUuid()).getUuid();
                UUID documentTypeUuid = documentService.findByUuid(documentUuid).getDocument_type_uuid();

                TaskEntity task = new TaskEntity();
                task.setUuid(UUID.randomUUID());
                task.setType(TaskType.non_existent);
                task.setTarget_table(TaskTargetTable.approval);
                task.setDocument_type_uuid(documentTypeUuid);
                task.setTarget_uuid(approval.getUuid());
                task.setStatus(TaskStatus.assigned);
                task.setDescription("Approval task for team " + team.getName());
                task.setApplication_uuid(applicationUuid);
                task.setOrganization_uuid(team.getOrganization_uuid());
                task.setTeams(Collections.singletonList(team.getUuid()));
                tasksToCreate.add(task);
            }
        }
        tasksToCreate.removeIf(task -> existsAndIsNotCompleted(task.getType().name(), task.getApplication_uuid(), task.getTarget_table().name(), task.getDocument_type_uuid(), task.getTarget_uuid()));
        createOrUpdate(tasksToCreate);
    }

    @Override
    public void createDocumentTaskCompleted(DocumentEntity document) {
        List<TaskEntity> tasks = taskDao.findByDocumentTypeAndApplication(document.getDocument_type_uuid(), document.getApplication_uuid());
        System.out.println("tasks: " + tasks);
        for (TaskEntity task : tasks) {
            task.setStatus(TaskStatus.completed);
            taskDao.createOrUpdate(task);
        }
    }

    @Override
    public void approveDocumentTaskCompleted(UUID approvalUuid)
    {
        taskDao.completeByApprovalUUID(approvalUuid);
    }
}
