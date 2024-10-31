package dk.northtech.springskeleton.controllers.dtos.NotificationDetailsDTO;

import dk.northtech.springskeleton.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class NotificationDetailsDTO {
    private UUID uuid;
    private UUID organization_uuid;
    private String title;
    private NotificationType type;
    private LocalDateTime created_at;
    private String app_name;
    private LocalDateTime seen_at;
}
