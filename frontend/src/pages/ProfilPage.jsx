
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const RISQUE_LBL = { faible: "Faible", moyen: "Moyen", eleve: "Eleve" };
const RISQUE_CLS = { faible: "badge-faible", moyen: "badge-moyen", eleve: "badge-eleve" };

function ReputationBar({ points }) {
  const TIERS = [
    { label: "Novice", min: 0, max: 10 },
    { label: "Explorateur", min: 10, max: 50 },
    { label: "Veteran", min: 50, max: 150 },
    { label: "Legende", min: 150, max: 300 },
  ];
  const tier = TIERS.slice().reverse().find(t => points >= t.min) || TIERS[0];
  const next = TIERS[TIERS.indexOf(tier) + 1];
  const pct = next ? Math.min(100, ((points - tier.min) / (next.min - tier.min)) * 100) : 100;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontWeight: 600, color: "var(--amber)" }}>{tier.label}</span>
        <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
          {next ? next.min - points + " pts pour " + next.label : "Niveau max"}
        </span>
      </div>
      <div style={{ background: "var(--bg-base)", borderRadius: 4, height: 6, overflow: "hidden" }}>
        <div style={{ width: pct + "%", height: "100%", background: "var(--amber)", borderRadius: 4, transition: "width 0.6s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{points} pts</span>
        {next && <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{next.min} pts</span>}
      </div>
    </div>
  );
}

export default function ProfilPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) return <p style={{ color: "var(--text-secondary)" }}>Non connecte.</p>;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <div className="page-header">
        <h1>Mon profil</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "var(--amber)", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 700, color: "#000", flexShrink: 0,
            }}>
              {user.pseudo?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 20 }}>{user.pseudo}</div>
              <div style={{ color: "var(--text-muted)", fontSize: 13 }}>{user.email}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <span className="badge" style={{ background: user.role === "moderateur" ? "rgba(245,158,11,0.15)" : "var(--bg-elevated)", color: user.role === "moderateur" ? "var(--amber)" : "var(--text-secondary)" }}>
              {user.role === "moderateur" ? "Moderateur" : "Explorateur"}
            </span>
          </div>

          {user.bio && (
            <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>{user.bio}</p>
          )}
        </div>

        <div className="card">
          <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>
            Reputation
          </p>
          <div style={{ fontSize: 36, fontWeight: 700, color: "var(--amber)", marginBottom: 16 }}>
            {user.niveau_reputation} <span style={{ fontSize: 16, color: "var(--text-muted)", fontWeight: 400 }}>pts</span>
          </div>
          <ReputationBar points={user.niveau_reputation || 0} />
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, marginBottom: 16 }}>
          Badges <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: 13 }}>({user.badges?.length || 0})</span>
        </h2>
        {user.badges?.length > 0 ? (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {user.badges.map(b => (
              <div key={b.id} style={{
                background: "var(--bg-elevated)", border: "1px solid var(--border-light)",
                borderRadius: 10, padding: "12px 16px", textAlign: "center", minWidth: 100,
              }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{b.icone}</div>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{b.nom}</div>
                <div style={{ fontSize: 11, color: "var(--amber)" }}>{b.seuil_reputation} pts</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 8, opacity: 0.3 }}>&#127942;</div>
            <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
              Aucun badge encore — explore des lieux pour en gagner !
            </p>
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, marginBottom: 16 }}>
          Historique de visites <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: 13 }}>({user.carnets?.length || 0})</span>
        </h2>
        {user.carnets?.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {user.carnets.map(c => (
              <Link
                key={c.id}
                to={"/lieux/" + c.lieu_id}
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 14px", background: "var(--bg-elevated)", borderRadius: 8,
                  textDecoration: "none", border: "1px solid var(--border)",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-light)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>
                    {c.lieu?.nom || "Lieu inconnu"}
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 2 }}>
                    {c.date_visite}
                  </div>
                </div>
                <div style={{ color: "var(--text-secondary)", fontSize: 13 }}>
                  {c.duree_visite} min
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--text-muted)", fontSize: 14, textAlign: "center", padding: "16px 0" }}>
            Aucune visite enregistree.
          </p>
        )}
      </div>

      <div className="card" style={{ borderColor: "#3b1515" }}>
        <h3 style={{ fontSize: 14, marginBottom: 12, color: "var(--text-secondary)" }}>Zone dangereuse</h3>
        <button onClick={handleLogout} className="btn btn-danger btn-sm">
          Se deconnecter
        </button>
      </div>
    </div>
  );
}
