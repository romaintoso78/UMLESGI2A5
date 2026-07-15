
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ProposerLieuPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: "", description: "", adresse: "",
    latitude: "", longitude: "", niveau_risque: "faible",
  });
  const [photo, setPhoto] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [geocoding, setGeocoding] = useState(false);

  const geocoderAdresse = async () => {
    if (!form.adresse) return;
    setGeocoding(true);
    try {
      const r = await api.post("/geocode", { adresse: form.adresse });
      setSuggestions(r.data);
      if (r.data.length === 0) setError("Aucun resultat pour cette adresse.");
    } catch {
      setError("Impossible de geocoder cette adresse.");
    } finally {
      setGeocoding(false);
    }
  };

  const choisirSuggestion = (s) => {
    setForm({ ...form, latitude: parseFloat(s.lat).toFixed(6), longitude: parseFloat(s.lon).toFixed(6) });
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = new FormData();
      data.append("nom", form.nom);
      data.append("description", form.description);
      data.append("latitude", form.latitude);
      data.append("longitude", form.longitude);
      data.append("niveau_risque", form.niveau_risque);
      if (photo) data.append("photo", photo);
      await api.post("/lieux", data, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || JSON.stringify(err.response?.data?.errors) || "Erreur";
      setError(msg);
    }
  };

  if (success) return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>&#10003;</div>
      <h2 style={{ color: "var(--green)", marginBottom: 8 }}>Lieu soumis a validation !</h2>
      <p style={{ color: "var(--text-secondary)" }}>Redirection en cours...</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div className="page-header">
        <h1>Proposer un lieu</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
          Ton lieu sera examine par un moderateur avant publication.
        </p>
      </div>

      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 16, textTransform: "uppercase", letterSpacing: 1, fontSize: 12 }}>
            Informations
          </h3>

          <div className="field">
            <label>Nom du lieu <span style={{ color: "var(--amber)" }}>*</span></label>
            <input
              value={form.nom}
              onChange={e => setForm({ ...form, nom: e.target.value })}
              required
              placeholder="Ex: Usine abandonnee de Saint-Denis"
            />
          </div>

          <div className="field">
            <label>Description <span style={{ color: "var(--amber)" }}>*</span></label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              required
              rows={4}
              placeholder="Histoire du lieu, acces, points d'interet..."
            />
          </div>

          <div className="field">
            <label>Niveau de risque</label>
            <select
              value={form.niveau_risque}
              onChange={e => setForm({ ...form, niveau_risque: e.target.value })}
            >
              <option value="faible">Faible — Acces facile, peu de dangers</option>
              <option value="moyen">Moyen — Attention requise</option>
              <option value="eleve">Eleve — Danger potentiel</option>
            </select>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>
            Localisation
          </h3>

          <div className="field">
            <label>Adresse (pour geocoder les coordonnees)</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={form.adresse}
                onChange={e => setForm({ ...form, adresse: e.target.value })}
                placeholder="Ex: Usine Ford, Poissy, France"
                style={{ flex: 1 }}
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), geocoderAdresse())}
              />
              <button
                type="button"
                onClick={geocoderAdresse}
                className="btn btn-primary btn-sm"
                disabled={geocoding}
                style={{ whiteSpace: "nowrap" }}
              >
                {geocoding ? "..." : "Geocoder"}
              </button>
            </div>
          </div>

          {suggestions.length > 0 && (
            <div style={{ border: "1px solid var(--border-light)", borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => choisirSuggestion(s)}
                  style={{
                    padding: "10px 14px",
                    cursor: "pointer",
                    borderBottom: i < suggestions.length - 1 ? "1px solid var(--border)" : "none",
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    background: "var(--bg-elevated)",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card)"}
                  onMouseLeave={e => e.currentTarget.style.background = "var(--bg-elevated)"}
                >
                  <span style={{ color: "var(--amber)", marginRight: 8 }}>&#9679;</span>
                  {s.display_name}
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Latitude <span style={{ color: "var(--amber)" }}>*</span></label>
              <input
                value={form.latitude}
                onChange={e => setForm({ ...form, latitude: e.target.value })}
                required
                placeholder="48.856600"
              />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Longitude <span style={{ color: "var(--amber)" }}>*</span></label>
              <input
                value={form.longitude}
                onChange={e => setForm({ ...form, longitude: e.target.value })}
                required
                placeholder="2.352200"
              />
            </div>
          </div>

          {form.latitude && form.longitude && (
            <div style={{ marginTop: 10, padding: "8px 12px", background: "var(--bg-base)", borderRadius: 6, fontSize: 12, color: "var(--text-muted)" }}>
              Coordonnees : {form.latitude}, {form.longitude}
            </div>
          )}
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>
            Photo (optionnelle)
          </h3>
          <div className="field" style={{ marginBottom: 0 }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 16px",
                border: "2px dashed var(--border-light)",
                borderRadius: 8,
                cursor: "pointer",
                background: "var(--bg-base)",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--amber)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-light)"}
            >
              <span style={{ fontSize: 24 }}>&#128247;</span>
              <div>
                <div style={{ color: "var(--text-primary)", fontSize: 14 }}>
                  {photo ? photo.name : "Choisir une photo"}
                </div>
                <div style={{ color: "var(--text-muted)", fontSize: 12 }}>
                  JPG, PNG, WEBP — max 5 Mo
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={e => setPhoto(e.target.files[0])}
                style={{ display: "none" }}
              />
            </label>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            Soumettre pour validation
          </button>
          <button type="button" onClick={() => navigate("/")} className="btn btn-ghost">
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
