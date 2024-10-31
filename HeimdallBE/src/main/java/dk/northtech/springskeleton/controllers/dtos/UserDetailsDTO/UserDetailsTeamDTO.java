package dk.northtech.springskeleton.controllers.dtos.UserDetailsDTO;

import dk.northtech.springskeleton.enums.TeamType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDetailsTeamDTO {
    private UUID uuid;
    private String name;
    private TeamType type;
    private String description;
}
