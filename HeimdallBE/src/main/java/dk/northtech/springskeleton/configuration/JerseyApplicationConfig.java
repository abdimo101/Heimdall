package dk.northtech.springskeleton.configuration;

import dk.northtech.springskeleton.controllers.*;
import jakarta.ws.rs.ApplicationPath;
import org.glassfish.jersey.server.ResourceConfig;
import org.springframework.stereotype.Component;

@Component
// Application path determines the root path all JAX-RS endpoints appear under.
// We deliberately do not lay claim to / (the server root), leaving room for other parts of the application to have
// their own paths. (Notably, static HTML to serve an SPA).
@ApplicationPath("/api")
public class JerseyApplicationConfig extends ResourceConfig {
    public JerseyApplicationConfig() {
        // Activate the designated JaxRs classes with API endpoints
        // (You need to register them explicitly, individually. Package scanning does not work in a packaged jar).
        register(TaskController.class);
        register(ResponseStatusExceptionMapper.class);
        register(OrganizationController.class);
        register(ApplicationController.class);
        register(DocumentController.class);
        register(ApprovalController.class);
        register(ArtifactController.class);
        register(TeamController.class);
        register(UserController.class);
        register(RequirementController.class);
        register(NotificationController.class);
        register(DocumentTypeController.class);
        register(PhaseController.class);
        register(SettingTTLController.class);
        register(SettingController.class);
        property("jersey.config.server.wadl.disableWadl", true);
    }
}