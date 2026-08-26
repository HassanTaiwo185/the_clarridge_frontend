import { useEffect, useState } from "react";
import { getTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from "../../api/team";
import ConfirmDialog from "../../components/ConfirmDialog";
import ImagePreviewModal from "../../components/ImagePreviewModal";

function TeamManage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", office: "", contact: "", bio: "" });
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [confirmSave, setConfirmSave] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const res = await getTeamMembers();
      setMembers(res.data);
    } catch {
      setError("Unable to load team members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const resetForm = () => {
    setForm({ name: "", office: "", contact: "", bio: "" });
    setNewPhotoFile(null);
    setPhotoPreview(null);
    setFormError("");
  };

  const openCreate = () => {
    resetForm();
    setEditingId("new");
  };

  const openEdit = (member) => {
    setForm({
      name: member.name,
      office: member.office || "",
      contact: member.contact || "",
      bio: member.bio || "",
    });
    setNewPhotoFile(null);
    setPhotoPreview(null);
    setFormError("");
    setEditingId(member.id);
  };

  const closeForm = () => {
    setEditingId(null);
    resetForm();
  };

  const handlePhotoSelect = (file) => {
    if (!file) return;
    setNewPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSaveClick = () => {
    if (!form.name.trim()) {
      setFormError("Name is required.");
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
      data.append("name", form.name);
      data.append("office", form.office);
      data.append("contact", form.contact);
      data.append("bio", form.bio);
      if (newPhotoFile) data.append("photo", newPhotoFile);

      if (editingId === "new") {
        await createTeamMember(data);
      } else {
        await updateTeamMember(editingId, data);
      }
      await loadMembers();
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
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    try {
      await deleteTeamMember(id);
      await loadMembers();
    } catch {
      setError("Unable to delete team member.");
    }
  };

  const filteredMembers = members.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="text-uppercase text-muted small mb-1">Content</div>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-2">
        <h3 className="text-navy fw-bold mb-0">Manage Team Members</h3>
        {editingId === null && (
          <button type="button" className="btn btn-navy" onClick={openCreate}>
            + Add New Member
          </button>
        )}
      </div>

      {!loading && (
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <p className="text-muted mb-0">
            {members.length} member{members.length !== 1 ? "s" : ""}
          </p>
          <input
            type="text"
            className="form-control form-control-sm"
            style={{ width: "220px" }}
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {editingId && (
        <div className="glass-card bg-white p-4 mb-4">
          <h6 className="fw-bold mb-3">
            {editingId === "new" ? "Add New Member" : `Edit: ${form.name}`}
          </h6>

          {formError && <div className="alert alert-danger py-2 small">{formError}</div>}

          <div className="d-flex flex-column flex-md-row gap-3 align-items-md-end mb-3">
            <div className="text-center">
              <label
                htmlFor="team-photo-upload"
                className="d-flex align-items-center justify-content-center rounded-circle bg-light text-muted small"
                style={{
                  width: "72px",
                  height: "72px",
                  cursor: "pointer",
                  overflow: "hidden",
                  border: "2px dashed #ccc",
                }}
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : editingId !== "new" && members.find((m) => m.id === editingId)?.photo ? (
                  <img
                    src={members.find((m) => m.id === editingId)?.photo}
                    alt="Current"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span className="px-1 text-center" style={{ fontSize: "0.7rem" }}>
                    Upload Photo
                  </span>
                )}
              </label>
              <input
                id="team-photo-upload"
                type="file"
                accept="image/*"
                className="d-none"
                onChange={(e) => handlePhotoSelect(e.target.files[0])}
                disabled={saving}
              />
            </div>

            <div className="flex-grow-1">
              <label className="fw-semibold text-navy mb-2 d-block">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={saving}
              />
            </div>

            <div className="flex-grow-1">
              <label className="fw-semibold text-navy mb-2 d-block">Office</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Research & Publications"
                value={form.office}
                onChange={(e) => setForm({ ...form, office: e.target.value })}
                disabled={saving}
              />
            </div>

            <div className="flex-grow-1">
              <label className="fw-semibold text-navy mb-2 d-block">Contact</label>
              <input
                type="text"
                className="form-control"
                placeholder="Phone or email"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                disabled={saving}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="fw-semibold text-navy mb-2 d-block">
              Bio <span className="text-muted fw-normal">(optional)</span>
            </label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="A short bio for this team member..."
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              disabled={saving}
            />
          </div>

          <div className="d-flex gap-2">
            <button type="button" className="btn btn-navy" onClick={handleSaveClick} disabled={saving}>
              {saving ? "Saving..." : editingId === "new" ? "+ Add" : "Save Changes"}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={closeForm} disabled={saving}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted">Loading members...</p>
      ) : filteredMembers.length === 0 ? (
        <div className="glass-card bg-white p-4 text-center text-muted">
          {members.length === 0
            ? 'No team members yet. Click "+ Add New Member" to create one.'
            : "No members match this search."}
        </div>
      ) : (
        <div className="glass-card bg-white p-0 overflow-hidden" style={{ overflowX: "auto" }}>
          <table className="table table-row-hover mb-0" style={{ minWidth: "700px" }}>
            <thead>
              <tr className="text-uppercase text-muted small">
                <th className="ps-4">Photo</th>
                <th>Name</th>
                <th>Office</th>
                <th>Contact</th>
                <th>Bio</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m) => (
                <tr key={m.id}>
                  <td className="ps-4">
                    {m.photo ? (
                      <img
                        src={m.photo}
                        alt={m.name}
                        onClick={() => setPreviewPhoto(m)}
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "50%",
                          cursor: "pointer",
                        }}
                      />
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center bg-light text-muted"
                        style={{ width: "40px", height: "40px", borderRadius: "50%", fontSize: "0.6rem" }}
                      >
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="fw-semibold">{m.name}</td>
                  <td className="text-muted small">{m.office || "—"}</td>
                  <td className="text-muted small">{m.contact || "—"}</td>
                  <td className="text-muted small" style={{ maxWidth: "200px" }}>
                    {m.bio ? (m.bio.length > 50 ? `${m.bio.slice(0, 50)}...` : m.bio) : "—"}
                  </td>
                  <td className="text-end pe-4">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => openEdit(m)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setConfirmDeleteId(m.id)}
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
        message="This will update the team member visible to the public."
        confirmLabel="Yes, Save"
        onConfirm={performSave}
        onCancel={() => setConfirmSave(false)}
      />

      <ConfirmDialog
        show={Boolean(confirmDeleteId)}
        title="Delete this team member?"
        message="This action cannot be undone."
        confirmLabel="Yes, Delete"
        variant="danger"
        onConfirm={performDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />

      {previewPhoto?.photo && (
        <ImagePreviewModal
          show={Boolean(previewPhoto)}
          imageUrl={previewPhoto.photo}
          title={previewPhoto.name}
          onClose={() => setPreviewPhoto(null)}
        />
      )}
    </div>
  );
}

export default TeamManage;