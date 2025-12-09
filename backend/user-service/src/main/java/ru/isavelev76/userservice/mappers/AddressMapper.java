package ru.isavelev76.userservice.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import ru.isavelev76.userservice.entities.Address;
import ru.isavelev76.userservice.requests.AddressRequest;
import ru.isavelev76.userservice.responses.AddressResponse;

@Mapper(componentModel = "spring")
public interface AddressMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    Address toEntity(AddressRequest authRequest);

    void updateEntityFromRequest(AddressRequest request,
                                 @MappingTarget Address address);

    @Mapping(target = "userId", source = "address.user.id")
    AddressResponse toResponse(Address address);
}
