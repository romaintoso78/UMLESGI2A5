import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ pseudo: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") await login(form.email, form.password);
      else await register(form.pseudo, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Identifiants incorrects.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56,
            background: "#f59e0b",
            borderRadius: 12,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, fontWeight: 800, color: "#0a0e1a",
            margin: "0 auto 16px",
            fontFamily: "'Space Grotesk', sans-serif"
          }}>U</div>
          <h1 style={{ fontSize: 26, color: "#e8edf5", marginBottom: 6 }}>
            {mode === "login" ? "Bienvenue" : "Rejoindre UrbNet"}
          </h1>
          <p style={{ color: "#7f93b2", fontSize: 14 }}>
            {mode === "login" ? "Connecte-toi à ta communauté urbex" : "Crée ton compte explorateur"}
          </p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="field">
                <label>Pseudo</label>
                <input
                  value={form.pseudo}
                  onChange={e => setForm({ ...form, pseudo: e.target.value })}
                  placeholder="ton_pseudo"
                  required
                />
              </div>
            )}

            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="toi@exemple.fr"
                required
              />
            </div>

            <div className="field" style={{ marginBottom: 20 }}>
              <label>Mot de passe</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center", height: 42, fontSize: 15 }}
            >
              {loading ? "Chargement..." : (mode === "login" ? "Se connecter" : "Créer mon compte")}
            </button>
          </form>

          <hr className="divider" />

          <p style={{ textAlign: "center", color: "#7f93b2", fontSize: 14 }}>
            {mode === "login" ? "Pas encore de compte ? " : "Déjà un compte ? "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              style={{ background: "none", border: "none", color: "#f59e0b", cursor: "pointer", fontWeight: 600, fontSize: 14 }}
            >
              {mode === "login" ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}