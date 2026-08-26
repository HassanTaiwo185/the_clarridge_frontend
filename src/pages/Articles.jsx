import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import { getPublicArticles } from "../api/articlesPublic";

function Articles() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPublicArticles();
        setArticles(res.data);
      } catch {
        setError("Unable to load articles right now.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <PublicNavbar />

      <div className="container py-5" style={{ maxWidth: "800px" }}>
        <div className="d-flex align-items-center gap-2 mb-2">
          <span style={{ width: "30px", height: "1px", backgroundColor: "var(--clarridge-gold)" }} />
          <span className="text-uppercase fw-semibold" style={{ color: "var(--clarridge-gold)", fontSize: "0.8rem", letterSpacing: "1px" }}>
            Articles
          </span>
        </div>
        <h1 className="text-navy fw-normal mb-4" style={{ fontSize: "2rem" }}>
          Published Research
        </h1>

        {loading ? (
          <p className="text-muted">Loading articles...</p>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : articles.length === 0 ? (
          <p className="text-muted">No articles published yet.</p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {articles.map((a) => (
              <div
                key={a.id}
                className="py-4 px-3"
                role="button"
                onClick={() => navigate(`/articles/${a.slug}`)}
                style={{
                  cursor: "pointer",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
                  backgroundColor: "#fff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(6px)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(10, 31, 68, 0.12)";
                  e.currentTarget.style.borderColor = "var(--clarridge-gold)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#e5e7eb";
                }}
              >
                <h5 className="text-navy fw-bold mb-2">{a.title}</h5>

                {a.page_count && (
                  <p className="small text-muted mb-1">{a.page_count} Pages</p>
                )}

                <p className="small text-muted mb-1">
                  Posted: {new Date(a.date_posted).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
                </p>

                <p className="small fw-semibold mb-1">{a.author_name}</p>

                {a.institution && (
                  <p className="small text-muted mb-1">{a.institution}</p>
                )}

                <p className="small text-muted mb-2">
                  Date Written: {new Date(a.date_written).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>

                <p className="text-muted mb-0">{a.summary}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Articles;