package dev.moderncoding.core.storage;

import java.io.*;
import java.nio.file.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.Objects;

/** Bounded demo adapter. Bytes and MIME type are published as one atomic file. */
public final class LocalObjectStorage implements ObjectStorage {
    private static final int MAX_BYTES = 10 * 1024 * 1024;
    private final Path root;
    public LocalObjectStorage(Path root) { this.root = root.toAbsolutePath().normalize(); }

    @Override
    public void put(String bucket, String key, ObjectData object) throws IOException {
        Objects.requireNonNull(object);
        if (object.bytes() == null || object.bytes().length > MAX_BYTES
                || object.contentType() == null || object.contentType().length() > 255)
            throw new IllegalArgumentException("Invalid demo object (maximum 10 MiB)");
        Path target = path(bucket, key);
        Files.createDirectories(target.getParent());
        Path temporary = Files.createTempFile(target.getParent(), ".upload-", ".tmp");
        try {
            try (var out = new DataOutputStream(Files.newOutputStream(temporary))) {
                out.writeUTF(object.contentType());
                out.writeInt(object.bytes().length);
                out.write(object.bytes());
            }
            Files.move(temporary, target, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING);
        } finally { Files.deleteIfExists(temporary); }
    }

    @Override
    public ObjectData read(String bucket, String key) throws IOException {
        try (var in = new DataInputStream(Files.newInputStream(path(bucket, key)))) {
            String type = in.readUTF();
            int length = in.readInt();
            if (length < 0 || length > MAX_BYTES) throw new IOException("Invalid stored object size");
            byte[] bytes = in.readNBytes(length);
            if (bytes.length != length || in.read() != -1) throw new IOException("Invalid stored object data");
            return new ObjectData(bytes, type);
        }
    }

    @Override
    public void delete(String bucket, String key) throws IOException { Files.deleteIfExists(path(bucket, key)); }

    private Path path(String bucket, String key) {
        if (bucket == null || !bucket.matches("[a-z0-9][a-z0-9-]{0,62}")
                || key == null || key.isBlank() || key.length() > 1024)
            throw new IllegalArgumentException("Invalid bucket or key");
        // Opaque keys cannot escape the root or collide with internal metadata filenames.
        try {
            String filename = HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                .digest(key.getBytes(StandardCharsets.UTF_8)));
            return root.resolve(bucket).resolve(filename + ".object");
        } catch (NoSuchAlgorithmException impossible) { throw new IllegalStateException(impossible); }
    }
}
