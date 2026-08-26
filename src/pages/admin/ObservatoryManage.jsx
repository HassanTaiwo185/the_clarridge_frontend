import { useEffect, useState } from "react";
import {
  getObservatoryPosts,
  createObservatoryPost,
  updateObservatoryPost,
  deleteObservatoryPost,
} from "../../api/observatory";
import { getCurrentUserId, isCurrentUserSuperuser } from "../../utils/jwt";
import ConfirmDialog from "../../components/ConfirmDialog";

const CATEGORY_OPTIONS = [
  { value: "research", label: "Research" },
  { value: "essays", label: "Essays" },
  { value: "student_voices", label: "Student Voices" },
  { value: "interviews", label: "Interviews" },
  { value: "publications", label: "Publications" },
];

function ObservatoryManage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUserId = getCurrentUserId();
  const isSuperuser = isCurrentUserSuperuser();

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const [editingSlug, setEditingSlug] = useState(null);
  const [form, setForm] = useState({
    title: "",
    category: "research",
    summary: "",
    content: "",
    read_time_minutes: 5,
    is_featured: false,
  });
  const [coverImage, setCoverImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [confirmSave, setConfirmSave] = useState(false);
  const [confirmDeleteSlug, setConfirmDeleteSlug] = useState(null);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await getObservatoryPosts();
      setPosts(res.data);
    } catch {
      setError("Unable to load Observatory posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const canManage = (post) => post.posted_by === currentUserId || isSuperuser;

  const resetForm = () => {
    setForm({
      title: "",
      category: "research",
      summary: "",
      content: "",
      read_time_minutes: 5,
      is_featured: false,
    });
    setCoverImage(null);
    setFormError("");
  };

  const openCreate = () => {
    resetForm();
    setEditingSlug("new");
  };

  const openEdit = (post) => {
    setForm({
      title: post.title,
      category: post.category,
      summary: post.summary || "",
      content: post.content || "",
      read_time_minutes: post.read_time_minutes,
      is_featured: post.is_featured,
    });
    setCoverImage(null);
    setFormError("");
    setEditingSlug(post.slug);
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
    if (!form.summary.trim()) {
      setFormError("Summary is required.");
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
      data.append("category", form.category);
      data.append("summary", form.summary);
      data.append("content", form.content);
      data.append("read_time_minutes", form.read_time_minutes);
      data.append("is_featured", form.is_featured);
      if (coverImage) data.append("cover_image", coverImage);

      if (editingSlug === "new") {
        await createObservatoryPost(data);
      } else {
        await updateObservatoryPost(editingSlug, data);
      }
      await loadPosts();
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
      await deleteObservatoryPost(slug);
      await loadPosts();
    } catch {
      setError("Unable to delete post.");
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <div className="text-uppercase text-muted small mb-1">Content</div>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-2">
        <h3 className="text-navy fw-bold mb-0">Manage The Observatory</h3>
        {editingSlug === null && (
          <button type="button" className="btn btn-navy" onClick={openCreate}>
            + New Post
          </button>
        )}
      </div>

      {!loading && (
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <p className="text-muted mb-0">
            {posts.length} post{posts.length !== 1 ? "s" : ""}
          </p>
          <div className="d-flex gap-2 flex-wrap">
            <input
              type="text"
              className="form-control form-control-sm"
              style={{ width: "200px" }}
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {editingSlug && (
        <div className="glass-card bg-white p-4 mb-4">
          <h6 className="fw-bold mb-3">
            {editingSlug === "new" ? "New Post" : "Edit Post"}
          </h6>

          {formError && <div className="alert alert-danger py-2 small">{formError}</div>}

          <div className="row g-3 mb-3">
            <div className="col-md-8">
              <label className="fw-semibold text-navy mb-2 d-block">Title</label>
              <input
                type="text"
                className="form-control"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                disabled={saving}
              />
            </div>
            <div className="col-md-4">
              <label className="fw-semibold text-navy mb-2 d-block">Category</label>
              <select
                className="form-select"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                disabled={saving}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
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

          <div className="mb-3">
            <label className="fw-semibold text-navy mb-2 d-block">
              Content <span className="text-muted fw-normal">(optional)</span>
            </label>
            <textarea
              className="form-control"
              rows={5}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              disabled={saving}
            />
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-4">
              <label className="fw-semibold text-navy mb-2 d-block">Read Time (minutes)</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={form.read_time_minutes}
                onChange={(e) => setForm({ ...form, read_time_minutes: e.target.value })}
                disabled={saving}
              />
            </div>
            <div className="col-md-4">
              <label className="fw-semibold text-navy mb-2 d-block">
                Cover Image <span className="text-muted fw-normal">(optional)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) => setCoverImage(e.target.files[0])}
                disabled={saving}
              />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="is_featured"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                  disabled={saving}
                />
                <label className="form-check-label" htmlFor="is_featured">
                  Featured Post
                </label>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button type="button" className="btn btn-navy" onClick={handleSaveClick} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={closeForm} disabled={saving}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted">Loading posts...</p>
      ) : filteredPosts.length === 0 ? (
        <div className="glass-card bg-white p-4 text-center text-muted">
          {posts.length === 0 ? "No posts yet." : "No posts match this search/filter."}
        </div>
      ) : (
        <div className="glass-card bg-white p-0 overflow-hidden" style={{ overflowX: "auto" }}>
          <table className="table table-row-hover mb-0" style={{ minWidth: "800px" }}>
            <thead>
              <tr className="text-uppercase text-muted small">
                <th className="ps-4">Title</th>
                <th>Category</th>
                <th>Posted By</th>
                <th>Read Time</th>
                <th>Featured</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((p) => (
                <tr key={p.id}>
                  <td className="ps-4 fw-semibold">{p.title}</td>
                  <td>
                    <span className="status-pill status-pending text-capitalize">
                      {p.category.replace("_", " ")}
                    </span>
                  </td>
                  <td className="text-muted small">{p.posted_by_username || "—"}</td>
                  <td className="text-muted small">{p.read_time_minutes} min</td>
                  <td>
                    {p.is_featured && (
                      <span className="status-pill status-approved">Featured</span>
                    )}
                  </td>
                  <td className="text-end pe-4">
                    {canManage(p) && (
                      <>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => openEdit(p)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setConfirmDeleteSlug(p.slug)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        show={confirmSave}
        title="Save this post?"
        message="This will publish or update the post visible to the public."
        confirmLabel="Yes, Save"
        onConfirm={performSave}
        onCancel={() => setConfirmSave(false)}
      />

      <ConfirmDialog
        show={Boolean(confirmDeleteSlug)}
        title="Delete this post?"
        message="This action cannot be undone."
        confirmLabel="Yes, Delete"
        variant="danger"
        onConfirm={performDelete}
        onCancel={() => setConfirmDeleteSlug(null)}
      />
    </div>
  );
}

export default ObservatoryManage;