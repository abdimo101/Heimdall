package dk.northtech.springskeleton.services.Impl;

import dk.northtech.springskeleton.entities.PhaseEntity;
import dk.northtech.springskeleton.repositories.PhaseDAO;
import dk.northtech.springskeleton.services.PhaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PhaseServiceImpl implements PhaseService {

    private final PhaseDAO phaseDAO;

    @Autowired
    public PhaseServiceImpl(PhaseDAO phaseDAO) {
        this.phaseDAO = phaseDAO;
    }

    @Override
    public List<PhaseEntity> getAllPhases() {
        return phaseDAO.findAll();
    }

    @Override
    public void createOrUpdatePhase(PhaseEntity entity)
    {
        if(entity.getOrder_number() == null)
        {
            entity.setOrder_number(phaseDAO.findMaxOrderNumber() + 1);
            List<Long> missingNumbers = getNumbersExcept(phaseDAO.findAllOrderNumbers(), 1L, phaseDAO.findMaxOrderNumber());
            if(!missingNumbers.isEmpty())
            {
                entity.setOrder_number(missingNumbers.get(0));
            }
        }
       if(phaseDAO.findAllOrderNumbers().contains(entity.getOrder_number()) && phaseDAO.existsByUuid(entity.getUuid()))
       {
           PhaseEntity oldOrderNumberPhaseEntity = phaseDAO.findByOrderNumber(entity.getOrder_number());
           PhaseEntity workingPhaseEntity = phaseDAO.findByUuid(entity.getUuid());
           oldOrderNumberPhaseEntity.setOrder_number(-1L);
           phaseDAO.createOrUpdate(oldOrderNumberPhaseEntity);
           phaseDAO.createOrUpdate(entity);
           oldOrderNumberPhaseEntity.setOrder_number(workingPhaseEntity.getOrder_number());
           phaseDAO.createOrUpdate(oldOrderNumberPhaseEntity);
           return;
       }
       else if(phaseDAO.findAllOrderNumbers().contains(entity.getOrder_number()))
       {
           PhaseEntity oldOrderNumberPhaseEntity = phaseDAO.findByOrderNumber(entity.getOrder_number());
           oldOrderNumberPhaseEntity.setOrder_number(phaseDAO.findMaxOrderNumber() + 1);
              phaseDAO.createOrUpdate(oldOrderNumberPhaseEntity);
              phaseDAO.createOrUpdate(entity);
              return;
       }
        phaseDAO.createOrUpdate(entity);
    }

    @Override
    public void deletePhase(UUID uuid)
    {
        phaseDAO.delete(uuid);
    }
    public List<Long> getNumbersExcept(List<Long> excludeList, Long min, Long max) {
        List<Long> numbers = new ArrayList<>();
        for (Long i = min; i <= max; i++) {
            if (!excludeList.contains(i)) {
                numbers.add(i);
            }
        }
        return numbers;
    }
}