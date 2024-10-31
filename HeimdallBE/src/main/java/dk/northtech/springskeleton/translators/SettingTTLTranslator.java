package dk.northtech.springskeleton.translators;

import dk.northtech.springskeleton.controllers.dtos.SettingTTLDTO.SettingTTLDTO;
import dk.northtech.springskeleton.entities.SettingTTLEntity;

import java.util.List;
import java.util.stream.Collectors;

public abstract class SettingTTLTranslator {

    public static SettingTTLDTO translateToDTO(SettingTTLEntity settingTTLEntity) {
        SettingTTLDTO settingTTLDTO = new SettingTTLDTO();
        settingTTLDTO.setUuid(settingTTLEntity.getUuid());
        settingTTLDTO.setInterval(settingTTLEntity.getInterval());
        settingTTLDTO.setOrganization_uuid(settingTTLEntity.getOrganization_uuid());
        settingTTLDTO.setDocument_type_uuid(settingTTLEntity.getDocument_type_uuid());
        return settingTTLDTO;
    }

    public static SettingTTLEntity translateToEntity(SettingTTLDTO settingTTLDTO) {
        SettingTTLEntity settingTTLEntity = new SettingTTLEntity();
        settingTTLEntity.setUuid(settingTTLDTO.getUuid());
        settingTTLEntity.setInterval(settingTTLDTO.getInterval());
        settingTTLEntity.setOrganization_uuid(settingTTLDTO.getOrganization_uuid());
        settingTTLEntity.setDocument_type_uuid(settingTTLDTO.getDocument_type_uuid());
        return settingTTLEntity;
    }

    public static List<SettingTTLDTO> translateToDTO(List<SettingTTLEntity> settingTTLEntities) {
        return settingTTLEntities.stream().map(SettingTTLTranslator::translateToDTO).collect(Collectors.toList());
    }
}
