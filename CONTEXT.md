# Modern Coding – Kontext für die Weiterarbeit

Stand: 30. September 2026. Diese Datei fasst das bisherige Gespräch zusammen;
sie ist kein vollständiger Chat-Export. Sie soll ermöglichen, das Projekt auf
einem anderen Rechner in einem neuen Chat weiterzuführen.

## Einstieg für einen neuen Chat

> Lies AGENTS.md, CONTEXT.md und README.md und verschaffe dir einen Überblick über
> frontend/ und backend/. Führe mit mir das Architektur-Brainstorming fort.
> Die bisherigen Ansätze sind Diskussionsgrundlagen, keine endgültigen Regeln.
> Zeige konkrete Beispiele, Code und übersichtliche Tabellen. Hinterfrage unsere
> Annahmen und schlage auch grundlegend andere Lösungen vor, wenn sie helfen.
> Als nächstes möchten wir insbesondere Next.js und die Zusammenarbeit zwischen
> Frontend und Backend untersuchen.

AGENTS.md enthält die aktuellen Arbeitsanweisungen für Änderungen an diesem
Repository. Diese Kontextdatei beschreibt Ziele und Überlegungen; sie ersetzt
weder diese Anweisungen noch neue Wünsche des Nutzers. Eine Diskussion über eine
Alternative bedeutet noch nicht, dass das bestehende Projekt umgebaut werden soll.

## Was wir herausfinden möchten

Wie könnte eine moderne Architektur aussehen, wenn KI einen großen Teil des Codes
schreibt und Menschen vor allem Anforderungen formulieren, Ergebnisse prüfen,
Fehler eingrenzen und Änderungen beurteilen?

Die Ausgangshypothese des Nutzers: Viele verbreitete Entwicklungsstrukturen sind
stark auf manuelles Programmieren ausgerichtet. Deshalb wollen wir ihre Eignung
für KI-gestützte Entwicklung neu prüfen. Das ist eine Hypothese, kein Nachweis,
dass bisherige Werkzeuge oder Frameworks veraltet wären.

Die Untersuchung ist grundsätzlich offen: Programmiersprache, Framework,
Frontend-/Backend-Grenzen und Programmierparadigmen dürfen hinterfragt werden.
Java, Spring Boot und Next.js bilden das aktuelle Anschauungsbeispiel, keine
unveränderliche Zielarchitektur.

## Prioritäten und bevorzugte Zusammenarbeit

1. **Der Code muss zuverlässig funktionieren.** Korrektheit, Sicherheit,
   Authentifizierung, Berechtigungen, Datenintegrität und Performance haben Vorrang.
2. **KI soll den relevanten Kontext gut erfassen können.** Abhängigkeiten,
   Verträge und fachliche Regeln sollen auffindbar und nachvollziehbar sein.
3. **Menschen sollen den betroffenen Ablauf schnell identifizieren können.**
   Möglichst wenig zwischen Dateien und Abstraktionen springen müssen.

Der Nutzer mag konkrete Codebeispiele, direkte Vergleiche und Tabellen mit Zahlen.
Lange theoretische Ausführungen helfen ihm weniger. Offen widersprechen, wenn
eine Annahme nicht trägt; nicht nur die bestehende Idee bestätigen. Auch abstrakte
oder ungewöhnliche Vorschläge sind willkommen, wenn ihr Nutzen erklärt wird.

## Zentrale Architekturidee

Bei einem Fehler an einem Endpunkt soll der Weg kurz sein:

```text
Endpunkt → fachlicher Ablauf → SQL und Berechtigung → Antworttyp
```

Idealerweise sieht man den für einen Anwendungsfall nötigen Kontext in einer
oder wenigen zusammengehörigen Dateien. Beispiel: ProfileController und
ProfileService. Dort sind HTTP-Einstieg, aktuelle Identität, Query und kleine
Response-Records leicht zu finden.

Das Ziel ist **lokal nachvollziehbare Komplexität**, nicht möglichst einfacher
Code um jeden Preis. Ein komplizierter Algorithmus oder eine anspruchsvolle Query
darf kompliziert bleiben, wenn das Problem es verlangt. Ebenso wenig ist eine
feste Grenze von zwei Dateien oder eine riesige Klasse für alle Features gemeint.

Das Beispiel ähnelt Vertical Slice Architecture. Die weitergehende Frage ist,
welche Strukturen sich bei KI-Erstellung und menschlichem Review tatsächlich
bewähren. Der Name eines Musters beantwortet diese Frage noch nicht.

## Bisherige Überlegungen und ihre Grenzen

| Thema | Arbeitsstand |
| --- | --- |
| JPA-Entities / ORM | In dieser JDBC-Demo nicht nötig. KI macht ORM nicht generell überflüssig; komplexe Objektmodelle können dafür sprechen. |
| Repositories | Keine obligatorischen Wrapper, die lediglich weiterleiten. Bei einer echten Persistenz- oder Wiederverwendungsgrenze weiterhin denkbar. |
| DTOs | Separate DTO-Dateien reduzieren, wenn lokale Records genügen. Typisierte Eingaben und Antwortverträge bleiben erhalten. |
| Services | Fachliche Abläufe und Transaktionsgrenzen sind gute Gründe. Keine zusätzliche Schicht nur zur Erfüllung eines Schemas. |
| Interfaces | Gezielt an sinnvollen Grenzen. ObjectStorage ist das vorhandene Beispiel für einen austauschbaren Provider. |
| Vererbung | Komposition bevorzugen, wenn dadurch Abhängigkeiten und Verhalten leichter sichtbar werden. Kein pauschales Verbot echter Subtyp-Beziehungen. |
| Gemeinsame Regeln | Invarianten bei ihrem fachlichen Besitzer bündeln; nicht für maximale Lokalität widersprüchlich duplizieren. |
| Tests und Typen | Bleiben notwendig. Lokaler Code und KI-Erstellung sind kein Beleg für Korrektheit. |
| Closures / Lambdas | Kurze lokale Transformationen und SQL-Mapping passen gut. Tiefe Verschachtelung, große Business-Lambdas und langlebige Captures bewusst prüfen. |

### SQL und Performance

Der Nutzer hat ausdrücklich präzisiert: Nicht künstlich eine einzige Abfrage
erzwingen und auch nicht aus Gründen der Lesbarkeit in viele Abfragen zerlegen.
Entscheidend ist, was für Datenmenge und Zugriffsmuster besser funktioniert.
Ausführungspläne, Indizes, Roundtrips, Ergebnismengen, Sperren und Konsistenz müssen
berücksichtigt werden. Vermutete Performancevorteile bei Bedarf messen.

Eine HTTP-Antwort kann mehrere SQL-Abfragen enthalten. Die aktuelle Demo ist kein
Benchmark für große Datenbestände. H2 im PostgreSQL-Modus ersetzt keine Prüfung
gegen eine echte PostgreSQL-Datenbank.

### Zahlen und Recherche

Der Nutzer hatte nach aktueller Forschung und Ansätzen speziell für KI-Workflows
gefragt. Diese Datei enthält jedoch keine verifizierte Forschungsbibliografie.
Bei weiteren empirischen Aussagen Primärquellen recherchieren und sauber zwischen
Beleg, eigener Einschätzung und Hypothese unterscheiden.

Die Oberfläche zeigt **subjektive Diskussionsgewichte** für „Weglassen“,
„Neu definieren“ und „Nutzen“. Pro Zeile ergeben sie 100 %. Sie sind weder
gemessene Wahrscheinlichkeiten noch ein Veraltungsgrad oder Studienergebnisse.
Die Werte sind veränderbar und beziehen sich auf unseren Beispielansatz.

## Aktueller Projektstand

Repository: https://github.com/oskar-k-k/modern-coding

Ein gemeinsames Repository mit zwei separat baubaren Anwendungen:

```text
modern-coding/
├── frontend/           Next.js App Router, React, TypeScript
├── backend/            Java 21, Spring Boot, Maven Wrapper
├── compose.yaml        Gemeinsamer Docker-Start
├── Start.cmd           Windows-Doppelklick-Einstieg
├── Start.ps1           Docker prüfen, bauen, starten, Browser öffnen
├── Stop.cmd            Container stoppen, Volume erhalten
├── start.sh            Linux/macOS-Einstieg
├── README.md           Einrichtung und technische Details
├── PRESENTATION.md     Deutsche Sprech- und Präsentationsnotizen
├── AGENTS.md           Arbeitsanweisungen
└── CONTEXT.md           Diese Gesprächsübergabe
```

### Backend

- Java 21, Spring Boot 3.5.x, JDBC, Flyway, eingebettetes H2 im PostgreSQL-Modus.
- Wichtigste Präsentationsdateien:
  [ProfileController](backend/src/main/java/dev/moderncoding/features/users/profile/ProfileController.java)
  und [ProfileService](backend/src/main/java/dev/moderncoding/features/users/profile/ProfileService.java).
- Kleine Antwort-Records und SQL nahe am Anwendungsfall; keine obligatorischen
  JPA-Entities, Repository-Wrapper oder BaseController/BaseService.
- UserInteractionService besitzt gemeinsame Schreibregeln. ObjectStorage und der
  lokale Provider zeigen eine begründete technische Abstraktion.
- Parameterisiertes SQL, Transaktionen, Constraints, Autorisierung und CSRF bleiben.
- Fiktive Demo-Nutzer, keine externe Anmeldung und keine Produktionskonfiguration.
- Öffentliches Beispiel: `/api/profiles/alex/page`; API-Vertrag: `/v3/api-docs`.

### Frontend

- Next.js 16.3.7, React 19.3.0 und TypeScript; genaue Versionen in package.json.
- Präsentationsoberfläche mit 60 Diskussionspunkten in vier Tabs: Spring Boot,
  Java, Programmiermuster und Closures.
- Suche, Tendenzfilter, farbige Prozentbalken, aufklappbare Begründungen,
  einzelne Codebeispiele und Präsentationsmodus.
- Bewertungen und Texte: [architecture-data.ts](frontend/app/architecture-data.ts).
- Interaktion: [architecture-explorer.tsx](frontend/app/architecture-explorer.tsx).
- Gestaltung: [globals.css](frontend/app/globals.css).
- Tabellen funktionieren ohne Backend. Der API-Link verwendet das Spring-Beispiel.
- Keine Bearbeitung oder Speicherung der Bewertungen im Browser implementiert.
- Next.js selbst ist als nächstes Diskussionsthema vorgemerkt, noch kein eigener
  bewerteter Tab.

### Start und Kommunikation

Für die Präsentation Docker Desktop mit Linux-Containern installieren, Repository
klonen und unter Windows `Start.cmd` doppelklicken. Der erste Build benötigt
Internet. Java und Node müssen für den Docker-Weg nicht lokal installiert sein.

Docker veröffentlicht standardmäßig nur `127.0.0.1:8085`. Hier liefert Next.js die
Oberfläche aus und leitet `/api/*` sowie `/v3/api-docs/*` intern an Spring weiter.
Das Backend hat keinen veröffentlichten Host-Port. API-Schutzmechanismen werden
weiterhin von Spring umgesetzt. Details und alternative Ports stehen in README.md.

Lokale Entwicklung: Backend auf 8085, Next.js auf 3000. Die Docker-Demo sollte
dabei nicht gleichzeitig den Backend-Port belegen. BACKEND_URL konfiguriert das
Proxyziel; beim Produktionsbuild wird die Rewrite-Konfiguration festgelegt.

## Zuletzt geprüft

Beim Implementierungsstand vor dieser Dokumentationsübergabe wurden erfolgreich
ausgeführt:

- Acht Backend-Tests mit dem Maven Wrapper.
- Next.js-Typprüfung und Produktionsbuild.
- Docker-Build und gemeinsamer Start über Start.ps1; beide Dienste wurden gesund.
- API-Weiterleitung, OpenAPI sowie angemeldetes Follow/Unfollow mit CSRF.
- Browserprüfung von Tabs, Suche, Filtern einschließlich Gleichstand, Details,
  Codebeispielen, leerem Suchergebnis, Präsentationsmodus und Tastatursteuerung.
- Desktop- und Mobilansicht; kein horizontaler Seitenüberlauf und keine erfassten
  JavaScript-Laufzeitfehler bei diesen Interaktionen.

Das beschreibt die damalige Prüfung, keine automatische Garantie für spätere
Änderungen. Der Anwendungsstand wurde auf `main` als Commit `e9a1531` gepusht.

## Sinnvolle nächste Gespräche

1. **Next.js untersuchen:** Welche Aufgaben gehören in Server Components, welche
   in Client Components? Wo liegen Zuständigkeiten von Next und Spring? Was
   bringen Route Handler oder Server Actions konkret in diesem Setup?
2. **Einen echten Ablauf vergleichen:** Zum Beispiel Profil anzeigen oder folgen.
   Zwei Architekturvarianten anhand desselben Verhaltens zeigen, statt nur
   abstrakte Muster zu bewerten.
3. **Bewertungskriterien schärfen:** Wie viele Stellen muss man für eine Änderung
   verstehen? Wie sichtbar sind Berechtigungen und Seiteneffekte? Welche Fehler
   entdecken Typen, Tests oder Datenbank-Constraints?
4. **Wiederverwendung gegen Lokalität abwägen:** Wann ist eine gemeinsame Grenze
   hilfreich, wann produziert sie nur zusätzliche Navigation?
5. **Empirisch prüfen:** Kleine vergleichbare Änderungsaufgaben mit KI bearbeiten
   und Review-Aufwand, Fehler und Laufzeitverhalten beobachten. Weniger Dateien
   allein sind noch kein Qualitätsmaß.

Diese Punkte sind Vorschläge, keine bereits beauftragten Implementierungen.
Das Projekt soll ein offenes Architektur-Labor bleiben.
