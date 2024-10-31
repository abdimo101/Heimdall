package dk.northtech.springskeleton.controllers.dtos.teamdtos;

import dk.northtech.springskeleton.enums.TeamType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class TeamDetailsDTO
{
    private UUID uuid;
    private UUID organization_uuid;
    private String name;
    private TeamType type;
    private String description;
    private Long spoc;
    private String spoc_name;
    private List<TeamDetailsUserDTO> users;
    private List<TeamDetailsApplicationsDTO> applications;
    private List<TeamDetailsTasksDTO> tasks;
}
