package dk.northtech.springskeleton.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.postgresql.util.PGInterval;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SettingEntity
{
    private UUID organization_uuid;
    private PGInterval default_interval;
}
