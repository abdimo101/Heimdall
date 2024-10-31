package dk.northtech.springskeleton.controllers.dtos.ApplicationDetailsDTO;

import dk.northtech.springskeleton.enums.TeamType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ApplicationDetailsTeamDTO
{
    private UUID uuid;
    private String name;
    private TeamType type;
    private String description;
    private Long spoc;
    private Long responsible_user;
    private String responsible_user_name;
}
