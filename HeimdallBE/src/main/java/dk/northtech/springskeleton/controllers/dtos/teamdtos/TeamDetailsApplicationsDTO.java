package dk.northtech.springskeleton.controllers.dtos.teamdtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TeamDetailsApplicationsDTO
{
    private UUID uuid;
    private String app_key;
    private String name;
    private String version;
    private Long responsible_user_id;
    private String responsible_user_name;
}
