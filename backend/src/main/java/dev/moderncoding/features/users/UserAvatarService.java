package dev.moderncoding.features.users;

import dev.moderncoding.core.storage.ObjectStorage;
import java.io.IOException;
import java.nio.file.NoSuchFileException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserAvatarService {
    private final JdbcTemplate jdbc;
    private final ObjectStorage storage;
    public UserAvatarService(JdbcTemplate jdbc, ObjectStorage storage) { this.jdbc = jdbc; this.storage = storage; }
    public ObjectStorage.ObjectData read(long id) throws IOException {
        String key = jdbc.queryForList("SELECT avatar_object_key FROM users WHERE id=? AND status='ACTIVE' AND avatar_object_key IS NOT NULL", String.class, id)
            .stream().findFirst().orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        try {
            var object = storage.read("avatars", key);
            if (!"image/png".equals(object.contentType())) throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE);
            return object;
        } catch (NoSuchFileException missing) { throw new ResponseStatusException(HttpStatus.NOT_FOUND); }
    }
}
