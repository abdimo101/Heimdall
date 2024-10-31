package dk.northtech.springskeleton.services;

import dk.northtech.springskeleton.entities.OrganizationEntity;

import java.util.List;
import java.util.UUID;

public interface OrganizationService {
    void createOrUpdateOrganization(OrganizationEntity organization);
    List<OrganizationEntity> getAllOrganizations();
    OrganizationEntity getOrganization(UUID uuid);
    void deleteOrganization(UUID uuid);
}
