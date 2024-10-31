package dk.northtech.springskeleton.services.Impl;

import dk.northtech.springskeleton.entities.NotificationEntity;
import dk.northtech.springskeleton.entities.PhaseEntity;
import dk.northtech.springskeleton.entities.UserEntity;
import dk.northtech.springskeleton.enums.NotificationType;
import dk.northtech.springskeleton.repositories.NotificationDAO;
import dk.northtech.springskeleton.repositories.PhaseDAO;
import dk.northtech.springskeleton.repositories.UserDAO;
import dk.northtech.springskeleton.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationDAO notificationDAO;
    private final UserDAO userDAO;

    private final PhaseDAO phaseDAO;

    @Autowired
    public NotificationServiceImpl(NotificationDAO notificationDAO, UserDAO userDAO, PhaseDAO phaseDAO) {
        this.notificationDAO = notificationDAO;
        this.userDAO = userDAO;
        this.phaseDAO = phaseDAO;
    }

    @Override
    public void sendNotification(String title, NotificationType type, UUID targetUuid, List<Long> userIds) {
        UUID notificationUuid = UUID.randomUUID();
        UUID organizationUuid = UUID.fromString("ace2e137-d6e7-4476-9bc4-5c7a23c17ddd");
        NotificationEntity notification = new NotificationEntity(
                notificationUuid,
                organizationUuid,
                title,
                type,
                targetUuid,
                LocalDateTime.now(),
                userIds
        );
        notificationDAO.insertNotification(notification);
        for (Long userId : userIds) {
            notificationDAO.insertUserNotification(userId, notificationUuid);
        }
    }

    @Override
    public void sendPhaseChangeNotification(UUID applicationUuid, NotificationType type,UUID phase) {
        PhaseEntity previousPhase = phaseDAO.findByUuid(phase);
        Long order_number = previousPhase.getOrder_number() - 1;
        List<Long> userIds = notificationDAO.findUserIdsByApplicationUuid(applicationUuid,order_number);

        PhaseEntity phaseEntity = phaseDAO.findByUuid(phase);
        String formattedPhase = phaseEntity.getName().toLowerCase();
        sendNotification("has changed to: " + formattedPhase, type, applicationUuid, userIds);
    }

    @Override
    public List<NotificationEntity> getNotificationByUser(String email) {
        return notificationDAO.findNotificationsByUserEmail(email);
    }

    @Override
    public void notificationHasBeenSeen(String email, UUID notificationUuid) {
        UserEntity user = userDAO.findByEmail(email);
        notificationDAO.notificationHasBeenSeen(user.getId(), notificationUuid, LocalDateTime.now());
    }



}
