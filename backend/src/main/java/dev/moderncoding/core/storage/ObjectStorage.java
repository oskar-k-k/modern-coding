package dev.moderncoding.core.storage;

import java.io.IOException;

/** Provider boundary. Ownership and visibility belong to the feature, not storage. */
public interface ObjectStorage {
    record ObjectData(byte[] bytes, String contentType) {}
    void put(String bucket, String key, ObjectData object) throws IOException;
    ObjectData read(String bucket, String key) throws IOException;
    void delete(String bucket, String key) throws IOException;
}
