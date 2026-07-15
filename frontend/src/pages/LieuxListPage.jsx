import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const RISQUE = {
  faible: { label: "Faible",  cls: "badge-faible",  dot: "#22c55e" },
  moyen:  { label: "Moyen",   cls: "badge-moyen",   dot: "#f97316" },
  eleve:  { label: "Eleve",   cls: "badge-eleve",   dot: "#ef4444" },
};

const FILTERS = [
  { value: "",       label: "Tous"   },
  { value: "faible", label: "Faible" },
  { value: "moyen",  label: "Moyen"  },
  { value: "eleve",  label: "Eleve"  },
];

function LieuCard({ lieu }) {
  const r = RISQUE[lieu.niveau_risque] || {};
  return (
    <Link to={"/lieux/" + lieu.id} style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        overflow: "hidden",
        transition: "border-color 0.2s, transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)";
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.4)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Bande colorée en haut */}
        <div style={{
          height: 4,
          background: r.dot === "#22c55e"
            ? "linear-gradient(90deg, #16a34a, #22c55e)"
            : r.dot === "#f97316"
            ? "linear-gradient(90deg, #c2410c, #f97316)"
            : "linear-gradient(90deg, #b91c1c, #ef4444)",
        }} />

        <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 8 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3, flex: 1 }}>
              {lieu.nom}
            </h3>
            <span className={"badge " + r.cls} style={{ flexShrink: 0 }}>
              {r.label}
            </span>
          </div>

          {/* Description */}
          <p style={{ color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6, flex: 1, marginBottom: 16 }}>
            {lieu.description.substring(0, 120)}{lieu.description.length > 120 ? "…" : ""}
          </p>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--text-muted)" }} />
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{lieu.date_creation}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {lieu.coords_floutees && (
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: "#f59e0b", background: "rgba(120,69,10,0.4)",
                  padding: "2px 8px", borderRadius: 10,
                  border: "1px solid rgba(245,158,11,0.2)",
                }}>
                  Coords masquees
                </span>
              )}
              <span style={{ color: "var(--amber)", fontSize: 13 }}>&#8594;</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function LieuxListPage() {
  const { user } = useAuth();
  const [lieux, setLieux] = useState([]);
  const [filtre, setFiltre] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = filtre ? { niveau_risque: filtre } : {};
    setLoading(true);
    api.get("/lieux", { params })
      .then(r => setLieux(r.data))
      .finally(() => setLoading(false));
  }, [filtre]);

  return (
    <div>
      {/* Hero header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 6 }}>
              Lieux explores
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              {lieux.length} lieu{lieux.length !== 1 ? "x" : ""} repertorie{lieux.length !== 1 ? "s" : ""} par la communaute
            </p>
          </div>
          {user && (
            <Link to="/proposer" className="btn btn-primary">
              + Proposer un lieu
            </Link>
          )}
        </div>

        {/* Ligne de séparation stylée */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24, marginBottom: 0 }}>
          <div style={{ height: 1, flex: 1, background: "var(--border)" }} />
          <span style={{ color: "var(--text-muted)", fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>Explorer</span>
          <div style={{ height: 1, flex: 1, background: "var(--border)" }} />
        </div>
      </div>

      {/* Filtres */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, flexWrap: "wrap" }}>
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFiltre(f.value)}
            style={{
              padding: "7px 16px",
              borderRadius: 8,
              border: "1px solid " + (filtre === f.value ? "var(--amber)" : "var(--border)"),
              background: filtre === f.value ? "rgba(120,69,10,0.5)" : "var(--bg-elevated)",
              color: filtre === f.value ? "var(--amber)" : "var(--text-secondary)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              fontFamily: "Inter, sans-serif",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { if (filtre !== f.value) { e.currentTarget.style.borderColor = "var(--border-light)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
            onMouseLeave={e => { if (filtre !== f.value) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; } }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grille */}
      {loading ? (
        <div className="spinner">Chargement des lieux...</div>
      ) : lieux.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "64px 0",
          border: "1px dashed var(--border)", borderRadius: 14,
          background: "var(--bg-card)",
        }}>
          <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.3 }}>&#128506;</div>
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Aucun lieu trouve</p>
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Sois le premier a en proposer un.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 16 }}>
          {lieux.map(lieu => <LieuCard key={lieu.id} lieu={lieu} />)}
        </div>
      )}
    </div>
  );
}
