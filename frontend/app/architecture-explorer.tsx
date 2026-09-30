"use client";

import { Fragment, useState } from "react";
import { choices, dominant, topics } from "./architecture-data";

export default function ArchitectureExplorer() {
  const [topicId, setTopicId] = useState("spring");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [presenting, setPresenting] = useState(false);
  const topic = topics.find((item) => item.id === topicId)!;
  const rows = topic.rows.filter(
    (row) =>
      row.name
        .toLocaleLowerCase("de")
        .includes(query.toLocaleLowerCase("de")) &&
      (filter === "all" || dominant(row.scores) === Number(filter)),
  );
  const switchTopic = (id: string) => {
    setTopicId(id);
    setQuery("");
    setFilter("all");
    setExpanded(null);
  };
  return (
    <div className={`shell ${presenting ? "presenting" : ""}`}>
      <aside className="sidebar">
        <a className="brand" href="/" aria-label="Modern Coding Startseite">
          <img src="/mark.svg" width="36" height="36" alt="" />
          <span>
            modern<span className="brand-light">coding</span>
          </span>
        </a>
        <div className="workspace-label">
          ARCHITEKTUR-LABOR <span>01</span>
        </div>
        <div className="nav-active">
          <span>▦</span> Architektur-Explorer <span>↗</span>
        </div>
        <div className="sidebar-note">
          Ein neuer Workflow.
          <br />
          Eine neue Perspektive.
        </div>
        <div className="principles">
          <div className="eyebrow">UNSER MASSSTAB</div>
          <p>
            <span>01</span> Korrektheit & Sicherheit
          </p>
          <p>
            <span>02</span> Performance
          </p>
          <p>
            <span>03</span> Kontext verstehen
          </p>
          <p>
            <span>04</span> Einfach prüfen
          </p>
        </div>
        <div className="sidebar-bottom">
          <span className="status-dot" /> Offenes Gedankenexperiment
          <p>Java 21 · Spring Boot · Next.js</p>
        </div>
      </aside>
      <main>
        <header className="topbar">
          <span>
            Modern Coding <span className="slash">/</span>{" "}
            <strong>Architektur-Explorer</strong>
          </span>
          <button
            className="quiet-button"
            onClick={() => setPresenting(!presenting)}
            aria-pressed={presenting}
          >
            <span aria-hidden="true">⛶</span>{" "}
            {presenting ? "Ansicht beenden" : "Präsentationsmodus"}
          </button>
        </header>
        <div className="content">
          <div className="intro">
            <div>
              <div className="eyebrow">
                <span className="tiny-line" /> ENTWICKLUNG MIT KI NEU DENKEN
              </div>
              <h1>
                Architektur im Wandel<span>.</span>
              </h1>
              <p>
                Was bleibt? Was verändert sich? Was kann weg?
                <br />
                Ein Arbeitsstand für besseren Code und kürzere Wege zum
                Verstehen.
              </p>
            </div>
            <span className="edition">
              DISCUSSION PAPER <b>01 / 2026</b>
            </span>
          </div>
          <div className="thesis">
            <span className="thesis-icon">↳</span>
            <p>
              <strong>
                Komplexität darf bleiben. Der Kontext sollte zusammenbleiben.
              </strong>
              <span>
                Korrektheit, Sicherheit und Performance zuerst.
                Zusammengehörigen Code dort bündeln, wo wir ihn prüfen.
              </span>
            </p>
            <span className="thesis-tag">DIE LEITIDEE</span>
          </div>
          <div className="section-heading">
            <h2>Bausteine auf dem Prüfstand</h2>
            <span>
              {topics.reduce((count, item) => count + item.rows.length, 0)}{" "}
              Diskussionspunkte · 4 Perspektiven
            </span>
          </div>
          <div className="tabs" role="tablist" aria-label="Architekturthemen">
            {topics.map((item, index) => (
              <button
                key={item.id}
                role="tab"
                id={`tab-${item.id}`}
                aria-selected={topicId === item.id}
                aria-controls="topic-panel"
                tabIndex={topicId === item.id ? 0 : -1}
                onClick={() => switchTopic(item.id)}
                onKeyDown={(event) => {
                  let next = index;
                  if (event.key === "ArrowRight")
                    next = (index + 1) % topics.length;
                  else if (event.key === "ArrowLeft")
                    next = (index + topics.length - 1) % topics.length;
                  else if (event.key === "Home") next = 0;
                  else if (event.key === "End") next = topics.length - 1;
                  else return;
                  event.preventDefault();
                  switchTopic(topics[next].id);
                  document.getElementById(`tab-${topics[next].id}`)?.focus();
                }}
              >
                <span className="tab-number">0{index + 1}</span>
                {item.label}
                <span className="tab-count">{item.rows.length}</span>
              </button>
            ))}
          </div>
          <section
            id="topic-panel"
            role="tabpanel"
            aria-labelledby={`tab-${topic.id}`}
            className="panel"
          >
            <div className="panel-heading">
              <div>
                <div className="eyebrow">{topic.label.toUpperCase()}</div>
                <h3>{topic.subtitle}</h3>
              </div>
              <span className="working-label">
                <span className="status-dot" /> Arbeitsstand
              </span>
            </div>
            <div className="stat-grid">
              {choices.map((choice, index) => (
                <button
                  key={choice}
                  className={`stat stat-${index} ${filter === String(index) ? "selected" : ""}`}
                  aria-pressed={filter === String(index)}
                  onClick={() =>
                    setFilter(filter === String(index) ? "all" : String(index))
                  }
                >
                  <span className="stat-label">
                    <span className={`dot color-${index}`} />
                    {choice}
                    <span className="stat-arrow">↗</span>
                  </span>
                  <strong>
                    {String(
                      topic.rows.filter((row) => dominant(row.scores) === index)
                        .length,
                    ).padStart(2, "0")}
                  </strong>
                  <span className="stat-caption">
                    Bausteine mit dieser Tendenz
                  </span>
                </button>
              ))}
            </div>
            <div className="toolbar">
              <label className="search">
                <span aria-hidden="true">⌕</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Baustein suchen …"
                  aria-label="Baustein suchen"
                />
                <kbd>Suche</kbd>
              </label>
              <select
                aria-label="Nach Tendenz filtern"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                <option value="all">Alle Tendenzen</option>
                {choices.map((choice, index) => (
                  <option value={index} key={choice}>
                    {choice}
                  </option>
                ))}
                <option value="-1">Offen / Gleichstand</option>
              </select>
              <span className="result-count" aria-live="polite">
                {rows.length} von {topic.rows.length}
              </span>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>BAUSTEIN</th>
                    <th className="score-heading">WEGLASSEN</th>
                    <th className="score-heading">NEU DEFINIEREN</th>
                    <th className="score-heading">NUTZEN</th>
                    <th>EINSCHÄTZUNG</th>
                    <th>
                      <span className="sr-only">Details</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const recommendation = dominant(row.scores);
                    const open = expanded === row.name;
                    return (
                      <Fragment key={row.name}>
                        <tr className={open ? "row-open" : ""}>
                          <th scope="row">
                            <button
                              className="row-name"
                              onClick={() =>
                                setExpanded(open ? null : row.name)
                              }
                              aria-expanded={open}
                            >
                              {row.name}
                            </button>
                          </th>
                          {row.scores.map((score, index) => (
                            <td
                              className={`score score-${index} ${recommendation === index ? "score-leading" : ""}`}
                              key={index}
                            >
                              {score}
                              <span>%</span>
                            </td>
                          ))}
                          <td>
                            <div
                              className="distribution"
                              aria-label={`Gewichtung: ${row.scores.join(", ")} Prozent`}
                            >
                              {row.scores.map((score, index) => (
                                <span
                                  key={index}
                                  className={`color-${index}`}
                                  style={{ width: `${score}%` }}
                                />
                              ))}
                            </div>
                            <span className="recommendation">
                              {recommendation === -1
                                ? "Offen / Gleichstand"
                                : choices[recommendation]}
                            </span>
                          </td>
                          <td>
                            <button
                              className="expand"
                              aria-label={`${open ? "Schließen" : "Details"}: ${row.name}`}
                              aria-expanded={open}
                              onClick={() =>
                                setExpanded(open ? null : row.name)
                              }
                            >
                              {open ? "−" : "+"}
                            </button>
                          </td>
                        </tr>
                        {open && (
                          <tr className="detail-row">
                            <td colSpan={6}>
                              <div className="detail-content">
                                <div>
                                  <span className="eyebrow">
                                    WARUM DIESE TENDENZ?
                                  </span>
                                  <p>{row.reason}</p>
                                </div>
                                {row.example && (
                                  <pre>
                                    <code>{row.example}</code>
                                  </pre>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
              {rows.length === 0 && (
                <div className="empty">
                  <strong>Kein passender Baustein.</strong>
                  <p>Suchbegriff oder Filter anpassen.</p>
                  <button
                    className="quiet-button"
                    onClick={() => {
                      setQuery("");
                      setFilter("all");
                    }}
                  >
                    Filter zurücksetzen
                  </button>
                </div>
              )}
            </div>
            <div className="table-footer">
              <span>
                <b>+</b> Einen Baustein öffnen, um die Begründung zu sehen.
              </span>
              <span>Gewichtung je Zeile = 100 %</span>
            </div>
          </section>
          <div className="footnotes">
            <div>
              <span className="note-symbol">i</span>
              <p>
                <strong>Einschätzungen, keine Messwerte.</strong> Die
                Prozentwerte sind vorläufige subjektive Diskussionsgewichte für
                unser SQL-orientiertes Beispiel. Sie sind keine
                Studienergebnisse oder Wahrscheinlichkeit, dass ein Feature
                veraltet ist. „Weglassen“ gilt für diesen Ansatz, nicht pauschal
                für jedes Projekt.
              </p>
            </div>
            <div className="next-note">
              <span className="eyebrow">ALS NÄCHSTES</span>
              <strong>
                Next.js gemeinsam hinterfragen <span>↗</span>
              </strong>
              <p>Server Components, Datenzugriff und die Grenze zum Backend.</p>
            </div>
          </div>
          <footer>
            <span>
              modern coding <span className="footer-dot">·</span> Ein
              Repository. Zwei Anwendungen.
            </span>
            <a href="/api/profiles/alex/page" target="_blank" rel="noreferrer">
              Spring-Boot-Beispiel öffnen ↗
            </a>
          </footer>
        </div>
      </main>
    </div>
  );
}
