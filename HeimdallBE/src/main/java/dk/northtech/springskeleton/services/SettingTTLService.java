package dk.northtech.springskeleton.services;

import dk.northtech.springskeleton.controllers.dtos.SettingTTLDTO.SettingTTLDTO;
import dk.northtech.springskeleton.controllers.dtos.SettingTTLDTO.TTLDisplayDTO;
import dk.northtech.springskeleton.entities.SettingTTLEntity;

import java.util.List;
import java.util.UUID;

public interface SettingTTLService {

    List<SettingTTLDTO> findAllByOrganizationUuid(UUID uuid);

    void createOrUpdate(SettingTTLEntity settingTTL);

    TTLDisplayDTO displayTTL(UUID documentUuid);

    void delete(UUID uuid);
}
