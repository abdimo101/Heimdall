package dk.northtech.springskeleton.controllers.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.postgresql.util.PGInterval;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SettingDTO
{
    private UUID organization_uuid;
    private PGInterval default_interval;

}
