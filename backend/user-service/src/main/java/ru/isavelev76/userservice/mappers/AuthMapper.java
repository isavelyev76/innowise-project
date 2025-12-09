package ru.isavelev76.userservice.mappers;


import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.isavelev76.userservice.entities.User;
import ru.isavelev76.userservice.requests.AuthRequest;
import ru.isavelev76.userservice.responses.AuthResponse;

@Mapper(componentModel = "spring", uses = UserMapper.class)
public interface AuthMapper {
    @Mapping(target = "userResponse", source = "user")
    @Mapping(target = "accessToken", source = "accessToken")
    @Mapping(target = "refreshToken", source = "refreshToken")
    @Mapping(target = "message", source = "message")
    AuthResponse toAuthResponse(User user, String accessToken, String refreshToken, String message);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "fullName", source = "authRequest.fullName")
    @Mapping(target = "email", source = "authRequest.email")
    @Mapping(target = "passwordHash", source = "authRequest.password")
    User toEntity(AuthRequest authRequest);
}
