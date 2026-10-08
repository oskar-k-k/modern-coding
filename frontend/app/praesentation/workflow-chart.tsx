const groups = [
  { name: "Klassisches Development", bars: [
    { label: "IDE/Dev", value: 80, color: "#397895" },
    { label: "AI", value: 0, color: "#286a50" },
    { label: "Prüfung", value: 10, color: "#a66e16" },
  ] },
  { name: "AI Development", bars: [
    { label: "IDE/Dev", value: 10, color: "#397895" },
    { label: "AI", value: 70, color: "#286a50" },
    { label: "Prüfung", value: 20, color: "#a66e16" },
  ] },
];

export default function WorkflowChart() {
  return <section className="workflow-chart" aria-label="Schematischer Vergleich der reinen Entwicklungszeit">
    <p className="workflow-model">Reine Entwicklungszeit · schematische Darstellung</p>
    <div className="workflow-comparison">
      {groups.map(group => <figure className="workflow-scenario" key={group.name}>
        <figcaption>{group.name}</figcaption>
        <div className={group.bars.length === 3 ? "workflow-three-bars workflow-schematic" : "workflow-two-bars"} role="img" aria-label={`${group.name}: ${group.bars.map(bar => bar.label).join(", ")}. Balkenhöhen sind schematisch.`}>
          {group.bars.map(bar => <div key={bar.label}>
            <div className="workflow-column-pair"><div className="workflow-column-track">
              <div className="workflow-column-fill" style={{ height: `${bar.value}%`, backgroundColor: bar.color }} />
            </div></div>
            <strong className="workflow-column-label">{bar.label}</strong>
          </div>)}
        </div>
      </figure>)}
    </div>
  </section>;
}
