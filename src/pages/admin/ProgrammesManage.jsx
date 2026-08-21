import { useEffect, useState } from "react";
import { getProgrammes, updateProgramme, deleteProgramme, createProgramme } from "../../api/programmes";
import ImageDropzone from "../../components/ImageDropzone";
import ConfirmDialog from "../../components/ConfirmDialog";
import ImagePreviewModal from "../../components/ImagePreviewModal";

const STATUS_OPTIONS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "open", label: "Open Now" },
  { value: "completed", label: "Completed" },
];

function ProgrammesManage() {
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [editingSlug, setEditingSlug] = useState(null);
  const [form, setForm] = useState({ name: "", status: "upcoming", start_date: "", end_date: "", description: "" });
  const [newImageFile, setNewImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [confirmSave, setConfirmSave] = useState(false);
  const [confirmDeleteSlug, setConfirmDeleteSlug] = useState(null);
  const [previewProgramme, setPreviewProgramme] = useState(null);

  const loadProgrammes = async () => {
    setLoading(true);
    try {
      const res = await getProgrammes();
      setProgrammes(res.data);
    } catch {
      setError("Unable to load programmes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgrammes();
  }, []);

  const openCreate = () => {
    setForm({ name: "", status: "upcoming", start_date: "", end_date: "", description: "" });
    setNewImageFile(null);
    setFormError("");
    setEditingSlug("new");
  };

  const openEdit = (programme) => {
    setForm({
      name: programme.name,
      status: programme.status,
      start_date: programme.start_date || "",
      end_date: programme.end_date || "",
      description: programme.description || "",
    });
    setNewImageFile(null);
    setFormError("");
    setEditingSlug(programme.slug);
  };

  const closeForm = () => {
    setEditingSlug(null);
    setFormError("");
  };

  const buildFormData = () => {
    const data = new FormData();
    data.append("name", form.name);
    data.append("status", form.status);
    if (form.start_date) data.append("start_date", form.start_date);
    if (form.end_date) data.append("end_date", form.end_date);
    data.append("description", form.description);
    if (newImageFile) data.append("cover_image", newImageFile);
    return data;
  };

  const handleSaveClick = () => {
    if (!form.name.trim()) {
      setFormError("Programme name is required.");
      return;
    }
    setFormError("");
    setConfirmSave(true);
  };

  const performSave = async () => {
    setConfirmSave(false);
    setSaving(true);
    try {
      const data = buildFormData();
      if (editingSlug === "new") {
        await createProgramme(data);
      } else {
        await updateProgramme(editingSlug, data);
      }
      await loadProgrammes();
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
      await deleteProgramme(slug);
      await loadProgrammes();
    } catch {
      setError("Unable to delete programme.");
    }
  };

  const openCount = programmes.filter((p) => p.status === "open").length;

  const filteredProgrammes =
    statusFilter === "all"
      ? programmes
      : programmes.filter((p) => p.status === statusFilter);

  return (
    <div>
      <div className="text-uppercase text-muted small mb-1">Content</div>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-2">
        <h3 className="text-navy fw-bold mb-0">Manage Programmes</h3>
        <button type="button" className="btn btn-navy" onClick={openCreate}>
          + Add New Programme
        </button>
      </div>

      {!loading && (
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <p className="text-muted mb-0">
            {programmes.length} programme{programmes.length !== 1 ? "s" : ""} · {openCount} currently open
          </p>
          <select
            className="form-select form-select-sm"
            style={{ width: "auto" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="open">Open Now</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {editingSlug && (
        <div className="glass-card bg-white p-4 mb-4">
          <h6 className="fw-bold mb-3">
            {editingSlug === "new" ? "Add New Programme" : `Edit: ${form.name}`}
          </h6>

          {formError && <div className="alert alert-danger py-2 small">{formError}</div>}

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="fw-semibold text-navy mb-2 d-block">Programme Name</label>
              <input
                type="text"
                className="form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={saving}
              />
            </div>
            <div className="col-md-6">
              <label className="fw-semibold text-navy mb-2 d-block">Status</label>
              <select
                className="form-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                disabled={saving}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="fw-semibold text-navy mb-2 d-block">
                Start Date <span className="text-muted fw-normal">(optional)</span>
              </label>
              <input
                type="date"
                className="form-control"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                disabled={saving}
              />
            </div>
            <div className="col-md-6">
              <label className="fw-semibold text-navy mb-2 d-block">
                End Date <span className="text-muted fw-normal">(optional)</span>
              </label>
              <input
                type="date"
                className="form-control"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
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

          <div className="mb-4">
            <ImageDropzone
              currentImageUrl={
                editingSlug !== "new"
                  ? programmes.find((p) => p.slug === editingSlug)?.cover_image
                  : null
              }
              onFileSelect={setNewImageFile}
            />
            <p className="text-muted small mt-2 mb-0">Cover image is optional.</p>
          </div>

          <div className="d-flex gap-2">
            <button type="button" className="btn btn-navy" onClick={handleSaveClick} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={closeForm} disabled={saving}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted">Loading programmes...</p>
      ) : filteredProgrammes.length === 0 ? (
        <div className="glass-card bg-white p-4 text-center text-muted">
          {programmes.length === 0
            ? 'No programmes yet. Click "+ Add New Programme" to create one.'
            : "No programmes match this filter."}
        </div>
      ) : (
        <div className="glass-card bg-white p-0 overflow-hidden" style={{ overflowX: "auto" }}>
          <table className="table table-row-hover mb-0" style={{ minWidth: "650px" }}>
            <thead>
              <tr className="text-uppercase text-muted small">
                <th className="ps-4">Cover</th>
                <th>Name</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProgrammes.map((p) => (
                <tr key={p.id}>
                  <td className="ps-4">
                    {p.cover_image ? (
                      <img
                        src={p.cover_image}
                        alt={p.name}
                        onClick={() => setPreviewProgramme(p)}
                        style={{
                          width: "56px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          cursor: "pointer",
                          transition: "transform 0.15s ease, box-shadow 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.08)";
                          e.currentTarget.style.boxShadow = "0 2px 8px rgba(10, 31, 68, 0.25)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      />
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center bg-light text-muted"
                        style={{ width: "56px", height: "40px", borderRadius: "6px", fontSize: "0.65rem" }}
                      >
                        No image
                      </div>
                    )}
                  </td>
                  <td className="fw-semibold">{p.name}</td>
                  <td>
                    <span
                      className={`status-pill ${
                        p.status === "open"
                          ? "status-approved"
                          : p.status === "upcoming"
                          ? "status-pending"
                          : "status-shortlisted"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="text-muted small">{p.start_date || "—"}</td>
                  <td className="text-muted small">{p.end_date || "—"}</td>
                  <td className="text-end pe-4">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        show={confirmSave}
        title="Save changes?"
        message="This will update the programme details visible to the public."
        confirmLabel="Yes, Save"
        onConfirm={performSave}
        onCancel={() => setConfirmSave(false)}
      />

      <ConfirmDialog
        show={Boolean(confirmDeleteSlug)}
        title="Delete this programme?"
        message="This action cannot be undone. The programme will be permanently removed."
        confirmLabel="Yes, Delete"
        variant="danger"
        onConfirm={performDelete}
        onCancel={() => setConfirmDeleteSlug(null)}
      />

      {previewProgramme?.cover_image && (
        <ImagePreviewModal
          show={Boolean(previewProgramme)}
          imageUrl={previewProgramme?.cover_image}
          title={previewProgramme?.name}
          onClose={() => setPreviewProgramme(null)}
        />
      )}
    </div>
  );
}

export default ProgrammesManage;