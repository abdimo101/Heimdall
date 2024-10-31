package dk.northtech.springskeleton.services.Impl;

import dk.northtech.springskeleton.entities.DocumentTypeEntity;
import dk.northtech.springskeleton.repositories.ApplicationDAO;
import dk.northtech.springskeleton.repositories.DocumentTypeDAO;
import dk.northtech.springskeleton.repositories.PhaseDAO;
import dk.northtech.springskeleton.services.DocumentService;
import dk.northtech.springskeleton.services.DocumentTypeService;
import jakarta.ws.rs.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DocumentTypeServiceImpl implements DocumentTypeService
{

    private final DocumentTypeDAO documentTypeDAO;
    private final ApplicationDAO applicationDAO;
    private final PhaseDAO phaseDAO;
    private final DocumentService documentService;

    @Autowired
    public DocumentTypeServiceImpl(DocumentTypeDAO documentTypeDAO, ApplicationDAO applicationDAO, PhaseDAO phaseDAO, DocumentService documentService) {
        this.documentTypeDAO = documentTypeDAO;
        this.applicationDAO = applicationDAO;
        this.phaseDAO = phaseDAO;
        this.documentService = documentService;
    }

    public List<DocumentTypeEntity> findAll() {
        return documentTypeDAO.findAll();
    }

    public DocumentTypeEntity findByUuid(UUID uuid) {
        return documentTypeDAO.findByUuid(uuid);
    }

    public List<DocumentTypeEntity> findByUuids(List<UUID> uuids) {
        if(uuids == null || uuids.isEmpty()) {
            return List.of();
        }
        return documentTypeDAO.findByUuids(uuids);
    }

    public void create(DocumentTypeEntity documentType) {
        documentTypeDAO.create(documentType);
    }

    public void update(DocumentTypeEntity documentType) {
        documentTypeDAO.update(documentType);
    }

    public void createOrUpdate(DocumentTypeEntity documentType) {
        if (documentType.getUuid() != null && existsByUuid(documentType.getUuid())) {
            update(documentType);
        } else {
            create(documentType);
        }
    }

    public void deleteByUuid(UUID uuid) {
        documentTypeDAO.deleteByUuid(uuid);
    }

    public boolean existsByUuid(UUID uuid) {
        return documentTypeDAO.existsByUuid(uuid);
    }

    public List<DocumentTypeEntity> findByTeamUuid(UUID teamUuid) {
        return documentTypeDAO.findByTeamUuid(teamUuid);
    }

    public List<DocumentTypeEntity> findByTeamUuidAndPhaseUuid(UUID teamUuid, UUID phaseUuid) {
        return documentTypeDAO.findByTeamUuidAndPhaseUuid(teamUuid, phaseUuid);
    }

    public List<DocumentTypeEntity> findByPhaseUuid(UUID phaseUuid) {
        return documentTypeDAO.findByPhaseUuid(phaseUuid);
    }

    public List<DocumentTypeEntity> search(String query) {
        return documentTypeDAO.search(query);
    }

    public List<DocumentTypeEntity> getMissingByApplicationPhase(UUID applicationUuid, UUID phase) {
        if(applicationUuid == null || !applicationDAO.existsByUuid(applicationUuid))
            throw new NotFoundException("Application not found");
        if(phase == null || !phaseDAO.existsByUuid(phase))
            throw new NotFoundException("Phase not found");
        List<UUID> missingDocumentTypeUuids = documentService.checkDocumentsByRequirement(applicationUuid, phase);
        return findByUuids(missingDocumentTypeUuids);
    }
}

