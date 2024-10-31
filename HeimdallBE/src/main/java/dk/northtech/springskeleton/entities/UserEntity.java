package dk.northtech.springskeleton.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserEntity
{
    private Long id;
    private String name;
    private String email;
    private UUID organization_uuid;
    private List<UUID> team_uuids;
    private List<UUID> notification_uuids;

}
