package ru.isavelev76.userservice.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.isavelev76.userservice.entities.Address;
import ru.isavelev76.userservice.entities.User;
import ru.isavelev76.userservice.entities.enums.UserStatus;
import ru.isavelev76.userservice.mappers.AddressMapper;
import ru.isavelev76.userservice.repositories.AddressRepository;
import ru.isavelev76.userservice.repositories.UserRepository;
import ru.isavelev76.userservice.requests.AddressRequest;
import ru.isavelev76.userservice.responses.AddressResponse;

import java.util.List;
import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 07.12.2025
 */

@RequiredArgsConstructor
@Service
public class AddressService {
    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final AddressMapper addressMapper;

    private User getActiveUser(UUID userId) {
        return userRepository.findByIdAndStatus(userId, UserStatus.ACTIVE)
                .orElseThrow(() -> new EntityNotFoundException("User not active or not found"));
    }

    @Transactional
    public AddressResponse create(AddressRequest request, UUID userId) {
        User user = getActiveUser(userId);

        Address address = addressMapper.toEntity(request);
        address.setUser(user);

        addressRepository.save(address);

        return addressMapper.toResponse(address);
    }

    @Transactional(readOnly = true)
    public AddressResponse getById(UUID id, UUID userId) {
        User user = getActiveUser(userId);

        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Address not found"));

        return addressMapper.toResponse(address);
    }

    @Transactional(readOnly = true)
    public List<AddressResponse> getAll(UUID userId) {
        User user = getActiveUser(userId);

        return addressRepository.findAllByUserId(user.getId()).stream()
                .map(addressMapper::toResponse)
                .toList();
    }

    @Transactional
    public AddressResponse update(UUID id, UUID userId, AddressRequest request) {
        User user = getActiveUser(userId);

        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Address not found"));

        addressMapper.updateEntityFromRequest(request, address);

        return addressMapper.toResponse(address);
    }

    @Transactional
    public void delete(UUID id, UUID userId) {
        User user = getActiveUser(userId);

        Address address = addressRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Address not found"));

        addressRepository.delete(address);
    }
}
