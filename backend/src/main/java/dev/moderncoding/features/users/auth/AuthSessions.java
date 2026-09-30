package dev.moderncoding.features.users.auth;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/** Adapts the authenticated principal to an explicit actor ID for feature services. */
@Component
public class AuthSessions {
    private final JdbcTemplate jdbc;
    public AuthSessions(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public Long currentUserId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) return null;
        return jdbc.queryForList("SELECT id FROM users WHERE username=? AND status='ACTIVE'", Long.class, auth.getName())
            .stream().findFirst().orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    public long requireUserId() {
        var id = currentUserId();
        if (id == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        return id;
    }
}
