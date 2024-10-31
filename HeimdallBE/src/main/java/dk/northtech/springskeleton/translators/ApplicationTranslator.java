package dk.northtech.springskeleton.translators;

import dk.northtech.springskeleton.controllers.dtos.ApplicationDTO;
import dk.northtech.springskeleton.entities.ApplicationEntity;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public abstract class ApplicationTranslator {
    public static ApplicationDTO toDto(ApplicationEntity entity) {
        ApplicationDTO dto = new ApplicationDTO();
        dto.setUuid(entity.getUuid());
        dto.setOrganization_uuid(entity.getOrganization_uuid());
        dto.setApp_key(entity.getApp_key());
        dto.setName(entity.getName());
        dto.setVersion(entity.getVersion());
        dto.setPhase_uuid(entity.getPhase_uuid());
        dto.setNext_phase_uuid(entity.getNext_phase_uuid());
        dto.setPo(entity.getPo());
        dto.setPm(entity.getPm());
        dto.setDescription(entity.getDescription());
        if (entity.getTeams() == null) entity.setTeams(List.of());
        for (UUID team : entity.getTeams()) {
            dto.getTeams().add(team);
        }
        if (entity.getTasks() == null) entity.setTasks(List.of());
        for (UUID task : entity.getTasks()) {
            dto.getTasks().add(task);
        }
        if (entity.getDocuments() == null) entity.setDocuments(List.of());
        for (UUID document : entity.getDocuments()) {
            dto.getDocuments().add(document);
        }
        return dto;
    }

    public static ApplicationEntity toEntity(ApplicationDTO dto) {
        ApplicationEntity entity = new ApplicationEntity();
        entity.setUuid(dto.getUuid());
        entity.setOrganization_uuid(dto.getOrganization_uuid());
        entity.setApp_key(dto.getApp_key());
        entity.setName(dto.getName());
        entity.setVersion(dto.getVersion());
        entity.setPhase_uuid(dto.getPhase_uuid());
        entity.setNext_phase_uuid(dto.getNext_phase_uuid());
        entity.setPo(dto.getPo());
        entity.setPm(dto.getPm());
        entity.setDescription(dto.getDescription());
        if (dto.getTeams() == null) dto.setTeams(List.of());
        for (UUID team : dto.getTeams()) {
            entity.getTeams().add(team);
        }
        if (dto.getTasks() == null) dto.setTasks(List.of());
        for (UUID task : dto.getTasks()) {
            entity.getTasks().add(task);
        }
        if (dto.getDocuments() == null) dto.setDocuments(List.of());
        for (UUID document : dto.getDocuments()) {
            entity.getDocuments().add(document);
        }
        return entity;
    }

    public static List<ApplicationDTO> toDTOs(List<ApplicationEntity> entities) {
        return entities.stream().map(ApplicationTranslator::toDto).collect(Collectors.toList());
    }

    public static List<ApplicationEntity> toEntities(List<ApplicationDTO> dtos) {
        return dtos.stream().map(ApplicationTranslator::toEntity).collect(Collectors.toList());
    }
}
