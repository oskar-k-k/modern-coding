export default function ArchitectureComparison() {
  return <div className="architecture-comparison">
    <figure>
      <figcaption>Nach technischer Rolle</figcaption>
      <svg viewBox="0 0 400 310" role="img" aria-label="Eine Profiländerung verteilt sich im gezeigten Schichtenmodell über Controller, Service, Repository und Mapper.">
        <text x="18" y="25" fill="#52665d" fontSize="13">Eine Änderung · mehrere technische Bereiche</text>
        {["controller/", "service/", "repository/", "dto/"].map((name, i) => <g key={name}>
          <rect x="18" y={45 + i * 61} width="364" height="46" rx="4" fill="#e7eff3" />
          <text x="30" y={73 + i * 61} fontSize="14" fill="#20382e">{name}</text>
          <rect x="201" y={52 + i * 61} width="165" height="32" rx="3" fill="#397895" />
          <text x="283" y={73 + i * 61} textAnchor="middle" fontSize="13" fill="white">Profil</text>
          {i < 3 && <path d={`M 283 ${91 + i * 61} v 15 m -4 -4 l 4 4 l 4 -4`} stroke="#397895" fill="none" strokeWidth="2" />}
        </g>)}
      </svg>
    </figure>
    <figure>
      <figcaption>Nach Feature</figcaption>
      <svg viewBox="0 0 400 310" role="img" aria-label="Profil, Upload und Suche bilden eigene Featurebereiche. Die Profiländerung bleibt im gezeigten Modell innerhalb eines Features.">
        <text x="18" y="25" fill="#52665d" fontSize="13">Eine Änderung · ein zusammenhängender Bereich</text>
        {["Profil", "Upload", "Suche"].map((name, i) => <g key={name}>
          <rect x={18 + i * 125} y="45" width="114" height="229" rx="4" fill={i === 0 ? "#286a50" : "#edf1e8"} />
          <text x={75 + i * 125} y="75" textAnchor="middle" fill={i === 0 ? "white" : "#20382e"} fontSize="15" fontWeight="bold">{name}</text>
          {["Controller", "Service", "Repository", "DTO"].map((label, row) => <text key={label} x={75 + i * 125} y={115 + row * 40} textAnchor="middle" fontSize="13" fill={i === 0 ? "white" : "#52665d"}>{label}</text>)}
        </g>)}
      </svg>
    </figure>
    <p className="architecture-caption">Spring-Boot-Paketstruktur · gleiche Rollen, andere Gruppierung</p>
  </div>;
}
