package dk.northtech.springskeleton.translators;

import dk.northtech.springskeleton.controllers.dtos.TeamDTO;
import dk.northtech.springskeleton.entities.TeamEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public abstract class TeamTranslator {
    public static TeamDTO toDTO(TeamEntity entity) {
        TeamDTO dto = new TeamDTO();
        dto.setUuid(entity.getUuid());
        dto.setOrganization_uuid(entity.getOrganization_uuid());
        dto.setName(entity.getName());
        dto.setType(entity.getType());
        dto.setDescription(entity.getDescription());
        dto.setSpoc(entity.getSpoc());
        List<UUID> applications = new ArrayList<>(entity.getApplications());
        dto.setApplications(applications);
        List<UUID> tasks = new ArrayList<>(entity.getTasks());
        dto.setTasks(tasks);
        List<Long> members = new ArrayList<>(entity.getMembers());
        dto.setMembers(members);
        return dto;
    }

    public static TeamEntity toEntity(TeamDTO dto) {
        TeamEntity entity = new TeamEntity();
        entity.setUuid(dto.getUuid());
        entity.setOrganization_uuid(dto.getOrganization_uuid());
        entity.setName(dto.getName());
        entity.setType(dto.getType());
        entity.setDescription(dto.getDescription());
        entity.setSpoc(dto.getSpoc());
        if (dto.getMembers() == null) dto.setMembers(List.of());
        for (Long member : dto.getMembers()) {
            entity.getMembers().add(member);
        }
        if (dto.getApplications() == null) dto.setApplications(List.of());
        for (UUID application : dto.getApplications()) {
            entity.getApplications().add(application);
        }
        if (dto.getTasks() == null) dto.setTasks(List.of());
        for (UUID task : dto.getTasks()) {
            entity.getTasks().add(task);
        }
        return entity;
    }

    public static List<TeamDTO> toDTOs(List<TeamEntity> entities) {
        return entities.stream().map(TeamTranslator::toDTO).collect(Collectors.toList());
    }

    public static List<TeamEntity> toEntities(List<TeamDTO> dtos) {
        return dtos.stream().map(TeamTranslator::toEntity).collect(Collectors.toList());
    }
}
