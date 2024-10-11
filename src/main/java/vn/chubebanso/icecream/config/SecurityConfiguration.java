package vn.chubebanso.icecream.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfiguration {
    // @Value("${hoidanit.jwt.base64-secret}")
    // private String jwtKey;

    @Bean
    public PasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(c -> c.disable())
                .authorizeHttpRequests(
                        authz -> authz
                                .requestMatchers("/").permitAll()
                                .anyRequest().permitAll())
                .formLogin(f -> f.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }

    // @Bean
    // public JwtEncoder jwtEncoder() {
    // return new NimbusJwtEncoder(new ImmutableSecret<>(getSecretKey()));
    // }

    // private SecretKey getSecretKey() {
    // byte[] keyBytes = Base64.from(jwtKey).decode();
    // return new SecretKeySpec(keyBytes, 0, keyBytes.length,
    // SecurityUtil.JWT_ALGORITHM.getName());
    // }

}
