package dev.moderncoding.platform;

import dev.moderncoding.core.storage.ObjectStorage;
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import javax.imageio.ImageIO;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/** Neutral local images; no external requests, accounts or asset downloads. */
@Component
public class DemoFixtures implements ApplicationRunner {
    private final ObjectStorage storage;
    public DemoFixtures(ObjectStorage storage) { this.storage = storage; }
    @Override
    public void run(ApplicationArguments arguments) throws Exception {
        var image = new BufferedImage(128, 128, BufferedImage.TYPE_INT_RGB);
        var graphics = image.createGraphics();
        try {
            graphics.setColor(new Color(35, 65, 95)); graphics.fillRect(0, 0, 128, 128);
            graphics.setColor(new Color(125, 210, 185)); graphics.fillOval(36, 20, 56, 56);
            graphics.fillRoundRect(20, 82, 88, 60, 36, 36);
        } finally { graphics.dispose(); }
        var bytes = new ByteArrayOutputStream();
        ImageIO.write(image, "png", bytes);
        var object = new ObjectStorage.ObjectData(bytes.toByteArray(), "image/png");
        storage.put("avatars", "alex.png", object);
        storage.put("content", "sample.png", object);
    }
}
