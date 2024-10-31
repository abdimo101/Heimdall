package dk.northtech.springskeleton.controllers.dtos.teamdtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class TeamDetailsUserDTO
{
    private Long id;
    private String name;
    private String email;
}
