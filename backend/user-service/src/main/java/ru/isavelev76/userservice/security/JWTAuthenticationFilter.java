package ru.isavelev76.userservice.security;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import ru.isavelev76.userservice.entities.enums.UserStatus;

import java.io.IOException;
import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 02.12.2025
 */

@Component
@RequiredArgsConstructor
public class JWTAuthenticationFilter extends OncePerRequestFilter {
    private final JWTUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);
            try {
                DecodedJWT decodedJWT = jwtUtil.verifyToken(jwt);
                if (!jwtUtil.isTokenExpired(decodedJWT)) {
                    UUID userId = jwtUtil.getUserIdFromJWT(decodedJWT);
                    UserDetails userDetails = userDetailsService.loadUserById(userId);
                    if (!userDetails.isEnabled()) {
                        String path = request.getRequestURI();
                        boolean isActivationRequest = path.equals("/api/users/me/activate");

                        if (!isActivationRequest) {
                            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Account is deactivated. Please activate it.");
                            return;
                        }
                    }
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (JWTVerificationException ex) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired JWT token");
                return;
            }
        }
        filterChain.doFilter(request, response);
    }
}
