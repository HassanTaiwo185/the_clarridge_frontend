import { useEffect, useState } from "react";
import { getArticles, createArticle, updateArticle, deleteArticle } from "../../api/articles";
import { getCurrentUserId, isCurrentUserSuperuser } from "../../utils/jwt";
import ConfirmDialog from "../../components/ConfirmDialog";

function ArticlesManage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUserId = getCurrentUserId();
  const isSuperuser = isCurrentUserSuperuser();

  const [editingSlug, setEditingSlug] = useState(null);
  const [form, setForm] = useState({
    title: "",
    author_name: "",
    institution: "",
    page_count: "",
    summary: "",
    date_written: "",
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [confirmSave, setConfirmSave] = useState(false);
  const [confirmDeleteSlug, setConfirmDeleteSlug] = useState(null);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const res = await getArticles();
      setArticles(res.data);
    } catch {
      setError("Unable to load articles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const canManage = (article) => article.uploaded_by === currentUserId || isSuperuser;

  const resetForm = () => {
    setForm({
      title: "",
      author_name: "",
      institution: "",
      page_count: "",
      summary: "",
      date_written: "",
    });
    setPdfFile(null);
    setFormError("");
  };

  const openCreate = () => {
    resetForm();
    setEditingSlug("new");
  };

  const openEdit = (article) => {
    setForm({
      title: article.title,
      author_name: article.author_name,
      institution: article.institution || "",
      page_count: article.page_count || "",
      summary: article.summary,
      date_written: article.date_written,
    });
    setPdfFile(null);
    setFormError("");
    setEditingSlug(article.slug);
  };

  const closeForm = () => {
    setEditingSlug(null);
    resetForm();
  };

  const handleSaveClick = () => {
    if (!form.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!form.author_name.trim()) {
      setFormError("Author name is required.");
      return;
    }
    if (!form.summary.trim()) {
      setFormError("Summary is required.");
      return;
    }
    if (!form.date_written) {
      setFormError("Date written is required.");
      return;
    }
    if (editingSlug === "new" && !pdfFile) {
      setFormError("A PDF file is required for a new article.");
      return;
    }
    setFormError("");
    setConfirmSave(true);
  };

  const performSave = async () => {
    setConfirmSave(false);
    setSaving(true);
    try {
      const data = new FormData();
      data.append("title", form.title);
      data.append("author_name", form.author_name);
      data.append("institution", form.institution);
      data.append("page_count", form.page_count);
      data.append("summary", form.summary);
      data.append("date_written", form.date_written);
      if (pdfFile) data.append("pdf_file", pdfFile);

      if (editingSlug === "new") {
        await createArticle(data);
      } else {
        await updateArticle(editingSlug, data);
      }
      await loadArticles();
      closeForm();
    } catch (err) {
      const backendData = err.response?.data;
      if (backendData) {
        const firstError = Object.values(backendData)[0];
        setFormError(Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else {
        setFormError("Unable to save. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const performDelete = async () => {
    const slug = confirmDeleteSlug;
    setConfirmDeleteSlug(null);
    try {
      await deleteArticle(slug);
      await loadArticles();
    } catch {
      setError("Unable to delete article.");
    }
  };

  return (
    <div>
      <div className="text-uppercase text-muted small mb-1">Content</div>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-2">
        <h3 className="text-navy fw-bold mb-0">Manage Articles</h3>
        {editingSlug === null && (
          <button type="button" className="btn btn-navy" onClick={openCreate}>
            + Upload New Article
          </button>
        )}
      </div>

      {!loading && (
        <p className="text-muted mb-4">
          {articles.length} article{articles.length !== 1 ? "s" : ""}
        </p>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {editingSlug && (
        <div className="glass-card bg-white p-4 mb-4">
          <h6 className="fw-bold mb-3">
            {editingSlug === "new" ? "Upload New Article" : "Edit Article"}
          </h6>

          {formError && <div className="alert alert-danger py-2 small">{formError}</div>}

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="fw-semibold text-navy mb-2 d-block">Title</label>
              <input
                type="text"
                className="form-control"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                disabled={saving}
              />
            </div>
            <div className="col-md-6">
              <label className="fw-semibold text-navy mb-2 d-block">Author Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Actual writer of the article"
                value={form.author_name}
                onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                disabled={saving}
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="fw-semibold text-navy mb-2 d-block">
                Institution <span className="text-muted fw-normal">(optional)</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Elizade University Faculty of Law"
                value={form.institution}
                onChange={(e) => setForm({ ...form, institution: e.target.value })}
                disabled={saving}
              />
            </div>
            <div className="col-md-6">
              <label className="fw-semibold text-navy mb-2 d-block">
                Page Count <span className="text-muted fw-normal">(optional)</span>
              </label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={form.page_count}
                onChange={(e) => setForm({ ...form, page_count: e.target.value })}
                disabled={saving}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="fw-semibold text-navy mb-2 d-block">Summary</label>
            <textarea
              className="form-control"
              rows={2}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              disabled={saving}
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="fw-semibold text-navy mb-2 d-block">Date Written</label>
              <input
                type="date"
                className="form-control"
                value={form.date_written}
                onChange={(e) => setForm({ ...form, date_written: e.target.value })}
                disabled={saving}
              />
            </div>
            <div className="col-md-6">
              <label className="fw-semibold text-navy mb-2 d-block">
                PDF File {editingSlug !== "new" && (
                  <span className="text-muted fw-normal">(leave blank to keep current)</span>
                )}
              </label>
              <input
                type="file"
                accept="application/pdf"
                className="form-control"
                onChange={(e) => setPdfFile(e.target.files[0])}
                disabled={saving}
              />
            </div>
          </div>

          <div className="d-flex gap-2">
            <button type="button" className="btn btn-navy" onClick={handleSaveClick} disabled={saving}>
              {saving ? "Saving..." : "Save Article"}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={closeForm} disabled={saving}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted">Loading articles...</p>
      ) : articles.length === 0 ? (
        <div className="glass-card bg-white p-4 text-center text-muted">
          No articles yet. Click "+ Upload New Article" to add one.
        </div>
      ) : (
        <div className="row g-3">
          {articles.map((a) => (
            <div className="col-12 col-md-6 col-lg-4" key={a.id}>
              <div className="glass-card bg-white p-4 h-100 d-flex flex-column">
                <h6 className="fw-bold text-navy mb-2">{a.title}</h6>

                <div className="small text-muted mb-2">
                  <div>By {a.author_name}</div>
                  {a.institution && <div>{a.institution}</div>}
                  <div>Uploaded by {a.uploaded_by_username || "—"}</div>
                </div>

                <p className="small text-muted flex-grow-1" style={{ whiteSpace: "pre-wrap" }}>
                  {a.summary}
                </p>

                <div className="small text-muted mb-3">
                  {a.page_count && <div>{a.page_count} Pages</div>}
                  <div>Written: {a.date_written}</div>
                  <div>Posted: {new Date(a.date_posted).toLocaleDateString()}</div>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-navy flex-grow-1"
                    onClick={() => window.open(a.pdf_file, "_blank", "noopener,noreferrer")}
                  >
                    View PDF
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary flex-grow-1"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = a.pdf_file;
                      link.download = a.title || "article.pdf";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    Download
                  </button>
                </div>

                {canManage(a) && (
                  <div className="d-flex gap-2 mt-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary flex-grow-1"
                      onClick={() => openEdit(a)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger flex-grow-1"
                      onClick={() => setConfirmDeleteSlug(a.slug)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        show={confirmSave}
        title="Save this article?"
        message="This will publish or update the article visible to the public."
        confirmLabel="Yes, Save"
        onConfirm={performSave}
        onCancel={() => setConfirmSave(false)}
      />

      <ConfirmDialog
        show={Boolean(confirmDeleteSlug)}
        title="Delete this article?"
        message="This action cannot be undone. The article will be permanently removed."
        confirmLabel="Yes, Delete"
        variant="danger"
        onConfirm={performDelete}
        onCancel={() => setConfirmDeleteSlug(null)}
      />
    </div>
  );
}

export default ArticlesManage;