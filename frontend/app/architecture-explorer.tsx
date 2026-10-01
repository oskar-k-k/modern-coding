"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { analyses, choices, dominant, type CodeSource, type CodeExamplePart, type Rating } from "./architecture-data";

type SortKey = "name" | "omit" | "rethink" | "use" | "dominant" | "vote";
type SortDirection = "asc" | "desc";
type Vote = "up" | "down";

const scoreColor = (index: number, score: number) => {
  const colors = [
    [197, 56, 43],
    [211, 163, 55],
    [43, 137, 88],
  ];
  const [r, g, b] = colors[index];
  const intensity = Math.max(0, Math.min(1, score / 100));
  const alpha = 0.12 + intensity * 0.88;
  return {
    color: `rgba(${r}, ${g}, ${b}, ${alpha})`,
    backgroundColor: `rgba(${r}, ${g}, ${b}, ${0.05 + intensity * 0.13})`,
  };
};

const scoreAt = (
  row: Rating,
  key: SortKey,
  vote: Vote | undefined,
) => {
  if (key === "omit") return row.scores[0];
  if (key === "rethink") return row.scores[1];
  if (key === "use") return row.scores[2];
  if (key === "dominant") return Math.max(...row.scores);
  if (key === "vote") return vote === "up" ? 2 : vote === "down" ? 1 : 0;
  return row.name;
};

const tokenClass = (
  token: string,
  previousToken: string,
  nextToken: string,
) => {
  if (/^["']/.test(token)) return "token-string";
  if (token.startsWith("//")) return "token-comment";
  if (token.startsWith("@")) return "token-annotation";
  if (/^\d+$/.test(token)) return "token-number";
  if (/^[A-Z_]{2,}$/.test(token)) return "token-sql";
  if (
    /^(class|record|interface|enum|return|if|else|for|while|new|void|long|boolean|public|private|protected|static|final|extends|implements|throws|try|catch|var|const|let|async|await|export|default|function|from)$/.test(
      token,
    )
  )
    return "token-keyword";
  if (/^(class|record|interface|enum|new|extends|implements)$/.test(previousToken))
    return "token-type";
  if (/^[A-Z][A-Za-z0-9_]*$/.test(token)) return "token-type";
  if (nextToken === "(" && /^[a-zA-Z_$][\w$]*$/.test(token))
    return "token-method";
  return "";
};

const highlightCode = (code: string) => {
  const tokenPattern =
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*|@\w+|[A-Za-z_$][\w$]*|\b\d+\b|\S|\s+)/g;
  const parts = code.match(tokenPattern) ?? [code];
  return parts.map((part, index) => {
    const previousToken =
      [...parts.slice(0, index)].reverse().find((item) => item.trim()) ?? "";
    const nextToken = parts.slice(index + 1).find((item) => item.trim()) ?? "";
    const className = tokenClass(part, previousToken, nextToken);
    return className ? (
      <span className={className} key={index}>
        {part}
      </span>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    );
  });
};

const exportFileName = () => {
  const stamp = new Date().toISOString().slice(0, 10);
  return `modern-coding-architecture-decisions-${stamp}.json`;
};

const downloadJson = (fileName: string, data: unknown) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const voteLabel = (vote: Vote | undefined) => {
  if (vote === "up") return "approved";
  if (vote === "down") return "rejected";
  return "unreviewed";
};

const recommendationLabel = (row: Rating) => {
  const value = dominant(row.scores);
  return value === -1 ? "Offen / Gleichstand" : choices[value];
};

const architecturePrompt =
  "Use this file as architecture guidance for project start or code review. Prefer rows marked approved, avoid or challenge rows marked rejected, and treat unreviewed rows as discussion material. Percentages are subjective discussion weights, not empirical measurements. Project current examples are captured repository excerpts with relative paths and one-based inclusive line ranges. When examples contain parts, read those ordered file excerpts together; each part has its own description and current parts have individual source provenance. The legacy code field is not an additional example. A replacement-context excerpt shows existing code motivating a new technique, not proof that the target technique is already used. Recommended examples and their filenames are proposals, not existing repository code. Method excerpts and named collaborators are not complete runnable implementations; resolve the described contracts before implementing them. Verify source locations against the snapshot date and excerpt SHA-256 before applying changes.";

function CodeBlock({ code, source, file, description, proposal = false }: {
  code: string;
  source?: CodeSource;
  file?: string;
  description?: string;
  proposal?: boolean;
}) {
  return (
    <figure className="code-example">
      {description && <p className="code-part-description">{description}</p>}
      {(file || source) && <div className="code-file-heading">
        <code>{(file ?? source?.path)?.split(/[\\/]/).pop()}</code>
      </div>}
      <pre>
        <code>{highlightCode(code)}</code>
      </pre>
      {source && (
        <figcaption className="code-source">
          <span className="code-source-path">Quelle: {source.path}</span>
          <span>Zeilen {source.startLine}–{source.endLine} · Stand {source.capturedAt}</span>
        </figcaption>
      )}
      {proposal && (
        <figcaption className="code-source">
          Entwurf für den Neubau · noch nicht im Projekt implementiert
        </figcaption>
      )}
    </figure>
  );
}

function CodeParts({ parts, code, source, proposal = false }: {
  parts?: CodeExamplePart[];
  code: string;
  source?: CodeSource;
  proposal?: boolean;
}) {
  return <div className="code-parts">
    {parts?.length ? parts.map((part, index) => (
      <CodeBlock key={`${part.file}:${index}`} {...part} proposal={proposal} />
    )) : <CodeBlock code={code} source={source} proposal={proposal} />}
  </div>;
}

export default function ArchitectureExplorer() {
  const [analysisId, setAnalysisId] = useState("global");
  const analysis = analyses.find((item) => item.id === analysisId)!;
  const [frameworkId, setFrameworkId] = useState(analysis.frameworks[0].id);
  const framework =
    analysis.frameworks.find((item) => item.id === frameworkId) ??
    analysis.frameworks[0];
  const [topicId, setTopicId] = useState(framework.topics[0].id);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [presenting, setPresenting] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("dominant");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [voteFilter, setVoteFilter] = useState<"all" | "up" | "down" | "none">(
    "all",
  );
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const importInput = useRef<HTMLInputElement | null>(null);
  const topic =
    framework.topics.find((item) => item.id === topicId) ?? framework.topics[0];
  useEffect(() => {
    const stored = window.localStorage.getItem("modern-coding-votes");
    if (!stored) return;
    try {
      setVotes(JSON.parse(stored) as Record<string, Vote>);
    } catch {
      setVotes({});
    }
  }, []);
  useEffect(() => {
    window.localStorage.setItem("modern-coding-votes", JSON.stringify(votes));
  }, [votes]);
  const rowKey = (row: Rating) =>
    `${analysis.id}/${framework.id}/${topic.id}/${row.name}`;
  const voteFor = (row: Rating) => votes[rowKey(row)];
  const rows = topic.rows
    .filter(
      (row) =>
      row.name
        .toLocaleLowerCase("de")
        .includes(query.toLocaleLowerCase("de")) &&
      (filter === "all" || dominant(row.scores) === Number(filter)) &&
      (voteFilter === "all" ||
        voteFor(row) === voteFilter ||
        (voteFilter === "none" && voteFor(row) === undefined)),
    )
    .sort((left, right) => {
      const leftValue = scoreAt(left, sortKey, voteFor(left));
      const rightValue = scoreAt(right, sortKey, voteFor(right));
      const result =
        typeof leftValue === "string" && typeof rightValue === "string"
          ? leftValue.localeCompare(rightValue, "de")
          : Number(leftValue) - Number(rightValue);
      return sortDirection === "asc" ? result : -result;
    });
  const selectAnalysis = (id: string) => {
    const next = analyses.find((item) => item.id === id)!;
    setAnalysisId(id);
    setFrameworkId(next.frameworks[0].id);
    setTopicId(next.frameworks[0].topics[0].id);
    setQuery("");
    setFilter("all");
    setExpanded(null);
  };
  const switchFramework = (id: string) => {
    const next = analysis.frameworks.find((item) => item.id === id)!;
    setFrameworkId(id);
    setTopicId(next.topics[0].id);
    setQuery("");
    setFilter("all");
    setExpanded(null);
  };
  const switchTopic = (id: string) => {
    setTopicId(id);
    setQuery("");
    setFilter("all");
    setExpanded(null);
  };
  const setVote = (row: Rating, vote: Vote) => {
    const key = rowKey(row);
    setVotes((current) => {
      const next = { ...current };
      if (next[key] === vote) delete next[key];
      else next[key] = vote;
      return next;
    });
  };
  const exportAnalysis = () => {
    const exportedAt = new Date().toISOString();
    const exportRows = analysis.frameworks.flatMap((frameworkItem) =>
      frameworkItem.topics.flatMap((topicItem) =>
        topicItem.rows.map((row) => ({
          key: `${analysis.id}/${frameworkItem.id}/${topicItem.id}/${row.name}`,
          row,
        })),
      ),
    );
    const payload = {
      schema: "modern-coding.architecture-decisions.v1",
      exportedAt,
      aiUsage: architecturePrompt,
      analysis: {
        id: analysis.id,
        label: analysis.label,
        kind: analysis.kind,
        description: analysis.description,
      },
      summary: {
        totalRows: exportRows.length,
        approved: exportRows.filter(({ key }) => votes[key] === "up").length,
        rejected: exportRows.filter(({ key }) => votes[key] === "down").length,
        unreviewed: exportRows.filter(({ key }) => votes[key] === undefined)
          .length,
      },
      frameworks: analysis.frameworks.map((frameworkItem) => ({
        id: frameworkItem.id,
        label: frameworkItem.label,
        subtitle: frameworkItem.subtitle,
        topics: frameworkItem.topics.map((topicItem) => ({
          id: topicItem.id,
          label: topicItem.label,
          subtitle: topicItem.subtitle,
          rows: topicItem.rows.map((row) => {
            const key = `${analysis.id}/${frameworkItem.id}/${topicItem.id}/${row.name}`;
            const rowVote = votes[key];
            const recommendation = dominant(row.scores);
            return {
              id: key,
              name: row.name,
              meetingVote: voteLabel(rowVote),
              scores: {
                omit: row.scores[0],
                redefine: row.scores[1],
                use: row.scores[2],
              },
              recommendation:
                recommendation === -1 ? "tie" : choices[recommendation],
              priority: row.priority,
              priorityReason: row.priorityReason,
              occurrence: row.occurrence,
              explanation: row.explanation,
              assessment: row.reason,
              examples:
                analysis.kind === "global" && recommendation === 2
                  ? {
                      recommended: {
                        label: "So ist es richtig",
                        description: row.recommendedDescription,
                        code: row.recommendedExample ?? row.currentExample,
                      },
                    }
                  : {
                      current: {
                        label: "IST-Code",
                        origin: row.currentSource ? "repository" : analysis.kind === "global" ? "illustration" : "not-documented",
                        source: row.currentSource ?? null,
                        evidence: row.currentEvidence,
                        description: row.currentDescription,
                        code: row.currentExample,
                        parts: row.currentParts,
                      },
                      recommended: {
                        label: "Soll / Empfehlung",
                        origin: analysis.kind === "project" ? "proposal" : "illustration",
                        description: row.recommendedDescription,
                        code: row.recommendedExample,
                        parts: row.recommendedParts,
                      },
                    },
            };
          }),
        })),
      })),
    };
    downloadJson(exportFileName(), payload);
  };
  const importAnalysis = async (file: File | undefined) => {
    if (!file) return;
    const text = await file.text();
    const payload = JSON.parse(text) as {
      frameworks?: Array<{
        topics?: Array<{
          rows?: Array<{ id?: string; meetingVote?: string }>;
        }>;
      }>;
    };
    const importedVotes: Record<string, Vote> = {};
    for (const frameworkItem of payload.frameworks ?? []) {
      for (const topicItem of frameworkItem.topics ?? []) {
        for (const row of topicItem.rows ?? []) {
          if (!row.id) continue;
          if (row.meetingVote === "approved") importedVotes[row.id] = "up";
          if (row.meetingVote === "rejected") importedVotes[row.id] = "down";
        }
      }
    }
    setVotes((current) => ({ ...current, ...importedVotes }));
  };
  const sortBy = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      return;
    }
    setSortKey(key);
    setSortDirection(key === "name" ? "asc" : "desc");
  };
  return (
    <div
      className={`shell ${presenting ? "presenting" : ""} ${
        sidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      <aside className="sidebar">
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarCollapsed(true)}
          aria-label="Sidebar einklappen"
        >
          ‹
        </button>
        <a className="brand" href="/" aria-label="Modern Coding Startseite">
          <img src="/mark.svg" width="36" height="36" alt="" />
          <span>
            modern<span className="brand-light">coding</span>
          </span>
        </a>
        <div className="workspace-label">
          PROJEKTE <span>{String(analyses.length).padStart(2, "0")}</span>
        </div>
        <div className="project-list" aria-label="Analysen">
          {analyses.map((item) => (
            <button
              key={item.id}
              className={`project-link ${analysisId === item.id ? "active" : ""}`}
              onClick={() => selectAnalysis(item.id)}
              aria-pressed={analysisId === item.id}
            >
              <span>{item.kind === "global" ? "ALL" : "REPO"}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </div>
        <div className="sidebar-bottom">
          <span className="status-dot" /> Offenes Gedankenexperiment
          <p>Java 21 · Spring Boot · Next.js</p>
        </div>
      </aside>
      {sidebarCollapsed && !presenting && (
        <button
          className="sidebar-restore"
          onClick={() => setSidebarCollapsed(false)}
          aria-label="Sidebar ausklappen"
        >
          Projekte
        </button>
      )}
      <main>
        <header className="topbar">
          <span>
            Modern Coding <span className="slash">/</span>{" "}
            <strong>{analysis.label}</strong>
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
          <div className="framework-tabs" role="tablist" aria-label="Frameworks">
            {analysis.frameworks.map((item) => (
              <button
                key={item.id}
                role="tab"
                aria-selected={framework.id === item.id}
                onClick={() => switchFramework(item.id)}
              >
                <strong>{item.label}</strong>
                <span>{item.subtitle}</span>
              </button>
            ))}
          </div>
          <div className="tabs" role="tablist" aria-label="Architekturthemen">
            {framework.topics.map((item, index) => (
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
                    next = (index + 1) % framework.topics.length;
                  else if (event.key === "ArrowLeft")
                    next =
                      (index + framework.topics.length - 1) %
                      framework.topics.length;
                  else if (event.key === "Home") next = 0;
                  else if (event.key === "End")
                    next = framework.topics.length - 1;
                  else return;
                  event.preventDefault();
                  switchTopic(framework.topics[next].id);
                  document
                    .getElementById(`tab-${framework.topics[next].id}`)
                    ?.focus();
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
                <div className="eyebrow">{framework.label.toUpperCase()}</div>
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
              <select
                aria-label="Nach manueller Bewertung filtern"
                value={voteFilter}
                onChange={(event) =>
                  setVoteFilter(
                    event.target.value as "all" | "up" | "down" | "none",
                  )
                }
              >
                <option value="all">Alle Bewertungen</option>
                <option value="up">Daumen hoch</option>
                <option value="down">Daumen runter</option>
                <option value="none">Unbewertet</option>
              </select>
              <button className="export-button" onClick={exportAnalysis}>
                Export JSON
              </button>
              <button
                className="import-button"
                onClick={() => importInput.current?.click()}
              >
                Import JSON
              </button>
              <input
                ref={importInput}
                className="sr-only"
                type="file"
                accept="application/json,.json"
                onChange={(event) => {
                  void importAnalysis(event.target.files?.[0]);
                  event.currentTarget.value = "";
                }}
              />
              <span className="result-count" aria-live="polite">
                {rows.length} von {topic.rows.length}
              </span>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>
                      <button
                        className="sort-heading"
                        onClick={() => sortBy("name")}
                      >
                        BAUSTEIN
                        {sortKey === "name" && (
                          <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="score-heading">
                      <button
                        className="sort-heading"
                        onClick={() => sortBy("omit")}
                      >
                        WEGLASSEN
                        {sortKey === "omit" && (
                          <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="score-heading">
                      <button
                        className="sort-heading"
                        onClick={() => sortBy("rethink")}
                      >
                        NEU DEFINIEREN
                        {sortKey === "rethink" && (
                          <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="score-heading">
                      <button
                        className="sort-heading"
                        onClick={() => sortBy("use")}
                      >
                        NUTZEN
                        {sortKey === "use" && (
                          <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th>
                      <button
                        className="sort-heading"
                        onClick={() => sortBy("dominant")}
                      >
                        EINSCHÄTZUNG
                        {sortKey === "dominant" && (
                          <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th className="vote-heading">
                      <button
                        className="sort-heading"
                        onClick={() => sortBy("vote")}
                      >
                        BEWERTUNG
                        {sortKey === "vote" && (
                          <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                        )}
                      </button>
                    </th>
                    <th>
                      <span className="sr-only">Details</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const recommendation = dominant(row.scores);
                    const open = expanded === row.name;
                    const singleExample =
                      analysis.kind === "global" && recommendation === 2;
                    const vote = voteFor(row);
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
                              style={scoreColor(index, score)}
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
                            <div className="vote-actions">
                              <button
                                className={vote === "up" ? "selected" : ""}
                                aria-pressed={vote === "up"}
                                aria-label={`Daumen hoch: ${row.name}`}
                                onClick={() => setVote(row, "up")}
                              >
                                👍
                              </button>
                              <button
                                className={vote === "down" ? "selected" : ""}
                                aria-pressed={vote === "down"}
                                aria-label={`Daumen runter: ${row.name}`}
                                onClick={() => setVote(row, "down")}
                              >
                                👎
                              </button>
                            </div>
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
                            <td colSpan={7}>
                              <div className="detail-content">
                                <div className="detail-description">
                                  {(row.priority || row.occurrence) && (
                                    <div className="detail-meta">
                                      {row.priority && (
                                        <span>
                                          <b>Priorität</b>
                                          {row.priority}
                                        </span>
                                      )}
                                      {row.occurrence && (
                                        <span>
                                          <b>Vorkommen</b>
                                          {row.occurrence}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  <div>
                                    <span className="eyebrow">
                                      WAS BEDEUTET DAS?
                                    </span>
                                    <p>{row.explanation}</p>
                                  </div>
                                  <div>
                                    <span className="eyebrow">
                                      WARUM DIESE TENDENZ?
                                    </span>
                                    <p>{row.reason}</p>
                                  </div>
                                  {row.priorityReason && (
                                    <div>
                                      <span className="eyebrow">
                                        PRIORITÄT
                                      </span>
                                      <p>{row.priorityReason}</p>
                                    </div>
                                  )}
                                </div>
                                <div
                                  className={
                                    singleExample
                                      ? "code-comparison single-code"
                                      : "code-comparison"
                                  }
                                >
                                  {singleExample ? (
                                    <div>
                                      <span>SO IST ES RICHTIG</span>
                                      <p>{row.recommendedDescription}</p>
                                      <CodeBlock
                                        code={
                                          row.recommendedExample ??
                                          row.currentExample ??
                                          "Für diese Zeile wird noch ein Beispiel ergänzt."
                                        }
                                      />
                                    </div>
                                  ) : (
                                    <>
                                      <div>
                                        <span>{row.currentEvidence === "replacement-context" ? "IST-CODE / AUSGANGSPUNKT" : "IST-CODE"}</span>
                                        <p>{row.currentDescription}</p>
                                        {row.currentExample && (
                                          <CodeParts parts={row.currentParts} code={row.currentExample} source={row.currentSource} />
                                        )}
                                      </div>
                                      <div>
                                        <span>SOLL / EMPFEHLUNG</span>
                                        <p>{row.recommendedDescription}</p>
                                        <CodeParts
                                          parts={row.recommendedParts}
                                          proposal={analysis.kind === "project"}
                                          code={
                                            row.recommendedExample ??
                                            "Für eine Projektanalyse wird hier die empfohlene Variante ergänzt."
                                          }
                                        />
                                      </div>
                                    </>
                                  )}
                                </div>
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
