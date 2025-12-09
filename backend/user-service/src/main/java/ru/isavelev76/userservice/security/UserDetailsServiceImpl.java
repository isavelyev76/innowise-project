package ru.isavelev76.userservice.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.isavelev76.userservice.repositories.UserRepository;

import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 02.12.2025
 */

@RequiredArgsConstructor
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByFullName(username)
                .map(UserDetailsImpl::new)
                .orElseThrow(() -> new UsernameNotFoundException("Filed to retrieve user by username: " + username));
    }

    @Transactional(readOnly = true)
    public UserDetails loadUserById(UUID id) throws UsernameNotFoundException {
        return userRepository.findByIdWithRoles(id)
                .map(UserDetailsImpl::new)
                .orElseThrow(() -> new UsernameNotFoundException("Filed to retrieve user by username: " + id));
    }
}
