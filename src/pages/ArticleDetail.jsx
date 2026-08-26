import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import { getPublicArticle } from "../api/articlesPublic";

function ArticleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getPublicArticle(slug);
        setArticle(res.data);
      } catch {
        setError("This article could not be found.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  const handleOpenPdf = () => {
    window.open(article.pdf_file, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <PublicNavbar />

      <div className="container py-5" style={{ maxWidth: "720px" }}>
        <button
          type="button"
          className="btn btn-outline-primary btn-sm mb-4"
          style={{ color: "var(--clarridge-navy)", borderColor: "var(--clarridge-navy)" }}
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
<button
  type="button"
  className="btn fw-bold mb-4 ms-2"
  style={{ backgroundColor: "var(--clarridge-gold)", borderColor: "var(--clarridge-gold)", color: "#fff" }}
  onClick={handleOpenPdf}
>
  Open PDF in Browser
</button>

            <h1 className="text-navy fw-normal mb-3" style={{ fontSize: "1.85rem", lineHeight: 1.35 }}>
              {article.title}
            </h1>

            {article.page_count && (
              <p className="text-muted mb-1">{article.page_count} Pages</p>
            )}

            <p className="text-muted mb-1">
              Posted: {new Date(article.date_posted).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}
            </p>

            <p className="fw-semibold text-navy mb-1">{article.author_name}</p>

            {article.institution && (
              <p className="text-muted mb-1">{article.institution}</p>
            )}

            <p className="text-muted mb-4 pb-4" style={{ borderBottom: "1px solid #e5e7eb" }}>
              Date Written: {new Date(article.date_written).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>

            {article.summary && (
              <div>
                <h6 className="text-uppercase text-muted small fw-semibold mb-2" style={{ letterSpacing: "1px" }}>
                  Abstract
                </h6>
                <p className="text-muted" style={{ lineHeight: 1.8, fontSize: "1.05rem" }}>
                  {article.summary}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ArticleDetail;