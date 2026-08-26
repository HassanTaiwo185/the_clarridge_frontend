import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import { getObservatoryPost } from "../api/observatoryPublic";

const CATEGORY_LABELS = {
  research: "Research",
  essays: "Essays",
  student_voices: "Student Voices",
  interviews: "Interviews",
  publications: "Publications",
};

function ObservatoryPostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getObservatoryPost(slug);
        setPost(res.data);
      } catch {
        setError("This post could not be found.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

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
            {post.cover_image ? (
              <img
                src={post.cover_image}
                alt={post.title}
                style={{ width: "100%", height: "360px", objectFit: "cover", borderRadius: "6px" }}
                className="mb-4"
              />
            ) : (
              <div
                className="bg-light d-flex align-items-center justify-content-center text-muted mb-4"
                style={{ width: "100%", height: "360px", borderRadius: "6px", fontSize: "4rem" }}
              >
                No Image

              </div>
            )}

            <div className="small fw-semibold mb-2" style={{ color: "var(--clarridge-gold)" }}>
              {(CATEGORY_LABELS[post.category] || post.category).toUpperCase()}
            </div>

            <h1 className="text-navy fw-normal mb-3" style={{ fontSize: "2.25rem", lineHeight: 1.25 }}>
              {post.title}
            </h1>

            <p className="text-muted mb-4 pb-4" style={{ borderBottom: "1px solid #e5e7eb" }}>
              {new Date(post.date_posted).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              {" · "}{post.read_time_minutes} min read
            </p>

            {post.summary && (
              <p className="fs-5 text-navy fw-semibold mb-4" style={{ lineHeight: 1.5 }}>
                {post.summary}
              </p>
            )}

            {post.content && (
              <div
                className="text-muted"
                style={{ whiteSpace: "pre-wrap", lineHeight: 1.8, fontSize: "1.05rem" }}
              >
                {post.content}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ObservatoryPostDetail;