import { useEffect, useState } from "react";
import { getApplications, updateApplicationStatus, deleteApplication } from "../../api/applications";
import ConfirmDialog from "../../components/ConfirmDialog";
import ImagePreviewModal from "../../components/ImagePreviewModal";

const STATUS_OPTIONS = ["pending", "shortlisted", "approved"];

function statusPillClass(status) {
  if (status === "approved") return "status-approved";
  if (status === "shortlisted") return "status-shortlisted";
  return "status-pending";
}

function ApplicationsManage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedApp, setSelectedApp] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const res = await getApplications();
      setApplications(res.data);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("You do not have permission to view applications.");
      } else {
        setError("Unable to load applications.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingStatusId(id);
    try {
      await updateApplicationStatus(id, newStatus);
      await loadApplications();
      if (selectedApp?.id === id) {
        setSelectedApp((prev) => ({ ...prev, status: newStatus }));
      }
    } catch {
      setError("Unable to update status.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const performDelete = async () => {
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    try {
      await deleteApplication(id);
      await loadApplications();
      if (selectedApp?.id === id) setSelectedApp(null);
    } catch {
      setError("Unable to delete application.");
    }
  };

  const pendingCount = applications.filter((a) => a.status === "pending").length;

  const filteredApplications =
    statusFilter === "all"
      ? applications
      : applications.filter((a) => a.status === statusFilter);

  return (
    <div>
      <div className="text-uppercase text-muted small mb-1">Content</div>
      <h3 className="text-navy fw-bold mb-2">Manage Applications</h3>

      {!loading && (
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <p className="text-muted mb-0">
            {applications.length} application{applications.length !== 1 ? "s" : ""} · {pendingCount} pending review
          </p>
          <select
            className="form-select form-select-sm"
            style={{ width: "auto" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p className="text-muted">Loading applications...</p>
      ) : filteredApplications.length === 0 ? (
        <div className="glass-card bg-white p-4 text-center text-muted">
          {applications.length === 0
            ? "No applications submitted yet."
            : "No applications match this filter."}
        </div>
      ) : (
        <div className="glass-card bg-white p-0 overflow-hidden" style={{ overflowX: "auto" }}>
          <table className="table table-row-hover mb-0" style={{ minWidth: "650px" }}>
            <thead>
              <tr className="text-uppercase text-muted small">
                <th className="ps-4">Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Applied</th>
                <th>Status</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr key={app.id}>
                  <td className="ps-4">
                    <img
                      src={app.passport_photo}
                      alt={app.full_name}
                      onClick={() => setPreviewPhoto(app)}
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                    />
                  </td>
                  <td className="fw-semibold">{app.full_name}</td>
                  <td className="text-muted small">{app.email}</td>
                  <td className="text-muted small">
                    {new Date(app.date_applied).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={`status-pill ${statusPillClass(app.status)}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="text-end pe-4">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => setSelectedApp(app)}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setConfirmDeleteId(app.id)}
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

      {selectedApp && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ backgroundColor: "rgba(6, 21, 48, 0.5)", zIndex: 1050 }}
            onClick={() => setSelectedApp(null)}
          />
          <div
            className="position-fixed top-0 end-0 h-100 bg-white shadow-lg p-4"
            style={{ width: "380px", maxWidth: "100vw", zIndex: 1051, overflowY: "auto" }}
          >
            <div className="d-flex justify-content-between align-items-start mb-4">
              <h5 className="text-navy fw-bold mb-0">Application Details</h5>
              <button type="button" className="btn-close" onClick={() => setSelectedApp(null)} />
            </div>

            <div className="text-center mb-4">
              <img
                src={selectedApp.passport_photo}
                alt={selectedApp.full_name}
                onClick={() => setPreviewPhoto(selectedApp)}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  cursor: "pointer",
                }}
              />
            </div>

            <dl className="small">
              <dt className="text-muted">Full Name</dt>
              <dd className="fw-semibold">{selectedApp.full_name}</dd>

              <dt className="text-muted">Email</dt>
              <dd>{selectedApp.email}</dd>

              <dt className="text-muted">Phone</dt>
              <dd>{selectedApp.phone_number}</dd>

              <dt className="text-muted">Date of Birth</dt>
              <dd>{selectedApp.date_of_birth}</dd>

              <dt className="text-muted">University</dt>
              <dd>{selectedApp.university || "—"}</dd>

              <dt className="text-muted">Level</dt>
              <dd>{selectedApp.level || "—"}</dd>

              <dt className="text-muted">Course of Study</dt>
              <dd>{selectedApp.course_of_study || "—"}</dd>

              <dt className="text-muted">Statement of Purpose</dt>
              <dd style={{ whiteSpace: "pre-wrap" }}>{selectedApp.statement_of_purpose || "—"}</dd>

              <dt className="text-muted">Date Applied</dt>
              <dd>{new Date(selectedApp.date_applied).toLocaleString()}</dd>

              <dt className="text-muted">Status</dt>
              <dd>
                <select
                  className={`form-select form-select-sm status-pill ${statusPillClass(selectedApp.status)}`}
                  style={{ border: "none", width: "auto" }}
                  value={selectedApp.status}
                  onChange={(e) => handleStatusChange(selectedApp.id, e.target.value)}
                  disabled={updatingStatusId === selectedApp.id}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </dd>
            </dl>

            <a href={selectedApp.cv_transcript} target="_blank" rel="noopener noreferrer" className="btn btn-navy w-100 mb-2">
              View CV / Transcript
            </a>

            <button
              type="button"
              className="btn btn-outline-danger w-100"
              onClick={() => setConfirmDeleteId(selectedApp.id)}
            >
              Delete Application
            </button>
          </div>
        </>
      )}

      <ConfirmDialog
        show={Boolean(confirmDeleteId)}
        title="Delete this application?"
        message="This action cannot be undone. The applicant's data will be permanently removed."
        confirmLabel="Yes, Delete"
        variant="danger"
        onConfirm={performDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />

      {previewPhoto && (
        <ImagePreviewModal
          show={Boolean(previewPhoto)}
          imageUrl={previewPhoto.passport_photo}
          title={previewPhoto.full_name}
          onClose={() => setPreviewPhoto(null)}
        />
      )}
    </div>
  );
}

export default ApplicationsManage;