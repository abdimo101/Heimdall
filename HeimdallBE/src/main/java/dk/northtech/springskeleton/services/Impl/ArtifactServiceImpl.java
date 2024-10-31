package dk.northtech.springskeleton.services.Impl;

import dk.northtech.springskeleton.entities.ArtifactEntity;
import dk.northtech.springskeleton.repositories.ArtifactDAO;
import dk.northtech.springskeleton.services.ArtifactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ArtifactServiceImpl implements ArtifactService {

    private ArtifactDAO artifactDAO;

    @Autowired
    public ArtifactServiceImpl(ArtifactDAO artifactDAO) {
        this.artifactDAO = artifactDAO;
    }
    @Override
    public ArtifactEntity findByUuid(UUID uuid) {
        return artifactDAO.findByUuid(uuid);
    }

    @Override
    public List<ArtifactEntity> findAll() {
        return artifactDAO.findAll();
    }

    @Override
    public void createOrUpdate(ArtifactEntity artifact) {
        artifactDAO.createOrUpdate(artifact);

        if (artifact.getDocuments() != null) {
            for (UUID documentUuid : artifact.getDocuments()) {
                artifactDAO.addArtifactDocumentsRelation(artifact.getUuid(), documentUuid);
            }
        }
    }

    @Override
    public void delete(UUID uuid) {
        artifactDAO.delete(uuid);
    }
}
