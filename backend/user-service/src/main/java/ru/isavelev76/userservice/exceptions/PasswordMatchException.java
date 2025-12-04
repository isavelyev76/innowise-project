package ru.isavelev76.userservice.exceptions;

public class PasswordMatchException extends RuntimeException {
    public PasswordMatchException(String message) {
        super(message);
    }
}
