import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
L.Marker.prototype.options.icon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow });

const RISQUE_CLS = { faible: "badge-faible", moyen: "badge-moyen", eleve: "badge-eleve" };
const RISQUE_LBL = { faible: "Faible", moyen: "Moyen", eleve: "Eleve" };

function Stars({ note }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= note ? "#f59e0b" : "#243047", fontSize: 16 }}>&#9733;</span>
      ))}
    </span>
  );
}

export default function LieuDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [lieu, setLieu] = useState(null);
  const [carnets, setCarnets] = useState([]);
  const [newCarnet, setNewCarnet] = useState({ date_visite: "", compte_rendu: "", duree_visite: "" });
  const [newComment, setNewComment] = useState({ contenu: "", note: 5 });
  const [error, setError] = useState(null);
  const [carnetOk, setCarnetOk] = useState(false);
  const [showSignal, setShowSignal] = useState(false);
  const [signal, setSignal] = useState({ type: "danger", description: "" });

  const reload = () => {
    api.get("/lieux/" + id).then(r => setLieu(r.data));
    api.get("/lieux/" + id + "/carnets").then(r => setCarnets(r.data));
  };
  useEffect(() => { reload(); }, [id]);

  const ajouterCarnet = async (e) => {
    e.preventDefault();
    try {
      const r = await api.post("/lieux/" + id + "/carnets", newCarnet);
      setCarnets([r.data, ...carnets]);
      setNewCarnet({ date_visite: "", compte_rendu: "", duree_visite: "" });
      setCarnetOk(true);
      setTimeout(() => setCarnetOk(false), 3000);
    } catch (err) { setError(err.response?.data?.message || "Erreur"); }
  };

  const ajouterCommentaire = async (e) => {
    e.preventDefault();
    try {
      await api.post("/lieux/" + id + "/commentaires", newComment);
      reload();
      setNewComment({ contenu: "", note: 5 });
    } catch (err) { setError(err.response?.data?.message || "Erreur"); }
  };

  const signaler = async (e) => {
    e.preventDefault();
    try {
      await api.post("/lieux/" + id + "/signalements", signal);
      setShowSignal(false);
      setSignal({ type: "danger", description: "" });
    } catch (err) { setError(err.response?.data?.message || "Erreur"); }
  };

  if (!lieu) return <div className="spinner">Chargement...</div>;

  return (
    <div>
      <Link to="/" style={{ color: "#7f93b2", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 20 }}>
        &#8592; Retour aux lieux
      </Link>

      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
          <h1 style={{ fontSize: 30, flex: 1 }}>{lieu.nom}</h1>
           <h1 style={{ fontSize: 30, flex: 1 }}>{lieu.nom}</h1>
           {user && (
            <button onClick={() => setShowSignal(!showSignal)} className="btn btn-ghost btn-sm">
              Signaler ce lieu
              </button>
            )}
            {showSignal && (
    <form onSubmit={signaler} className="card" style={{ marginTop: 10 }}>
      <h3>Signaler ce lieu</h3>
      <div className="field">
        <label>Type</label>
        <select value={signal.type} onChange={e => setSignal({ ...signal, type: e.target.value })}>
          <option value="danger">Danger</option>
          <option value="lieu_detruit">Lieu detruit</option>
          <option value="lieu_squatte">Lieu squatte</option>
        </select>
      </div>
      <div className="field">
        <label>Description</label>
        <textarea value={signal.description} onChange={e => setSignal({ ...signal, description: e.target.value })}
  required rows={3} />
      </div>
      <button type="submit" className="btn btn-danger btn-sm">Envoyer le signalement</button>
    </form>
  )}
          <div style={{ display: "flex", gap: 8 }}>
            <span className={"badge " + (RISQUE_CLS[lieu.niveau_risque] || "")}>{RISQUE_LBL[lieu.niveau_risque]}</span>
            <span className={"badge badge-" + lieu.statut}>
              {lieu.statut === "en_attente" ? "En attente" : lieu.statut === "valide" ? "Valide" : "Rejete"}
            </span>
          </div>
        </div>
        <p style={{ color: "#7f93b2", fontSize: 15, lineHeight: 1.6, maxWidth: 700 }}>{lieu.description}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, marginBottom: 28 }}>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {lieu.coords_floutees && (
            <div style={{ background: "#3b2008", borderBottom: "1px solid #78450a", padding: "8px 16px", fontSize: 13, color: "#f59e0b" }}>
              Coordonnees approximatives &#8212; atteins 10 rep pour les debloquer
            </div>
          )}
          <div style={{ height: 300 }}>
            <MapContainer center={[lieu.latitude, lieu.longitude]} zoom={lieu.coords_floutees ? 11 : 15} style={{ height: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="OpenStreetMap" />
              <Marker position={[lieu.latitude, lieu.longitude]}><Popup>{lieu.nom}</Popup></Marker>
            </MapContainer>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="card" style={{ padding: "14px 16px" }}>
            <p style={{ fontSize: 11, color: "#4a607d", marginBottom: 4 }}>PROPOSE PAR</p>
            <p style={{ fontWeight: 600 }}>{lieu.utilisateur?.pseudo}</p>
          </div>
          <div className="card" style={{ padding: "14px 16px" }}>
            <p style={{ fontSize: 11, color: "#4a607d", marginBottom: 4 }}>DATE DE CREATION</p>
            <p style={{ fontWeight: 600 }}>{lieu.date_creation}</p>
          </div>
          <div className="card" style={{ padding: "14px 16px" }}>
            <p style={{ fontSize: 11, color: "#4a607d", marginBottom: 4 }}>VISITES</p>
            <p style={{ fontWeight: 600 }}>{carnets.length} carnet(s)</p>
          </div>
          <div className="card" style={{ padding: "14px 16px" }}>
            <p style={{ fontSize: 11, color: "#4a607d", marginBottom: 6 }}>NOTE MOYENNE</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Stars note={Math.round(lieu.note_moyenne || 0)} />
              <span style={{ color: "#7f93b2", fontSize: 13 }}>({lieu.commentaires?.length || 0})</span>
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ marginBottom: 14, fontSize: 20 }}>
        Commentaires <span style={{ color: "#4a607d", fontWeight: 400, fontSize: 15 }}>({lieu.commentaires?.length || 0})</span>
      </h2>
      {(lieu.commentaires?.length === 0) && <p style={{ color: "#4a607d", marginBottom: 16 }}>Aucun commentaire encore.</p>}
      {lieu.commentaires?.map(c => (
        <div key={c.id} className="card" style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontWeight: 600 }}>{c.utilisateur?.pseudo}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Stars note={c.note} />
              <span style={{ color: "#4a607d", fontSize: 12 }}>{c.date_creation}</span>
            </div>
          </div>
          <p style={{ color: "#7f93b2", fontSize: 14 }}>{c.contenu}</p>
        </div>
      ))}

      {user && (
        <form onSubmit={ajouterCommentaire} className="card" style={{ marginBottom: 28, marginTop: 12 }}>
          <h3 style={{ marginBottom: 12, fontSize: 16 }}>Laisser un commentaire</h3>
          {error && <div className="error-msg">{error}</div>}
          <div className="field">
            <textarea value={newComment.contenu} onChange={e => setNewComment({ ...newComment, contenu: e.target.value })}
              required placeholder="Ton avis..." rows={3} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex" }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => setNewComment({ ...newComment, note: n })}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 26, color: n <= newComment.note ? "#f59e0b" : "#243047", padding: "0 2px" }}>&#9733;</button>
              ))}
            </div>
            <button type="submit" className="btn btn-primary btn-sm">Envoyer</button>
          </div>
        </form>
      )}

      <h2 style={{ marginBottom: 14, fontSize: 20 }}>
        Carnets <span style={{ color: "#4a607d", fontWeight: 400, fontSize: 15 }}>({carnets.length})</span>
      </h2>
      {carnets.length === 0 && <p style={{ color: "#4a607d", marginBottom: 16 }}>Aucun carnet encore.</p>}
      {carnets.map(c => (
        <div key={c.id} className="card" style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontWeight: 600 }}>{c.utilisateur?.pseudo}</span>
            <span style={{ color: "#4a607d", fontSize: 13 }}>{c.date_visite} &#8212; {c.duree_visite} min</span>
          </div>
          <p style={{ color: "#7f93b2", fontSize: 14 }}>{c.compte_rendu}</p>
        </div>
      ))}

      {user && (
        <form onSubmit={ajouterCarnet} className="card" style={{ marginTop: 12, borderColor: "#1a5c38" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ fontSize: 16 }}>Ajouter mon carnet</h3>
            <span style={{ background: "#0f3320", color: "#22c55e", padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600 }}>+5 rep</span>
          </div>
          {carnetOk && (
            <div style={{ background: "#0f3320", border: "1px solid #1a5c38", color: "#22c55e", padding: "10px 14px", borderRadius: 8, marginBottom: 12, fontSize: 14 }}>
              Carnet ajoute ! Tu as gagne 5 points de reputation.
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field"><label>Date de visite</label>
              <input type="date" value={newCarnet.date_visite} onChange={e => setNewCarnet({ ...newCarnet, date_visite: e.target.value })} required />
            </div>
            <div className="field"><label>Duree (min)</label>
              <input type="number" placeholder="90" min="1" value={newCarnet.duree_visite} onChange={e => setNewCarnet({ ...newCarnet, duree_visite: e.target.value })} required />
            </div>
          </div>
          <div className="field"><label>Compte-rendu</label>
            <textarea value={newCarnet.compte_rendu} onChange={e => setNewCarnet({ ...newCarnet, compte_rendu: e.target.value })} required placeholder="Raconte ta visite..." rows={3} />
          </div>
          <button type="submit" className="btn btn-success">Ajouter le carnet</button>
        </form>
      )}
    </div>
  );
}
