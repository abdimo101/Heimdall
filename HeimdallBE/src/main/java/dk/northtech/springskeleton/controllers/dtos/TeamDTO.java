package dk.northtech.springskeleton.controllers.dtos;

import dk.northtech.springskeleton.enums.TeamType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TeamDTO {
    private UUID uuid;
    private UUID organization_uuid;
    private String name;
    private TeamType type;
    private String description;
    private Long spoc;
    private List<Long> members;
    private List<UUID> applications;
    private List<UUID> tasks;
}
