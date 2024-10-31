package dk.northtech.springskeleton.services.Impl;

import dk.northtech.springskeleton.controllers.dtos.UserDetailsDTO.UserDetailsDTO;
import dk.northtech.springskeleton.entities.UserEntity;
import dk.northtech.springskeleton.services.UserService;
import dk.northtech.springskeleton.repositories.UserDAO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private final UserDAO userDAO;

    @Autowired
    public UserServiceImpl(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    @Override
    public List<UserEntity> getAllUsers() {
        return userDAO.findAll();
    }

    @Override
    public UserEntity getUserByEmail(String email) {
        return userDAO.findByEmail(email);
    }

    @Transactional
    @Override
    public boolean verifyUser(String email, String name) {
        boolean userCreated = false;
        UserEntity user = getUserByEmail(email);
        if (user == null) {
            user = new UserEntity();
            user.setEmail(email);
            user.setName(name);
            //TODO: Implement organization
            user.setOrganization_uuid(UUID.fromString("ace2e137-d6e7-4476-9bc4-5c7a23c17ddd"));
            createOrUpdate(user);
            userCreated = true;
        }
        return userCreated;
    }

    @Override
    public boolean checkValidUser(String email) {
        boolean exists = false;
        UserEntity user = getUserByEmail(email);
        if (user != null) {
            exists = true;
        }
        return exists;
    }

    @Transactional
    @Override
    public void createOrUpdate(UserEntity userEntity) {
        // TODO: Optimize this
        if (userEntity.getId() == null || !userDAO.exists(userEntity.getId())) {
            userDAO.create(userEntity);
        } else {
            userDAO.update(userEntity);
        }
        if (userEntity.getTeam_uuids() == null) return;
        for (UUID teamUuid : userEntity.getTeam_uuids()) {
            if (!userDAO.isOnTeam(userEntity.getId(), teamUuid)) {
                userDAO.addToTeam(userEntity.getId(), teamUuid);
            }
        }
    }

    @Override
    public UserDetailsDTO getUserDetailsById(Long id) {
        UserDetailsDTO userDetailsDTO = userDAO.getUserDetailsById(id);
        userDetailsDTO.setTeams(userDAO.getTeamsByUserId(id));
        return userDetailsDTO;
    }

    public List<UserEntity> search(String query) {
        return userDAO.search(query);
    }

    @Override
    public UserEntity getUserById(Long id) {
        return userDAO.findById(id);
    }

    @Override
    public UserEntity getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new InsufficientAuthenticationException("User is not authenticated");
        }
        Object principal = authentication.getPrincipal();
        UserEntity user = null;
        if (principal instanceof org.springframework.security.oauth2.jwt.Jwt jwt) {
            String userEmail = jwt.getClaimAsString("email");
            user = getUserByEmail(userEmail);
        }
        if (user == null) {
            throw new InsufficientAuthenticationException("User not found");
        }
        return user;
    }

    @Override
    public UUID getCurrentUserOrganizationUuid() {
        return getCurrentUser().getOrganization_uuid();
    }
}
