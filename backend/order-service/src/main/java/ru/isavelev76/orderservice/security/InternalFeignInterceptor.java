package ru.isavelev76.orderservice.security;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import ru.isavelev76.orderservice.config.AppProperties;

/**
 * @author Ilya Savelyev
 * @since 17.12.2025
 */

@RequiredArgsConstructor
@Component
public class InternalFeignInterceptor implements RequestInterceptor {

    private final AppProperties appProperties;

    @Override
    public void apply(RequestTemplate template) {
        template.header("X-Internal-Token", appProperties.internalToken());
    }
}
