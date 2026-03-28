package com.capgemini.notificationservice.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;

@ControllerAdvice
public class GlobalException {

    // 🔹 NOT FOUND
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponses> handleNotFound(
            ResourceNotFoundException ex,
            HttpServletRequest request) {

        return buildResponse(ex.getMessage(), HttpStatus.NOT_FOUND, request);
    }

    // 🔹 VALIDATION (DTO)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponses> handleValidation(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {

        Map<String, String> errors = new HashMap<>();

        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }

        return buildResponse(errors.toString(), HttpStatus.BAD_REQUEST, request);
    }

    // 🔹 VALIDATION (PARAMS)
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponses> handleConstraintViolation(
            ConstraintViolationException ex,
            HttpServletRequest request) {

        return buildResponse(ex.getMessage(), HttpStatus.BAD_REQUEST, request);
    }

    // 🔹 BAD REQUEST
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponses> handleBadRequest(
            BadRequestException ex,
            HttpServletRequest request) {

        return buildResponse(ex.getMessage(), HttpStatus.BAD_REQUEST, request);
    }

    // 🔹 UNAUTHORIZED
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponses> handleUnauthorized(
            UnauthorizedException ex,
            HttpServletRequest request) {

        return buildResponse(ex.getMessage(), HttpStatus.UNAUTHORIZED, request); // ✅ FIXED
    }

    // 🔹 CONFLICT
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ErrorResponses> handleConflict(
            ConflictException ex,
            HttpServletRequest request) {

        return buildResponse(ex.getMessage(), HttpStatus.CONFLICT, request);
    }

    // 🔹 GENERIC
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponses> handleGeneric(
            Exception ex,
            HttpServletRequest request) {

        return buildResponse(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, request);
    }

    // 🔥 COMMON BUILDER (CLEAN)
    private ResponseEntity<ErrorResponses> buildResponse(
            String message,
            HttpStatus status,
            HttpServletRequest request) {

        ErrorResponses error = new ErrorResponses(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                request.getRequestURI()
        );

        return new ResponseEntity<>(error, status);
    }
}