package dk.northtech.springskeleton.controllers;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import dk.northtech.springskeleton.controllers.dtos.TaskDTO;
import dk.northtech.springskeleton.services.TaskService;
import dk.northtech.springskeleton.translators.TaskTranslator;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@Path("/tasks")
public class TaskController {

    private TaskService taskService;

    @Inject
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }


    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTasks() {
        List<TaskDTO> tasks = TaskTranslator.translateToDTO(taskService.findAll());
        return Response.ok(tasks).build();
    }

    @GET
    @Path("/{uuid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTask(@PathParam("uuid") UUID uuid) {
        TaskDTO task = TaskTranslator.translateToDTO(taskService.findByUuid(uuid));
        return Response.ok(task).build();
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateTask(TaskDTO taskDTO) {
        taskService.createOrUpdate(TaskTranslator.translateToEntity(taskDTO));
        return Response.ok().build();
    }

    @DELETE
    @Path("/{uuid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteTask(@PathParam("uuid") String uuid) {
        taskService.delete(UUID.fromString(uuid));
        return Response.noContent().build();
    }


}
