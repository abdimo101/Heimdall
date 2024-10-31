package dk.northtech.springskeleton.controllers.dtos.SettingTTLDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.postgresql.util.PGInterval;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SettingTTLDTO {
    private UUID uuid;
    private PGInterval interval;
    private UUID organization_uuid;
    private UUID document_type_uuid;
    private String document_type_name;
}
