package dk.northtech.springskeleton.assets;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.ConstructorBinding;

@ConfigurationProperties("frontend-properties")
public class FrontendProperties {
    public final String dataUrl;

    public FrontendProperties(String dataUrl) {
        this.dataUrl = dataUrl;
    }
}