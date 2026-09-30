package dev.moderncoding.features.users;

import dev.moderncoding.features.users.UserEnums;

import java.util.Objects;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Write boundary for user interactions. Callers must derive sourceUserId from the
 * authenticated user, never trust an arbitrary actor supplied by a client.
 * No public API is exposed here. Feature queries must enforce BLOCK/MUTE/privacy.
 */
@Service
public class UserInteractionService {
    private final JdbcTemplate jdbc;
    public UserInteractionService(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    @Transactional
    public void add(long sourceUserId, long targetUserId, UserEnums.InteractionType type) {
        Objects.requireNonNull(type);
        lockUsers(sourceUserId, targetUserId);
        if (type == UserEnums.InteractionType.FOLLOW && isBlocked(sourceUserId, targetUserId))
            throw new IllegalStateException("Following is unavailable while either user blocks the other");
        if (type == UserEnums.InteractionType.BLOCK) {
            jdbc.update("""
                DELETE FROM user_interactions WHERE type='FOLLOW'
                AND ((source_user_id=? AND target_user_id=?) OR (source_user_id=? AND target_user_id=?))
                """, sourceUserId, targetUserId, targetUserId, sourceUserId);
        }
        jdbc.update("""
            INSERT INTO user_interactions(source_user_id,target_user_id,type)
            VALUES (?,?,?) ON CONFLICT DO NOTHING
            """, sourceUserId, targetUserId, type.name());
    }

    @Transactional
    public void remove(long sourceUserId, long targetUserId, UserEnums.InteractionType type) {
        Objects.requireNonNull(type);
        lockUsers(sourceUserId, targetUserId);
        jdbc.update("DELETE FROM user_interactions WHERE source_user_id=? AND target_user_id=? AND type=?",
                sourceUserId, targetUserId, type.name());
    }

    @Transactional(readOnly = true)
    public boolean isBlocked(long firstUserId, long secondUserId) {
        return Boolean.TRUE.equals(jdbc.queryForObject("""
            SELECT EXISTS(SELECT 1 FROM user_interactions WHERE type='BLOCK'
            AND ((source_user_id=? AND target_user_id=?) OR (source_user_id=? AND target_user_id=?)))
            """, Boolean.class, firstUserId, secondUserId, secondUserId, firstUserId));
    }

    private void lockUsers(long sourceUserId, long targetUserId) {
        if (sourceUserId == targetUserId) throw new IllegalArgumentException("Self interactions are not allowed");
        // Fixed order serializes competing follow/block operations without pair-order deadlocks.
        var users = jdbc.queryForList("SELECT id FROM users WHERE id IN (?,?) ORDER BY id FOR UPDATE",
                Long.class, sourceUserId, targetUserId);
        if (users.size() != 2) throw new IllegalArgumentException("Both users must exist");
    }
}
