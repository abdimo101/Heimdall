package dk.northtech.springskeleton.repositories;

import dk.northtech.springskeleton.controllers.dtos.UserDetailsDTO.UserDetailsDTO;
import dk.northtech.springskeleton.controllers.dtos.UserDetailsDTO.UserDetailsTeamDTO;
import dk.northtech.springskeleton.entities.UserEntity;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
@RegisterBeanMapper(UserEntity.class)
public interface UserDAO {
    @SqlQuery("SELECT * FROM users WHERE email = :email")
    UserEntity findByEmail(@Bind String email);


    @SqlQuery("SELECT * FROM users")
    List<UserEntity> findAll();


    @SqlUpdate("INSERT INTO users (organization_uuid, email, name) VALUES (:organization_uuid, :email, :name)")
    void create(@BindBean UserEntity user);


    @SqlUpdate("INSERT INTO user_teams (user_id, team_uuid) VALUES (:user_id, :team_uuid)")
    void addToTeam(@Bind("user_id") Long userId, @Bind("team_uuid") UUID teamUuid);


    @SqlUpdate("UPDATE users SET organization_uuid = :organization_uuid, email = :email, name = :name WHERE id = :id")
    void update(@BindBean UserEntity user);


    @SqlQuery("SELECT EXISTS(SELECT 1 FROM users WHERE id = :id)")
    boolean exists(@Bind("id") Long id);


    @SqlQuery("SELECT EXISTS(SELECT 1 FROM user_teams WHERE user_id = :user_id AND team_uuid = :team_uuid)")
    boolean isOnTeam(@Bind("user_id") Long userId, @Bind("team_uuid") UUID teamUuid);


    @SqlQuery("SELECT t.uuid, t.name, t.type, t.description " +
            "FROM team t " +
            "JOIN user_teams ut ON t.uuid = ut.team_uuid " +
            "WHERE ut.user_id = :userId")
    @RegisterBeanMapper(UserDetailsTeamDTO.class)
    List<UserDetailsTeamDTO> getTeamsByUserId(@Bind("userId") Long userId);


    @SqlQuery("SELECT u.id, u.organization_uuid, u.email, u.name " +
            "FROM users u " +
            "WHERE u.id = :id")
    @RegisterBeanMapper(UserDetailsDTO.class)
    UserDetailsDTO getUserDetailsById(@Bind("id") Long id);


    @SqlQuery("SELECT * FROM (" +
            "    SELECT *, GREATEST(similarity(name, :query), similarity(email, :query)) AS max_similarity " +
            "    FROM users WHERE similarity(name, :query) > 0.05 OR similarity(email, :query) > 0.05" +
            ") subquery ORDER BY max_similarity DESC LIMIT 10")
    List<UserEntity> search(@Bind("query") String query);


    @SqlQuery("SELECT * FROM users WHERE id= :id")
    UserEntity findById(@Bind Long id);
}
