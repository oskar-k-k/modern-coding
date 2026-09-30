package dev.moderncoding.core.storage;

import java.nio.file.Path;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StorageConfiguration {
    @Bean
    ObjectStorage objectStorage(@Value("${demo.storage.root:./data/objects}") Path root) {
        return new LocalObjectStorage(root);
    }
}
