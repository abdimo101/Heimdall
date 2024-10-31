package dk.northtech.springskeleton.controllers.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeamUserAssignDTO {
    private UUID application_uuid;
    private UUID team_uuid;
    private Long user_id;
}
