import type { CodeExamplePart, Rating, Topic } from "./architecture-data";

const sample = (file: string, description: string, code: string): CodeExamplePart => ({ file, description, code });
const reference = (title: string, url: string) => ({ title, url });
const docs = {
  next: reference("Next.js: Server und Client Components", "https://nextjs.org/docs/app/getting-started/server-and-client-components"),
  fetch: reference("Next.js: Daten laden", "https://nextjs.org/docs/app/getting-started/fetching-data"),
  cache: reference("Next.js: Caching", "https://nextjs.org/docs/app/getting-started/caching"),
  auth: reference("Next.js: Authentifizierung und Autorisierung", "https://nextjs.org/docs/app/guides/authentication"),
  bff: reference("Next.js: Backend for Frontend", "https://nextjs.org/docs/app/guides/backend-for-frontend"),
  effects: reference("React: You Might Not Need an Effect", "https://react.dev/learn/you-might-not-need-an-effect"),
  state: reference("React: State-Struktur", "https://react.dev/learn/choosing-the-state-structure"),
  compiler: reference("React Compiler", "https://react.dev/learn/react-compiler/introduction"),
  types: reference("TypeScript: Narrowing", "https://www.typescriptlang.org/docs/handbook/2/narrowing.html"),
  nulls: reference("TypeScript: strictNullChecks", "https://www.typescriptlang.org/tsconfig/strictNullChecks.html"),
  aria: reference("WAI: Native Semantik vor eigener ARIA", "https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/"),
  forms: reference("MDN: Input-Element", "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input"),
  containers: reference("MDN: Container Queries", "https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries"),
  layers: reference("MDN: Cascade Layers", "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer"),
  motion: reference("MDN: Reduced Motion", "https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion"),
  query: reference("TanStack Query: Defaults", "https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults"),
  e2e: reference("Playwright: Best Practices", "https://playwright.dev/docs/best-practices"),
  testing: reference("Testing Library: Grundsaetze", "https://testing-library.com/docs/guiding-principles/"),
  vitals: reference("Web Vitals", "https://web.dev/articles/vitals"),
  image: reference("Next.js: Image", "https://nextjs.org/docs/app/api-reference/components/image"),
  html: reference("React: HTML-Inhalte und XSS", "https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html"),
};

function item(
  name: string, scores: Rating["scores"], explanation: string, reason: string,
  recommended: CodeExamplePart | CodeExamplePart[],
  current?: CodeExamplePart,
  references: NonNullable<Rating["references"]> = [],
): Rating {
  const parts = Array.isArray(recommended) ? recommended : [recommended];
  return {
    name, scores, explanation, reason, references, reviewedAt: "2026-10-01",
    recommendedParts: parts,
    recommendedExample: parts.map(part => `// ${part.file}\n${part.code}`).join("\n\n"),
    recommendedDescription: "Allgemeines Zielmuster. Die Beispiele zeigen den relevanten Ausschnitt; benannte Adapter und Fachfunktionen sind im konkreten Projekt auszuarbeiten.",
    currentParts: current ? [current] : undefined,
    currentExample: current?.code,
    currentDescription: current ? "Illustratives Ausgangsmuster, kein Befund aus einem Repository." : undefined,
  };
}

// Weights are editorial discussion aids, not measurements or framework rankings.
export const globalFrontendTopics: Topic[] = [
  {
    id: "next-runtime", label: "Next.js",
    subtitle: "App Router und React Server Components: Grenzen nach Laufzeit und Produktbedarf, nicht nach einem bestimmten Backend.",
    rows: [
      item("Server Components", [0, 20, 80],
        "Server Components werden auf dem Server ausgewertet. Ihr eigener Komponentencode wird nicht als interaktive Browserkomponente ausgeliefert. Sie koennen Daten laden und HTML beziehungsweise React-Ausgaben vorbereiten; Client Components ergaenzen die interaktiven Teile.",
        "Fuer datengetriebene Next.js-Seiten ein sinnvoller Ausgangspunkt. Nur benoetigte Daten an den Client geben. Eine Server Component ist aber weder automatisch schnell noch automatisch berechtigt, beliebige Daten zu lesen. Fuer rein lokale Browserwerkzeuge kann eine Client-App einfacher sein.",
        sample("page.tsx", "Die Query muss den Nutzer authentifizieren und die sichtbaren Felder begrenzen. Die Tabelle erhaelt nur ihren Antwortvertrag.", `export default async function Page() {
  const rows = await loadVisibleRowsForCurrentUser();
  return <ResultsTable rows={rows} />;
}`), undefined, [docs.next]),
      item("Client Components", [0, 25, 75],
        "Die Direktive use client markiert eine Modulgrenze fuer interaktive Komponenten mit State, Events oder Browser-APIs. Sie bedeutet nicht, dass beim ersten Seitenaufruf grundsaetzlich kein HTML auf dem Server entsteht. Ihre importierten Abhaengigkeiten beeinflussen das Client-Bundle.",
        "Interaktion bleibt wichtig. Die Grenze moeglichst nahe am interaktiven Teil setzen und keine komplette Seite nur wegen eines Schalters in den Client ziehen. Fuer AI-Reviews ist eine kleine, klar benannte Zustandskomponente leichter zu pruefen als ein globales Browser-Root.",
        sample("DetailsToggle.tsx", "Ein lokaler UI-Zustand braucht weder globalen Store noch Server-Roundtrip.", `"use client";
import { useState } from "react";

export function DetailsToggle() {
  const [open, setOpen] = useState(false);
  return <>
    <button aria-expanded={open} onClick={() => setOpen(value => !value)}>
      Details
    </button>
    {open && <p>Zusaetzliche Informationen</p>}
  </>;
}`), undefined, [docs.next]),
      item("Route Handler als BFF", [15, 55, 30],
        "Ein Backend-for-Frontend bietet Endpunkte speziell fuer eine Oberflaeche, etwa fuer Aggregation, Session-Anbindung oder externe Dienste. Next.js Route Handler sind echte HTTP-Endpunkte, keine automatisch geschuetzten internen Funktionen.",
        "Nutzen, wenn eine konkrete Anpassung noetig ist. Eine zweite API-Schicht nur zum unveraenderten Durchreichen erhoeht Fehlerpfade und Wartung. Server Components koennen ihre serverseitige Datenfunktion direkt aufrufen; Browser und externe Clients brauchen einen klaren Vertrag.",
        sample("page.tsx", "Serverinterner Zugriff vermeidet einen HTTP-Aufruf an die eigene App. Authentifizierung und Objektberechtigung bleiben in der Query.", `export default async function Page() {
  const data = await loadDashboardForCurrentUser();
  return <Dashboard data={data} />;
}`),
        sample("page.tsx", "Die Seite ruft ihren eigenen HTTP-Endpunkt auf, obwohl beide dieselbe serverseitige Query nutzen koennten.", `const response = await fetch(appOrigin + "/api/dashboard");
const data = await response.json();`), [docs.bff]),
      item("Server Actions", [10, 50, 40],
        "Server Actions fuehren serverseitige Mutationen aus, die React etwa aus Formularen anstossen kann. Sie koennen Formulare vereinfachen, ersetzen aber weder Eingabevalidierung noch Authentifizierung, Objektberechtigung und einen klaren Fehlervertrag.",
        "Fuer Next.js-eigene Schreibablaeufe gut geeignet. Bei einer separaten Fach-API pruefen, ob die Action einen echten Adapter liefert oder Regeln nur dupliziert. Versteckte Buttons und unerratbare Action-IDs sind keine Sicherheitsgrenze.",
        sample("actions.ts", "Die Action behandelt ihre Eingabe als unvertrauenswuerdig. Die benannte Fachfunktion muss die Aenderung berechtigt und atomar ausfuehren.", `"use server";

export async function rename(form: FormData) {
  const user = await requireUser();
  const command = parseRename(form);
  await renameAuthorizedItem(user, command);
  revalidatePath("/items");
}`),
        sample("actions.ts", "Die vom Browser gelieferte ID wird ohne sichtbare Pruefung uebernommen.", `"use server";
export async function rename(form: FormData) {
  await database.item.update({
    where: { id: String(form.get("id")) },
    data: { name: String(form.get("name")) }
  });
}`), [docs.auth]),
      item("Rewrites zum Backend", [10, 35, 55],
        "Ein Rewrite leitet einen eingehenden Pfad intern an ein anderes Ziel weiter, ohne die sichtbare Browseradresse zu wechseln. Das ist Routing, nicht automatisch ein Login-, CSRF- oder Berechtigungssystem.",
        "Bei getrennter API oft ausreichend und einfacher als ein handgeschriebener Proxy. Ziel und Pfade explizit begrenzen. Ohne separates Backend braucht es diese Schicht nicht; same-origin allein macht Schreibzugriffe nicht sicher.",
        sample("next.config.ts", "Die Adresse kommt aus Serverkonfiguration, nicht aus Nutzereingaben. Das Ziel muss weiterhin jeden Zugriff schuetzen.", `const backend = process.env.BACKEND_URL;
if (!backend) throw new Error("BACKEND_URL fehlt");

export default {
  async rewrites() {
    return [{ source: "/api/:path*", destination: backend + "/api/:path*" }];
  }
};`), undefined, [docs.bff]),
      item("Frontend-eigene Domänenlogik", [65, 30, 5],
        "UI-Regeln bestimmen Darstellung und Bedienung. Verbindliche Fachregeln entscheiden dagegen, welche Daten gelesen oder veraendert werden duerfen. Browsercode und Browserzustand sind vom Nutzer veraenderbar.",
        "Berechtigungen und Integritaet nicht ausschliesslich im Frontend erzwingen. Lokale Vorschauen, Plausibilitaetspruefungen oder Offline-Berechnungen koennen trotzdem sinnvoll sein. Die verbindliche Schreibgrenze prueft erneut; nicht jede Berechnung gehoert deshalb auf den Server.",
        sample("DeleteButton.tsx", "Das Flag steuert nur die Bedienbarkeit. Der Endpunkt prueft Rechte unabhaengig davon erneut.", `<button disabled={!item.actions.delete.allowed}
  onClick={() => deleteItem(item.id)}>
  Loeschen
</button>`),
        sample("permissions.ts", "Ein aus localStorage gelesenes Rollenflag ist keine vertrauenswuerdige Autorisierung.", `const canDelete = localStorage.getItem("role") === "admin";
if (canDelete) await deleteWithoutServerCheck(item.id);`), [docs.auth]),
      item("Caching & Revalidierung", [5, 65, 30],
        "Caches speichern Ergebnisse fuer spaetere Anfragen. Dabei sind Client-Cache, Server-Daten, gerenderte Seiten und CDN nicht dieselbe Ebene. Gueltigkeit, Nutzerbezug und das Verhalten nach Aenderungen muessen zusammenpassen.",
        "Nicht blind 'alles cachen' oder 'alles no-store'. Pro Datenart Frische und Sichtbarkeit festlegen. Next.js-Defaults und Cache-APIs sind versions- und konfigurationsabhaengig; besonders Cache Components aendern das Modell. Private Antworten nie unbeabsichtigt fuer andere Nutzer wiederverwenden.",
        sample("loadAccount.ts", "Ein bewusst frischer, nutzerbezogener Abruf. Authentifizierung erfolgt im serverseitigen Adapter; oeffentliche Katalogdaten duerfen eine andere Cache-Strategie haben.", `const response = await fetch(accountApiUrl, {
  cache: "no-store",
  headers: await serverAuthHeaders()
});
if (!response.ok) throw new Error("Kontodaten nicht verfuegbar");
return parseAccount(await response.json());`),
        sample("loadAccount.ts", "Eine pauschale Cache-Vorgabe dokumentiert weder Nutzertrennung noch Aktualisierung nach Mutationen.", `return fetch(accountApiUrl, { cache: "force-cache" });`), [docs.cache]),
      item("Streaming & Ladegrenzen", [0, 20, 80],
        "Streaming liefert schon verfuegbare Teile einer Seite, waehrend langsamere Bereiche noch laden. Suspense legt fest, wo ein sinnvoller Ladezustand erscheint. Es ersetzt keine Fehlerbehandlung und macht langsame Datenquellen nicht schneller.",
        "Unabhaengige Bereiche getrennt laden und stabile Platzhalter einsetzen. Grenzen nach Nutzeraufgaben waehlen, nicht um jedes Textfeld legen. Zugriffspruefungen duerfen nicht erst nach dem Streamen vertraulicher Inhalte passieren.",
        sample("page.tsx", "Die Ueberschrift ist sofort verfuegbar; nur die langsame Ergebnisliste wartet. Die Query innerhalb Results prueft ihre Berechtigung.", `import { Suspense } from "react";

export default function Page() {
  return <main>
    <h1>Ergebnisse</h1>
    <Suspense fallback={<p role="status">Ergebnisse werden geladen</p>}>
      <Results />
    </Suspense>
  </main>;
}`), undefined, [docs.fetch]),
      item("Next.js als Pflicht fuer jede Website", [20, 65, 15],
        "Next.js kombiniert Routing, Rendering und eine Serverlaufzeit. Eine statische Inhaltsseite oder ein rein lokales Browserwerkzeug braucht nicht automatisch alle diese Faehigkeiten. Frameworkwahl und Renderingstrategie sind getrennte Entscheidungen.",
        "Fuer komplexe React-Produkte mit Serverintegration gut begruendbar. Fuer einfache Seiten auch statische Ausgabe oder weniger JavaScript pruefen. AI macht einen zusaetzlichen Server weder kostenlos noch wartungsfrei. Vor einem Wechsel den konkreten Produktnutzen benennen.",
        sample("next.config.ts", "Statische Ausgabe ist eine Option fuer passende Next.js-Inhalte. Request-abhaengige Serverfunktionen stehen in diesem Modus nicht einfach weiter zur Verfuegung.", `export default {
  output: "export"
};`),
        sample("page.tsx", "Eine statische Informationsseite wird unnoetig als Client-Seite angelegt.", `"use client";
export default function Page() {
  return <main><h1>Kontakt</h1><p>Unsere Kontaktinformationen</p></main>;
}`), [docs.bff]),
    ],
  },
  {
    id: "frontend-react", label: "React",
    subtitle: "Komponenten, Hooks und State: Datenfluss sichtbar halten und Abstraktionen am Bedarf messen.",
    rows: [
      item("Funktionskomponenten & Hooks", [0, 10, 90],
        "Eine Funktionskomponente beschreibt UI aus Props und State. Hooks verbinden sie mit React-Faehigkeiten. Hooks muessen in stabiler Reihenfolge aufgerufen werden; Rendering soll keine externen Systeme veraendern.",
        "Fuer neuen React-Code ein guter Standard. Eine kleine Funktion ist aber nicht automatisch eine gute Komponente: Verantwortung und Schnittstelle zaehlen mehr als Zeilenanzahl. Bestehende Klassen nicht ohne fachlichen Nutzen komplett umschreiben.",
        sample("Counter.tsx", "State bleibt bei der Interaktion. Die funktionale Aktualisierung verwendet den vorherigen Wert.", `function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(value => value + 1)}>
    {count}
  </button>;
}`)),
      item("Abgeleiteter State in Effects", [75, 20, 5],
        "Abgeleiteter State dupliziert Werte, die bereits aus Props oder anderem State berechnet werden koennen. Ein Effect aktualisiert diese Kopie erst nach dem Rendern und schafft einen weiteren Synchronisationspfad.",
        "Filterergebnisse, Summen und Labels meist direkt berechnen. Das reduziert Zwischenzustaende und Fehler bei AI-Aenderungen. Wirkliche Synchronisation mit einem externen System bleibt eine Aufgabe fuer Effects.",
        sample("Results.tsx", "Die gefilterte Liste hat keine eigene Lebensdauer und wird daher nicht separat gespeichert.", `const visible = rows.filter(row => row.name.includes(query));
return <ResultsList rows={visible} />;`),
        sample("Results.tsx", "Ein zusaetzlicher Renderdurchlauf synchronisiert eine redundante Kopie.", `const [visible, setVisible] = useState(rows);
useEffect(() => {
  setVisible(rows.filter(row => row.name.includes(query)));
}, [rows, query]);`), [docs.effects]),
      item("Effects fuer externe Systeme", [0, 15, 85],
        "Effects synchronisieren React mit etwas ausserhalb des Renderns, beispielsweise Events, Verbindungen oder einem nicht von React verwalteten Widget. Cleanup beendet die Registrierung beim Wechsel oder Entfernen der Komponente.",
        "Diese Aufgabe bleibt sinnvoll. Dependencies ehrlich angeben und jede Registrierung wieder aufheben. Ein leeres Dependency-Array oder ein Ref zum Unterdruecken doppelter Ausfuehrung ist kein Ersatz fuer korrektes Cleanup.",
        sample("ConnectionStatus.tsx", "Die Komponente abonniert Browserereignisse und entfernt genau ihre eigenen Handler.", `useEffect(() => {
  const update = () => setOnline(navigator.onLine);
  update();
  window.addEventListener("online", update);
  window.addEventListener("offline", update);
  return () => {
    window.removeEventListener("online", update);
    window.removeEventListener("offline", update);
  };
}, []);`), undefined, [docs.effects]),
      item("Globaler Store fuer jeden Zustand", [65, 30, 5],
        "Ein globaler Store teilt Zustand ueber entfernte Komponenten. Er ist etwas anderes als ein lokales Eingabefeld oder ein Cache fuer Serverdaten. Globaler Zustand vergroessert die Zahl moeglicher Leser und Schreiber.",
        "State zunaechst am kleinsten gemeinsamen Besitzer halten. Einen Store einsetzen, wenn getrennte Features wirklich denselben langlebigen Zustand bearbeiten. Nicht jedes Dropdown, jeder Dialog und jeder API-Response braucht eine zentrale Ablage.",
        sample("Search.tsx", "Ein Suchentwurf gehoert zunaechst zur Suchoberflaeche. Ein teilbarer angewendeter Filter kann dagegen in die URL gehoeren.", `const [draft, setDraft] = useState("");
return <input aria-label="Suche" value={draft}
  onChange={event => setDraft(event.target.value)} />;`),
        sample("store.ts", "Eine rein lokale Bedienung wird fuer die ganze Anwendung veraenderbar.", `const globalState = {
  searchDraft: "",
  isTooltipOpen: false,
  hoveredRow: null
};`), [docs.state]),
      item("Context als universeller Datenbus", [20, 60, 20],
        "Context verteilt Werte im Komponentenbaum, ohne sie durch jede Zwischenkomponente reichen zu muessen. Er legt weder automatisch einen Cache noch eine fein granulare Subscription pro Feld an.",
        "Fuer Theme, Sprache oder klar begrenzte Kontextdaten sinnvoll. Haeufig wechselnde Formularwerte und grosse Datenmengen nicht automatisch in einen einzigen Provider mischen. Props bleiben fuer lokale Beziehungen oft die lesbarste Dokumentation.",
        sample("Providers.tsx", "Unabhaengige Verantwortungen sind getrennt. Das Formular verwaltet seinen schnellen Eingabezustand selbst.", `<ThemeProvider>
  <Editor initialDocument={document} />
</ThemeProvider>`),
        sample("Providers.tsx", "Jede Eingabe aendert das grosse Kontextobjekt fuer alle konsumierenden Bereiche.", `<AppContext value={{ theme, user, rows, formDraft, pointerPosition }}>
  {children}
</AppContext>`), [docs.state]),
      item("useMemo/useCallback ueberall", [25, 65, 10],
        "Memoisierung versucht Berechnungen oder Referenzen zwischen Renderdurchlaeufen wiederzuverwenden. Sie ist eine Performance-Optimierung und kein Ersatz fuer korrekten Datenfluss. Auch Dependency-Listen muessen gepflegt werden.",
        "Zuerst messen und die Ursache verstehen. Bei aktiviertem React Compiler sinkt der Bedarf vieler manueller Memoisierungen; das gilt nicht automatisch fuer jedes Projekt und jede Funktion. Teure Berechnungen oder bestimmte Bibliotheksschnittstellen koennen weiterhin explizite Memoisierung brauchen.",
        sample("Totals.tsx", "Eine triviale Berechnung braucht in der Regel keine gespeicherte Ableitung.", `const total = price * quantity;
return <output>{total}</output>;`),
        sample("Totals.tsx", "Verwaltungsaufwand ohne belegten Vorteil fuer eine einfache Multiplikation.", `const total = useMemo(() => price * quantity, [price, quantity]);`), [docs.compiler]),
      item("Custom Hook fuer jede Funktion", [25, 60, 15],
        "Custom Hooks buendeln wiederverwendbare React-Logik mit Hooks. Eine reine Formatierung oder Berechnung ist dagegen eine normale Funktion und muss nicht an React gebunden werden.",
        "Hooks fuer echte State- oder Effect-Zusammenhaenge nutzen. Keine Sammlung von Einzeiler-Hooks als Standardschicht einfuehren. Reine Funktionen sind einfacher isoliert zu testen und von AI ohne React-Lebenszyklus zu verstehen.",
        sample("formatMoney.ts", "Die Formatierung hat keinen React-Zustand und kann auch auf dem Server verwendet werden.", `export function formatMoney(value: number, locale: string, currency: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);
}`),
        sample("usePrice.ts", "Der Hook-Name suggeriert einen Lebenszyklus, obwohl keiner benoetigt wird.", `function usePrice(value: number) {
  return value.toFixed(2) + " EUR";
}`)),
      item("Stabile Keys & unveraenderliche Updates", [0, 5, 95],
        "Keys ordnen Listenelemente zwischen Renderdurchlaeufen zu. Stabile fachliche IDs erhalten die richtige Komponentenidentitaet. Unveraenderliche Updates erzeugen neue Werte, ohne bereits gerenderten State nachtraeglich umzuschreiben.",
        "Beides bleibt zentral, gerade bei Sortierung, Filtern und Formularen. Index-Keys koennen State der falschen Zeile zuordnen; zufaellige Keys erzeugen unnoetige Neustarts. Direkte Mutation verschleiert Aenderungen.",
        sample("Tasks.tsx", "Die ID bleibt beim Sortieren erhalten, und nur das betroffene Datenobjekt wird ersetzt.", `const toggle = (id: string) => setTasks(previous =>
  previous.map(task => task.id === id ? { ...task, done: !task.done } : task)
);
return tasks.map(task => <TaskRow key={task.id} task={task} onToggle={toggle} />);`), undefined, [docs.state]),
      item("Komposition statt Universal-Komponente", [0, 25, 75],
        "Komposition setzt kleine UI-Bausteine ueber Props oder children zusammen. Eine Universal-Komponente versucht dagegen viele fachlich verschiedene Ansichten durch Flags und Konfiguration abzubilden.",
        "Gemeinsame Semantik und Gestaltung teilen, aber unterschiedliche Fachablaeufe sichtbar lassen. Eine Abstraktion lohnt sich bei stabilen Gemeinsamkeiten, nicht nur weil AI aehnliches Markup mehrfach erzeugt hat. Zu viele frei kombinierbare Flags erschweren Tests.",
        sample("Editor.tsx", "Der Rahmen kennt Layout und Bedienaktionen, nicht die Details jedes Formularfelds.", `<EditorLayout actions={<SaveActions pending={pending} />}>
  <AddressFields value={address} onChange={setAddress} />
</EditorLayout>`)),
    ],
  },
  {
    id: "frontend-typescript", label: "TypeScript & JavaScript",
    subtitle: "Typen als pruefbare Vertraege, JavaScript fuer Ablauf und Browserintegration.",
    rows: [
      item("Strikte Typisierung", [0, 5, 95],
        "TypeScript prueft beim Entwickeln, welche Werte und Operationen zusammenpassen. Strict-Modi machen etwa moeglich fehlende Werte sichtbar. Die Typen verschwinden beim Uebersetzen und schuetzen daher nicht automatisch vor fehlerhaften Netzwerkdaten.",
        "Fuer langlebige Frontends besonders mit AI sinnvoll: Aenderungen werden an Aufrufern sichtbar. Strenge Typen ersetzen trotzdem keine Laufzeitpruefung und Tests. Eine Migration kann schrittweise erfolgen, statt Bestandsprojekte durch einen Komplettumbau zu blockieren.",
        sample("tsconfig.json", "Die Compilerpruefung ist Teil des Builds, nicht nur eine optionale IDE-Anzeige.", `{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noEmit": true
  }
}`), undefined, [docs.nulls]),
      item("any & ungepruefte Type Assertions", [80, 15, 5],
        "any schaltet einen grossen Teil der Typpruefung aus. Eine Assertion wie as User sagt dem Compiler, einem Vertrag zu vertrauen; sie untersucht den echten Wert nicht. unknown verlangt dagegen eine Pruefung vor der Verwendung.",
        "An externen Grenzen unknown annehmen und validieren. Assertions nur bei nachvollziehbar bewiesenen Invarianten oder engen Bibliotheksadaptern nutzen. Ein von AI eingefuegtes as ist kein behobener Datenfehler.",
        sample("parseName.ts", "Das minimale Beispiel validiert eine einzelne Eigenschaft. Fuer groessere Payloads ein gepflegtes Schema verwenden.", `function parseName(value: unknown): string {
  if (typeof value !== "object" || value === null ||
      !("name" in value) || typeof value.name !== "string") {
    throw new Error("Ungueltiger Name");
  }
  return value.name;
}`),
        sample("loadUser.ts", "Die Behauptung prueft weder JSON-Form noch fehlende Felder.", `const user = await response.json() as User;
return user.name.toUpperCase();`), [docs.types]),
      item("Discriminated Unions statt Boolean-Sammlung", [0, 15, 85],
        "Eine discriminated union beschreibt mehrere erlaubte Varianten mit einem gemeinsamen Kennzeichen. Beispielsweise kann ein Ladezustand entweder laden, fehlschlagen oder Daten besitzen, statt widerspruechliche Boolean-Kombinationen zuzulassen.",
        "Fuer endliche UI-Zustaende sehr hilfreich. Der Compiler kann beim Verzweigen passende Felder eingrenzen. Nicht jedes boolesche Flag braucht eine Zustandsmaschine; entscheidend sind miteinander verbundene Zustaende und Uebergaenge.",
        sample("LoadState.ts", "Daten existieren nur in der Erfolgsvariante; Fehlerdetails nur im Fehlerfall.", `type LoadState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: T };

function label(state: LoadState<string[]>) {
  return state.status === "ready" ? state.data.length + " Treffer" : state.status;
}`), undefined, [docs.types]),
      item("Generics & Typakrobatik", [10, 60, 30],
        "Generics erhalten eine Beziehung zwischen Typen, etwa zwischen Listeninhalt und ausgewaehltem Wert. Sehr tiefe Conditional Types koennen dagegen schwer lesbare Fehler und lange Compilerzeiten verursachen.",
        "Generics fuer echte gemeinsame Vertraege nutzen, nicht fuer eine universelle Formular- oder Backendbeschreibung ohne konkreten Bedarf. Typen sollen einen Fehler erklaeren koennen. Gerade AI-generierte Typkonstrukte brauchen einen einfachen Aufrufer als Gegenprobe.",
        sample("Selection.ts", "Ein kleiner generischer Vertrag erhaelt den konkreten Typ fuer Auswahl und Callback.", `type Selection<T> = {
  value: T | null;
  onChange: (value: T) => void;
};`),
        sample("Selection.ts", "any zerstoert gerade die Beziehung, die ein gemeinsamer Vertrag erhalten sollte.", `type Selection = {
  value: any;
  onChange: (value: any) => void;
};`), [docs.types]),
      item("Klassen & Vererbung im UI-Modell", [35, 55, 10],
        "Klassen koennen Zustand und Verhalten kapseln. Vererbung koppelt Untertypen an eine Basisimplementierung. Fuer einfache API-Daten und React-Props sind solche Objektgraphen oft unnoetig und an Server-Client-Grenzen schwieriger zu uebertragen.",
        "Datenvertraege als einfache Objekte und Fachberechnungen als explizite Funktionen beginnen. Klassen bleiben fuer echte zustandsbehaftete Adapter oder etablierte Bibliotheken sinnvoll. Nicht jede Backend-Entity muss im Browser eine gleichnamige Klasse besitzen.",
        sample("UserSummary.ts", "Die Oberflaeche erhaelt nur die Felder, die sie tatsaechlich darstellt.", `type UserSummary = Readonly<{ id: string; displayName: string }>;
const initials = (user: UserSummary) => user.displayName.slice(0, 1);`),
        sample("User.ts", "Technische Basisklassen werden an jede einfache Anzeige gekoppelt.", `class User extends BaseEntity {
  save() { return this.repository.persist(this); }
  renderLabel() { return this.displayName; }
}`)),
      item("Async-Ablauf & explizite Fehler", [0, 15, 85],
        "Promises beschreiben spaetere Ergebnisse. await macht Abhaengigkeiten sichtbar; unabhaengige Arbeiten koennen parallel laufen. Ein HTTP-Fehlerstatus laesst fetch nicht automatisch mit einer Exception scheitern.",
        "Fehlerstatus, Abbruch und ungueltige Antworten bewusst behandeln. Unabhaengige Anfragen parallelisieren, aber keine fachlich benoetigte Reihenfolge zerstoeren. Promise.all bricht das Warten bei einem Fehler ab; es storniert die anderen Arbeiten nicht automatisch.",
        sample("loadOverview.ts", "Die beiden Requests sind voneinander unabhaengig. Ihre Adapter pruefen jeweils Status und Payload.", `const [profile, preferences] = await Promise.all([
  loadProfile(),
  loadPreferences()
]);
return { profile, preferences };`)),
      item("Eigene Datums- & Formatierungshelfer", [30, 60, 10],
        "Datumswerte koennen Kalendertage, Zeitpunkte oder lokale Uhrzeiten meinen. Manuelles Zerlegen und Zusammenbauen von Strings verwechselt diese Bedeutungen leicht. Intl formatiert nach Sprache und explizitem Zeitzonenbezug.",
        "Native Formatierung bevorzugen, fuer komplexe Kalenderregeln eine begruendete Bibliothek einsetzen. Keine beliebigen ISO-Strings durch split in lokale Termine verwandeln. Ein reines Datum ist nicht automatisch Mitternacht UTC.",
        sample("formatTimestamp.ts", "Der Vertrag erwartet einen echten Zeitpunkt; die Anzeigezone ist bewusst festgelegt.", `const formatter = new Intl.DateTimeFormat("de-DE", {
  dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Berlin"
});
export const formatTimestamp = (timestamp: Date) => formatter.format(timestamp);`),
        sample("formatDate.ts", "Die Stringzerlegung ignoriert Zeitzone und den semantischen Unterschied zwischen Datum und Zeitpunkt.", `return timestamp.split("T")[0].split("-").reverse().join(".");`)),
    ],
  },
  {
    id: "frontend-html", label: "HTML & Barrierefreiheit",
    subtitle: "Browsersemantik, Tastaturbedienung und verstaendliche Zustaende sind Grundlagen, keine nachtraegliche Dekoration.",
    rows: [
      item("Semantisches HTML", [0, 0, 100],
        "HTML-Elemente tragen Bedeutung und eingebautes Verhalten. Ein button ist eine Aktion, ein Link eine Navigation, main der Hauptinhalt. Diese Semantik hilft Browsern, assistiven Technologien und automatisierten Tests.",
        "Konsequent nutzen. Ein Framework oder AI-generiertes JSX ersetzt diese Grundlage nicht. Passende Elemente sparen eigene Event-, Fokus- und Tastaturlogik. Die Bedeutung muss zur Handlung passen, nicht nur zum gewuenschten Aussehen.",
        sample("Navigation.tsx", "Navigation bleibt ein Link; das Ausloesen einer Aktion bleibt ein Button.", `<nav aria-label="Hauptnavigation">
  <a href="/settings">Einstellungen</a>
</nav>
<button type="button" onClick={openEditor}>Bearbeiten</button>`), undefined, [docs.aria]),
      item("Klickbare divs & ARIA als Reparatur", [85, 10, 5],
        "Ein div besitzt kein eingebautes Button-Verhalten. role=button allein implementiert weder Tastaturbedienung noch Fokus oder deaktivierte Zustaende. Selbst gebaute Widgets tragen diese Verantwortung vollstaendig.",
        "Bei normalen Aktionen native Elemente verwenden. ARIA ist wichtig, wenn native Semantik nicht ausreicht, aber kein Freibrief fuer beliebiges Markup. Komplexe Widgets bevorzugt aus geprueften Komponenten statt ad hoc von AI erzeugen.",
        sample("SaveButton.tsx", "Der Browser liefert die Standardbedienung; disabled verhindert die Aktion waehrend des Speicherns.", `<button type="submit" disabled={pending}>Speichern</button>`),
        sample("SaveButton.tsx", "Ein Maus-Handler bietet ohne weitere Implementierung keinen gleichwertigen Tastaturzugang.", `<div onClick={save}>Speichern</div>`), [docs.aria]),
      item("Native Formulare & Beschriftungen", [0, 5, 95],
        "Form, label, input und button bilden gemeinsam einen Formularvertrag. name identifiziert Daten, label den Zweck, und passende Eingabetypen aktivieren Browserfunktionen. Placeholder verschwinden beim Tippen und ersetzen kein Label.",
        "Auch in React beibehalten. Native Formularfunktionen reduzieren Eigenbau und helfen Autofill sowie Tastaturbedienung. Browservalidierung verbessert die Bedienung, ersetzt aber keine erneute Servervalidierung.",
        sample("EmailField.tsx", "Label, Autofill und Fehlerreferenz sind explizit miteinander verbunden.", `<label htmlFor="email">E-Mail</label>
<input id="email" name="email" type="email" autoComplete="email"
  required aria-invalid={Boolean(error)} aria-describedby="email-error" />
<p id="email-error">{error}</p>`), undefined, [docs.forms]),
      item("Tastatur, Fokus & Dialoge", [0, 5, 95],
        "Fokus zeigt, welches Element Tastatureingaben erhaelt. Ein modaler Dialog begrenzt die Interaktion auf seinen Inhalt und muss beim Schliessen einen nachvollziehbaren Fokus hinterlassen. Ein optisch sichtbares Overlay allein implementiert das nicht.",
        "Von Beginn an testen: Oeffnen, Escape, Tab-Reihenfolge und Rueckkehr zum Ausloeser. Native Dialoge oder bewaehrte barrierefreie Bausteine reduzieren Eigenbau. Fokusmarkierungen nicht aus Designgruenden entfernen.",
        sample("dialog.css", "Der sichtbare Fokus bleibt unabhaengig vom Hover-Zustand erkennbar. Das Dialogverhalten selbst gehoert in den geprueften Dialogbaustein.", `button:focus-visible, a:focus-visible, input:focus-visible {
  outline: 3px solid #1463a8;
  outline-offset: 3px;
}`), undefined, [docs.aria]),
      item("Tabellen fuer tabellarische Daten", [0, 5, 95],
        "Tabellen ordnen Werte nach Zeilen und Spalten. Tabellenkoepfe beschreiben die Beziehung zwischen einem Wert und seiner Kategorie. Eine Sammlung optisch ausgerichteter divs hat diese Beziehung nicht automatisch.",
        "Fuer Vergleich, Zahlen und wiederholte Datensaetze weiter nutzen. Sortierzustand und Bedienung explizit machen. Ein ARIA-grid lohnt sich erst bei spreadsheet-artiger Tastaturinteraktion und verlangt deutlich mehr Implementierung.",
        sample("ResultsTable.tsx", "Der Header benennt Spalte und Sortierrichtung; ein nativer Button steuert die Sortierung.", `<table>
  <caption>Bewertungen</caption>
  <thead><tr>
    <th scope="col" aria-sort="descending">
      <button onClick={sortByScore}>Bewertung</button>
    </th>
  </tr></thead>
  <tbody><tr><td>90 %</td></tr></tbody>
</table>`), undefined, [docs.aria]),
      item("Status nur durch Farbe oder Icons", [80, 15, 5],
        "Ein roter Punkt oder ein Daumen allein ist nicht fuer alle Menschen eindeutig wahrnehmbar oder verstaendlich. Statusmeldungen brauchen einen zugaenglichen Namen; dynamische Rueckmeldungen muessen bei Bedarf ohne Fokuswechsel angekuendigt werden.",
        "Farbe als Verstaerkung, nicht als einzigen Informationstraeger einsetzen. Native Labels und gezielte Live-Regionen verwenden. Nicht jedes Rendern laut vorlesen lassen; wichtige Aenderungen und Fehler priorisieren.",
        sample("SaveStatus.tsx", "Der Text transportiert das Ergebnis auch ohne Farbe. role=status kuendigt die Aktualisierung hoeflich an.", `<p role="status">
  {saved ? "Aenderungen gespeichert" : "Noch nicht gespeichert"}
</p>`),
        sample("SaveStatus.tsx", "Die visuelle Farbe ist die einzige erkennbare Rueckmeldung.", `<span style={{ background: saved ? "green" : "red" }} />`), [docs.aria]),
      item("Ungeprueftes HTML & Sanitizing", [95, 5, 0],
        "HTML aus CMS, Editor oder Nutzereingaben kann ausfuehrbare oder gefaehrliche Inhalte enthalten. React maskiert normale Textausgaben; dangerouslySetInnerHTML umgeht diese Schutzwirkung bewusst.",
        "Ungeprueftes HTML weglassen. Fuer normalen Text keine HTML-Ausgabe verwenden. Wenn Rich Text fachlich benoetigt wird, eine gepflegte Sanitizer-Loesung mit expliziter Allowlist und Tests einsetzen; Regex-Ersetzungen reichen nicht.",
        sample("Comment.tsx", "Text wird als Text dargestellt, nicht als Markup interpretiert.", `<p>{comment.text}</p>`),
        sample("Comment.tsx", "Fremde Inhalte gelangen ungeprueft in einen HTML-Kontext.", `<div dangerouslySetInnerHTML={{ __html: comment.text }} />`), [docs.html]),
    ],
  },
  {
    id: "frontend-css", label: "CSS & Designsystem",
    subtitle: "Native Layouts, begrenzte Geltungsbereiche und gemeinsame Tokens statt stetig wachsender Overrides.",
    rows: [
      item("Grid & Flexbox", [0, 5, 95],
        "Flexbox verteilt Elemente vor allem entlang einer Achse; Grid ordnet sie in Zeilen und Spalten. Beide reagieren auf vorhandenen Platz und Inhalt, ohne die Position jedes Elements mit JavaScript auszurechnen.",
        "Fuer normale Seiten- und Komponentenlayouts bevorzugen. Absolute Positionierung bleibt fuer bewusste Overlays oder raeumliche Szenen sinnvoll, nicht als Standard fuer ein Formular. Inhalt, Uebersetzung und Zoom muessen das Layout vergroessern duerfen.",
        sample("results.module.css", "Die Karten wechseln anhand des Platzes die Spaltenzahl. min(100%, ...) verhindert Ueberbreite auf sehr kleinen Flaechen.", `.results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: 1rem;
}`)),
      item("Responsive Layouts & Container Queries", [0, 20, 80],
        "Media Queries reagieren etwa auf den Viewport. Container Queries richten eine Komponente nach dem Platz ihres umgebenden Containers aus. So kann dieselbe Komponente in Sidebar und Hauptbereich unterschiedlich angeordnet werden.",
        "Viewport fuer globale Struktur, Container fuer wiederverwendbare lokale Layouts. Nicht jeden Bildschirm separat nachbauen. Browserziel und Fallback pruefen; neue CSS-Funktionen ersetzen keine Tests mit langen Texten und schmalem Platz.",
        sample("summary.module.css", "Die innere Zusammenfassung reagiert auf ihren Container, nicht auf eine angenommene Bildschirmbreite.", `.host { container-type: inline-size; }
.summary { display: grid; gap: 1rem; }
@container (min-width: 36rem) {
  .summary { grid-template-columns: 1fr 1fr; }
}`), undefined, [docs.containers]),
      item("Design Tokens & CSS Custom Properties", [0, 10, 90],
        "Tokens benennen gemeinsame Gestaltungsentscheidungen wie Textfarbe, Abstand oder Fokusfarbe. CSS Custom Properties transportieren solche Werte durch die Kaskade und koennen je Theme ueberschrieben werden.",
        "Wenige semantische Tokens erleichtern konsistente AI-Aenderungen. Nicht jeden zufaelligen Pixelwert in ein globales Token verwandeln. Namen sollen Zweck statt aktuelle Farbe ausdruecken; Kontrast muss pro Kombination geprueft werden.",
        sample("tokens.css", "Komponenten teilen eine semantische Linie und Textfarbe statt unabhängiger Farbkopien.", `:root {
  --color-text: #202629;
  --color-border: #ccd2d5;
  --space-field: 0.75rem;
}
.field { color: var(--color-text); padding: var(--space-field); }`)),
      item("Globale Selektoren & !important-Ketten", [75, 20, 5],
        "Globale Selektoren koennen entfernte Komponenten beeinflussen. Immer speziellere Selektoren und !important erzeugen eine schwer nachvollziehbare Prioritaetskette. Die sichtbare Regel steht dann oft nicht mehr nahe an der Komponente.",
        "Geltungsbereiche begrenzen und die Kaskade bewusst ordnen. !important hat enge legitime Anwendungen, sollte aber keinen permanenten Override-Wettbewerb tragen. Cascade Layers helfen bei der Reihenfolge normaler Regeln; wichtige Regeln haben eine andere Prioritaetsordnung.",
        sample("app.css", "Die Layer-Reihenfolge dokumentiert die normale Prioritaet. Ein geplanter Komponentenlayer ersetzt spontane Spezifitaetseskalation.", `@layer reset, base, components, utilities;
@layer components {
  .saveButton { padding: 0.75rem 1rem; }
}`),
        sample("overrides.css", "Jede neue Ausnahme koppelt das Verhalten staerker an die Seitenstruktur.", `body main .panel div button { padding: 4px !important; }
body main .panel div button.save { padding: 8px !important; }`), [docs.layers]),
      item("CSS Modules", [0, 20, 80],
        "CSS Modules erzeugen lokal zugeordnete Klassennamen. Die Stylingdatei bleibt normales CSS, waehrend gleichnamige Klassen anderer Komponenten nicht versehentlich miteinander kollidieren.",
        "Ein guter Standard fuer komponentennahe Gestaltung ohne Runtime-Styling. Gemeinsame Tokens und wenige globale Grundlagen bleiben sinnvoll. Modules garantieren weder gute Semantik noch automatisch ein konsistentes Designsystem.",
        [sample("Notice.tsx", "Die Komponente benennt den lokalen Stil explizit.", `import styles from "./Notice.module.css";
export function Notice({ children }: { children: React.ReactNode }) {
  return <aside className={styles.notice}>{children}</aside>;
}`), sample("Notice.module.css", "Die Klasse ist lokal, der Farbwert kommt aus einem gemeinsamen Token.", `.notice {
  border-inline-start: 3px solid var(--color-border);
  padding: 1rem;
}`)]),
      item("Utility CSS / Tailwind als Dogma", [10, 60, 30],
        "Utility CSS setzt Gestaltung aus kleinen Klassen direkt im Markup zusammen. Das kann schnelle, konsistente Arbeit ermoeglichen, ist aber kein Ersatz fuer Layoutwissen, Semantik oder ein gemeinsames Komponentensystem.",
        "Als Teamkonvention entscheiden, nicht als zwingendes Merkmal modernen Codes. Wiederholte komplexe Kombinationen in sinnvolle UI-Komponenten ziehen. Fuer den Build muessen verwendete Klassen erkennbar sein; zur Laufzeit zusammengesetzte Klassennamen sind je Tool problematisch.",
        sample("Badge.tsx", "Eine endliche Variantenmenge ist fuer Mensch, AI und Klassenerkennung nachvollziehbar.", `const tones = {
  info: "bg-sky-100 text-sky-900",
  warning: "bg-amber-100 text-amber-950"
} as const;
return <span className={tones[tone]}>{children}</span>;`),
        sample("Badge.tsx", "Beliebige dynamische Klassen sind als Variantenvertrag und fuer die Build-Erkennung unzuverlaessig.", `return <span className={"bg-" + color + "-100"}>{children}</span>;`)),
      item("Runtime CSS-in-JS als Standard", [25, 55, 20],
        "Runtime CSS-in-JS berechnet beziehungsweise registriert Styles waehrend der Ausfuehrung. Das unterscheidet sich von CSS-Loesungen, die ihre Styles beim Build extrahieren. Integration, Serverrendering und Client-Bundle haengen von der Bibliothek ab.",
        "Nicht pauschal verbieten: Ein etabliertes Designsystem kann den Aufwand rechtfertigen. Fuer einfache komponentennahe Styles zuerst statisches CSS pruefen. Eine Migration nur fuer den Trend kann teurer sein als der verbleibende Runtime-Anteil.",
        sample("Meter.tsx", "Nur der wirklich dynamische Wert wird inline gesetzt; die dauerhafte Gestaltung bleibt in CSS.", `<progress className={styles.meter} max={100} value={percent} />`),
        sample("Meter.tsx", "Der gesamte Stil wird pro Render aus einem Objekt neu zusammengestellt, obwohl nur ein Wert variabel ist.", `const style = { width: percent + "%", background: "green", height: 8 };
return <div style={style} />;`)),
      item("JavaScript fuer jedes Layoutproblem", [80, 15, 5],
        "Resize-Listener und manuelle Breitenberechnung bilden oft Verhalten nach, das CSS bereits anbietet. Sie erzeugen zusaetzlichen State, Event-Aufwand und Unterschiede zwischen Server- und Browserausgabe.",
        "CSS fuer rein visuelle Anordnung nutzen. JavaScript bleibt fuer echte Messungen, Canvas oder spezialisierte Virtualisierung sinnvoll. Nicht jede Viewportaenderung muss einen React-Render ausloesen.",
        sample("toolbar.css", "Die Toolbar bricht durch CSS um, ohne Breite im React-State zu speichern.", `.toolbar { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.toolbar > * { min-width: 0; }`),
        sample("Toolbar.tsx", "Die Breite wird nur ermittelt, um einen CSS-artigen Umbruch auszuwaehlen.", `const columns = window.innerWidth < 700 ? 1 : 2;
return <div style={{ display: "grid", gridTemplateColumns: "1fr ".repeat(columns) }} />;`)),
      item("Animationen & Reduced Motion", [0, 25, 75],
        "Animation kann Zustandswechsel erklaeren, aber auch ablenken oder Beschwerden ausloesen. prefers-reduced-motion signalisiert den Wunsch nach weniger Bewegung. Nicht jede Rueckmeldung muss animiert sein.",
        "Kurze, funktionale Uebergaenge bevorzugen. Bei reduzierter Bewegung die Information erhalten und Bewegung entfernen oder stark vereinfachen. Dauernde dekorative Effekte ohne Produktnutzen sind kein Zeichen besserer UI.",
        sample("feedback.css", "Die Statusfarbe bleibt erhalten; nur der dekorative Uebergang wird bei entsprechendem Wunsch abgeschaltet.", `.feedback { transition: background-color 120ms ease; }
@media (prefers-reduced-motion: reduce) {
  .feedback { transition: none; }
}`), undefined, [docs.motion]),
    ],
  },
  {
    id: "frontend-data", label: "Daten & Formulare",
    subtitle: "Serverdaten, lokale Entwuerfe und URL-Zustand haben unterschiedliche Lebenszyklen.",
    rows: [
      item("Server-State-Cache statt Fetch-Eigenbau", [5, 30, 65],
        "Server-State-Bibliotheken verwalten Daten, die einer externen Quelle gehoeren: Ladezustaende, Fehler, Frische, erneutes Laden und Invalidierung. Das ist nicht dasselbe wie lokaler UI-State. Serverseitig geladene statische Inhalte brauchen nicht automatisch einen Client-Cache.",
        "Bei vielen interaktiven Abfragen spart eine bewaehrte Bibliothek eigenen Infrastrukturcode. Schluessel, Frische und Retry-Verhalten trotzdem bewusst festlegen. Weder jeden GET mit useEffect nachbauen noch fuer eine einzige statische Seite einen grossen Cache einfuehren.",
        sample("useItems.ts", "Beispiel mit TanStack Query und vorhandenem QueryClientProvider. Der Filter ist Teil der Identitaet; der Loader prueft die Antwort und verwendet das Signal.", `const query = useQuery({
  queryKey: ["items", filter],
  queryFn: ({ signal }) => loadItems(filter, signal),
  staleTime: 30_000,
  retry: 1
});`), undefined, [docs.query]),
      item("Filter & Pagination in der URL", [0, 20, 80],
        "Die URL kann den angewendeten Zustand einer Ansicht beschreiben. Dadurch funktionieren Teilen, Neuladen sowie Vor- und Zuruecknavigation. Nicht jeder kurzlebige Tastendruck und keine vertrauliche Eingabe gehoert in die Adresse.",
        "Fuer Suche, Sortierung und Seitenzahl meist sinnvoll. URL-Werte parsen und begrenzen; Eingabeentwurf und angewendeten Filter unterscheiden. Suchparameter sind extern kontrollierte Eingaben, keine vertrauenswuerdigen Enumwerte.",
        sample("parseFilters.ts", "Ein ungueltiger oder fehlender Seitenwert bekommt einen definierten Fallback. Die Sortierung hat eine endliche Allowlist.", `const pageValue = Number(params.get("page") ?? 1);
const page = Number.isSafeInteger(pageValue) && pageValue > 0 ? pageValue : 1;
const sort = params.get("sort") === "name" ? "name" : "newest";
return { page, sort };`)),
      item("Formularbibliothek fuer jedes Eingabefeld", [20, 55, 25],
        "Formularbibliotheken koordinieren Feldzustand, Validierung und komplexe Abhaengigkeiten. Fuer eine einfache Suche oder ein einzelnes Feld kann derselbe Aufbau mehr Infrastruktur als Nutzen erzeugen.",
        "Native Formulare und lokale Logik fuer kleine Faelle; Bibliotheken bei dynamischen Feldlisten, mehrstufigen Formularen oder komplexen Regeln pruefen. Entscheidung nach Verhalten und Teamkonvention treffen, nicht nach der Anzahl installierter Pakete.",
        sample("SearchForm.tsx", "Ein nativer GET-Submit macht die Suche teilbar und funktioniert ohne eigenen Feld-Store.", `<form action="/search" method="get">
  <label htmlFor="query">Suche</label>
  <input id="query" name="q" type="search" />
  <button type="submit">Suchen</button>
</form>`),
        sample("SearchForm.tsx", "Fuer einen einzelnen Suchstring werden Store, Controller und Schema pauschal vorausgesetzt.", `const form = useLargeFormFramework({ fields: { q: "" } });
return <FieldController form={form} name="q" />;`), [docs.forms]),
      item("Client- und Servervalidierung", [0, 5, 95],
        "Clientvalidierung liefert schnelle Rueckmeldung. Servervalidierung prueft den tatsaechlich empfangenen Request und schuetzt den verbindlichen Zustand. Ein Schema kann gemeinsame Formregeln beschreiben; objektbezogene Rechte bleiben kontextabhaengig.",
        "Beide Ebenen behalten, aber Regeln nicht ungeplant auseinanderlaufen lassen. Clientpruefung darf optimistisch sein, der Server muss unabhaengig entscheiden. Fehler pro Feld und allgemeine Fehler getrennt darstellen, ohne interne Diagnosen offenzulegen.",
        sample("parseTitle.ts", "Die Funktion prueft Laenge und Leerwerte. Dieselbe Formregel kann geteilt werden; der schreibende Endpunkt muss sie weiterhin selbst aufrufen.", `export function parseTitle(value: unknown): string {
  if (typeof value !== "string") throw new Error("Titel fehlt");
  const title = value.trim();
  if (title.length < 1 || title.length > 120) {
    throw new Error("Titel muss 1 bis 120 Zeichen enthalten");
  }
  return title;
}`), undefined, [docs.auth]),
      item("Optimistische Updates ohne Rueckweg", [35, 60, 5],
        "Ein optimistisches Update zeigt eine Aenderung vor der Serverbestaetigung an. Bei Ablehnung, Netzfehlern oder konkurrierenden Aenderungen kann dieser Zustand falsch sein. Optimistisch bedeutet nicht, Fehler zu ignorieren.",
        "Fuer reversible, haeufige Aktionen kann das die Bedienung verbessern. Vorher Konflikte, Ruecknahme und erneutes Laden definieren. Bei kritischen oder irreversiblen Aktionen lieber Bestaetigung abwarten. Das Zielbeispiel waehlt bewusst den einfacheren bestaetigten Ablauf.",
        sample("save.ts", "Die UI zeigt pending und aktualisiert nach Erfolg den Serverstand. Der API-Adapter prueft Status und fachlichen Fehlervertrag.", `setPending(true);
try {
  await saveItem(command);
  await refreshItems();
} catch {
  setError("Speichern fehlgeschlagen. Bitte erneut versuchen.");
} finally {
  setPending(false);
}`),
        sample("save.ts", "Die Oberflaeche zeigt Erfolg, auch wenn die unkontrollierte Anfrage spaeter scheitert.", `setSaved(true);
fetch("/api/items", { method: "POST", body: JSON.stringify(command) });`)),
      item("localStorage fuer Geheimnisse und Teamdaten", [85, 10, 5],
        "localStorage speichert Strings in einem Browserprofil fuer eine Origin. JavaScript derselben Origin kann darauf zugreifen. Es ist weder ein Team-Datenspeicher noch eine vertrauliche Ablage und kann blockiert oder geloescht werden.",
        "Fuer harmlose lokale Praeferenzen geeignet. Geheimnisse und verbindliche gemeinsame Entscheidungen brauchen ein passendes serverseitiges Modell; Session-Cookies mit HttpOnly haben andere Sicherheitsmerkmale, benoetigen aber weiterhin CSRF-Schutz passend zum Ablauf. Lokale Speicherung immer als ausfallfaehig behandeln.",
        sample("preferences.ts", "Nur eine harmlose Darstellungsoption wird lokal persistiert. Die Anwendung bleibt bei gesperrtem Speicher bedienbar.", `try {
  localStorage.setItem("table-density", density);
} catch {
  // Einstellung gilt fuer die aktuelle Sitzung weiter.
}`),
        sample("session.ts", "Ein langlebiges Geheimnis wird fuer jeden erfolgreichen Script-Zugriff lesbar persistiert.", `localStorage.setItem("access-token", token);`), [docs.auth]),
    ],
  },
  {
    id: "frontend-quality", label: "Tests & Performance",
    subtitle: "Verhalten, Zugaenglichkeit und echte Ladeerfahrung pruefen statt nur Komponentenformen abzusichern.",
    rows: [
      item("Verhaltenstests fuer Komponenten", [0, 5, 95],
        "Ein Komponententest prueft, was Nutzer sehen und ausloesen koennen. Tests gegen interne State-Namen oder private Handler pruefen dagegen oft Implementierungsdetails, die sich bei einem legitimen Refactoring aendern.",
        "Nach Rollen, Labels und sichtbarem Ergebnis testen. Pure Berechnungen zusaetzlich direkt testen. AI darf Tests schreiben, aber erwartetes Verhalten muss unabhaengig vom erzeugten Code feststehen; sonst bestaetigt der Test nur denselben Irrtum.",
        sample("Search.test.tsx", "Beispiel mit Testing Library und user-event. Die Pruefung folgt der Nutzeraktion statt internen Hook-Werten.", `const user = userEvent.setup();
render(<Search onSearch={onSearch} />);
await user.type(screen.getByRole("searchbox", { name: "Suche" }), "Notiz");
await user.click(screen.getByRole("button", { name: "Suchen" }));
expect(onSearch).toHaveBeenCalledWith("Notiz");`), undefined, [docs.testing]),
      item("End-to-End-Tests fuer Kernablaeufe", [0, 10, 90],
        "E2E-Tests bedienen die Anwendung im Browser ueber mehrere technische Schichten. Sie finden unter anderem kaputte Navigation, verlorene Formulardaten und Integrationsfehler. Sie sind teurer als kleine Funktionstests und brauchen kontrollierte Daten.",
        "Wenige wichtige Nutzerreisen verlaesslich absichern. Rollenbasierte Selektoren und erwartbare Zustaende verwenden; starre Wartezeiten und zufaellige Produktivdaten vermeiden. Nicht jede Darstellungsvariante ueber einen teuren Gesamtablauf pruefen.",
        sample("export.spec.ts", "Playwright wartet auf das tatsaechliche Downloadereignis statt auf eine geschaetzte Dauer.", `const downloadPromise = page.waitForEvent("download");
await page.getByRole("button", { name: "Export JSON" }).click();
const download = await downloadPromise;
expect(download.suggestedFilename()).toMatch(/\.json$/);`), undefined, [docs.e2e]),
      item("Grosse Snapshot-Tests als Hauptabsicherung", [65, 30, 5],
        "Snapshots vergleichen gespeicherte Ausgaben mit neuen Ausgaben. Sehr grosse DOM-Snapshots aendern sich haeufig, ohne zu erklaeren, welches Nutzerverhalten kaputt ist. Blindes Aktualisieren kann echte Regressionen freigeben.",
        "Kleine gezielte Snapshots sind eine Option, aber kein Ersatz fuer Verhaltens- und Datenpruefungen. Fuer visuelle Gestaltung eignen sich kontrollierte Screenshot-Vergleiche mit menschlichem Review. Nicht jede neue AI-Ausgabe als neue Wahrheit akzeptieren.",
        sample("Save.test.tsx", "Die wichtige Anforderung ist die sichtbare Rueckmeldung nach dem Speichern.", `await user.click(screen.getByRole("button", { name: "Speichern" }));
expect(await screen.findByRole("status")).toHaveTextContent("Gespeichert");`),
        sample("App.test.tsx", "Ein riesiger Snapshot dokumentiert viel Markup, aber keine konkrete Nutzerabsicht.", `expect(render(<EntireApplication />).container).toMatchSnapshot();`), [docs.testing]),
      item("Visuelle und manuelle Accessibility-Pruefung", [0, 5, 95],
        "Automatisierte Checks finden bestimmte technische Barrieren; Screenshots zeigen Ueberlagerungen, abgeschnittene Inhalte und falsche Umbrueche. Sinnvolle Fokusreihenfolge, verstaendliche Texte und tatsaechliche Bedienbarkeit brauchen zusaetzliche menschliche Pruefung.",
        "Desktop, schmale Ansicht, Tastatur und lange Inhalte als Abnahme kombinieren. Ein gruener Accessibility-Scanner ist kein Vollstaendigkeitsnachweis. AI-generierte Oberflaechen besonders auf echten Inhalt statt nur auf den leeren Idealzustand pruefen.",
        sample("responsive.spec.ts", "Der Screenshot ist eine Review-Grundlage. Die Tastaturpruefung und ein automatischer Accessibility-Scan ergaenzen diesen Test.", `await page.setViewportSize({ width: 390, height: 844 });
await page.goto("/settings");
await expect(page.getByRole("heading", { name: "Einstellungen" })).toBeVisible();
await expect(page).toHaveScreenshot("settings-mobile.png");`), undefined, [docs.e2e, docs.aria]),
      item("Bilder, Fonts & Layoutstabilitaet", [0, 10, 90],
        "Grosse Medien beeinflussen Ladezeit, fehlende Abmessungen verschieben Inhalte nach dem Laden. Fonts koennen Textbreite und Umbruch veraendern. Bildoptimierung umfasst Dateigroesse, Aufloesung, Ladeprioritaet und sinnvolle Alternativtexte.",
        "Abmessungen reservieren und Bilder passend zur Anzeige ausliefern. Wichtige sichtbare Inhalte nicht pauschal lazy laden. Next Image kann helfen, braucht aber korrekte Groessenangaben und ein passendes Hostingmodell. Nicht jede Dekoration braucht eine Bilddatei.",
        sample("Preview.tsx", "Das Seitenverhaeltnis bleibt beim Laden stabil. sizes beschreibt die erwartete Anzeige; der Alternativtext erklaert das relevante Motiv.", `import Image from "next/image";

<Image src="/preview.webp" alt="Vorschau der Ergebnisliste"
  width={960} height={640}
  sizes="(max-width: 48rem) 100vw, 50vw"
  style={{ width: "100%", height: "auto" }} />`), undefined, [docs.image]),
      item("Bundle-Budget & bedarfsweises Laden", [0, 20, 80],
        "Das Client-Bundle enthaelt JavaScript, das Browser laden und ausfuehren. Grosse selten genutzte Editoren oder Visualisierungen koennen den Einstieg verteuern. Code-Splitting trennt solche Teile in spaeter ladbare Einheiten.",
        "Vor allem teure optionale Funktionen gezielt laden und die Wirkung messen. Nicht jede kleine Komponente dynamisch importieren. Weniger JavaScript kann mehr bringen als viele lokale Memoisierungen; Accessibility und benoetigte Funktionalitaet bleiben erhalten.",
        sample("EditorPanel.tsx", "In einer Client Component wird der schwere Editor erst bei Bedarf eingebunden. Fuer Fehler beim Nachladen ist eine passende Fehlergrenze vorzusehen.", `"use client";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./RichEditor"), {
  loading: () => <p role="status">Editor wird geladen</p>
});
export function EditorPanel({ open }: { open: boolean }) {
  return open ? <Editor /> : null;
}`), undefined, [docs.next]),
      item("Performance messen statt vermuten", [0, 5, 95],
        "Ladezeit, Reaktionsfaehigkeit und visuelle Stabilitaet sind verschiedene Eigenschaften. LCP, INP und CLS beschreiben solche Erfahrungen. Lokale Labormessungen sind reproduzierbar, aber nicht identisch mit echten Geraeten und Netzen.",
        "Erst einen relevanten Ablauf und ein Budget festlegen, dann optimieren und erneut messen. Ein Lighthouse-Wert allein ist keine Produktabnahme. Telemetrie muss datensparsam sein und darf keine Formulareingaben oder privaten URLs sammeln.",
        sample("metrics.ts", "Mit der web-vitals-Bibliothek werden nur notwendige Messfelder an einen eigenen, datensparsamen Adapter uebergeben.", `import { onCLS, onINP, onLCP } from "web-vitals";
const report = ({ name, value }: { name: string; value: number }) => {
  recordMetric({ name, value });
};
onCLS(report);
onINP(report);
onLCP(report);`), undefined, [docs.vitals]),
    ],
  },
  {
    id: "frontend-workflow", label: "Architektur & AI",
    subtitle: "Kleine nachvollziehbare Aenderungen mit expliziten Vertraegen und menschlicher Abnahme.",
    rows: [
      item("Featureorientierte Struktur", [0, 20, 80],
        "Eine Feature-Struktur haelt zusammengehoerige UI, Datenadapter und Tests nahe beieinander. Gemeinsame Primitive koennen separat liegen. Sie ist kein Zwang, fuer jeden Button einen eigenen Ordner oder fuer jedes Modul ein Paket anzulegen.",
        "Hilft Menschen und AI, einen Ablauf lokal zu verstehen. Technische Grenzen wie Server-only-Code bleiben trotzdem explizit. Gemeinsamkeiten erst aus konkreten Faellen extrahieren; keine allwissende shared-Schicht aufbauen.",
        sample("feature-structure.txt", "Eine moegliche kleine Struktur, keine verpflichtende Dateischablone fuer jeden Anwendungsfall.", `features/search/
  SearchForm.tsx
  SearchResults.tsx
  loadResults.server.ts
  parseFilters.ts
  Search.test.tsx
ui/
  Button.tsx`)),
      item("Dependencies nach Bedarf statt Vollausstattung", [10, 65, 25],
        "Jede Bibliothek bringt API, Updates, Sicherheitsrisiken und moeglicherweise Client-JavaScript mit. Gleichzeitig sind bewaehrte Bibliotheken fuer komplexe Tabellen, Editoren oder barrierefreie Widgets oft sicherer als ein eigener Nachbau.",
        "Den Bedarf und die Alternativen dokumentieren. Keine Bibliothek nur installieren, weil AI sie vorgeschlagen hat; aber auch keine komplexe Kernfunktion reflexhaft selbst bauen. Wartung, Lizenz, Bundle und Integrationsaufwand pruefen, nicht nur Downloadzahlen.",
        sample("dependency-decision.json", "Ein kurzer Entscheidungsvertrag macht die Abwaegung spaeter nachvollziehbar.", `{
  "need": "Tastaturbedienbarer Dialog",
  "options": ["native dialog", "bestehende UI-Bibliothek"],
  "checks": ["Fokus", "Escape", "SSR", "Lizenz", "Wartung"],
  "decision": "Bestehenden geprueften Baustein verwenden"
}`),
        sample("setup-notes.txt", "Eine pauschale Paketsammlung ersetzt keine Analyse des Produkts.", `Neues Projekt: immer Store, Query-Cache, Formularframework,
Animation-Library und zweites UI-Kit installieren.`)),
      item("Designsystem statt AI-Einzelentwuerfe", [0, 15, 85],
        "Ein Designsystem verbindet Gestaltungsregeln mit verhaltensgeprueften UI-Bausteinen. Es enthaelt nicht nur Farben, sondern auch Zustaende wie Fehler, Laden, Fokus und deaktivierte Aktionen.",
        "AI soll vorhandene Primitive wiederverwenden und fehlende Varianten gezielt ergaenzen. Eigenstaendige Styles pro Aufgabe machen eine Anwendung langfristig inkonsistent. Ein kleines ehrliches System ist besser als eine generische Komponentenfabrik ohne Produktbezug.",
        sample("ActionBar.tsx", "Die konkrete Fachaktion nutzt den vereinbarten Button-Vertrag statt einen neuen Stil zu erfinden.", `<Button variant="primary" disabled={pending} type="submit">
  {pending ? "Wird gespeichert" : "Speichern"}
</Button>`)),
      item("AI-Aufgaben mit Akzeptanzkriterien", [0, 5, 95],
        "Ein Implementierungsauftrag braucht Ziel, Grenzen und beobachtbare Abnahme. Ein Screenshot beschreibt Aussehen, aber nicht automatisch Datenvertrag, Tastaturbedienung oder Fehlerfaelle. AI benoetigt diese Informationen ebenso wie ein neues Teammitglied.",
        "Kleine vertikale Aenderungen mit realen Komponenten, API-Typen und Tests beauftragen. Entscheidungen aus dieser Matrix als Kontext nutzen, aber keine Prozentzahl als universelles Gesetz behandeln. Produktverhalten bleibt eine menschlich bestaetigte Anforderung.",
        sample("frontend-task.json", "Das Beispiel verbindet sichtbares Verhalten mit Nicht-Zielen und konkret pruefbarer Abnahme.", `{
  "goal": "Ergebnisliste nach Status filtern",
  "reuse": ["StatusSelect", "ResultsTable"],
  "acceptance": [
    "Filter bleibt nach Neuladen in der URL erhalten",
    "Leere Liste und API-Fehler sind unterscheidbar",
    "Bedienung ohne Maus moeglich"
  ],
  "nonGoals": ["kein neuer globaler Store", "kein API-Umbau"]
}`)),
      item("AI-Code ungeprueft uebernehmen", [95, 5, 0],
        "Generierter Code kann plausibel wirken und trotzdem veraltete APIs, fehlende Rechtepruefungen, unzugaengliche Controls oder ungetestete Fehlerpfade enthalten. Eine erfolgreiche Generierung ist kein Nachweis fuer ein korrektes Produkt.",
        "Review, Typecheck, Tests und visuelle Abnahme bleiben notwendig. AI kann dieselben Pruefungen unterstuetzen, aber nicht durch die eigene Zuversicht ersetzen. Besonders neue Dependencies und Aenderungen an Server-Client-Grenzen bewusst pruefen.",
        sample("review-checklist.txt", "Eine kurze Gate-Liste fuer jeden kleinen Frontend-Change; die konkreten Testbefehle stammen aus dem Repository.", `1. Diff und neue Dependencies pruefen
2. Typecheck, Lint und relevante Tests ausfuehren
3. Produktionsbuild pruefen
4. Desktop, schmale Ansicht und Tastatur testen
5. Lade-, Leer-, Fehler- und Erfolgszustand abnehmen`),
        sample("handoff.txt", "Eine generierte Behauptung ersetzt keine beobachteten Testergebnisse.", `Die AI sagt: Fertig und responsive.
Ohne Build, Tests oder Browserpruefung direkt mergen.`)),
      item("Generierte API-Typen & klare Grenzen", [0, 25, 75],
        "Ein API-Vertrag beschreibt Daten, Fehler und erlaubte Aufrufe. Generierte Clients koennen Drift zwischen Frontend und API verringern. Sie beweisen nicht, dass ein Server zur Laufzeit gueltige Daten liefert oder ein Nutzer berechtigt ist.",
        "Bei mehreren Teams oder groesseren APIs lohnend. Kleine Adapter zwischen Transportdaten und UI halten Fehlerbehandlung sichtbar. Kein Backend-Objektgraph muss 1:1 in jedes Formular gelangen; fuer kleine APIs kann ein expliziter handgeschriebener Vertrag genuegen.",
        sample("toOption.ts", "Ein schmaler UI-Typ bleibt unabhaengig von zusaetzlichen Transportfeldern. Der API-Client validiert Fehler und kritische Payloads an seiner Grenze.", `type ApiItem = { id: string; title: string; updatedAt: string };
type Option = { value: string; label: string };

export function toOption(item: ApiItem): Option {
  return { value: item.id, label: item.title };
}`)),
    ],
  },
];
