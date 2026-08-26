import { useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div>
      <PublicNavbar />

      <div className="container py-5 text-center" style={{ maxWidth: "500px", paddingTop: "6rem", paddingBottom: "6rem" }}>
        <h1 className="fw-bold text-navy mb-3" style={{ fontSize: "5rem" }}>
          404
        </h1>
        <h4 className="text-navy fw-normal mb-3">Page not found.</h4>
        <p className="text-muted mb-4">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          type="button"
          className="btn fw-bold px-4 py-2"
          style={{ backgroundColor: "var(--clarridge-gold)", borderColor: "var(--clarridge-gold)", color: "#fff" }}
          onClick={() => navigate("/")}
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;