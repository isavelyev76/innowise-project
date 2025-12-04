package ru.isavelev76.userservice.exceptions;

public class RefreshTokenOrCredentialsNotValidException extends RuntimeException {
    public RefreshTokenOrCredentialsNotValidException(String message) {
        super(message);
    }
}
