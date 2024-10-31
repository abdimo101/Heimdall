package dk.northtech.springskeleton.services;

import dk.northtech.springskeleton.controllers.dtos.UserDetailsDTO.UserDetailsDTO;
import dk.northtech.springskeleton.entities.UserEntity;

import java.util.List;
import java.util.UUID;

public interface UserService
{
    List<UserEntity> getAllUsers();

    UserEntity getUserByEmail(String email);

    boolean verifyUser(String email, String name);

    boolean checkValidUser(String email);

    void createOrUpdate(UserEntity userEntity);

    UserDetailsDTO getUserDetailsById(Long id);

    List<UserEntity> search(String query);

    UserEntity getUserById(Long id);

    UserEntity getCurrentUser();

    UUID getCurrentUserOrganizationUuid();
}
