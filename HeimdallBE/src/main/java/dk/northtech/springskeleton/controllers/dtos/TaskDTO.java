package dk.northtech.springskeleton.controllers.dtos;

import dk.northtech.springskeleton.enums.TaskStatus;
import dk.northtech.springskeleton.enums.TaskTargetTable;
import dk.northtech.springskeleton.enums.TaskType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskDTO {
    private UUID uuid;
    private TaskType type;
    private TaskTargetTable target_table;
    private UUID document_type_uuid;
    private UUID target_uuid;
    private TaskStatus status;
    private String description;
    private UUID organization_uuid;
    private UUID application_uuid;
    private List<Long> users;
    private List<UUID> teams;
}
