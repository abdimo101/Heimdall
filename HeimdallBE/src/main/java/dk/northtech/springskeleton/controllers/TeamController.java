package dk.northtech.springskeleton.controllers;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import dk.northtech.springskeleton.controllers.dtos.TeamDTO;
import dk.northtech.springskeleton.controllers.dtos.TeamUserAssignDTO;
import dk.northtech.springskeleton.services.TeamService;
import dk.northtech.springskeleton.services.UserService;
import dk.northtech.springskeleton.translators.TeamTranslator;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@Path("/teams")
public class TeamController {

    private final TeamService teamService;
    private final UserService userService;

    @Autowired
    public TeamController(TeamService teamService, UserService userService) {
        this.teamService = teamService;
        this.userService = userService;
    }

    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateTeam(@Context HttpHeaders headers, TeamDTO dto) {
        // TODO: Replace header parsing with Spring Security
        String authHeader = headers.getHeaderString(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Response.status(Response.Status.UNAUTHORIZED).build(); // No token found or wrong format
        }
        String token = authHeader.substring("Bearer ".length());
        DecodedJWT decodedJWT = JWT.decode(token);
        String email = decodedJWT.getClaim("email").asString();
        dto.setOrganization_uuid(userService.getUserByEmail(email).getOrganization_uuid());

        teamService.createOrUpdateTeam(TeamTranslator.toEntity(dto));
        return Response.ok(dto).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllTeams() {
        return Response.ok(TeamTranslator.toDTOs(teamService.getAllTeams())).build();
    }

    @GET
    @Path("/organization/{uuid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllTeamsByOrganizationUuid(@PathParam("uuid") String uuid) {
        return Response.ok(TeamTranslator.toDTOs(teamService.getAllTeamsByOrganizationUuid(UUID.fromString(uuid)))).build();
    }

    @GET
    @Path("/{uuid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTeam(@PathParam("uuid") String uuid) {
        return Response.ok(TeamTranslator.toDTO(teamService.getTeam(UUID.fromString(uuid)))).build();
    }

    @DELETE
    @Path("/{uuid}")
    public Response deleteTeam(@PathParam("uuid") String uuid) {
        teamService.deleteTeam(UUID.fromString(uuid));
        return Response.noContent().build();
    }

    @GET
    @Path("/user")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTeamsByUser(@Context HttpHeaders headers) {
        // TODO: Replace this with Spring Security
        String authHeader = headers.getHeaderString(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Response.status(Response.Status.UNAUTHORIZED).build(); // No token found or wrong format
        }

        String token = authHeader.substring("Bearer ".length());

        DecodedJWT decodedJWT = JWT.decode(token);
        String email = decodedJWT.getClaim("email").asString();

        return Response.ok(TeamTranslator.toDTOs(teamService.getAllByUserEmail(email))).build();
    }
    @GET
    @Path("/details/{uuid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTeamDetailsByUuid(@PathParam("uuid") UUID uuid)
    {
        return Response.ok((teamService.getTeamDetails(uuid))).build();
    }
    @POST
    @Path("/assign-user")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response assignUserToTeam(TeamUserAssignDTO dto) {
        System.out.println(dto);
        teamService.assignUserToApplication(dto.getApplication_uuid(), dto.getTeam_uuid(), dto.getUser_id());
        return Response.ok().build();
    }

    @POST
    @Path("/add-member")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addMemberToTeam(TeamUserAssignDTO dto) {
        System.out.println(dto);
        teamService.addMemberToTeam(dto.getTeam_uuid(), dto.getUser_id());
        return Response.ok().build();
    }

    @DELETE
    @Path("/delete-member/{teamUuid}/{userId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteMemberFromTeam(@PathParam("teamUuid") UUID teamUuid, @PathParam("userId") Long userId) {
        teamService.removeMember(teamUuid, userId);
        return Response.noContent().build();
    }

}
