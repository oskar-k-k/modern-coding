export type Rating = {
  name: string;
  scores: [number, number, number];
  reason: string;
  example?: string;
};
export type Topic = {
  id: string;
  label: string;
  subtitle: string;
  rows: Rating[];
};
const row = (
  name: string,
  scores: Rating["scores"],
  reason: string,
  example?: string,
): Rating => ({ name, scores, reason, example });
export const topics: Topic[] = [
  {
    id: "spring",
    label: "Spring Boot",
    subtitle: "Weniger Schichten. Dieselben Garantien.",
    rows: [
      row(
        "JPA-Entities & Hibernate",
        [75, 15, 10],
        "Für diese SQL-orientierte Demo verzichtbar. Bei komplexen Objektgraphen kann ORM weiterhin eine gute Wahl sein.",
      ),
      row(
        "Repository pro Entity",
        [65, 25, 10],
        "Ein Wrapper ohne eigene Verantwortung verlängert den Weg zur Query. Wiederverwendbare fachliche Abfragen können eine eigene Grenze rechtfertigen.",
      ),
      row(
        "Request- & Response-Typen",
        [0, 80, 20],
        "Verträge bleiben explizit und typisiert; kleine Records stehen direkt am Anwendungsfall.",
        "record ProfileResponse(long id, String username) {}",
      ),
      row(
        "Separate Mapper-Klassen",
        [70, 20, 10],
        "Kleine Abbildungen lokal halten. Aufwendige oder mehrfach benötigte Transformationen gezielt auslagern.",
      ),
      row(
        "Service-Schicht",
        [10, 65, 25],
        "Nach fachlichen Abläufen schneiden. Transaktionsgrenzen und gemeinsame Regeln begründen einen Service.",
      ),
      row(
        "Interface für jeden Service",
        [90, 5, 5],
        "Ein Interface lohnt sich an austauschbaren Grenzen wie ObjectStorage; nicht automatisch für jede Klasse.",
      ),
      row(
        "BaseController / BaseService",
        [90, 10, 0],
        "Generische Basisklassen verstecken Verhalten. Konkrete Abläufe und Komposition erleichtern das Nachverfolgen.",
      ),
      row(
        "Technische Paketstruktur",
        [10, 85, 5],
        "Dateien nach Feature bündeln, statt Controller, Services und Modelle über globale Ordner zu verteilen.",
      ),
      row(
        "REST-Controller",
        [0, 15, 85],
        "HTTP-Vertrag und Einstiegspunkt bleiben klar erkennbar. Keine Datenbankabstraktion nur für die Form.",
      ),
      row(
        "Dependency Injection",
        [0, 10, 90],
        "Abhängigkeiten per Konstruktor sichtbar machen. Lebenszyklen und Konfiguration übernimmt Spring.",
      ),
      row(
        "JDBC & parameterisiertes SQL",
        [0, 15, 85],
        "Queries nahe am Anwendungsfall. Query-Pläne, Indizes und Datenmengen entscheiden über Performance, nicht die Anzahl der Codezeilen.",
      ),
      row(
        "Transaktionen",
        [0, 10, 90],
        "Zusammengehörige Änderungen brauchen atomare Grenzen und einen bewussten Umgang mit Nebenläufigkeit.",
      ),
      row(
        "Flyway & Schema-Constraints",
        [0, 5, 95],
        "Versionierte Migrationen und Datenbankregeln sichern die Integrität unabhängig vom aufrufenden Code.",
      ),
      row(
        "Authentifizierung",
        [0, 5, 95],
        "Identität und Session-Verarbeitung bleiben Aufgabe bewährter Sicherheitsmechanismen.",
      ),
      row(
        "Autorisierung & Rollen",
        [0, 60, 40],
        "Zugriffsregeln fachlich verständlich am Use Case ausdrücken. Objektbezogene Rechte nicht durch Rollen allein ersetzen.",
      ),
      row(
        "Sessions & CSRF",
        [0, 10, 90],
        "Browserbasierte Sessions brauchen passende Schutzmechanismen. Ein neues Frontend hebt diese Anforderungen nicht auf.",
      ),
      row(
        "Validierung",
        [0, 15, 85],
        "Eingaben am Rand prüfen; fachliche und Datenbank-Invarianten zusätzlich an ihren jeweiligen Grenzen absichern.",
      ),
      row(
        "Eigene Business-AOP",
        [65, 30, 5],
        "Versteckte fachliche Ausführung erschwert das Review. Explizite Aufrufe bevorzugen.",
      ),
      row(
        "Logs, Metriken & Actuator",
        [0, 10, 90],
        "Laufzeitverhalten muss beobachtbar bleiben. Sensible Daten gehören nicht in Logs.",
      ),
      row(
        "Integrationstests",
        [0, 15, 85],
        "Echte HTTP-, SQL- und Sicherheitsgrenzen prüfen. KI-generierter Code braucht überprüfbare Erwartungen.",
      ),
      row(
        "Mock-lastige Schichtentests",
        [35, 55, 10],
        "Verhalten statt interner Aufrufketten prüfen; Mocks gezielt an externen Grenzen einsetzen.",
      ),
      row(
        "WebFlux",
        [80, 10, 10],
        "Für diese blockierende JDBC-Demo kein Default. Ein vollständig reaktiver Ablauf kann andere Anforderungen erfüllen.",
      ),
    ],
  },
  {
    id: "java",
    label: "Java",
    subtitle: "Explizite Verträge. Lokale Komplexität.",
    rows: [
      row(
        "Statische Typisierung",
        [0, 0, 100],
        "Compilerfeedback begrenzt Fehler und macht Verträge für Mensch und KI überprüfbar.",
      ),
      row(
        "Records",
        [0, 5, 95],
        "Kompakte Datenträger für Antworten und Werte. Referenzierte veränderliche Objekte werden dadurch nicht automatisch unveränderlich.",
        "record ContentCard(long id, String title) {}",
      ),
      row(
        "Enums",
        [0, 10, 90],
        "Geschlossene Wertemengen explizit ausdrücken, statt frei verteilte Strings zu vergleichen.",
      ),
      row(
        "Klassen",
        [0, 30, 70],
        "Nach zusammengehöriger Verantwortung schneiden. Keine Klasse nur als Zwischenstation erzeugen.",
      ),
      row(
        "Interfaces",
        [15, 65, 20],
        "An stabilen Austauschgrenzen einsetzen. Eine zweite Implementierung ist ein Hinweis, aber nicht die einzige Begründung.",
      ),
      row(
        "Vererbung",
        [65, 25, 10],
        "Tiefe Hierarchien verteilen Verhalten. Echte Subtyp-Beziehungen sind weiterhin ein legitimer Einsatz.",
      ),
      row(
        "Komposition",
        [0, 10, 90],
        "Benötigte Fähigkeiten als sichtbare Abhängigkeiten zusammenstellen.",
      ),
      row(
        "Unveränderliche Daten",
        [0, 15, 85],
        "Weniger versteckte Zustandswechsel vereinfachen Nebenläufigkeit und lokale Analyse.",
      ),
      row(
        "Globaler veränderlicher Zustand",
        [90, 10, 0],
        "Weitreichende Seiteneffekte verhindern, dass man einen Ablauf lokal verstehen kann.",
      ),
      row(
        "Generics",
        [5, 35, 60],
        "Typisierte Wiederverwendung beibehalten; komplizierte Typsystem-Konstruktionen brauchen einen konkreten Nutzen.",
      ),
      row(
        "var",
        [5, 30, 65],
        "Bei offensichtlichem Typ hilfreich. Bei unklaren Rückgaben kann der ausgeschriebene Typ mehr Orientierung bieten.",
      ),
      row(
        "Optional",
        [10, 50, 40],
        "Optionalität in Rückgaben sichtbar machen; nicht wahllos in Felder und Parameter tragen.",
      ),
      row(
        "Exceptions",
        [0, 30, 70],
        "Fehlergrenzen explizit behandeln. Nicht für jeden fachlichen Fall eine eigene Exception-Hierarchie.",
      ),
      row(
        "try-with-resources",
        [0, 0, 100],
        "Ressourcen zuverlässig schließen. Framework-verwaltete Ressourcen nicht zusätzlich manuell besitzen.",
      ),
      row(
        "Streams",
        [10, 50, 40],
        "Gut für lokale Transformationen. Lange Ketten mit Seiteneffekten erschweren die Kontrolle.",
      ),
      row(
        "Schleifen",
        [0, 5, 95],
        "Direkte Kontrollflüsse sind bei Abbruchbedingungen und zustandsbehafteten Abläufen oft klarer.",
      ),
      row(
        "Virtual Threads",
        [20, 30, 50],
        "Für viele blockierende I/O-Aufgaben prüfen. Sie beschleunigen keine CPU-Arbeit und vergrößern keinen Connection-Pool.",
      ),
      row(
        "parallelStream()",
        [80, 15, 5],
        "Kein pauschaler Performance-Schalter. Ausführung, Datenmenge und gemeinsame Ressourcen müssen dazu passen.",
      ),
      row(
        "Eigene Reflection",
        [80, 15, 5],
        "Laufzeitmagie reduziert die Hilfe des Compilers und versteckt Verbindungen.",
      ),
    ],
  },
  {
    id: "patterns",
    label: "Programmiermuster",
    subtitle: "Die Grenze ist der Anwendungsfall.",
    rows: [
      row(
        "Vertical Slices",
        [0, 15, 85],
        "HTTP-Einstieg, SQL und Antwort eines Features liegen nahe beieinander. Gemeinsame Invarianten bleiben gemeinsam.",
      ),
      row(
        "Starre Schichtenarchitektur",
        [70, 25, 5],
        "Nicht jeder Ablauf muss dieselbe Zahl von Schichten durchlaufen. Jede Grenze sollte eine Verantwortung tragen.",
      ),
      row(
        "Objektorientierung",
        [5, 65, 30],
        "Zustand und Verhalten gezielt modellieren. Nicht jedes Problem verlangt einen umfangreichen Objektgraphen.",
      ),
      row(
        "Prozedurale Abläufe",
        [5, 15, 80],
        "Ein geradliniger Ablauf lässt sich gut verfolgen, solange fachliche Grenzen und Zuständigkeiten erhalten bleiben.",
      ),
      row(
        "Reine Funktionen",
        [0, 15, 85],
        "Berechnungen ohne Seiteneffekte sind leicht isoliert zu prüfen.",
      ),
      row(
        "Domain-driven Design",
        [10, 60, 30],
        "Gemeinsame Sprache und fachliche Grenzen nutzen. Den Umfang des taktischen Mustersatzes am Problem ausrichten.",
      ),
      row(
        "CQRS",
        [25, 50, 25],
        "Lesen und Schreiben können unterschiedliche Modelle brauchen. Separate Systeme sind dafür nicht zwingend nötig.",
      ),
      row(
        "Event Sourcing",
        [80, 10, 10],
        "Historisierung als Kernanforderung kann es rechtfertigen; Projektionen, Migrationen und Betrieb bringen Zusatzaufwand.",
      ),
      row(
        "DRY",
        [5, 80, 15],
        "Gemeinsame fachliche Regeln bündeln. Ähnlicher Code allein beweist noch keine gemeinsame Abstraktion.",
      ),
      row(
        "Single Responsibility",
        [0, 65, 35],
        "Nach Änderungsgründen schneiden, nicht automatisch nach jedem einzelnen Arbeitsschritt.",
      ),
      row(
        "Strategy",
        [25, 45, 30],
        "Sinnvoll für tatsächliche Varianten. Keine hypothetischen Erweiterungspunkte auf Vorrat.",
      ),
      row(
        "Jeden Schritt auslagern",
        [80, 15, 5],
        "Methoden sollten beim Verstehen helfen. Triviale Weiterleitungen erhöhen nur die Zahl der Sprünge.",
      ),
      row(
        "God Classes",
        [80, 20, 0],
        "Lokaler Kontext ist kein Grund, unabhängige Features in einer riesigen Klasse zu vermischen.",
      ),
    ],
  },
  {
    id: "closures",
    label: "Closures",
    subtitle: "Nah am Einsatz. Klar im Datenfluss.",
    rows: [
      row(
        "Lokales SQL-Mapping",
        [0, 5, 95],
        "Ein kurzes Lambda hält Query und Ergebnisform zusammen.",
        'return jdbc.query(sql, (rs, rowNum) ->\n    new ProfileResponse(\n        rs.getLong("id"),\n        rs.getString("username")\n    )\n);',
      ),
      row(
        "Kurze Filter & Transformationen",
        [5, 15, 80],
        "Ein lokaler Ausdruck ist gut nachvollziehbar, wenn Eingabe und Ergebnis klar sind.",
        "var visible = contents.stream()\n    .filter(content -> content.isPublic())\n    .toList();",
      ),
      row(
        "Große Business-Lambdas",
        [25, 65, 10],
        "Bei mehreren Verantwortungen oder Fehlerpfaden besser eine benannte Methode im selben Feature verwenden.",
      ),
      row(
        "Verschachtelte Lambdas",
        [65, 30, 5],
        "Viele Callback-Ebenen verstecken die Reihenfolge und den Fehlerfluss. Kontrollfluss möglichst direkt ausdrücken.",
      ),
      row(
        "Gespeicherte Callbacks",
        [45, 45, 10],
        "Lebensdauer und Ausführungszeitpunkt müssen erkennbar bleiben; eingefangene Objekte können unerwartet lange leben.",
      ),
      row(
        "Explizite lokale Captures",
        [5, 20, 75],
        "Java erlaubt finale oder effektiv finale lokale Variablen. Das eingefangene Objekt selbst kann trotzdem veränderlich sein.",
        "long viewerId = currentUser.id();\nPredicate<Content> ownedByViewer =\n    content -> content.ownerId() == viewerId;",
      ),
    ],
  },
];
export const choices = ["Weglassen", "Neu definieren", "Nutzen"] as const;
export function dominant(scores: Rating["scores"]): number {
  const max = Math.max(...scores);
  return scores.filter((score) => score === max).length > 1
    ? -1
    : scores.indexOf(max);
}
