package dk.northtech.springskeleton.repositories;

import dk.northtech.springskeleton.entities.OrganizationEntity;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
@RegisterBeanMapper(OrganizationEntity.class)
public interface OrganizationDAO {

    // CRUD operations
    @SqlUpdate("INSERT INTO organization (uuid, name) " +
                "VALUES (:uuid, :name)" +
                "ON CONFLICT (uuid)" +
                "DO UPDATE SET name = :name")
    void createOrUpdate(@BindBean OrganizationEntity organization);

    @SqlQuery("SELECT * FROM organization WHERE uuid = :uuid")
    OrganizationEntity findByUuid(@Bind("uuid") UUID uuid);

    @SqlUpdate("DELETE FROM organization WHERE uuid = :uuid")
    void deleteByUuid(@Bind("uuid") UUID uuid);

    @SqlQuery("SELECT * FROM organization")
    List<OrganizationEntity> findAll();
}