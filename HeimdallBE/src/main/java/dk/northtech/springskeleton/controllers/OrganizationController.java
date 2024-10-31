package dk.northtech.springskeleton.controllers;

import dk.northtech.springskeleton.controllers.dtos.OrganizationDTO;
import dk.northtech.springskeleton.services.OrganizationService;
import dk.northtech.springskeleton.services.UserService;
import dk.northtech.springskeleton.translators.OrganizationTranslator;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@Path("/organizations")
public class OrganizationController {

    private final OrganizationService organizationService;
    private final UserService userService;

    @Autowired
    public OrganizationController(OrganizationService organizationService, UserService userService) {
        this.organizationService = organizationService;
        this.userService = userService;
    }

    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createOrUpdateOrganization(OrganizationDTO dto) {
        organizationService.createOrUpdateOrganization(OrganizationTranslator.toEntity(dto));
        return Response.ok(dto).build();
    }

    @GET
    @Path("/{uuid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getOrganization(@PathParam("uuid") UUID uuid) {
        return Response.ok(OrganizationTranslator.toDto(organizationService.getOrganization(uuid))).build();
    }

    @DELETE
    @Path("/{uuid}")
    public Response deleteOrganization(@PathParam("uuid") UUID uuid) {
        organizationService.deleteOrganization(uuid);
        return Response.noContent().build();
    }

    @GET
    @Path("/my")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCurrentUserOrganization() {
        return Response.ok(OrganizationTranslator.toDto(organizationService.getOrganization(userService.getCurrentUserOrganizationUuid()))).build();
    }

}
