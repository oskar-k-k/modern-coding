import type { Topic } from "./architecture-data";

export const backendCategories = [
  { id: "language", label: "Sprache & Typen", subtitle: "Java-Sprachmittel, Datenformen und lokale Ausdrücke.",
    names: ["Statische Typisierung", "Records", "Enums", "Klassen", "Interfaces", "Generics", "var", "Optional", "Exceptions", "try-with-resources", "Streams", "Schleifen", "Kurze Filter & Transformationen", "Große Business-Lambdas", "Verschachtelte Lambdas", "Gespeicherte Callbacks", "Explizite lokale Captures"] },
  { id: "paradigms", label: "Programmierparadigmen", subtitle: "Objektorientierte, prozedurale und funktionale Ansätze sind kombinierbar.",
    names: ["Objektorientierung", "Prozedurale Abläufe", "Funktionale Programmierung"] },
  { id: "architecture", label: "Architektur & Struktur", subtitle: "Paketorganisation, Anwendungsfallgrenzen und übergreifende Architekturentscheidungen.",
    names: ["Technische Paketstruktur", "Featureorientierte Paketstruktur", "Vertical Slices", "Starre Schichtenarchitektur", "Service-Schicht", "Domain-driven Design", "CQRS", "Event Sourcing"] },
  { id: "design", label: "Code-Design", subtitle: "Prinzipien, Muster, Zustand und begründete Abstraktionen.",
    names: ["Vererbung", "Komposition", "Interface für jeden Service", "BaseController / BaseService", "Unveränderliche Daten", "Globaler veränderlicher Zustand", "Reine Funktionen", "DRY", "Single Responsibility", "Strategy", "Jeden Schritt auslagern", "God Classes"] },
  { id: "persistence", label: "Daten & Persistenz", subtitle: "Datenzugriff, Mapping, atomare Änderungen und Schemaentwicklung.",
    names: ["JPA-Entities & Hibernate", "Repository pro Entity", "Separate Mapper-Klassen", "JDBC & parameterisiertes SQL", "Transaktionen", "Flyway & Schema-Constraints", "Lokales SQL-Mapping"] },
  { id: "runtime", label: "Framework & Laufzeit", subtitle: "Spring-Verträge, Abhängigkeiten, Laufzeitmechanismen und Nebenläufigkeit.",
    names: ["Request- & Response-Typen", "REST-Controller", "Dependency Injection", "Eigene Business-AOP", "WebFlux", "Virtual Threads", "parallelStream()", "Eigene Reflection"] },
  { id: "quality", label: "Qualität & Sicherheit", subtitle: "Verhalten überprüfen, Zugriffe absichern und Betrieb beobachten.",
    names: ["Authentifizierung", "Autorisierung & Rollen", "Sessions & CSRF", "Validierung", "Logs, Metriken & Actuator", "Integrationstests", "Mock-lastige Schichtentests"] },
];

export const backendTopicForRow = (name: string) =>
  backendCategories.find(category => category.names.includes(name))?.id;

export function reorganizeBackendTopics(topics: Topic[]): Topic[] {
  const rows = topics.flatMap(topic => topic.rows);
  for (const row of rows) {
    if (!backendTopicForRow(row.name)) throw new Error("Unassigned backend row: " + row.name);
  }
  if (new Set(rows.map(row => row.name)).size !== rows.length) {
    throw new Error("Duplicate backend analysis row");
  }
  return backendCategories.map(({ id, label, subtitle, names }) => ({
    id, label, subtitle,
    rows: names.flatMap(name => rows.filter(row => row.name === name)),
  }));
}
