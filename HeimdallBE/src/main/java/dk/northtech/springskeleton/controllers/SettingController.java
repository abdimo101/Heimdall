package dk.northtech.springskeleton.controllers;

import dk.northtech.springskeleton.controllers.dtos.SettingDTO;
import dk.northtech.springskeleton.entities.SettingEntity;
import dk.northtech.springskeleton.services.SettingService;
import dk.northtech.springskeleton.translators.SettingTranslator;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@Path("/settings")
public class SettingController {

    private final SettingService settingService;

    @Autowired
    public SettingController(SettingService settingService) {
        this.settingService = settingService;
    }

    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateSetting(SettingDTO dto) {
        settingService.createOrUpdateSetting(SettingTranslator.toEntity(dto));
        return Response.ok(dto).build();
    }

    @GET
    @Path("/{organizationUuid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getSetting(@PathParam("organizationUuid") String organizationUuid) {
        return Response.ok(SettingTranslator.toDto(settingService.getSettingById(UUID.fromString(organizationUuid)))).build();
    }

}