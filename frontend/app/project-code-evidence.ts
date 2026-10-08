import type { Rating, Topic } from "./architecture-data";

const withoutProjectEvidence = (row: Rating): Rating => ({
  ...row,
  currentDescription:
    row.currentDescription ??
    "Fuer diese Zeile ist im oeffentlichen Repository keine Projektfundstelle hinterlegt.",
});

export function withProjectEvidence(_project: string, topics: Topic[]): Topic[] {
  return topics.map((topic) => ({
    ...topic,
    rows: topic.rows.map(withoutProjectEvidence),
  }));
}
