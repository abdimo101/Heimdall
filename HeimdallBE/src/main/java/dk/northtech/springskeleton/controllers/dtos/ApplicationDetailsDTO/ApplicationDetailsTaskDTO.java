package dk.northtech.springskeleton.controllers.dtos.ApplicationDetailsDTO;

import dk.northtech.springskeleton.enums.TaskStatus;
import dk.northtech.springskeleton.enums.TaskTargetTable;
import dk.northtech.springskeleton.enums.TaskType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ApplicationDetailsTaskDTO
{
    private UUID uuid;
    private TaskType type;
    private TaskTargetTable target_table;
    private UUID target_uuid;
    private TaskStatus status;
    private String description;
}
