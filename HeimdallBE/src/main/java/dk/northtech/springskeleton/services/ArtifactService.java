package dk.northtech.springskeleton.services;

import dk.northtech.springskeleton.entities.ArtifactEntity;

import java.util.List;
import java.util.UUID;

public interface ArtifactService {

    ArtifactEntity findByUuid(UUID uuid);

    List<ArtifactEntity> findAll();

    void createOrUpdate(ArtifactEntity artifact);

    void delete(UUID uuid);
}
