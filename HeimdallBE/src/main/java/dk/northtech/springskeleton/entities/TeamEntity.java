package dk.northtech.springskeleton.entities;

import dk.northtech.springskeleton.enums.TeamType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TeamEntity {
    private UUID uuid;
    private UUID organization_uuid;
    private String name;
    private TeamType type;
    private String description;
    private Long spoc;
    private List<Long> members = new ArrayList<>();
    private List<UUID> applications = new ArrayList<>();
    private List<UUID> tasks = new ArrayList<>();
}
