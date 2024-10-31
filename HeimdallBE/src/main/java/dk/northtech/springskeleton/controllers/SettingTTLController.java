package dk.northtech.springskeleton.controllers;

import dk.northtech.springskeleton.controllers.dtos.SettingTTLDTO.SettingTTLDTO;
import dk.northtech.springskeleton.controllers.dtos.SettingTTLDTO.TTLDisplayDTO;
import dk.northtech.springskeleton.services.SettingTTLService;
import dk.northtech.springskeleton.translators.SettingTTLTranslator;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@Path("/setting-ttl")
public class SettingTTLController {

    private final SettingTTLService settingTTLService;

    public SettingTTLController(SettingTTLService settingTTLService) {
        this.settingTTLService = settingTTLService;
    }

    @GET
    @Path("/document/{documentUuid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response displayTTL(@PathParam("documentUuid") UUID documentUuid) {
         TTLDisplayDTO ttl = settingTTLService.displayTTL(documentUuid);
        return Response.ok(ttl).build();
    }
    @GET
    @Path("/organization/{organizationUuid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response findAllByOrganizationUuid(@PathParam("organizationUuid") UUID organizationUuid) {
        List<SettingTTLDTO> settingTTLDTOList = settingTTLService.findAllByOrganizationUuid(organizationUuid);
        return Response.ok(settingTTLDTOList).build();
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateSettingTTL(SettingTTLDTO settingTTLDTO) {
        settingTTLService.createOrUpdate(SettingTTLTranslator.translateToEntity(settingTTLDTO));
        return Response.ok().build();
    }

    @DELETE
    @Path("/{uuid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteSettingTTL(@PathParam("uuid") UUID uuid) {
        settingTTLService.delete(uuid);
        return Response.ok().build();
    }


}
