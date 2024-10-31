package dk.northtech.springskeleton.translators;

import dk.northtech.springskeleton.controllers.dtos.NotificationDetailsDTO.NotificationDetailsDTO;
import dk.northtech.springskeleton.entities.NotificationEntity;

import java.util.List;
import java.util.stream.Collectors;

public abstract class NotificationTranslator {


    public static NotificationDetailsDTO toDTO(NotificationEntity notificationEntity) {
        return new NotificationDetailsDTO(
                notificationEntity.getUuid(),
                notificationEntity.getOrganization_uuid(),
                notificationEntity.getTitle(),
                notificationEntity.getType(),
                notificationEntity.getCreated_at(),
                notificationEntity.getApp_name(),
                notificationEntity.getSeen_at()
        );
    }
    public static List<NotificationDetailsDTO> toDTOs (List<NotificationEntity> notificationEntities) {
        return notificationEntities.stream()
                .map(NotificationTranslator::toDTO)
                .collect(Collectors.toList());
    }
}
