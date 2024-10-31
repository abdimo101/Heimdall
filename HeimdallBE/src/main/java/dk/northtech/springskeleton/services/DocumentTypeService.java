package dk.northtech.springskeleton.services;


import dk.northtech.springskeleton.entities.DocumentTypeEntity;

import java.util.List;
import java.util.UUID;

public interface DocumentTypeService
{
    List<DocumentTypeEntity> findAll();
    DocumentTypeEntity findByUuid(UUID uuid);
    List<DocumentTypeEntity> findByUuids(List<UUID> uuids);
    void create(DocumentTypeEntity documentType);
    void update(DocumentTypeEntity documentType);
    void deleteByUuid(UUID uuid);
    boolean existsByUuid(UUID uuid);
    List<DocumentTypeEntity> findByTeamUuid(UUID teamUuid);
    List<DocumentTypeEntity> findByTeamUuidAndPhaseUuid(UUID teamUuid, UUID phaseUuid);
    List<DocumentTypeEntity> findByPhaseUuid(UUID phaseUuid);
    void createOrUpdate(DocumentTypeEntity documentType);
    List<DocumentTypeEntity> search(String query);
    List<DocumentTypeEntity> getMissingByApplicationPhase(UUID applicationUuid, UUID phase);
}
