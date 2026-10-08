"use client";

import { useState } from "react";
import SlideVisual from "./slide-visual";
import WorkflowChart from "./workflow-chart";
import ArchitectureComparison from "./architecture-comparison";

const contentSlides = [
  {
    title: "Unsere Arbeit verändert sich",
    lead: "Vom eigenen Schreiben zum Beauftragen, Steuern und Prüfen.",
    points: ["KI steuern. Code verstehen. Ergebnisse prüfen."],
    visual: "workflow",
    note: "Ich habe mir Gedanken über unseren aktuellen Workflow gemacht. Bei KI-geführter Entwicklung verbringe ich weniger Zeit damit, alles selbst zu schreiben, und mehr damit, Aufgaben zu beschreiben, Änderungen zu steuern und Ergebnisse zu prüfen. Die Balken zeigen diese Verschiebung schematisch, nicht als Messung unseres Teams. Ich greife weiterhin selbst in der IDE ein. Übergang: Wenn sich unsere Arbeit verändert, sollten wir auch unsere Konventionen neu betrachten.",
  },
  {
    title: "Das Problem",
    lead: "Über Jahrzehnte dafür optimiert, dass Menschen gut programmieren können.",
    points: ["IDEs", "Tools", "Programmiersprachen", "Frameworks", "Code-Architektur"],
    visual: "motivation",
    note: "Über Jahrzehnte wurden IDEs, Programmiersprachen, Frameworks und Architekturkonventionen weiterentwickelt, um Menschen beim Programmieren zu unterstützen. Die letzten 20 bis 30 Jahre können wir mündlich als Beispiel nennen, nicht als Entstehungszeit aller Konzepte. Beispiele sind Navigation, Autovervollständigung, Typprüfung und die Aufteilung in Schichten. Typen, Tests, Debugging und Lesbarkeit helfen weiterhin bei KI-Code. Wenn sich die Implementierung zunehmend zur KI verschiebt: Was davon brauchen wir weiterhin genauso, und was sollten wir anders gestalten? Dazu habe ich privat recherchiert und gebrainstormt.",
  },
  {
    title: "Die Idee",
    lead: "Unseren Code bewusst für den neuen Workflow gestalten.",
    points: ["Welche Struktur brauchen wir wirklich?", "Was hilft noch – was ist nur Gewohnheit?", "Was macht AI-Änderungen für uns prüfbar?"],
    visual: "idea",
    note: "Die Idee ist keine bereits fertige Architektur. Ich möchte, dass wir uns bewusst Gedanken machen, wie wir diesen Workflow gestalten wollen. Welche Strukturen helfen einem Agent, die Aufgabe richtig umzusetzen, und uns, das Ergebnis gut zu prüfen? Für die Firma wünsche ich mir klarere Reviews und gemeinsame Orientierung; für uns Entwickler Erfahrung mit Agents. Ich habe darauf keine fertige Antwort. Ich habe aber angefangen, mir Gedanken zu machen, und möchte euch meinen ersten Stand als Grundlage für unsere Diskussion zeigen.",
  },
  {
    title: "Ein erster Gedankenstand",
    lead: "Recherche und Brainstorming als Grundlage für unsere Diskussion.",
    points: ["Recherche + Brainstorming mit ChatGPT", "Weglassen · Neu definieren · Nutzen", "Arbeitsstand zur Teamdiskussion"],
    visual: "explorer",
    note: "Ich habe privat mit ChatGPT gebrainstormt, Quellen recherchiert und daraus diese Seite erstellt. Es gibt bereits Ansätze und Erfahrungsberichte, aber daraus ergibt sich kein universeller Standard für unser Team. Auch KI-Antworten müssen wir kritisch prüfen. Die Analysegewichte sind subjektive Diskussionshilfen, keine Forschungsergebnisse. Ich möchte heute die globale Idee vorstellen und danach eure Sicht hören. Übergang: Zwei konkrete Beispiele machen meine Überlegung greifbar.",
  },
  {
    title: "Spring Boot: Wie organisieren wir unseren Code?",
    lead: "Nach technischer Rolle oder nach Feature?",
    points: ["Gleiche Aufgaben · andere Paketstruktur", "Zusammengehörige Dateien nahe beieinander", "Weniger Kontextsuche – unsere Hypothese"],
    visual: "architecture",
    note: "Hier vergleiche ich zwei mögliche Paketstrukturen in Spring Boot. Spring Boot schreibt keine dieser Varianten verbindlich vor. Links liegen Controller, Services, Repositories und Antworttypen in technischen Paketen. Rechts bleiben dieselben Rollen erhalten, ihre Dateien liegen aber beim jeweiligen Feature. Für eine Profiländerung finde ich dadurch zusammengehörige Dateien an einem Ort. Das allein reduziert weder die Dateianzahl noch die Abhängigkeiten und beweist keine bessere KI-Leistung. Unsere Hypothese ist, dass die Organisation das Auffinden und Review erleichtert. Das Demo-Beispiel verwendet zusätzlich JDBC und kleine Records; das ist eine unabhängige Entscheidung und keine Voraussetzung der Featurestruktur. Gemeinsame Regeln müssen weiterhin klar abgegrenzt bleiben. Übergang: Diese Überlegung ist Teil meines ersten Gedankenstands, den ich im Explorer gesammelt habe.",
  },
  {
    title: "Gemeinsam ausprobieren",
    lead: "Aus meinem Gedankenexperiment wird ein überprüfbarer Teamversuch.",
    points: ["Diskutieren und bewerten", "JSON → gemeinsame AGENTS.md-Regeln", "Kleiner Pilot · Ergebnisse bewerten"],
    visual: "pilot",
    note: "Hier möchte ich eure Einschätzung hören: Was findet ihr sinnvoll, was unpassend, was fehlt? Danach können wir in die globale Analyse wechseln und Bewertungen festhalten. Der JSON-Export ist vorhanden; daraus AGENTS.md-Regeln abzuleiten ist ein gemeinsamer Folgeschritt, keine automatische Funktion. Regeln müssen den jeweiligen Projektkontext berücksichtigen. Für einen Pilot wählen wir ein überschaubares Feature, halten Anforderungen und Schutzmechanismen fest und bewerten die Ergebnisse gemeinsam. Die Entscheidung heute wäre nicht ein großer Rewrite, sondern ob wir diesen Versuch zusammen machen wollen.",
  },
];

const slides = [contentSlides[0], contentSlides[1], contentSlides[2], contentSlides[4], contentSlides[3], contentSlides[5]];

const visualIndices: Record<string, number> = { motivation: 1, explorer: 3, profile: 5, storage: 6, goals: 8, pilot: 9 };

export default function CompanyPresentation() {
  const [index, setIndex] = useState(0);
  const [notes, setNotes] = useState(false);
  const slide = slides[index];
  return <div className="company-presentation">
    <header className="company-header">
      <a href="/" className="brand"><img src="/mark.svg" width="36" height="36" alt="" />Modern Coding</a>
      <a href="/">Zur Analyse</a>
    </header>
    <nav className="company-agenda" aria-label="Präsentationskapitel">
      {slides.map((item, position) => <button key={item.title} aria-current={index === position ? "step" : undefined} onClick={() => setIndex(position)}>{position + 1}. {item.title}</button>)}
    </nav>
    <main className="company-slide" aria-live="polite">
      <p className="eyebrow">GLOBAL / ALLGEMEIN · {index + 1} / {slides.length}</p>
      <h1>{slide.title}</h1>
      <p className="company-lead">{slide.lead}</p>
      {slide.visual === "workflow" ? <WorkflowChart /> : slide.visual === "architecture" ? <ArchitectureComparison /> : slide.visual === "idea" ? <div className="idea-question">Welche Struktur hilft?<br />Welche kann weg?</div> : <SlideVisual index={visualIndices[slide.visual]} />}
      <ul>{slide.points.map(point => <li key={point}>{point}</li>)}</ul>
      {notes && <aside className="company-notes"><strong>Sprechnotizen</strong><p>{slide.note}</p></aside>}
    </main>
    <footer className="company-controls">
      <button title="Vorherige Folie" aria-label="Vorherige Folie" disabled={index === 0} onClick={() => setIndex(index - 1)}>←</button>
      <span>{index + 1} / {slides.length}</span>
      <button title="Nächste Folie" aria-label="Nächste Folie" disabled={index === slides.length - 1} onClick={() => setIndex(index + 1)}>→</button>
      <label><input type="checkbox" checked={notes} onChange={event => setNotes(event.target.checked)} /> Sprechnotizen</label>
    </footer>
  </div>;
}
