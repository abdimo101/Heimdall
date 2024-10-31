package dk.northtech.springskeleton.services;

import dk.northtech.springskeleton.entities.PhaseEntity;

import java.util.List;
import java.util.UUID;

public interface PhaseService
{
    List<PhaseEntity> getAllPhases();

    void createOrUpdatePhase(PhaseEntity entity);

    void deletePhase(UUID uuid);
}
