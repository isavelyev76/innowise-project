package ru.isavelev76.restaurantservice.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import ru.isavelev76.restaurantservice.config.AppProperties;

import java.io.IOException;
import java.util.List;

/**
 * @author Ilya Savelyev
 * @since 17.12.2025
 */

@RequiredArgsConstructor
@Component
public class InternalServiceAuthFilter extends OncePerRequestFilter {

    private final AppProperties appProperties;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String header = request.getHeader("X-Internal-Token");

        if (header != null && header.equals(appProperties.iternalToken())) {
            Authentication auth = new UsernamePasswordAuthenticationToken(
                    "api-service",
                    null,
                    List.of(new SimpleGrantedAuthority("ROLE_INTERNAL"))
            );

            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }
}
