package ru.isavelev76.userservice.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import ru.isavelev76.userservice.entities.User;
import ru.isavelev76.userservice.responses.UserResponse;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "roles",
            expression = "java(user.getRoles().stream()" +
                    ".map(r -> r.getName().name())" +
                    ".toList())")
    UserResponse toResponse(User user);
}
