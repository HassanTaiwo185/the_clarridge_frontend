import { useEffect, useState } from "react";
import PublicNavbar from "../components/PublicNavbar";
import { getPublicProgrammes } from "../api/public";

function statusBadgeStyle(status) {
  if (status === "open") return { backgroundColor: "#e8f4ea", color: "#198754" };
  if (status === "upcoming") return { backgroundColor: "#fdf3e3", color: "#97742f" };
  return { backgroundColor: "#eef1f5", color: "#6c757d" };
}

function Programmes() {
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPublicProgrammes();
        setProgrammes(res.data);
      } catch {
        setError("Unable to load programmes right now.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <PublicNavbar />

      <section className="py-5" style={{ backgroundColor: "#f8f9fb" }}>
        <div className="container">
          <div className="text-uppercase small fw-semibold mb-2" style={{ color: "var(--clarridge-gold)", letterSpacing: "1px" }}>
            Our Work
          </div>
          <h1 className="text-navy fw-normal mb-4" style={{ fontSize: "2.25rem" }}>
            Programmes
          </h1>

          {loading ? (
            <p className="text-muted">Loading programmes...</p>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : programmes.length === 0 ? (
            <p className="text-muted">No programmes available right now.</p>
          ) : (
            <div className="row g-4">
              {programmes.map((p) => (
                <div className="col-12 col-md-6 col-lg-4" key={p.id}>
                  <div className="bg-white rounded overflow-hidden h-100 shadow-sm">
                    {p.cover_image ? (
                      <img
                        src={p.cover_image}
                        alt={p.name}
                        style={{ width: "100%", height: "180px", objectFit: "cover" }}
                      />
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center bg-light text-muted"
                        style={{ height: "180px" }}
                      >
                        No image
                      </div>
                    )}
                    <div className="p-4">
                      <span
                        className="badge rounded-pill mb-2 text-capitalize"
                        style={{ ...statusBadgeStyle(p.status), fontWeight: 600, fontSize: "0.75rem" }}
                      >
                        {p.status}
                      </span>
                      <h5 className="text-navy fw-bold mb-2">{p.name}</h5>
                      {p.description && (
                        <p className="text-muted small mb-3">{p.description}</p>
                      )}
                      {(p.start_date || p.end_date) && (
                        <p className="text-muted small mb-0">
                          {p.start_date || "—"} → {p.end_date || "—"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Programmes;