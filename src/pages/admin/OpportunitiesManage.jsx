import { useEffect, useState } from "react";
import {
  getOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} from "../../api/opportunities";
import ConfirmDialog from "../../components/ConfirmDialog";

const CATEGORY_OPTIONS = [
  { value: "scholarship", label: "Scholarship" },
  { value: "internship", label: "Internship" },
  { value: "fellowship", label: "Fellowship" },
  { value: "competition", label: "Competition" },
  { value: "other", label: "Other" },
];

function categoryPillClass(category) {
  if (category === "scholarship") return "status-approved";
  if (category === "internship") return "status-shortlisted";
  if (category === "other") return "status-shortlisted";
  return "status-pending";
}

function OpportunitiesManage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("all");

  const [editingSlug, setEditingSlug] = useState(null);
  const [form, setForm] = useState({
    title: "",
    category: "scholarship",
    deadline: "",
    description: "",
    details_url: "",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [confirmSave, setConfirmSave] = useState(false);
  const [confirmDeleteSlug, setConfirmDeleteSlug] = useState(null);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const res = await getOpportunities();
      setOpportunities(res.data);
    } catch {
      setError("Unable to load opportunities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, []);

  const resetForm = () => {
    setForm({ title: "", category: "scholarship", deadline: "", description: "", details_url: "" });
    setFormError("");
  };

  const openCreate = () => {
    resetForm();
    setEditingSlug("new");
  };

  const openEdit = (opp) => {
    setForm({
      title: opp.title,
      category: opp.category,
      deadline: opp.deadline,
      description: opp.description || "",
      details_url: opp.details_url || "",
    });
    setFormError("");
    setEditingSlug(opp.slug);
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
    if (!form.deadline) {
      setFormError("Deadline is required.");
      return;
    }
    setFormError("");
    setConfirmSave(true);
  };

  const performSave = async () => {
    setConfirmSave(false);
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        category: form.category,
        deadline: form.deadline,
        description: form.description,
        details_url: form.details_url,
      };
      if (editingSlug === "new") {
        await createOpportunity(payload);
      } else {
        await updateOpportunity(editingSlug, payload);
      }
      await loadOpportunities();
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
      await deleteOpportunity(slug);
      await loadOpportunities();
    } catch {
      setError("Unable to delete opportunity.");
    }
  };

  const filteredOpportunities =
    categoryFilter === "all"
      ? opportunities
      : opportunities.filter((o) => o.category === categoryFilter);

  return (
    <div>
      <div className="text-uppercase text-muted small mb-1">Content</div>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-2">
        <h3 className="text-navy fw-bold mb-0">Manage Opportunities</h3>
        {editingSlug === null && (
          <button type="button" className="btn btn-navy" onClick={openCreate}>
            + Add New Opportunity
          </button>
        )}
      </div>

      {!loading && (
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <p className="text-muted mb-0">
            {opportunities.length} opportunit{opportunities.length !== 1 ? "ies" : "y"}
          </p>
          <select
            className="form-select form-select-sm"
            style={{ width: "auto" }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            {CATEGORY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {editingSlug && (
        <div className="glass-card bg-white p-4 mb-4">
          <h6 className="fw-bold mb-3">
            {editingSlug === "new" ? "Add New Opportunity" : `Edit: ${form.title}`}
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
              <label className="fw-semibold text-navy mb-2 d-block">Category</label>
              <select
                className="form-select"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                disabled={saving}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="fw-semibold text-navy mb-2 d-block">Deadline</label>
              <input
                type="date"
                className="form-control"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                disabled={saving}
              />
            </div>
            <div className="col-md-6">
              <label className="fw-semibold text-navy mb-2 d-block">
                Details URL <span className="text-muted fw-normal">(optional)</span>
              </label>
              <input
                type="url"
                className="form-control"
                placeholder="https://..."
                value={form.details_url}
                onChange={(e) => setForm({ ...form, details_url: e.target.value })}
                disabled={saving}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="fw-semibold text-navy mb-2 d-block">Description</label>
            <textarea
              className="form-control"
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              disabled={saving}
            />
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
        <p className="text-muted">Loading opportunities...</p>
      ) : filteredOpportunities.length === 0 ? (
        <div className="glass-card bg-white p-4 text-center text-muted">
          {opportunities.length === 0 ? "No opportunities yet." : "No opportunities match this filter."}
        </div>
      ) : (
        <div className="glass-card bg-white p-0 overflow-hidden" style={{ overflowX: "auto" }}>
          <table className="table table-row-hover mb-0" style={{ minWidth: "700px" }}>
            <thead>
              <tr className="text-uppercase text-muted small">
                <th className="ps-4">Category</th>
                <th>Title</th>
                <th>Deadline</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOpportunities.map((o) => (
                <tr key={o.id}>
                  <td className="ps-4">
                    <span className={`status-pill ${categoryPillClass(o.category)}`}>
                      {o.category}
                    </span>
                  </td>
                  <td className="fw-semibold">{o.title}</td>
                  <td className="text-muted small">{o.deadline}</td>
                  <td className="text-end pe-4">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => openEdit(o)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setConfirmDeleteSlug(o.slug)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        show={confirmSave}
        title="Save this opportunity?"
        message="This will publish or update the opportunity visible to the public."
        confirmLabel="Yes, Save"
        onConfirm={performSave}
        onCancel={() => setConfirmSave(false)}
      />

      <ConfirmDialog
        show={Boolean(confirmDeleteSlug)}
        title="Delete this opportunity?"
        message="This action cannot be undone."
        confirmLabel="Yes, Delete"
        variant="danger"
        onConfirm={performDelete}
        onCancel={() => setConfirmDeleteSlug(null)}
      />
    </div>
  );
}

export default OpportunitiesManage;