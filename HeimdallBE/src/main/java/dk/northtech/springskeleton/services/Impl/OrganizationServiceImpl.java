package dk.northtech.springskeleton.services.Impl;

import dk.northtech.springskeleton.entities.OrganizationEntity;
import dk.northtech.springskeleton.repositories.OrganizationDAO;
import dk.northtech.springskeleton.services.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class OrganizationServiceImpl implements OrganizationService {

    private final OrganizationDAO organizationDao;

    @Autowired
    public OrganizationServiceImpl(OrganizationDAO organizationDao) {
        this.organizationDao = organizationDao;
    }

    @Transactional
    public void createOrUpdateOrganization(OrganizationEntity organization) {
        organizationDao.createOrUpdate(organization);
    }

    public List<OrganizationEntity> getAllOrganizations() {
        return organizationDao.findAll();
    }

    public OrganizationEntity getOrganization(UUID uuid) {
        OrganizationEntity organization = organizationDao.findByUuid(uuid);
        if (organization == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization not found");
        }
        return organizationDao.findByUuid(uuid);
    }

    @Transactional
    public void deleteOrganization(UUID uuid) {
        organizationDao.deleteByUuid(uuid);
    }
}
