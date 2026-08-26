import { useEffect, useState } from "react";
import PublicNavbar from "../components/PublicNavbar";
import api from "../api/axios";

const OPPORTUNITY_FILTERS = [
  { value: "all", label: "All" },
  { value: "scholarship", label: "Scholarships" },
  { value: "internship", label: "Internships" },
  { value: "fellowship", label: "Fellowships" },
  { value: "competition", label: "Competitions" },
];

function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/opportunities/");
        setOpportunities(res.data);
      } catch {
        setError("Unable to load opportunities right now.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredOpportunities =
    filter === "all" ? opportunities : opportunities.filter((o) => o.category === filter);

  return (
    <div>
      <PublicNavbar />

      <section className="py-5">
        <div className="container" style={{ maxWidth: "900px" }}>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span style={{ width: "30px", height: "1px", backgroundColor: "var(--clarridge-gold)" }} />
            <span className="text-uppercase fw-semibold" style={{ color: "var(--clarridge-gold)", fontSize: "0.8rem", letterSpacing: "1px" }}>
              Opportunities Bulletin
            </span>
          </div>

          <h1 className="text-navy fw-normal mb-3" style={{ fontSize: "2.25rem", lineHeight: 1.25 }}>
            Discover scholarships, internships, fellowships and more.
          </h1>

          <p className="text-muted mb-4">
            Updated every two weeks by our Research &amp; Publications team.
          </p>

          <div className="d-flex flex-wrap gap-2 mb-4">
            {OPPORTUNITY_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                className="btn btn-sm rounded-pill fw-semibold px-3 text-uppercase"
                style={
                  filter === f.value
                    ? { backgroundColor: "var(--clarridge-navy)", color: "#fff", border: "1px solid var(--clarridge-navy)" }
                    : { backgroundColor: "#fff", color: "var(--clarridge-navy)", border: "1px solid #ddd" }
                }
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-muted">Loading opportunities...</p>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : filteredOpportunities.length === 0 ? (
            <p className="text-muted">No opportunities in this category yet.</p>
          ) : (
            <div>
              {filteredOpportunities.map((o, idx) => (
                <div
                  key={o.id}
                  className="d-flex align-items-center gap-3 py-4"
                  style={{
                    borderBottom: idx < filteredOpportunities.length - 1 ? "1px solid #e5e7eb" : "none",
                  }}
                >
                  <div className="bg-light flex-shrink-0" style={{ width: "72px", height: "56px", borderRadius: "4px" }} />

                  <div className="flex-grow-1">
                    <div className="small fw-semibold mb-1" style={{ color: "var(--clarridge-gold)" }}>
                      {o.category.toUpperCase()}
                    </div>
                    <h6 className="text-navy fw-bold mb-0">{o.title}</h6>
                  </div>

                  <div className="text-muted small text-end flex-shrink-0 d-none d-md-block" style={{ minWidth: "160px" }}>
                    Deadline: {new Date(o.deadline).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
                  </div>

                  <button
                    type="button"
                    className="btn btn-sm fw-semibold flex-shrink-0"
                    style={{ color: "var(--clarridge-gold)", borderColor: "var(--clarridge-gold)", backgroundColor: "#fdf9f0" }}
                    onClick={() => setSelectedOpportunity(o)}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedOpportunity && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "rgba(6, 21, 48, 0.6)", zIndex: 1070 }}
          onClick={() => setSelectedOpportunity(null)}
        >
          <div
            className="bg-white rounded p-4"
            style={{ maxWidth: "440px", width: "90%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="small fw-semibold" style={{ color: "var(--clarridge-gold)" }}>
                {selectedOpportunity.category.toUpperCase()}
              </div>
              <button type="button" className="btn-close" onClick={() => setSelectedOpportunity(null)} />
            </div>
            <h4 className="text-navy fw-bold mb-2">{selectedOpportunity.title}</h4>
            <p className="small text-muted mb-3">
              Deadline: {new Date(selectedOpportunity.deadline).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}
            </p>
            {selectedOpportunity.description && (
              <p className="text-muted mb-3">{selectedOpportunity.description}</p>
            )}
            {selectedOpportunity.details_url && (
              <a href={selectedOpportunity.details_url} target="_blank" rel="noopener noreferrer" className="btn w-100 fw-bold py-2" style={{ backgroundColor: "var(--clarridge-gold)", borderColor: "var(--clarridge-gold)", color: "#fff" }}>
                Visit External Link
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Opportunities;