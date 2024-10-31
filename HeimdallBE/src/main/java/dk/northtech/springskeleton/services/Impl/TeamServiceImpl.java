package dk.northtech.springskeleton.services.Impl;

import dk.northtech.springskeleton.controllers.dtos.teamdtos.TeamDetailsDTO;
import dk.northtech.springskeleton.entities.ApplicationEntity;
import dk.northtech.springskeleton.entities.RequirementEntity;
import dk.northtech.springskeleton.entities.DocumentEntity;
import dk.northtech.springskeleton.entities.TeamEntity;
import dk.northtech.springskeleton.repositories.ApplicationDAO;
import dk.northtech.springskeleton.repositories.TeamDAO;
import dk.northtech.springskeleton.repositories.UserDAO;
import dk.northtech.springskeleton.services.RequirementService;
import dk.northtech.springskeleton.services.DocumentService;
import dk.northtech.springskeleton.services.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TeamServiceImpl implements TeamService {

    private final TeamDAO teamDao;
    private final ApplicationDAO applicationDao;
    private final UserDAO userDAO;
    private final RequirementService requirementService;
    private DocumentService documentService;

    @Autowired
    public TeamServiceImpl(TeamDAO teamDao, ApplicationDAO applicationDao, UserDAO userDAO, RequirementService requirementService, @Lazy DocumentService documentService) {
        this.teamDao = teamDao;
        this.applicationDao = applicationDao;
        this.userDAO = userDAO;
        this.requirementService = requirementService;
        this.documentService = documentService;
    }

    public boolean existsByUuid(UUID uuid) {
        return teamDao.existsByUuid(uuid);
    }

    @Transactional
    public void createOrUpdateTeam(TeamEntity team) {
        if (existsByUuid(team.getUuid())) {
            updateTeam(team);
        } else {
            createTeam(team);
            List<ApplicationEntity> applications = applicationDao.findAll();
            for (ApplicationEntity application : applications) {
                if(!application.getTeams().contains(team.getUuid())) {
                    applicationDao.addTeam(application.getUuid(), team.getUuid(), null);
                }
            }
        }
    }

    @Transactional
    protected void createTeam(TeamEntity team) {
        // TODO: Optimize this using batch insert
        teamDao.create(team);
        for (Long memberId : team.getMembers()) {
            teamDao.addMember(team.getUuid(), memberId);
        }
        for (UUID application : team.getApplications()) {
            applicationDao.addTeam(application, team.getUuid(), null);
        }
        for (UUID task : team.getTasks()) {
            teamDao.addTask(team.getUuid(), task);
        }
    }

    @Transactional
    protected void updateTeam(TeamEntity team) {
        teamDao.update(team);
    }

    public List<TeamEntity> getAllTeamsByOrganizationUuid(UUID uuid) {
        return teamDao.findAllByOrganizationUuid(uuid);
    }

    public TeamEntity getTeam(UUID uuid) {
        TeamEntity team = teamDao.findByUuid(uuid);
        if (team == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found");
        }
        return team;
    }

    @Transactional
    public void deleteTeam(UUID uuid) {
        teamDao.deleteByUuid(uuid);
    }

    @Transactional
    public void addSPOC(UUID teamUuid, Long spocId) {
        teamDao.addSPOC(teamUuid, spocId);
    }

    @Transactional
    public void removeSPOC(UUID teamUuid) {
        teamDao.removeSPOC(teamUuid);
    }

    @Transactional
    public void addMember(UUID teamUuid, Long userId) {
        teamDao.addMember(teamUuid, userId);
    }

    @Transactional
    public void removeMember(UUID teamUuid, Long userId) {
        teamDao.removeMember(teamUuid, userId);
    }

    @Transactional
    public void addTask(UUID teamUuid, UUID taskUuid) {
        teamDao.addTask(teamUuid, taskUuid);
    }

    @Transactional
    public void removeTask(UUID teamUuid, UUID taskUuid) {
        teamDao.removeTask(teamUuid, taskUuid);
    }

    public List<TeamEntity> getAllByUserId(Long userId) {
        return teamDao.findAllByUser(userId);
    }

    @Transactional
    public List<TeamEntity> getAllByUserEmail(String email) {
        return this.getAllByUserId(userDAO.findByEmail(email).getId());
    }

    @Override
    public TeamDetailsDTO getTeamDetails(UUID uuid) {
        TeamDetailsDTO teamDetailsDTO = teamDao.findTeamDetails(uuid);
        teamDetailsDTO.setTasks(teamDao.getTeamDetailsTaskDTOs(uuid));
        teamDetailsDTO.setUsers(teamDao.getTeamDetailsUserDTOs(uuid));
        teamDetailsDTO.setApplications(teamDao.getTeamDetailsApplicationDTOs(uuid));
        return teamDetailsDTO;
    }

    @Transactional
    public void assignUserToApplication(UUID applicationUuid, UUID teamUuid, Long userId) {
        applicationDao.assignUserToApplication(applicationUuid, teamUuid, userId);

    }

    @Override
    public List<TeamEntity> findTeamsToApprove(UUID applicationUuid, UUID phase, UUID documentUuid) {
        List<TeamEntity> applicationTeams = applicationDao.getTeams(applicationUuid);
        List<UUID> teamUuids = applicationTeams.stream().map(TeamEntity::getUuid).toList();
        List<RequirementEntity> requirements = requirementService.findByTeamUuidsAndPhase(teamUuids, phase);
        DocumentEntity document = documentService.findByUuid(documentUuid);
        List<TeamEntity> teamsToApprove = new ArrayList<>();
        //TODO: NEEDS MAJOR LOOKOVER
        /*
        for (RequirementEntity requirement : requirements) {
            if (requirement.getDocument_type().equalsIgnoreCase(document.getType())) {
                applicationTeams.stream()
                        .filter(team -> team.getUuid().equals(requirement.getTeam_uuid()))
                        .findFirst()
                        .ifPresent(teamsToApprove::add);
            }
        }
        */
        return teamsToApprove;
    }

    @Override
    public List<TeamEntity> getAllTeams() {
        return teamDao.findAll();
    }

    @Override
    public void addMemberToTeam(UUID teamUuid, Long userId) {
        teamDao.addMember(teamUuid, userId);
    }
}
