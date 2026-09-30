package dev.moderncoding.features.users.profile;

import dev.moderncoding.features.users.UserEnums;

import dev.moderncoding.features.users.UserInteractionService;
import java.util.*;
import io.swagger.v3.oas.annotations.media.Schema;
import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProfileService {
    private final JdbcTemplate jdbc;
    private final UserInteractionService interactions;
    public ProfileService(JdbcTemplate jdbc, UserInteractionService interactions) { this.jdbc=jdbc; this.interactions=interactions; }
    public record Profile(
            @Schema(requiredMode=REQUIRED) long id,
            @Schema(requiredMode=REQUIRED) String username,
            @Schema(requiredMode=REQUIRED, nullable=true) String displayName,
            @Schema(requiredMode=REQUIRED, nullable=true) String bio,
            @Schema(requiredMode=REQUIRED, nullable=true) String avatarPath,
            @Schema(requiredMode=REQUIRED) String accountType) {}
    public record Stats(@Schema(requiredMode=REQUIRED) long posts,
                        @Schema(requiredMode=REQUIRED) long followers,
                        @Schema(requiredMode=REQUIRED) long following) {}
    public record ContentCard(
            @Schema(requiredMode=REQUIRED) long id,
            @Schema(requiredMode=REQUIRED, nullable=true) String title,
            @Schema(requiredMode=REQUIRED, nullable=true) String description,
            @Schema(requiredMode=REQUIRED) String contentType,
            @Schema(requiredMode=REQUIRED) String categoryKey,
            @Schema(requiredMode=REQUIRED) long likeCount,
            @Schema(requiredMode=REQUIRED) long commentCount,
            @Schema(requiredMode=REQUIRED, format="date-time") String publishedAt,
            @Schema(requiredMode=REQUIRED, nullable=true) String previewPath,
            @Schema(requiredMode=REQUIRED) String visibility) {}
    public record CursorResponse<T>(@Schema(requiredMode=REQUIRED) List<T> items,
                                    @Schema(requiredMode=REQUIRED, nullable=true) Long nextCursor,
                                    @Schema(requiredMode=REQUIRED) boolean hasMore) {}
    public record ProfilePageResponse(@Schema(requiredMode=REQUIRED) Profile profile,
                                      @Schema(requiredMode=REQUIRED) Stats stats,
                                      @Schema(requiredMode=REQUIRED) boolean ownProfile,
                                      @Schema(requiredMode=REQUIRED) boolean following,
                                      @Schema(requiredMode=REQUIRED) CursorResponse<ContentCard> contents) {}

    public Profile profile(String username, Long viewer) {
        var profile=jdbc.query("SELECT id,username,display_name,bio,avatar_object_key,account_type FROM users WHERE lower(username)=lower(?) AND status='ACTIVE'", (rs,n)->new Profile(rs.getLong("id"),rs.getString("username"),rs.getString("display_name"),rs.getString("bio"),rs.getString("avatar_object_key")==null?null:"/api/auth/avatar/"+rs.getLong("id"),rs.getString("account_type")),username)
            .stream().findFirst().orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (viewer!=null && interactions.isBlocked(viewer,profile.id())) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return profile;
    }
    private long count(String sql, Object... args) { return Objects.requireNonNull(jdbc.queryForObject(sql,Long.class,args)); }
    @Transactional(readOnly=true)
    public ProfilePageResponse page(String username, Long viewer) {
        var p=profile(username,viewer);
        boolean own=Objects.equals(viewer,p.id());
        var stats=new Stats(count("SELECT count(*) FROM contents WHERE author_id=? AND status='PUBLISHED' AND (visibility='PUBLIC' OR ?)",p.id(),own),
            count("SELECT count(*) FROM user_interactions i JOIN users u ON u.id=i.source_user_id WHERE i.target_user_id=? AND i.type='FOLLOW' AND u.status='ACTIVE'",p.id()),
            count("SELECT count(*) FROM user_interactions i JOIN users u ON u.id=i.target_user_id WHERE i.source_user_id=? AND i.type='FOLLOW' AND u.status='ACTIVE'",p.id()));
        boolean following=viewer!=null && count("SELECT count(*) FROM user_interactions WHERE source_user_id=? AND target_user_id=? AND type='FOLLOW'",viewer,p.id())>0;
        return new ProfilePageResponse(p,stats,own,following,contents(username,viewer,null,false));
    }
    @Transactional(readOnly=true)
    public CursorResponse<ContentCard> contents(String username, Long viewer, Long cursor, boolean saved) {
        var p=profile(username,viewer);
        if (saved && !Objects.equals(viewer,p.id())) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        if(cursor!=null && cursor<1) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        var rows=jdbc.query("""
            SELECT c.*, cat.key AS category_key,
                (SELECT m.id FROM content_media m WHERE m.content_id=c.id AND m.type='IMAGE' ORDER BY m.sort_order,m.id LIMIT 1) AS preview_id
            FROM contents c JOIN content_categories cat ON cat.id=c.category_id JOIN users author ON author.id=c.author_id
            WHERE c.status='PUBLISHED' AND author.status='ACTIVE' AND (c.visibility='PUBLIC' OR c.author_id=?)
              AND NOT EXISTS (SELECT 1 FROM user_interactions b WHERE b.type='BLOCK' AND ((b.source_user_id=? AND b.target_user_id=c.author_id) OR (b.target_user_id=? AND b.source_user_id=c.author_id)))
            """ + (saved ? " AND EXISTS(SELECT 1 FROM content_interactions i WHERE i.content_id=c.id AND i.user_id=? AND i.type='SAVE')" : " AND c.author_id=?") + " AND c.id < ? ORDER BY c.id DESC LIMIT 13",
            (rs,n)->new ContentCard(rs.getLong("id"),rs.getString("title"),rs.getString("description"),rs.getString("content_type"),rs.getString("category_key"),rs.getLong("like_count"),rs.getLong("comment_count"),rs.getTimestamp("published_at").toInstant().toString(),rs.getObject("preview_id")==null?null:"/api/profiles/media/"+rs.getLong("preview_id"),rs.getString("visibility")),viewer,viewer,viewer,p.id(),cursor==null?Long.MAX_VALUE:cursor);
        boolean more=rows.size()>12;
        var items=List.copyOf(rows.subList(0,Math.min(12,rows.size())));
        return new CursorResponse<>(items,more?items.getLast().id():null,more);
    }
    @Transactional
    public ProfilePageResponse follow(String username, Long viewer, boolean follow) {
        if(viewer==null || count("SELECT count(*) FROM users WHERE id=? AND status='ACTIVE'",viewer)==0) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        var target=profile(username,viewer);
        if(target.id()==viewer) throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        if(follow) interactions.add(viewer,target.id(),UserEnums.InteractionType.FOLLOW);
        else interactions.remove(viewer,target.id(),UserEnums.InteractionType.FOLLOW);
        return page(username,viewer);
    }
    public List<Profile> connections(String username, Long viewer, boolean followers) {
        var p=profile(username,viewer);
        return jdbc.query("SELECT u.id,u.username,u.display_name,u.bio,u.avatar_object_key,u.account_type FROM user_interactions i JOIN users u ON u.id=i."+(followers?"source_user_id":"target_user_id")+" WHERE i."+(followers?"target_user_id":"source_user_id")+"=? AND i.type='FOLLOW' AND u.status='ACTIVE' AND NOT EXISTS(SELECT 1 FROM user_interactions b WHERE b.type='BLOCK' AND ((b.source_user_id=? AND b.target_user_id=u.id) OR (b.target_user_id=? AND b.source_user_id=u.id))) ORDER BY i.created_at DESC LIMIT 50",
            (rs,n)->new Profile(rs.getLong("id"),rs.getString("username"),rs.getString("display_name"),rs.getString("bio"),rs.getString("avatar_object_key")==null?null:"/api/auth/avatar/"+rs.getLong("id"),rs.getString("account_type")),p.id(),viewer,viewer);
    }
}
