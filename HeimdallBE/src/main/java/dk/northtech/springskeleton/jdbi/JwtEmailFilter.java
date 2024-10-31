package dk.northtech.springskeleton.jdbi;

import dk.northtech.springskeleton.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jdbi.v3.core.Jdbi;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtEmailFilter extends OncePerRequestFilter {
    private final Jdbi jdbi;

    public JwtEmailFilter(Jdbi jdbi) {
        this.jdbi = jdbi;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String requestURI = request.getRequestURI();

        // Allow access to Actuator endpoints
        if (requestURI.startsWith("/actuator")) {
            filterChain.doFilter(request, response);
            return;
        }

        String email = JwtUtil.extractEmailFromJwt();
        try {
            jdbi.useTransaction(handle -> {
                handle.createUpdate("SET LOCAL session.user_email = '" + email.replace("'", "''") + "'")
                        .execute();
                filterChain.doFilter(request, response);
            });
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
