package dk.northtech.springskeleton.repositories;

import dk.northtech.springskeleton.entities.NotificationEntity;
import dk.northtech.springskeleton.enums.ApplicationPhase;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
@RegisterBeanMapper(NotificationEntity.class)
public interface NotificationDAO {

    @SqlQuery("SELECT n.uuid, n.organization_uuid, n.title, n.type, n.created_at, a.name AS app_name, un.seen_at " +
            "FROM notification n " +
            "JOIN user_notifications un ON n.uuid = un.notification_uuid " +
            "JOIN application a ON n.target_uuid = a.uuid " +
            "WHERE un.user_id = (SELECT id FROM users WHERE email = :email)")
    List<NotificationEntity> findNotificationsByUserEmail(@Bind("email") String email);

    @SqlQuery("SELECT DISTINCT u.id " +
            "FROM users u " +
            "JOIN user_teams ut ON u.id = ut.user_id " +
            "JOIN application_teams at ON ut.team_uuid = at.team_uuid " +
            "JOIN team t ON at.team_uuid = t.uuid " +
            "JOIN application a ON at.application_uuid = a.uuid " +
            "JOIN requirement r on t.uuid = r.team_uuid " +
            "JOIN phase p on r.phase_uuid = p.uuid " +
            "WHERE a.uuid = :application_uuid AND p.order_number = :order_number")
    List<Long> findUserIdsByApplicationUuid(@Bind("application_uuid") UUID application_uuid, @Bind("order_number") Long order_number);

    @SqlUpdate("INSERT INTO notification (uuid, organization_uuid, title, type, target_uuid, created_at) " +
            "VALUES (:uuid, :organization_uuid, :title, :type::notification_type, :target_uuid, :created_at)")
    void insertNotification(@BindBean NotificationEntity notification);

    @SqlUpdate("INSERT INTO user_notifications (user_id, notification_uuid) VALUES (:user_id, :notification_uuid)")
    void insertUserNotification(@Bind("user_id") Long user_id, @Bind("notification_uuid") UUID notification_uuid);

    @SqlUpdate("UPDATE user_notifications " +
            "SET seen_at = :seen_at " +
            "WHERE user_id = :user_id AND notification_uuid = :notification_uuid")
    void notificationHasBeenSeen(@Bind("user_id") Long user_id, @Bind("notification_uuid") UUID notification_uuid, @Bind("seen_at") LocalDateTime seen_at);

}
