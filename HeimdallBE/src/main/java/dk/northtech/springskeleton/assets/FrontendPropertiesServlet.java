package dk.northtech.springskeleton.assets;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.inject.Inject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

// Using the @WebServlet annotation requires @ServletComponentScan on the SpringBootApplication class.
// In turn, this servlet <i>must not</i> be annotated as @Component, or the @WebServlet annotation will not be read correctly.
// Due to the component scan, it still counts as a component for dependency-injection purpose even without the annotation.
@WebServlet({"/assets/frontend-properties.json", "/assets/frontend-properties.js"})
public class FrontendPropertiesServlet extends HttpServlet {
    private final String frontendPropertiesJson;
    private final String frontendPropertiesJavaScript;

    @Inject
    public FrontendPropertiesServlet(FrontendProperties frontendProperties) throws JsonProcessingException {
        var writer = new ObjectMapper().writerWithDefaultPrettyPrinter();
        // The configuration is by definition read-once on boot, so pre-serialize it:
        this.frontendPropertiesJson = writer.writeValueAsString(frontendProperties);
        this.frontendPropertiesJavaScript = "var frontendProperties = " + this.frontendPropertiesJson + ";";
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        boolean isJavaScript = req.getRequestURI().toLowerCase().endsWith(".js");
        res.setCharacterEncoding("utf-8");
        var origin = req.getHeader("Origin");
        if (origin != null && !origin.isBlank()) {
            res.setHeader("Access-Control-Allow-Origin", "*");
        }
        res.setHeader("Cache-Control", "no-cache");
        res.setContentType(isJavaScript ? "text/javascript" : "application/json");
        try (var w = res.getWriter()) {
            w.print(isJavaScript ? this.frontendPropertiesJavaScript : this.frontendPropertiesJson);
        }
    }
}