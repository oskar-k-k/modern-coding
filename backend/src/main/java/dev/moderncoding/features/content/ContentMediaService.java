package dev.moderncoding.features.content;

import dev.moderncoding.features.users.UserInteractionService;
import dev.moderncoding.core.storage.ObjectStorage;
import java.io.IOException;
import java.nio.file.NoSuchFileException;
import java.util.Objects;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/** The feature owns visibility; storage only delivers bytes through a composed provider. */
@Service
public class ContentMediaService {
    private final JdbcTemplate jdbc;
    private final UserInteractionService interactions;
    private final ObjectStorage storage;
    public ContentMediaService(JdbcTemplate jdbc, UserInteractionService interactions, ObjectStorage storage) {
        this.jdbc = jdbc; this.interactions = interactions; this.storage = storage;
    }
    public record Image(byte[] bytes, String contentType) {}
    public Image readImage(long id, Long viewer) throws IOException {
        var rows = jdbc.queryForList("""
            SELECT m.storage_bucket,m.storage_object_key,c.author_id,c.visibility
            FROM content_media m JOIN contents c ON c.id=m.content_id JOIN users u ON u.id=c.author_id
            WHERE m.id=? AND m.type='IMAGE' AND c.status='PUBLISHED' AND u.status='ACTIVE'
            """, id);
        if (rows.isEmpty()) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        var row = rows.getFirst();
        long author = ((Number) row.get("author_id")).longValue();
        if ((!"PUBLIC".equals(row.get("visibility")) && !Objects.equals(viewer, author))
                || (viewer != null && interactions.isBlocked(viewer, author)))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        try {
            var object = storage.read((String) row.get("storage_bucket"), (String) row.get("storage_object_key"));
            if (!"image/png".equals(object.contentType())) throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE);
            return new Image(object.bytes(), object.contentType());
        } catch (NoSuchFileException missing) { throw new ResponseStatusException(HttpStatus.NOT_FOUND); }
    }
}
