package dk.northtech.springskeleton.services.Impl;

import dk.northtech.springskeleton.controllers.dtos.SettingTTLDTO.SettingTTLDTO;
import dk.northtech.springskeleton.controllers.dtos.SettingTTLDTO.TTLDisplayDTO;
import dk.northtech.springskeleton.entities.SettingTTLEntity;
import dk.northtech.springskeleton.repositories.SettingTTLDAO;
import dk.northtech.springskeleton.services.SettingTTLService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SettingTTLServiceImpl implements SettingTTLService {
    private final SettingTTLDAO settingTTLDAO;

    public SettingTTLServiceImpl(SettingTTLDAO settingTTLDAO) {
        this.settingTTLDAO = settingTTLDAO;
    }

    @Override
    public List<SettingTTLDTO> findAllByOrganizationUuid(UUID uuid) {
        return settingTTLDAO.findAllByOrganizationUuid(uuid);
    }

    @Override
    public void createOrUpdate(SettingTTLEntity settingTTL) {
        settingTTLDAO.createOrUpdate(settingTTL);
    }

    @Override
    public TTLDisplayDTO displayTTL(UUID documentUuid) {
        return settingTTLDAO.displayTTL(documentUuid);
    }

    @Override
    public void delete(UUID uuid)
    {
        settingTTLDAO.delete(uuid);
    }
}
