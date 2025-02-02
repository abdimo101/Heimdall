package dk.northtech.springskeleton.configuration;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import javax.sql.DataSource;

@Configuration
public class DataSources {
    @Bean
    public DataSource dataSource(HikariConfig hikariConfig) {
        return new HikariDataSource(hikariConfig);
    }

    // Using an explicit bean to carry the configuration allows the tooling to recognize the Hikari-specific property
    // names and, say, offer them as autocompletion in the property file.
    // Just returning a "new SomeObject()" here may look strange, but Spring will automatically use the setter methods
    // in the object to fill out the parameters with values from the configuration file.
    @Bean
    @ConfigurationProperties("datasource")
    public HikariConfig hikariConfig() {
        return new HikariConfig();
    }
}