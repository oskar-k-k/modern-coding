# Modern Coding – Gesprächsleitfaden

## Kernaussage

> Wir optimieren auf nachvollziehbare Änderungspfade. Ein Feature lässt sich vom
> Endpunkt bis zur Datenabfrage verfolgen, ohne automatisch mehrere
> Durchreichschichten öffnen zu müssen. Abstraktion setzen wir dort ein, wo sie
> tatsächlich eine technische oder fachliche Grenze abbildet.

Zeitbedarf: etwa 15–20 Minuten. Vorher `Start.cmd` ausführen, die Oberfläche auf
http://localhost:8085 öffnen, Profil-URL aufrufen und
Controller sowie Service in der IDE öffnen. Im Vortrag zunächst nur diese beiden
Dateien zeigen; alle Java-Pfade unten liegen unter `backend/src/main/java/dev/moderncoding/`.
Storage dient anschließend als bewusstes Gegenbeispiel zu
„alle Interfaces entfernen“.

## Einstieg: Architektur-Explorer — 3 Minuten

1. „Präsentationsmodus“ aktivieren, damit die Tabelle mehr Platz erhält.
2. Im Tab Spring Boot „JPA“ suchen und die Begründung über die Zeile oder `+` öffnen.
3. Suche leeren und die Karte „Nutzen“ anklicken: Schutzmechanismen bleiben wichtig.
4. Zwischen Java, Programmiermustern und Closures wechseln. Bei SQL-Mapping das
   konkrete Lambda-Beispiel öffnen.
5. Anschließend den Backend-Link unten öffnen und Controller/Service zeigen.

Sprechtext: „Diese Zahlen sind subjektive Diskussionsgewichte für unser Beispiel,
keine Forschungsergebnisse und keine Veraltungswahrscheinlichkeiten. Eine hohe Zahl
bei Weglassen bedeutet nicht, dass andere Projekte dieses Werkzeug nicht brauchen.“

Die Übersicht ist zunächst ein kuratierter Arbeitsstand. Next.js selbst ist bewusst
als nächstes Gesprächsthema genannt; dafür definieren wir die Kriterien gemeinsam.
Mit Pfeiltasten lassen sich die fokussierten Tabs wechseln. Suche, Filter, Details
und Präsentationsmodus sind mit der Tastatur bedienbar.

## 1. Controller: Wo kommt die Anfrage an? — 2 Minuten

Öffnen: `features/users/profile/ProfileController.java`.

- `GET /{username}/page`: Ein erkennbarer Einstieg für die Profilseite.
- Der Controller kennt HTTP und die aktuelle Identität.
- Er gibt die Nutzer-ID ausdrücklich an den Service weiter.
- `FollowRequest` liegt direkt bei seinem einzigen HTTP-Verwendungsort.
- Keine abstrakte Controller-Basisklasse und kein Interface nur für diese Klasse.

Sprechtext: „Ich sehe die Endpunkte und folge einem Methodenaufruf. Der Controller
enthält weder SQL noch die Entscheidung, welche Inhalte ein Nutzer sehen darf.“

## 2. Service: Was passiert tatsächlich? — 4 Minuten

Öffnen: `features/users/profile/ProfileService.java`.

1. Oben die Records zeigen: `Profile`, `Stats`, `ContentCard`, `ProfilePageResponse`.
2. `page`: Profil, Statistiken und erste Inhalte als eine API-Antwort zusammensetzen.
3. `contents`: Sichtbarkeit und Cursor direkt im parameterisierten SQL nachvollziehen.
4. `follow`: Authentifizierung prüfen und eine fachliche Schreiboperation delegieren.
5. `@Transactional`: Eine Geschäftsoperation bildet die Transaktionsgrenze.

Sprechtext: „Hier ist die Abfrage sichtbar. Kleine Antworttypen stehen neben ihrem
Verwendungszweck. Das erspart uns für diesen Fall eine Entity, einen Mapper und ein
Repository als zusätzliche Navigationsstationen.“

Wichtig: Die `?`-Parameter enthalten Eingaben. Dynamische SQL-Fragmente werden nur
zwischen fest definierten Varianten gewählt, nicht aus Nutzereingaben gebaut.
Eine Page-Antwort bedeutet einen HTTP-Aufruf, nicht automatisch nur eine SQL-Abfrage.

## 3. Warum das bei KI-Unterstützung hilft — 2 Minuten

- Mensch und KI finden die betroffenen Regeln in einem kleinen, zusammenhängenden Bereich.
- Ein Reviewer sieht Abfrage, Berechtigung und Antwortform im Kontext.
- Weniger redundante Darstellungen reduzieren mögliche widersprüchliche Änderungen.
- Schemaänderungen sind in Flyway explizit versioniert.

Nicht behaupten: „KI macht Entities unnötig“ oder „weniger Dateien ist immer besser“.
Die Vorteile ergeben sich aus dem konkreten Anwendungsfall. KI kann auch in zwei
Dateien falsche Regeln implementieren. Tests, Constraints und Review bleiben nötig.
Keine pauschalen Prozentangaben für Produktivität oder Qualität versprechen.

## 4. Komposition und ein sinnvolles Interface — 3 Minuten

Öffnen: `features/users/UserAvatarService.java`, dann `core/storage/ObjectStorage.java`
und `StorageConfiguration.java`.

Sprechtext: „Der Service erbt nicht von einem StorageService. Er bekommt eine
Storage-Fähigkeit über den Konstruktor. Heute wird eine lokale Implementierung
eingesetzt. An dieser Stelle ist ein Interface sinnvoll, weil der Provider eine
reale Austauschgrenze darstellt.“

```java
public UserAvatarService(JdbcTemplate jdbc, ObjectStorage storage) {
    this.jdbc = jdbc;
    this.storage = storage;
}
```

`implements ObjectStorage` ist weiterhin eine Typabstraktion. Komposition bedeutet
nicht „keine Interfaces“. Wir vermeiden unnötige Implementierungsvererbung, etwa
einen universellen `BaseService`, der Datenbank, Nutzer und Storage mitbringt.

Das Feature entscheidet, welches Objekt gelesen werden darf. Storage speichert
Bytes und kennt weder Profile noch Follower. Ein S3-Adapter wäre eine zusätzliche
Implementierung; er existiert in dieser Demo noch nicht.

## 5. Kleine Live-Demo — 2 Minuten

1. `/api/profiles/alex/page`: Profil, Statistik und 12 erste Inhalte zeigen.
2. `nextCursor=3` nehmen und `/api/profiles/alex/contents?cursor=3` aufrufen.
3. `/api/auth/avatar/1`: Das tatsächlich lokal gespeicherte Profilbild zeigen.
4. Optional `backend/demo.ps1` ausführen: Eigentümeransicht und Follow/Unfollow.

Die Daten sind fiktiv und reproduzierbar. Nach Neustart ist die Datenbank wieder
im Ausgangszustand. Es werden keine externen Konten benötigt.

## Rückfragen, auf die ich vorbereitet wäre

| Frage | Antwort |
| --- | --- |
| Sind Entities schlecht? | Nein. ORM kann bei komplexen Objektmodellen und Änderungen hilfreich sein. Hier passen explizite SQL-Abfragen gut. |
| Warum kein Repository? | Ein reiner Durchreicher bringt hier wenig. Bei einer echten wiederverwendeten Persistenzgrenze können wir eines ergänzen. |
| Werden Services riesig? | Das wäre ein Signal zum gezielten Aufteilen nach Anwendungsfällen. „Zwei Dateien“ ist kein dauerhaftes Größenlimit. |
| Darf ein Service andere Services nutzen? | Ja. Lesen kann aggregieren; Schreiben geht über den fachlichen Besitzer, etwa UserInteractionService. |
| Sind Records Entities? | Hier nein: Sie beschreiben Antworten ohne ORM-Mapping oder Persistenz-Lebenszyklus. |
| Wo ist die Wahrheit über die Datenbank? | In Flyway. Antworttypen und Eingabevalidierung haben andere Aufgaben und bleiben notwendig. |
| Ersetzt das Tests? | Nein. Besonders SQL, Autorisierung und Nebenläufigkeit brauchen überprüfbare Erwartungen. |
| Ist das Clean Architecture? | Es nutzt einige ihrer Ziele, ohne alle möglichen Schichten vorzuschreiben. Entscheidend sind klare Verantwortlichkeiten. |
| Warum H2? | Damit die Demo ohne separaten Datenbankdienst startet. PostgreSQL-Kompatibilitätsmodus bedeutet keine vollständige Gleichheit. |

## Bewusste Grenzen dieses Ausschnitts

Die kompakte Formatierung der Profile-Dateien ist kein allgemeines Gebot, möglichst
viel auf eine Zeile zu schreiben. Bei Teamarbeit ist lesbares Formatieren sinnvoll.
SQL-Strings werden nicht vom Java-Compiler gegen das Schema geprüft. Einige Abfragen
wiederholen Profil-Lookups; das kann später anhand von Messungen verbessert werden.
Für größere gemeinsame Antwortmodelle kann eine eigene Datei sinnvoll werden.

Abschluss: „Wir beginnen mit der einfachsten Struktur, die unsere Anforderungen
verlässlich abbildet. Wir führen zusätzliche Schichten ein, wenn ein konkreter
Nutzen entsteht – und behalten bewusst die Grenzen, die heute schon einen haben.“
