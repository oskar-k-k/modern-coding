package dev.moderncoding;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = "demo.storage.root=target/test-objects")
@AutoConfigureMockMvc
@Transactional
class ProfilePresentationTests {
    @Autowired MockMvc mvc;
    @Autowired JdbcTemplate jdbc;

    @Test void publicPageAndCursorExcludePrivateAndDraftContents() throws Exception {
        mvc.perform(get("/api/profiles/alex/page"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.stats.posts").value(14))
            .andExpect(jsonPath("$.stats.followers").value(2))
            .andExpect(jsonPath("$.ownProfile").value(false))
            .andExpect(jsonPath("$.contents.items.length()").value(12))
            .andExpect(jsonPath("$.contents.nextCursor").value(3))
            .andExpect(jsonPath("$.profile.avatarPath").value("/api/auth/avatar/1"));
        mvc.perform(get("/api/profiles/alex/contents?cursor=3"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.items.length()").value(2))
            .andExpect(jsonPath("$.hasMore").value(false));
    }
    @Test void ownerSeesPrivateEntriesAndSavedContents() throws Exception {
        mvc.perform(get("/api/profiles/alex/page").with(httpBasic("alex", "demo-password")))
            .andExpect(status().isOk()).andExpect(jsonPath("$.ownProfile").value(true))
            .andExpect(jsonPath("$.stats.posts").value(15));
        mvc.perform(get("/api/profiles/alex/contents?saved=true").with(user("alex")))
            .andExpect(status().isOk()).andExpect(jsonPath("$.items[0].id").value(16));
        mvc.perform(get("/api/profiles/alex/contents?saved=true").with(user("sam")))
            .andExpect(status().isForbidden());
    }
    @Test void followingIsIdempotentAndNeedsAuthenticationAndCsrf() throws Exception {
        for (int i = 0; i < 2; i++) {
            mvc.perform(post("/api/profiles/jordan/follow").with(user("alex")).with(csrf())
                .contentType("application/json").content("{\"following\":true}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.stats.followers").value(1));
        }
        mvc.perform(post("/api/profiles/jordan/follow").with(csrf())
            .contentType("application/json").content("{\"following\":true}"))
            .andExpect(status().isUnauthorized());
        mvc.perform(post("/api/profiles/jordan/follow").with(user("alex"))
            .contentType("application/json").content("{\"following\":true}"))
            .andExpect(status().isForbidden());
        mvc.perform(post("/api/profiles/jordan/follow").with(user("alex")).with(csrf())
            .contentType("application/json").content("{}"))
            .andExpect(status().isBadRequest());
    }
    @Test void imagesUseStorageAndRespectVisibility() throws Exception {
        mvc.perform(get("/api/auth/avatar/1")).andExpect(status().isOk()).andExpect(content().contentType("image/png"));
        mvc.perform(get("/api/profiles/media/1")).andExpect(status().isOk()).andExpect(content().contentType("image/png"));
        mvc.perform(get("/api/profiles/media/2")).andExpect(status().isNotFound());
        mvc.perform(get("/api/profiles/media/2").with(user("alex"))).andExpect(status().isOk());
    }
    @Test void blocksHideProfileAndMedia() throws Exception {
        jdbc.update("INSERT INTO user_interactions(source_user_id,target_user_id,type) VALUES (2,1,'BLOCK')");
        mvc.perform(get("/api/profiles/alex/page").with(user("sam"))).andExpect(status().isNotFound());
        mvc.perform(get("/api/profiles/media/1").with(user("sam"))).andExpect(status().isNotFound());
    }
    @Test void connectionsAndOpenApiAreAvailable() throws Exception {
        mvc.perform(get("/api/profiles/alex/connections")).andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(2));
        mvc.perform(get("/v3/api-docs")).andExpect(status().isOk()).andExpect(jsonPath("$.paths").exists());
    }
}
