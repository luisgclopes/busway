package com.busway.config;

import com.busway.dto.LoginResponseDTO;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class SessionAuthFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        if (session != null) {
            Object obj = session.getAttribute("usuarioLogado");
            if (obj instanceof LoginResponseDTO) {
                LoginResponseDTO usuario = (LoginResponseDTO) obj;
                List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                String cargo = usuario.getCargo() == null ? "" : usuario.getCargo().trim().toUpperCase();
                authorities.add(new SimpleGrantedAuthority("ROLE_" + cargo));
                
                if ("FUNCIONARIO".equals(cargo)) {
                    authorities.add(new SimpleGrantedAuthority("ROLE_ATENDENTE"));
                }
                
                UsernamePasswordAuthenticationToken auth = 
                        new UsernamePasswordAuthenticationToken(usuario, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        
        // Continua o fluxo permitindo que o Spring Security leia o auth que acabamos de setar
        filterChain.doFilter(request, response);
    }
}