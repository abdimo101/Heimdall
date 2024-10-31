package dk.northtech.springskeleton.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;

// The string here indicates the path in the application.properties file
@ConfigurationProperties("hello-api")
public record HelloApiConfiguration(String greetingsText) {
}