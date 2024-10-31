package dk.northtech.springskeleton.controllers;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import dk.northtech.springskeleton.services.NotificationService;
import dk.northtech.springskeleton.translators.NotificationTranslator;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@Path("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GET
    @Path("/user")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getNotificationsByUser(@Context HttpHeaders headers) {
        String authHeader = headers.getHeaderString(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Response.status(Response.Status.UNAUTHORIZED).build(); // No token found or wrong format
        }

        String token = authHeader.substring("Bearer ".length());

        DecodedJWT decodedJWT = JWT.decode(token);
        String email = decodedJWT.getClaim("email").asString();

        return Response.ok(NotificationTranslator.toDTOs(notificationService.getNotificationByUser(email))).build();
    }

    @GET
    @Path("/user/{notificationUuid}")
    public Response notificationHasBeenSeen(@Context HttpHeaders headers, @PathParam("notificationUuid") UUID notificationUuid) {
        String authHeader = headers.getHeaderString(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Response.status(Response.Status.UNAUTHORIZED).build(); // No token found or wrong format
        }

        String token = authHeader.substring("Bearer ".length());

        DecodedJWT decodedJWT = JWT.decode(token);
        String email = decodedJWT.getClaim("email").asString();

        notificationService.notificationHasBeenSeen(email, notificationUuid);

        return Response.ok().build();
    }
}
