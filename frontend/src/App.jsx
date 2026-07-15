import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import LieuxListPage from "./pages/LieuxListPage";
import LieuDetailPage from "./pages/LieuDetailPage";
import ProposerLieuPage from "./pages/ProposerLieuPage";
import ProfilPage from "./pages/ProfilPage";
import ModerationPage from "./pages/ModerationPage";

function Navbar() {
  const { user } = useAuth();
  return (
    <nav style={{
      background: "#0f1623",
      borderBottom: "1px solid #243047",
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      height: 60,
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 32 }}>
        <div style={{
          width: 32, height: 32,
          background: "#f59e0b",
          borderRadius: 6,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 800, fontSize: 14, color: "#0a0e1a"
        }}>U</div>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: "#e8edf5" }}>
          Urb<span style={{ color: "#f59e0b" }}>Net</span>
        </span>
      </Link>

      <div style={{ flex: 1 }} />

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {user ? (
          <>
            <Link to="/" style={{ padding: "6px 12px", color: "#7f93b2", fontSize: 14, fontWeight: 500, borderRadius: 6, transition: "color 0.15s" }}
              onMouseEnter={e => e.target.style.color="#e8edf5"}
              onMouseLeave={e => e.target.style.color="#7f93b2"}
            >Lieux</Link>

            {user.role === "moderateur" && (
              <Link to="/moderation" style={{
                padding: "5px 12px",
                background: "#78450a",
                color: "#f59e0b",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 6,
                border: "1px solid #f59e0b33",
              }}>Modération</Link>
            )}

            <Link to="/profil" style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "5px 12px",
              background: "#161e2e",
              border: "1px solid #243047",
              borderRadius: 8,
              fontSize: 13,
              color: "#e8edf5",
              fontWeight: 500,
            }}>
              <div style={{
                width: 24, height: 24,
                background: "#f59e0b",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, color: "#0a0e1a"
              }}>
                {user.pseudo[0].toUpperCase()}
              </div>
              <span>{user.pseudo}</span>
              <span style={{ color: "#f59e0b", fontSize: 12 }}>{user.niveau_reputation} rep</span>
            </Link>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary" style={{ padding: "7px 16px", borderRadius: 8, fontWeight: 600, background: "#f59e0b", color: "#0a0e1a", fontSize: 14 }}>
            Connexion
          </Link>
        )}
      </div>
    </nav>
  );
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner">Chargement...</div>;
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "32px 24px" }}>
          <Routes>
            <Route path="/" element={<LieuxListPage />} />
            <Route path="/lieux/:id" element={<LieuDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/proposer" element={<PrivateRoute><ProposerLieuPage /></PrivateRoute>} />
            <Route path="/profil" element={<PrivateRoute><ProfilPage /></PrivateRoute>} />
            <Route path="/moderation" element={<PrivateRoute><ModerationPage /></PrivateRoute>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}