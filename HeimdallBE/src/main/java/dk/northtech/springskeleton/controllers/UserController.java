package dk.northtech.springskeleton.controllers;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import dk.northtech.springskeleton.controllers.dtos.SearchDTO;
import dk.northtech.springskeleton.services.UserService;
import dk.northtech.springskeleton.translators.UserTranslator;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Path("/users")
public class UserController
{
    private final UserService userService;

   @Autowired
    public UserController(UserService userService)
    {
        this.userService = userService;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUsers()
    {
        return Response.ok(UserTranslator.toDTOs(userService.getAllUsers())).build();
    }

    @GET
    @Path("/{email}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserByEmail(@PathParam("email") String email)
    {
        return Response.ok(UserTranslator.toDTO(userService.getUserByEmail(email))).build();
    }

    @GET
    @Path("/verify")
    @Produces(MediaType.APPLICATION_JSON)
    public Response verifyUser(@Context HttpHeaders headers)
    {
        String authHeader = headers.getHeaderString(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return Response.status(Response.Status.UNAUTHORIZED).build(); // No token found or wrong format
        }

        String token = authHeader.substring("Bearer ".length());

        DecodedJWT decodedJWT = JWT.decode(token);
        String email = decodedJWT.getClaim("email").asString();
        String name = decodedJWT.getClaim("name").asString();

        boolean userCreated = userService.verifyUser(email, name);
        return Response.ok(userCreated).build();
    }
    @POST
    @Path("/exists")
    @Produces(MediaType.TEXT_PLAIN)
    @Consumes(MediaType.TEXT_PLAIN)
    public Response checkValidUser(@RequestBody String email)
    {
        boolean exists = userService.checkValidUser(email);
        return Response.ok(exists).build();
    }


    @GET
    @Path("/details/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserDetails(@PathParam("id") Long id)
    {
        return Response.ok(userService.getUserDetailsById(id)).build();
    }
  
    @POST
    @Path("/search")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response search(@RequestBody SearchDTO searchDTO)
    {
        return Response.ok(UserTranslator.toDTOs(userService.search(searchDTO.getQuery()))).build();

    }

    @GET
    @Path("/id/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getUserById(@PathParam("id") Long id)
    {
        return Response.ok(UserTranslator.toDTO(userService.getUserById(id))).build();
    }

    @GET
    @Path("/my")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getCurrentUser()
    {
        return Response.ok(userService.getCurrentUser()).build();
    }
}
