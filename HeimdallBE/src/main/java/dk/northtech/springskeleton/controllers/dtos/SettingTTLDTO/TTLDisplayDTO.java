package dk.northtech.springskeleton.controllers.dtos.SettingTTLDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.postgresql.util.PGInterval;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TTLDisplayDTO {
    LocalDateTime ttl;
}
