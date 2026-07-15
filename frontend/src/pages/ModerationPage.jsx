
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const RISQUE_CLS = { faible: "badge-faible", moyen: "badge-moyen", eleve: "badge-eleve" };
const RISQUE_LBL = { faible: "Faible", moyen: "Moyen", eleve: "Eleve" };

export default function ModerationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lieux, setLieux] = useState([]);
  const [signalements, setSignalements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "moderateur") {
      navigate("/");
      return;
    }
    Promise.all([
      api.get("/moderation/lieux-en-attente").then(r => setLieux(r.data)),
      api.get("/moderation/signalements").then(r => setSignalements(r.data)),
    ]).finally(() => setLoading(false));
  }, []);

  const statuerLieu = async (id, statut) => {
    await api.patch("/moderation/lieux/" + id, { statut });
    setLieux(lieux.filter(l => l.id !== id));
  };

  const traiterSignalement = async (id) => {
    await api.patch("/moderation/signalements/" + id);
    setSignalements(signalements.filter(s => s.id !== id));
  };

  if (!user || user.role !== "moderateur") return (
    <div style={{ textAlign: "center", padding: 60 }}>
      <p style={{ color: "var(--red)", fontSize: 16 }}>Acces refuse.</p>
    </div>
  );

  if (loading) return <div className="spinner">Chargement...</div>;

  return (
    <div>
      <div className="page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1>Tableau de moderation</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
            Gestion des lieux en attente et des signalements
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ textAlign: "center", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 18px" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--amber)" }}>{lieux.length}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>En attente</div>
          </div>
          <div style={{ textAlign: "center", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 18px" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--red)" }}>{signalements.length}</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>Signalements</div>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: 18, marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--amber)", display: "inline-block" }} />
        Lieux en attente
        <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: 14 }}>({lieux.length})</span>
      </h2>

      {lieux.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "32px 0", marginBottom: 28 }}>
          <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }}>&#10003;</div>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Aucun lieu en attente de validation.</p>
        </div>
      ) : (
        <div style={{ marginBottom: 28 }}>
          {lieux.map(lieu => (
            <div key={lieu.id} className="card" style={{ marginBottom: 12, borderColor: "var(--amber-dim)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{lieu.nom}</h3>
                  <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.5, maxWidth: 560 }}>
                    {lieu.description}
                  </p>
                </div>
                <span className={"badge " + (RISQUE_CLS[lieu.niveau_risque] || "")} style={{ flexShrink: 0, marginLeft: 12 }}>
                  {RISQUE_LBL[lieu.niveau_risque]}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
                  Propose par <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>{lieu.utilisateur?.pseudo}</span>
                  {" "}&mdash; {lieu.date_creation}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => statuerLieu(lieu.id, "valide")}
                    className="btn btn-success btn-sm"
                  >
                    &#10003; Valider
                  </button>
                  <button
                    onClick={() => statuerLieu(lieu.id, "rejete")}
                    className="btn btn-danger btn-sm"
                  >
                    &#10007; Rejeter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="divider" />

      <h2 style={{ fontSize: 18, marginBottom: 14, display: "flex", alignItems: "center", gap: 10, marginTop: 28 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--red)", display: "inline-block" }} />
        Signalements ouverts
        <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: 14 }}>({signalements.length})</span>
      </h2>

      {signalements.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "32px 0" }}>
          <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }}>&#10003;</div>
          <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Aucun signalement ouvert.</p>
        </div>
      ) : (
        <div>
          {signalements.map(s => (
            <div key={s.id} className="card" style={{ marginBottom: 12, borderColor: "#4b1515" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ background: "rgba(239,68,68,0.12)", color: "var(--red)", padding: "2px 8px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>
                      {s.type}
                    </span>
                    {s.lieu && (
                      <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
                        &rarr; <span style={{ color: "var(--text-secondary)" }}>{s.lieu.nom}</span>
                      </span>
                    )}
                  </div>
                  <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.5 }}>{s.description}</p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
                  Signale par <span style={{ color: "var(--text-secondary)" }}>{s.utilisateur?.pseudo}</span>
                  {" "}&mdash; {s.date_creation}
                </span>
                <button
                  onClick={() => traiterSignalement(s.id)}
                  className="btn btn-ghost btn-sm"
                >
                  Marquer traite
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
