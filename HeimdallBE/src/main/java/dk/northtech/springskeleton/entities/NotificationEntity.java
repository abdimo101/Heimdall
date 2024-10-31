package dk.northtech.springskeleton.entities;

import dk.northtech.springskeleton.enums.NotificationType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@NoArgsConstructor
@Data
public class NotificationEntity {
    private UUID uuid;
    private UUID organization_uuid;
    private String title;
    private NotificationType type;
    private UUID target_uuid;
    private LocalDateTime created_at;
    private List<Long> user_ids;
    private String app_name;
    private LocalDateTime seen_at;

    public NotificationEntity(UUID uuid, UUID organization_uuid, String title, NotificationType type, UUID target_uuid, LocalDateTime created_at, List<Long> user_ids) {
        this.uuid = uuid;
        this.organization_uuid = organization_uuid;
        this.title = title;
        this.type = type;
        this.target_uuid = target_uuid;
        this.created_at = created_at;
        this.user_ids = user_ids;

    }

    public NotificationEntity(UUID uuid, UUID organization_uuid, String title, NotificationType type, LocalDateTime created_at, List<Long> user_ids, String app_name, LocalDateTime seen_at) {
        this.uuid = uuid;
        this.organization_uuid = organization_uuid;
        this.title = title;
        this.type = type;
        this.created_at = created_at;
        this.user_ids = user_ids;
        this.app_name = app_name;
        this.seen_at = seen_at;
    }
}
