package dk.northtech.springskeleton.translators;

import dk.northtech.springskeleton.controllers.dtos.TaskDTO;
import dk.northtech.springskeleton.entities.TaskEntity;

import java.util.List;
import java.util.stream.Collectors;

public abstract class TaskTranslator {

    public static TaskDTO translateToDTO(TaskEntity taskEntity) {
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setUuid(taskEntity.getUuid());
        taskDTO.setType(taskEntity.getType());
        taskDTO.setTarget_table(taskEntity.getTarget_table());
        taskDTO.setDocument_type_uuid(taskEntity.getDocument_type_uuid());
        taskDTO.setTarget_uuid(taskEntity.getTarget_uuid());
        taskDTO.setStatus(taskEntity.getStatus());
        taskDTO.setDescription(taskEntity.getDescription());
        taskDTO.setOrganization_uuid(taskEntity.getOrganization_uuid());
        taskDTO.setApplication_uuid(taskEntity.getApplication_uuid());
        taskDTO.setUsers(taskEntity.getUsers());
        taskDTO.setTeams(taskEntity.getTeams());
        return taskDTO;
    }

    public static List<TaskDTO> translateToDTO(List<TaskEntity> taskEntities) {
        return taskEntities.stream().map(TaskTranslator::translateToDTO).collect(Collectors.toList());
    }

    public static TaskEntity translateToEntity(TaskDTO taskDTO) {
        TaskEntity taskEntity = new TaskEntity();
        taskEntity.setUuid(taskDTO.getUuid());
        taskEntity.setType(taskDTO.getType());
        taskEntity.setTarget_table(taskDTO.getTarget_table());
        taskEntity.setDocument_type_uuid(taskDTO.getDocument_type_uuid());
        taskEntity.setTarget_uuid(taskDTO.getTarget_uuid());
        taskEntity.setStatus(taskDTO.getStatus());
        taskEntity.setDescription(taskDTO.getDescription());
        taskEntity.setOrganization_uuid(taskDTO.getOrganization_uuid());
        taskEntity.setApplication_uuid(taskDTO.getApplication_uuid());
        taskEntity.setUsers(taskDTO.getUsers());
        taskEntity.setTeams(taskDTO.getTeams());
        return taskEntity;
    }
}
