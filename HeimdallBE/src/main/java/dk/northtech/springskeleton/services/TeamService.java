package dk.northtech.springskeleton.services;

import dk.northtech.springskeleton.controllers.dtos.teamdtos.TeamDetailsDTO;
import dk.northtech.springskeleton.entities.TeamEntity;

import java.util.List;
import java.util.UUID;

public interface TeamService {

    boolean existsByUuid(UUID uuid);

    void createOrUpdateTeam(TeamEntity team);

    List<TeamEntity> getAllTeamsByOrganizationUuid(UUID uuid);

    TeamEntity getTeam(UUID uuid);

    void deleteTeam(UUID uuid);

    void addSPOC(UUID teamUuid, Long userId);

    void removeSPOC(UUID teamUuid);

    void addMember(UUID teamUuid, Long userId);

    void removeMember(UUID teamUuid, Long userId);

    void addTask(UUID teamUuid, UUID taskUuid);

    void removeTask(UUID teamUuid, UUID taskUuid);

    List<TeamEntity> getAllByUserId(Long userId);

    List<TeamEntity> getAllByUserEmail(String email);

    TeamDetailsDTO getTeamDetails(UUID uuid);
    void assignUserToApplication(UUID applicationUuid, UUID teamUuid, Long userId);

    List<TeamEntity> findTeamsToApprove(UUID applicationUuid, UUID phase, UUID documentUuid);

    List<TeamEntity> getAllTeams();

    void addMemberToTeam(UUID teamUuid, Long userId);
}
