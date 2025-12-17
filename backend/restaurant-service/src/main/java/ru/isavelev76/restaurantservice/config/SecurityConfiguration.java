package ru.isavelev76.restaurantservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import ru.isavelev76.restaurantservice.security.InternalServiceAuthFilter;
import ru.isavelev76.restaurantservice.security.JWTAuthenticationFilter;

/**
 * @author Ilya Savelyev
 * @since 09.12.2025
 */

@Configuration
@EnableMethodSecurity
@EnableWebSecurity
public class SecurityConfiguration {
    private final JWTAuthenticationFilter jwtAuthenticationFilter;
    private final InternalServiceAuthFilter internalServiceAuthFilter;

    public SecurityConfiguration(JWTAuthenticationFilter jwtAuthenticationFilter, InternalServiceAuthFilter internalServiceAuthFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.internalServiceAuthFilter = internalServiceAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(urlConfig -> urlConfig
                        .requestMatchers(HttpMethod.POST, "/api/dishes/prices").hasRole("INTERNAL")
                        .requestMatchers(HttpMethod.GET, "/api/restaurants").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/restaurants/*").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/dishes/*").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/dishes/restaurant/*").permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(
                        internalServiceAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
