package dk.northtech.springskeleton.configuration;

import dk.northtech.springskeleton.jdbi.JwtEmailFilter;
import org.jdbi.v3.core.Jdbi;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JdbiFilterConfig {
    private final Jdbi jdbi;

    public JdbiFilterConfig(Jdbi jdbi) {
        this.jdbi = jdbi;
    }

    @Bean
    public FilterRegistrationBean<JwtEmailFilter> jwtEmailFilter() {
        FilterRegistrationBean<JwtEmailFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new JwtEmailFilter(jdbi));
        registrationBean.addUrlPatterns("/*"); // Activate for all routes
        return registrationBean;
    }
}
