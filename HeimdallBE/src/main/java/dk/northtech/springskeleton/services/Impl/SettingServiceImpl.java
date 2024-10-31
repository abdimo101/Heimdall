package dk.northtech.springskeleton.services.Impl;

import dk.northtech.springskeleton.entities.SettingEntity;
import dk.northtech.springskeleton.repositories.PhaseDAO;
import dk.northtech.springskeleton.services.SettingService;
import dk.northtech.springskeleton.repositories.SettingDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;
@Service
public class SettingServiceImpl implements SettingService
{
    private final SettingDAO settingDAO;
    @Autowired
    public SettingServiceImpl(SettingDAO settingDAO) {
        this.settingDAO = settingDAO;
    }

    @Override
    public void createOrUpdateSetting(SettingEntity setting)
    {
        settingDAO.createOrUpdate(setting);
    }

    @Override
    public SettingEntity getSettingById(UUID organizationUuid)
    {
        return settingDAO.findById(organizationUuid);
    }
}
