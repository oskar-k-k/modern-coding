# Modern Coding

Ein eigenständiges Spring-Boot-Beispiel für eine kompakte, featureorientierte
Architektur. Die Präsentation beginnt in **ProfileController.java** und
**ProfileService.java**. Das Next.js-Frontend stellt die Architektur als interaktive Tabellen dar. Kein externer Login, keine externe Datenbank.

Die These: **Weniger obligatorische Zwischenschichten, kurze nachvollziehbare
Änderungspfade und Komposition an konkreten Grenzen.** Das unterstützt menschliches
Review und KI-gestützte Entwicklung. Es ist kein Beweis, dass ORM, Repositories
oder Vererbung generell überholt wären.

## Start mit Docker

Die Backend-Analyse bleibt im Bereich **Spring Boot & Java** und ist nach
Sprache & Typen, Programmierparadigmen, Architektur & Struktur, Code-Design,
Daten & Persistenz, Framework & Laufzeit sowie Qualität & Sicherheit gegliedert.
Jeder allgemeine Bewertungspunkt erscheint genau einmal. Die Gewichte sind
subjektive Einschätzungen; technische Referenzen stehen bei den jeweiligen Punkten.

**Windows: `Start.cmd` doppelklicken.** Das Skript startet bei Bedarf Docker Desktop,
baut beide Anwendungen, wartet auf deren Bereitschaft und öffnet den Browser.
Voraussetzung ist eine installierte Docker-Desktop-Version mit Compose v2 und
Linux-Containern. Java, Maven und Node müssen für diesen Weg nicht installiert sein.
Beim ersten Start werden Images und Pakete aus dem Internet geladen.
Mit `Stop.cmd` beide Anwendungen stoppen; gespeicherte Demo-Objekte bleiben erhalten.
Linux/macOS: Docker starten und im Projektordner `sh start.sh` ausführen.

Voraussetzung: Docker mit Compose, bei Docker Desktop Linux-Container auswählen.
Im Projektverzeichnis:

```sh
docker compose up --build -d
docker compose ps
```

Danach öffnen:

- Präsentation: http://localhost:8085
- Allgemeine Firmenpräsentation: http://localhost:8085/praesentation
- Profilantwort: http://localhost:8085/api/profiles/alex/page
- Profilbild aus Object Storage: http://localhost:8085/api/auth/avatar/1
- API-Vertrag als JSON: http://localhost:8085/v3/api-docs

Der eigene Compose-Projektname ist `modern-coding`. Nur Port **8085** wird an
**127.0.0.1** veröffentlicht. Es gibt keine Abhängigkeiten zu benachbarten Projekten.
H2 läuft innerhalb der Anwendung; Object Storage verwendet ein eigenes Docker-Volume.
Keine Datenbank-Ports werden veröffentlicht.

Ist der Port belegt, eine `.env` neben `compose.yaml` erstellen:

```dotenv
MODERN_CODING_PORT=8086
```

Stoppen: `docker compose down`. Ein App-Neustart setzt die In-Memory-Datenbank auf
die Beispieldaten zurück. Das Storage-Volume bleibt erhalten; die zwei Demo-Bilder
werden beim Start erneut angelegt. `docker compose down -v` entfernt zusätzlich
**das Volume dieser Demo**. Images und Abhängigkeiten vor der Präsentation einmal
herunterladen/bauen; danach genügt `docker compose up -d` ohne erneuten Build.

## Start mit IntelliJ oder Java

Java 21 installieren, `backend/pom.xml` als Maven-Projekt öffnen und
`ModernCodingApplication` starten. Alternativ:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Unter Linux/macOS im Ordner `backend/`: `sh mvnw spring-boot:run`. Maven selbst muss nicht installiert
werden. Beim ersten Start ist Internet für die Abhängigkeiten erforderlich.
Docker und lokalen Java-Start nicht gleichzeitig auf demselben Port verwenden.
Lokaler Storage liegt unter `data/objects` und gehört nicht ins Repository.

## Die Präsentationsdateien

### Gemeinsames Repository

```text
modern-coding/
├── frontend/          Next.js App Router, TypeScript, Präsentationsoberfläche
│   ├── app/architecture-data.ts       Diskussionswerte und Begründungen
│   ├── app/architecture-explorer.tsx  Tabs, Suche, Filter und Details
│   └── app/globals.css                Darstellung und responsive Layouts
├── backend/           Spring Boot, Maven Wrapper, SQL und Tests
├── compose.yaml       Gemeinsamer Start, nur ein öffentlicher lokaler Port
├── Start.cmd / Start.ps1 / Stop.cmd
├── start.sh
├── README.md
├── PRESENTATION.md
└── AGENTS.md
```

Die Anwendungen haben eigene Build-Dateien und Dockerfiles. Next.js leitet `/api/*`
und `/v3/api-docs/*` an Spring Boot weiter. Im Docker-Netz heißt das Backend `app`;
es hat keinen veröffentlichten Host-Port. Der Browser nutzt dieselbe Origin für
Oberfläche und API. Anmeldung, Autorisierung und CSRF werden weiterhin in Spring
geprüft. Das Frontend enthält keine zweite Benutzerverwaltung.

Die Tabellen sind ein lokaler Diskussionsstand, keine gemessenen Wahrscheinlichkeiten.
Jede Zeile gewichtet **Weglassen / Neu definieren / Nutzen** mit insgesamt 100 %.
Die Zahlen lassen sich in `frontend/app/architecture-data.ts` ändern. Die Karten
zählen Zeilen mit eindeutig höchstem Gewicht; Gleichstände erscheinen unter
„Offen / Gleichstand“. Es gibt keine automatisch gespeicherten Änderungen im Browser.

### Frontend lokal entwickeln

Node.js 22 oder neuer installieren. In einem zweiten Terminal:

```powershell
cd frontend
npm ci
npm run dev
```

Öffnen: http://localhost:3000. Die Tabellen funktionieren eigenständig; für den
API-Link zusätzlich das Backend lokal unter Port 8085 starten. `BACKEND_URL`
kann das Ziel ändern und muss vor dem Start beziehungsweise Produktions-Build
gesetzt werden, weil Next.js die Rewrite-Konfiguration beim Build übernimmt.
Docker-Demo und lokale Entwicklung nicht gleichzeitig auf Port 8085 betreiben.

### Backend zeigen

| Datei | Was zeigen? |
| --- | --- |
| [ProfileController](backend/src/main/java/dev/moderncoding/features/users/profile/ProfileController.java) | HTTP-Endpunkte, aktuelle Identität, Delegation an den Service |
| [ProfileService](backend/src/main/java/dev/moderncoding/features/users/profile/ProfileService.java) | Page-Antwort, lokale Records, SQL, Sichtbarkeit, Transaktionen und Cursor |
| [ObjectStorage](backend/src/main/java/dev/moderncoding/core/storage/ObjectStorage.java) | Ein Interface mit einer konkreten technischen Austauschgrenze |
| [UserAvatarService](backend/src/main/java/dev/moderncoding/features/users/UserAvatarService.java) | Komposition: SQL bestimmt den Objektschlüssel, Storage liefert Bytes |
| [StorageConfiguration](backend/src/main/java/dev/moderncoding/core/storage/StorageConfiguration.java) | Hier wird der lokale Provider zusammengesteckt |
| [Präsentationsleitfaden](PRESENTATION.md) | Ablauf, Argumente, Formulierungen und erwartbare Rückfragen |

Die beiden Profile-Dateien behalten die kompakte Struktur und SQL-Abfragen des
zugrundeliegenden Beispiels bei; Packages wurden neutralisiert. Bewusst keine
zusätzlichen BaseController, Repository-Interfaces oder separaten DTO-Dateien.
OpenAPI-Annotationen beschreiben den Antwortvertrag, nicht das Datenbankschema.

## Orientierung

```text
dev.moderncoding
├── ModernCodingApplication
├── core/storage
│   ├── ObjectStorage
│   ├── LocalObjectStorage
│   └── StorageConfiguration
├── features
│   ├── users
│   │   ├── profile/ProfileController + ProfileService
│   │   ├── auth/AuthSessions
│   │   ├── UserAvatarController + UserAvatarService
│   │   ├── UserInteractionService
│   │   └── UserEnums
│   └── content/ContentMediaService
└── platform
    ├── DemoSecurity
    └── DemoFixtures
```

`core` enthält hier die kleine gemeinsam verwendete Storage-Fähigkeit inklusive
lokalem Adapter. Bei mehreren Providern können Implementierungen in einen eigenen
Infrastructure-Bereich wandern. Nicht jede zweimal verwendete Funktion gehört
automatisch in Core. Fachliche Regeln bleiben beim besitzenden Feature.

## Beispieldaten und API

- `alex`: 14 öffentliche Beiträge, ein privater veröffentlichter Beitrag, ein Entwurf.
- `sam` und `jordan`: Beispieldaten für Follower; Sam besitzt einen gespeicherten Artikel.
- Alex hat Sams Artikel gespeichert und zwei Follower.
- Demo-Anmeldung per HTTP Basic: **alex / demo-password** oder **sam / demo-password**.
- Öffentlich sichtbar sind 14 Beiträge, als Alex 15. Entwürfe bleiben ausgeblendet.
- Seitengröße: 12, über `nextCursor` nachladen. Verbindungsliste: maximal 50.

| Methode | Pfad | Zweck |
| --- | --- | --- |
| GET | `/api/profiles/alex/page` | Profil, Statistik und erste Content-Seite |
| GET | `/api/profiles/alex/contents?cursor=3` | Weitere öffentliche Beiträge |
| GET | `/api/profiles/alex/contents?saved=true` | Gespeicherte Inhalte, nur als Alex |
| GET | `/api/profiles/alex/connections` | Follower; `followers=false` für Gefolgte |
| POST | `/api/profiles/jordan/follow` | Folgen/Entfolgen mit `{"following":true}` bzw. `false` |
| GET | `/api/profiles/media/1` | Öffentliches Beispielbild |
| GET | `/api/auth/avatar/1` | Öffentliches Profilbild |

Schreibzugriffe benötigen Anmeldung **und CSRF-Token**. Der IntelliJ-HTTP-Client
kann die Requests in [demo.http](backend/demo.http) ausführen. Die erste Anfrage speichert
den Token; Cookies müssen vom Client beibehalten werden. Alternativ zeigt
[demo.ps1](backend/demo.ps1) einen vollständigen Ablauf mit derselben Web-Session.

## Object Storage: Komposition statt Basisklasse

```text
ProfileService → avatarPath → UserAvatarController → UserAvatarService
                                                     ├── JdbcTemplate
                                                     └── ObjectStorage
                                                          ↑ implementiert
                                                     LocalObjectStorage
```

Der ProfileService selbst lädt keine Bildbytes: Er liefert eine URL. Erst die
Bildanfrage nutzt den Storage. Für Content-Bilder läuft derselbe Gedanke über
ContentMediaService, der zusätzlich Eigentümerschaft und Blockierungen prüft.

Das Storage-Interface ist eine bewusst kleine Demo-Fassung mit `put`, `read` und
`delete`. Es ist keine vollständige S3-Abbildung. Ein späterer S3-Adapter würde
diesen Vertrag implementieren; die Feature-Konstruktoren bleiben gleich.
Authentifizierung, Konfiguration und Provider-Tests kämen selbstverständlich hinzu.
**Ein S3-Adapter ist hier nicht implementiert.**

Der lokale Adapter speichert Bytes und MIME-Typ gemeinsam, ersetzt Dateien atomar
und bildet Objektschlüssel auf gehashte Dateinamen ab. Er begrenzt Objekte auf 10 MiB
und lädt sie vollständig in den Speicher. Für große Uploads wären Streams und
entsprechende Limits sinnvoll. Der Storage-Ordner ist anwendungseigen; Manipulation
durch andere lokale Prozesse, etwa über Symlinks, ist nicht Teil dieses Demo-Modells.

## Was bleibt bewusst erhalten?

Typen, Zugriffsschutz, parameterisiertes SQL, Transaktionen, Datenbank-Constraints
und Tests bleiben wichtig. Java-Records sind weiterhin Typen; sie sind hier keine
JPA-Entities. Zusammengesetzte Schreibvorgänge haben eine zuständige Service-Grenze.
Die H2-Datenbank läuft im PostgreSQL-Kompatibilitätsmodus, ersetzt aber keine
Integrationstests gegen PostgreSQL für ein Produktionssystem.

Dies ist eine lokale Präsentation: feste Demo-Passwörter, keine Registrierung,
keine OAuth-Anbindung, keine Upload-API und kein Produktionsbetrieb. Zähler und
Inhalte sind Fixtures; nur Follow/Unfollow ist als Schreibablauf umgesetzt.
Eine Page-Antwort reduziert HTTP-Aufrufe, enthält aber mehrere SQL-Abfragen.
Die Lesetransaktion verspricht keinen Snapshot über alle Abfragen hinweg.

## Prüfen

```powershell
cd backend
.\mvnw.cmd test
```

Die Tests prüfen unter anderem öffentliche/private Inhalte, Cursor, Follow,
CSRF, Blockierungen, Profilbilder und lokale Storage-Operationen.
Der Docker-Build führt sie ebenfalls aus.

Frontend separat prüfen:

```powershell
cd frontend
npm ci
npm run typecheck
npm run build
```

## Auf einem anderen Rechner präsentieren

### Quellen der Projektbeispiele

Die allgemeine Frontend-Matrix liegt getrennt in
`frontend/app/global-frontend-data.ts`: Next.js, React, TypeScript/JavaScript,
HTML/Barrierefreiheit, CSS, Daten/Formulare, Tests/Performance und Architektur/AI.
Sie wird nur unter Global/Allgemein eingebunden; Projektbewertungen bleiben
unveraendert. Die Beispiele sind Illustrationen, keine Repository-Fundstellen.
Technische Referenzen und Pruefdatum werden mit exportiert. Die Prozentwerte
sind redaktionelle Diskussionsgewichte, keine Messungen oder pauschalen Verbote.
Pruefung der Matrix: `node scripts/check-global-frontend.cjs`.

IST-Beispiele in Projektanalysen stammen aus geprüften Quellcode-Ausschnitten.
Unter dem Code stehen der relative Repository-Pfad, der inklusive Zeilenbereich
und das Aufnahmedatum. Der JSON-Export enthält zusätzlich den SHA-256 des
Ausschnitts (UTF-8, LF-Zeilenenden, ohne zusätzlichen abschließenden Zeilenumbruch).
SOLL-Code ist als Entwurf gekennzeichnet. Bei neuen Zieltechniken kann der
IST-Ausschnitt den zu ersetzenden Bestand zeigen. Ohne passende Fundstelle
erscheint kein erfundenes IST-Beispiel.

Zusammengehörige Stellen erscheinen als geordnete Abschnitte mit Dateinamen und
eigener Erklärung, etwa Controller, Service und Antwortmodell. Jeder IST-Abschnitt
hat einen eigenen Quellenbeleg. Dateinamen im SOLL sind Vorschläge für den Neubau;
Methodenausschnitte sind keine vollständigen, ausführbaren Implementierungen.
Die Zuordnung steht in `frontend/app/project-code-flows.ts`. Der JSON-Export
übernimmt diese Abschnitte unter `examples.current.parts` beziehungsweise
`examples.recommended.parts` einschließlich Beschreibung, Code und IST-Quellen.
Die bisherigen `code`-Felder bleiben für bestehende Export-Leser erhalten.

Die Momentaufnahmen liegen in `frontend/app/project-code-snapshots.json`;
`scripts/project-code-selections.mjs` enthält die geprüfte Auswahl.
Die Präsentation benötigt keinen Zugriff auf das analysierte Repository.
Zum Prüfen gegen einen separat vorhandenen Checkout, aus dem Projektverzeichnis:

```powershell
node scripts/project-code-snapshots.mjs revidacon "<Pfad zum RevidaCon-Checkout>" --check
node scripts/project-code-snapshots.mjs modern-coding . --check
node scripts/check-project-evidence.cjs
```

Nach erneuter Prüfung der Zeilenauswahl aktualisiert derselbe Aufruf ohne
`--check` die Momentaufnahmen. Private Konfigurationen und Zugangsdaten gehören
nicht in die Auswahl.

### Start

```sh
git clone https://github.com/oskar-k-k/modern-coding.git
cd modern-coding
```

Anschließend `Start.cmd` doppelklicken (Windows) oder `sh start.sh` (Linux/macOS).
Alle nötigen Projektdateien liegen in diesem Repository. Eigene `.env`-Dateien,
IDE-Einstellungen, Build-Ergebnisse und lokale Daten werden nicht versioniert.
Für eine Präsentation ohne Internet vorher auf diesem Rechner einmal bauen;
danach reicht `docker compose up -d --wait` mit den vorhandenen Images.
