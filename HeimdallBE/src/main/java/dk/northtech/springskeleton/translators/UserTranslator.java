package dk.northtech.springskeleton.translators;

import dk.northtech.springskeleton.controllers.dtos.UserDTO;
import dk.northtech.springskeleton.entities.UserEntity;

import java.util.List;

public abstract class UserTranslator
{
    public static UserDTO toDTO(UserEntity entity)
    {
        return new UserDTO(entity);
    }
    public static UserEntity toEntity(UserDTO dto)
    {
        return new UserEntity(dto.getId(), dto.getName(), dto.getEmail(), dto.getOrganization_uuid(), dto.getTeam_uuids(), dto.getNotification_uuids());
    }

    public static List<UserDTO> toDTOs(List<UserEntity> entities)
    {
        return entities.stream().map(UserDTO::new).toList();
    }
}
