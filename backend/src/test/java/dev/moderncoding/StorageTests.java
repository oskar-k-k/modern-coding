package dev.moderncoding;

import dev.moderncoding.core.storage.*;
import java.nio.file.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import static org.junit.jupiter.api.Assertions.*;

class StorageTests {
    @TempDir Path directory;
    @Test void opaqueKeysAndMetadataNamesDoNotCollide() throws Exception {
        ObjectStorage storage = new LocalObjectStorage(directory);
        storage.put("images", "photo", new ObjectStorage.ObjectData(new byte[]{1,2}, "image/png"));
        storage.put("images", "photo.metadata.properties", new ObjectStorage.ObjectData(new byte[]{3}, "image/jpeg"));
        assertArrayEquals(new byte[]{1,2}, storage.read("images", "photo").bytes());
        assertEquals("image/jpeg", storage.read("images", "photo.metadata.properties").contentType());
        storage.put("images", "photo", new ObjectStorage.ObjectData(new byte[]{4}, "image/png"));
        assertArrayEquals(new byte[]{4}, storage.read("images", "photo").bytes());
        storage.delete("images", "photo");
        assertThrows(NoSuchFileException.class, () -> storage.read("images", "photo"));
    }
    @Test void invalidBucketCannotEscapeRoot() {
        ObjectStorage storage = new LocalObjectStorage(directory);
        assertThrows(IllegalArgumentException.class, () -> storage.read("../outside", "photo"));
    }
}
