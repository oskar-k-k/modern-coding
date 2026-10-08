function Example({ title, code }: { title: string; code: string }) {
  return <figure className="slide-code">
    <figcaption>{title} <span>Illustrativer Ausschnitt</span></figcaption>
    <pre><code>{code}</code></pre>
  </figure>;
}

export default function SlideVisual({ index }: { index: number }) {
  if (index === 3 || index === 4) return <section className="slide-visual" aria-label="Architektur-Explorer im Projekt">
    <figure className="slide-project-image">
      <a href="/"><img src="/analysis-overview.png" alt="Globaler Architektur-Explorer mit Spring-Boot-Bausteinen und den drei Entscheidungsrichtungen Weglassen, Neu definieren und Nutzen" /></a>
    </figure>
  </section>;
  if (index === 5) return <section className="slide-visual" aria-label="Änderungspfade und Codebeispiel">
    <Example title="Explizite Abfrage und Antwortform" code={'record Profile(long id, String username) {}\n\nProfile load(String username) {\n    return jdbc.queryForObject(\n        "SELECT id, username FROM app_user WHERE username = ?",\n        (row, n) -> new Profile(\n            row.getLong("id"), row.getString("username")),\n        username);\n}'} />
    <Example title="Komposition: Fähigkeit gezielt einbinden" code={'class AvatarService {\n    private final ObjectStorage storage;\n\n    AvatarService(ObjectStorage storage) {\n        this.storage = storage;\n    }\n}'} />
  </section>;
  if (index === 6) return <section className="slide-visual" aria-label="Storage-Architektur">
    <Example title="Komposition statt gemeinsamer Basisklasse" code={'class UserAvatarService {\n    private final ObjectStorage storage;\n\n    UserAvatarService(ObjectStorage storage) {\n        this.storage = storage;\n    }\n    // Das Feature prüft Zugriff und Eigentum.\n    // Storage übernimmt nur die Objektoperationen.\n}'} />
  </section>;
  if (index === 2) return <section className="slide-visual" aria-label="Featureorientierte Struktur">
    <Example title="Lokale Interaktion im Frontend" code={'"use client";\nimport { useState } from "react";\n\nexport function Details() {\n  const [open, setOpen] = useState(false);\n  return <>\n    <button aria-expanded={open}\n      onClick={() => setOpen(value => !value)}>Details</button>\n    {open && <p>Begründung der Entscheidung</p>}\n  </>;\n}'} />
  </section>;
  return null;
}
