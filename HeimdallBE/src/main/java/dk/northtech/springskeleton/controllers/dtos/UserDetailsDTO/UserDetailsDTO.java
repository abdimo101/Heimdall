package dk.northtech.springskeleton.controllers.dtos.UserDetailsDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDetailsDTO {
    private Long id;
    private String name;
    private String email;
    private UUID organization_uuid;
    private List<UserDetailsTeamDTO> teams;

}
