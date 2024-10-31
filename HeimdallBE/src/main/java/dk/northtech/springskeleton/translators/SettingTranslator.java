package dk.northtech.springskeleton.translators;

import dk.northtech.springskeleton.controllers.dtos.SettingDTO;
import dk.northtech.springskeleton.entities.SettingEntity;
import org.postgresql.util.PGInterval;

import java.sql.SQLException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class SettingTranslator {

    public static SettingEntity toEntity(SettingDTO dto)
    {
        return new SettingEntity(dto.getOrganization_uuid(), dto.getDefault_interval());
    }

    public static SettingDTO toDto(SettingEntity entity) {
        return new SettingDTO(entity.getOrganization_uuid(), entity.getDefault_interval());
    }

    public static List<SettingDTO> toDTOs(List<SettingEntity> entities) {
        return entities.stream().map(SettingTranslator::toDto).collect(Collectors.toList());
    }

    public static List<SettingEntity> toEntities(List<SettingDTO> dtos) {
        return dtos.stream().map(SettingTranslator::toEntity).collect(Collectors.toList());
    }
}