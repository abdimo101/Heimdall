package dk.northtech.springskeleton.services;

import dk.northtech.springskeleton.entities.NotificationEntity;
import dk.northtech.springskeleton.enums.ApplicationPhase;
import dk.northtech.springskeleton.enums.NotificationType;

import java.util.List;
import java.util.UUID;

public interface NotificationService {
    void sendNotification(String title, NotificationType type, UUID targetUuid, List<Long> userIds);

    void sendPhaseChangeNotification(UUID applicationUuid, NotificationType tyoe , UUID phase);

    List<NotificationEntity> getNotificationByUser(String email);

    void notificationHasBeenSeen(String email, UUID notificationUuid);
}
