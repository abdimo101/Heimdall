package dk.northtech.springskeleton.configuration;

import dk.northtech.springskeleton.repositories.*;
import org.jdbi.v3.core.Jdbi;
import org.jdbi.v3.sqlobject.SqlObjectPlugin;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class JdbiConfig {
    @Bean
    public Jdbi jdbi(DataSource dataSource) {
        Jdbi jdbi = Jdbi.create(dataSource);
        jdbi.installPlugin(new SqlObjectPlugin());
        SettingTTLDAO.registerArgumentFactories(jdbi);
        return jdbi;
    }

    @Bean
    public OrganizationDAO organizationDao(Jdbi jdbi) {
        return jdbi.onDemand(OrganizationDAO.class);
    }

    @Bean
    public ApplicationDAO applicationDao(Jdbi jdbi) {
        return jdbi.onDemand(ApplicationDAO.class);
    }

    @Bean
    public DocumentDAO documentDAO(Jdbi jdbi) {
        return jdbi.onDemand(DocumentDAO.class);
    }

    @Bean
    public ApprovalDAO approvalDAO(Jdbi jdbi) {
        return jdbi.onDemand(ApprovalDAO.class);
    }

    @Bean
    public TeamDAO teamDAO(Jdbi jdbi) { 
        return jdbi.onDemand(TeamDAO.class); 
    }

    @Bean
    public UserDAO userDAO(Jdbi jdbi) {
        return jdbi.onDemand(UserDAO.class);
    }
  
    @Bean
    public TaskDao taskDao(Jdbi jdbi) {
        return jdbi.onDemand(TaskDao.class);
    }

    @Bean
    public ArtifactDAO artifactDAO(Jdbi jdbi) {
        return jdbi.onDemand(ArtifactDAO.class);
    }

    @Bean
    public RequirementDAO requirementDAO(Jdbi jdbi) {
        return jdbi.onDemand(RequirementDAO.class);
    }

    @Bean
    public NotificationDAO notificationDAO(Jdbi jdbi) {
        return jdbi.onDemand(NotificationDAO.class);
    }
    @Bean
    public PhaseDAO phaseDAO(Jdbi jdbi) {
        return jdbi.onDemand(PhaseDAO.class);
    }

    @Bean
    public DocumentTypeDAO documentTypeDAO(Jdbi jdbi) {
        return jdbi.onDemand(DocumentTypeDAO.class);
    }

    @Bean
    public SettingTTLDAO settingTTLDAO(Jdbi jdbi) {
        return jdbi.onDemand(SettingTTLDAO.class);
    }
    @Bean
    public SettingDAO settingDAO(Jdbi jdbi) {
        return jdbi.onDemand(SettingDAO.class);
    }

}