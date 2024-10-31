package dk.northtech.springskeleton.controllers.dtos;

import dk.northtech.springskeleton.entities.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserDTO
{
    private Long id;
    private String name;
    private String email;
    private UUID organization_uuid;
    private List<UUID> team_uuids;
    private List<UUID> notification_uuids;

    public UserDTO(UserEntity entity)
    {
        this.id = entity.getId();
        this.name = entity.getName();
        this.email = entity.getEmail();
        this.organization_uuid = entity.getOrganization_uuid();
        this.team_uuids = entity.getTeam_uuids();
        this.notification_uuids = entity.getNotification_uuids();
    }
}
