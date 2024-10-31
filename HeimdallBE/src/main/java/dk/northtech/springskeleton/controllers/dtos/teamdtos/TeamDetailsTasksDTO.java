package dk.northtech.springskeleton.controllers.dtos.teamdtos;

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
public class TeamDetailsTasksDTO
{
    private UUID uuid;
    private TaskType type;
    private TaskTargetTable target_table;
    private UUID target_uuid;
    private TaskStatus status;
    private String description;
    private String app_key;
    private String document_type_name;
    private Long responsible_user_id;
    private String responsible_user_name;
    private UUID application_uuid;
    private UUID document_type_uuid;
}
