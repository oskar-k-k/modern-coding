package dev.moderncoding.features.users.profile;

import dev.moderncoding.features.content.ContentMediaService;
import dev.moderncoding.features.users.auth.AuthSessions;
import java.util.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/profiles")
public class ProfileController {
    private final ProfileService profiles;
    private final AuthSessions sessions;
    private final ContentMediaService media;
    public ProfileController(ProfileService profiles,AuthSessions sessions,ContentMediaService media) {
        this.profiles=profiles; this.sessions=sessions; this.media=media;
    }
    @GetMapping("/{username}/page") public ResponseEntity<ProfileService.ProfilePageResponse> page(@PathVariable String username) {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(profiles.page(username,sessions.currentUserId()));
    }
    @GetMapping("/{username}/contents") public ResponseEntity<ProfileService.CursorResponse<ProfileService.ContentCard>> contents(@PathVariable String username,@RequestParam(required=false) Long cursor,@RequestParam(defaultValue="false") boolean saved) {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(profiles.contents(username,sessions.currentUserId(),cursor,saved));
    }
    @GetMapping("/{username}/connections") public ResponseEntity<List<ProfileService.Profile>> connections(@PathVariable String username,@RequestParam(defaultValue="true") boolean followers) {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(profiles.connections(username,sessions.currentUserId(),followers));
    }
    public record FollowRequest(@io.swagger.v3.oas.annotations.media.Schema(requiredMode=io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED) @jakarta.validation.constraints.NotNull Boolean following) {}
    @PostMapping("/{username}/follow") public ResponseEntity<ProfileService.ProfilePageResponse> follow(@PathVariable String username,@jakarta.validation.Valid @RequestBody FollowRequest body) {
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(profiles.follow(username,sessions.requireUserId(),body.following()));
    }
    @GetMapping("/media/{id}") public ResponseEntity<byte[]> media(@PathVariable long id) throws java.io.IOException {
        var image=media.readImage(id,sessions.currentUserId());
        return ResponseEntity.ok().cacheControl(CacheControl.noStore()).contentType(MediaType.parseMediaType(image.contentType())).body(image.bytes());
    }
}
