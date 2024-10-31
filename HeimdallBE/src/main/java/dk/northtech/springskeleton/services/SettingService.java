package dk.northtech.springskeleton.services;

import dk.northtech.springskeleton.entities.SettingEntity;

import java.util.UUID;

public interface SettingService {
    void createOrUpdateSetting(SettingEntity setting);
    SettingEntity getSettingById(UUID organizationUuid);
}