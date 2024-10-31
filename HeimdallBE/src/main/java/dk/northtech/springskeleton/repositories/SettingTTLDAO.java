package dk.northtech.springskeleton.repositories;

import dk.northtech.springskeleton.configuration.PGIntervalArgumentFactory;
import dk.northtech.springskeleton.controllers.dtos.SettingTTLDTO.SettingTTLDTO;
import dk.northtech.springskeleton.controllers.dtos.SettingTTLDTO.TTLDisplayDTO;
import dk.northtech.springskeleton.entities.SettingTTLEntity;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.postgresql.util.PGInterval;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
@RegisterBeanMapper(SettingTTLEntity.class)
public interface SettingTTLDAO {

    @SqlQuery("SELECT st.*, dt.name as document_type_name FROM setting_ttl as st " +
            "JOIN document_type dt on st.document_type_uuid = dt.uuid " +
    "WHERE st.organization_uuid = :uuid")
    @RegisterBeanMapper(SettingTTLDTO.class)
    List<SettingTTLDTO> findAllByOrganizationUuid(@Bind("uuid") UUID uuid );

    @SqlUpdate("INSERT INTO setting_ttl (uuid, interval, organization_uuid, document_type_uuid) " +
            "VALUES (:uuid, :interval, :organization_uuid, :document_type_uuid::UUID) " +
            "ON CONFLICT (uuid) DO UPDATE SET " +
            "    interval = EXCLUDED.interval, " +
            "    organization_uuid = EXCLUDED.organization_uuid, " +
            "    document_type_uuid = EXCLUDED.document_type_uuid::UUID")
    void createOrUpdate(@BindBean SettingTTLEntity settingTTL);

    @SqlQuery("WITH latest_approvals AS (" +
            "    SELECT aa.operation_timestamp + COALESCE(st.interval, s.default_interval) as ttl, " +
            "           ROW_NUMBER() OVER (PARTITION BY aa.team_uuid ORDER BY aa.operation_timestamp DESC) as rn " +
            "    FROM audit.approval aa " +
            "             JOIN approval_documents ad ON aa.uuid = ad.approval_uuid " +
            "             JOIN document d on ad.document_uuid = d.uuid " +
            "             JOIN document_type dt on d.document_type_uuid = dt.uuid " +
            "             LEFT JOIN setting_ttl st on dt.uuid = st.document_type_uuid " +
            "             LEFT JOIN setting s on dt.organization_uuid = s.organization_uuid " +
            "    WHERE aa.status = 'approved' " +
            "      AND ad.document_uuid = :documentUuid::UUID " +
            ") " +
            "SELECT ttl " +
            "FROM latest_approvals " +
            "WHERE rn = 1 " +
            "ORDER BY ttl ASC " +
            "LIMIT 1;")
    @RegisterBeanMapper(TTLDisplayDTO.class)
    TTLDisplayDTO displayTTL(@Bind("documentUuid") UUID documentUuid);

    @SqlUpdate("DELETE FROM setting_ttl WHERE uuid = :uuid")
    void delete(@Bind("uuid") UUID uuid);

    static void registerArgumentFactories(org.jdbi.v3.core.Jdbi jdbi) {
        jdbi.registerArgument(new PGIntervalArgumentFactory());
    }

}
