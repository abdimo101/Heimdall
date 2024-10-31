package dk.northtech.springskeleton.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties("csp")
public class CspConfiguration {
    private String contentSecurityPolicy;
    private boolean reportOnly;

    public String getContentSecurityPolicy() {
        return contentSecurityPolicy;
    }

    public void setContentSecurityPolicy(String contentSecurityPolicy) {
        this.contentSecurityPolicy = contentSecurityPolicy;
    }

    public boolean isReportOnly() {
        return reportOnly;
    }

    public void setReportOnly(boolean reportOnly) {
        this.reportOnly = reportOnly;
    }
}