package com.busway.dto;

import lombok.Data;

@Data
public class LoginRequestDTO {
    private String login;
    private String senha;
}