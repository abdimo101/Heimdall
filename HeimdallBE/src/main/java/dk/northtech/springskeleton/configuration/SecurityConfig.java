package dk.northtech.springskeleton.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import jakarta.inject.Inject;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;


@Configuration
@EnableWebSecurity
@EnableConfigurationProperties(CspConfiguration.class)
public class SecurityConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String issuerUri;

    @Value("${keycloak.internal-issuer-uri}")
    private String internalIssuerUri;

    private final CspConfiguration cspConfiguration;

    @Inject
    public SecurityConfig(CspConfiguration cspConfiguration) {
        this.cspConfiguration = cspConfiguration;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(corsConfigurer -> {
                    var source = new UrlBasedCorsConfigurationSource();
                    source.registerCorsConfiguration("/**", corsConfiguration());
                    corsConfigurer.configurationSource(source);
                })
                .authorizeRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/actuator/**").permitAll()  // Allow access to Actuator endpoints
                                .anyRequest().authenticated()  // All requests need to be authenticated
                )
                .oauth2ResourceServer(oauth2ResourceServer ->
                        oauth2ResourceServer.jwt(jwt ->
                                jwt.decoder(jwtDecoder())  // Configure custom JWT decoder
                        )
                );

        if (this.cspConfiguration.getContentSecurityPolicy() != null && !this.cspConfiguration.getContentSecurityPolicy().isBlank()) {
            http.headers(headersConfigurer -> headersConfigurer.contentSecurityPolicy(
                    cspConfig -> {
                        cspConfig.policyDirectives(this.cspConfiguration.getContentSecurityPolicy());
                        if (this.cspConfiguration.isReportOnly()) cspConfig.reportOnly();
                    }
            ));
        }

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        NimbusJwtDecoder jwtDecoder = (NimbusJwtDecoder) JwtDecoders.fromIssuerLocation(internalIssuerUri);
        jwtDecoder.setJwtValidator(JwtValidators.createDefaultWithIssuer(issuerUri));
        return jwtDecoder;
    }

    @Bean
    @ConfigurationProperties("cors")
    public CorsConfiguration corsConfiguration() {
        CorsConfiguration configuration = new CorsConfiguration();
        // TODO: Properly configure allowed origins, methods, and headers
        configuration.addAllowedOrigin("*");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        return configuration;
    }
}