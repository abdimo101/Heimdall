package dk.northtech.springskeleton.repositories;

import dk.northtech.springskeleton.entities.SettingEntity;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
@RegisterBeanMapper(SettingEntity.class)
public interface SettingDAO {

    @SqlUpdate("INSERT INTO setting (organization_uuid, default_interval) VALUES (:organization_uuid, :default_interval) " +
            "ON CONFLICT (organization_uuid) DO UPDATE SET default_interval = EXCLUDED.default_interval")
    void createOrUpdate(@BindBean SettingEntity setting);

    @SqlQuery("SELECT * FROM setting WHERE organization_uuid = :organizationUuid")
    SettingEntity findById(@Bind("organizationUuid") UUID organizationUuid);
}