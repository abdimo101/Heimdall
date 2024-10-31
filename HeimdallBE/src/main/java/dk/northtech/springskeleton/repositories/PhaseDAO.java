package dk.northtech.springskeleton.repositories;

import dk.northtech.springskeleton.entities.PhaseEntity;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.customizer.BindBeanList;
import org.jdbi.v3.sqlobject.statement.SqlBatch;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;
@Repository
@RegisterBeanMapper(PhaseEntity.class)
public interface PhaseDAO {

    @SqlQuery("SELECT * FROM phase")

    List<PhaseEntity> findAll();

    @SqlQuery("SELECT * FROM phase WHERE uuid = :uuid")
    PhaseEntity findByUuid(@Bind("uuid") UUID uuid);

    @SqlUpdate("INSERT INTO phase (uuid, organization_uuid, name, order_number) VALUES (:uuid, :organization_uuid, :name, :order_number)")
    void insert(@BindBean PhaseEntity phase);

    @SqlUpdate("UPDATE phase SET organization_uuid = :organization_uuid, name = :name,  order_number = :order_number WHERE uuid = :uuid")
    void update(@BindBean PhaseEntity phase);

    @SqlUpdate("DELETE FROM phase WHERE uuid = :uuid")
    void delete(@Bind("uuid") UUID uuid);

    @SqlQuery("SELECT EXISTS (SELECT 1 FROM phase WHERE uuid = :uuid)")
    boolean existsByUuid(UUID uuid);

    @SqlUpdate("INSERT INTO phase (uuid, organization_uuid, name, order_number) VALUES (:uuid, :organization_uuid, :name, :order_number) " +
            "ON CONFLICT (uuid) DO UPDATE SET organization_uuid = EXCLUDED.organization_uuid, name = EXCLUDED.name, order_number = EXCLUDED.order_number")
    void createOrUpdate(@BindBean PhaseEntity phase);

    @SqlQuery("SELECT MAX(order_number) FROM phase")
    Long findMaxOrderNumber();
    @SqlQuery("SELECT order_number FROM phase")
    List<Long> findAllOrderNumbers();

    @SqlQuery("SELECT * FROM phase WHERE order_number = :order_number")
    PhaseEntity findByOrderNumber(@Bind("order_number") Long orderNumber);

    @SqlBatch("UPDATE phase SET organization_uuid = :organization_uuid, name = :name, order_number = :order_number WHERE uuid = :uuid")
    void updatePhases(@BindBeanList(propertyNames = {"uuid", "organization_uuid", "name", "order_number"}) List<PhaseEntity> phases);


}