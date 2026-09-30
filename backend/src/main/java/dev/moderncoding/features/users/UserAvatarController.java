package dev.moderncoding.features.users;

import java.io.IOException;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserAvatarController {
    private final UserAvatarService avatars;
    public UserAvatarController(UserAvatarService avatars) { this.avatars = avatars; }
    @GetMapping("/api/auth/avatar/{id}")
    public ResponseEntity<byte[]> avatar(@PathVariable long id) throws IOException {
        var object = avatars.read(id);
        return ResponseEntity.ok().cacheControl(CacheControl.noStore())
            .contentType(MediaType.parseMediaType(object.contentType())).body(object.bytes());
    }
}
