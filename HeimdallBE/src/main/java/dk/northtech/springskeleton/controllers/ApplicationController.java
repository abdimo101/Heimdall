package dk.northtech.springskeleton.controllers;

import dk.northtech.springskeleton.controllers.dtos.ApplicationDTO;
import dk.northtech.springskeleton.services.ApplicationService;
import dk.northtech.springskeleton.translators.ApplicationTranslator;
import dk.northtech.springskeleton.translators.DocumentTranslator;
import dk.northtech.springskeleton.translators.TeamTranslator;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@Path("/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    @Autowired
    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateApplication(ApplicationDTO dto) {
        applicationService.createOrUpdateApplication(ApplicationTranslator.toEntity(dto));
        return Response.ok(dto).build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllApplications() {
        return Response.ok(ApplicationTranslator.toDTOs(applicationService.getAllApplications())).build();
    }

    @GET
    @Path("/userdetails")
    @Produces(MediaType.APPLICATION_JSON)
    public Response findAllApplicationsWithUserDetails() {
        return Response.ok(applicationService.findAllApplicationsWithUserDetails()).build();
    }
    @GET
    @Path("/{uuid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getApplication(@PathParam("uuid") String uuid) {
        return Response.ok(ApplicationTranslator.toDto(applicationService.getApplication(UUID.fromString(uuid)))).build();
    }


    @DELETE
    @Path("/{uuid}")
    public Response deleteApplication(@PathParam("uuid") String uuid) {
        applicationService.deleteApplication(UUID.fromString(uuid));
        return Response.noContent().build();
    }

    @GET
    @Path("/details/{uuid}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getApprovalDetailsByUuid(@PathParam("uuid") UUID uuid)
    {
        return Response.ok((applicationService.getApplicationDetails(uuid))).build();
    }
    @GET
    @Path("/{uuid}/documents/{type}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getDocumentByApplicationAndType(@PathParam("uuid") UUID uuid, @PathParam("type") String type)
    {
        return Response.ok(DocumentTranslator.toDto(applicationService.getDocumentByApplicationAndType(uuid, type))).build();
    }

    @PUT
    @Path("/{uuid}/phase/{phase}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response changePhase(@PathParam("uuid") UUID uuid, @PathParam("phase") UUID phase) {
        applicationService.changePhase(uuid, phase);
        return Response.ok().build();
    }

    @GET
    @Path("/{application_uuid}/teams")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getApplicationDetailsTeamDTO(@PathParam("application_uuid") UUID application_uuid)
    {
        return Response.ok(TeamTranslator.toDTOs(applicationService.getTeams(application_uuid))).build();
    }

    @GET
    @Path("/test")
    @Produces(MediaType.APPLICATION_JSON)
    public Response test() {
        applicationService.getApplicationDetails(UUID.fromString("987e4567-e89b-12d3-a456-426614174010"));
        return Response.ok("Test").build();
    }

    @GET
    @Path("/{uuid}/history")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAppAuditInfo(@PathParam("uuid") UUID uuid) {
        return Response.ok(applicationService.getAppAuditInfo(uuid)).build();
    }

}
