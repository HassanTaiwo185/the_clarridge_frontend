import { useEffect, useState } from "react";
import { getTestimonials, updateTestimonialStatus, deleteTestimonial } from "../../api/testimonials";
import ConfirmDialog from "../../components/ConfirmDialog";

function statusPillClass(status) {
  if (status === "approved") return "status-approved";
  if (status === "rejected") return "status-shortlisted";
  return "status-pending";
}

function truncate(text, max = 60) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

function TestimonialsManage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("pending");
  const [updatingId, setUpdatingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const res = await getTestimonials();
      setTestimonials(res.data);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("You do not have permission to view testimonials.");
      } else {
        setError("Unable to load testimonials.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await updateTestimonialStatus(id, newStatus);
      await loadTestimonials();
    } catch {
      setError("Unable to update testimonial status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const performDelete = async () => {
    const id = confirmDeleteId;
    setConfirmDeleteId(null);
    try {
      await deleteTestimonial(id);
      await loadTestimonials();
    } catch {
      setError("Unable to delete testimonial.");
    }
  };

  const filteredTestimonials =
    statusFilter === "all"
      ? testimonials
      : testimonials.filter((t) => t.status === statusFilter);

  const pendingCount = testimonials.filter((t) => t.status === "pending").length;

  return (
    <div>
      <div className="text-uppercase text-muted small mb-1">Content</div>
      <h3 className="text-navy fw-bold mb-2">Testimonial Moderation Queue</h3>

      {!loading && (
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <p className="text-muted mb-0">
            {testimonials.length} testimonial{testimonials.length !== 1 ? "s" : ""} · {pendingCount} pending review
          </p>
          <select
            className="form-select form-select-sm"
            style={{ width: "auto" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p className="text-muted">Loading testimonials...</p>
      ) : filteredTestimonials.length === 0 ? (
        <div className="glass-card bg-white p-4 text-center text-muted">
          {testimonials.length === 0
            ? "No testimonials submitted yet."
            : "No testimonials match this filter."}
        </div>
      ) : (
        <div className="glass-card bg-white p-0 overflow-hidden" style={{ overflowX: "auto" }}>
          <table className="table table-row-hover mb-0" style={{ minWidth: "650px" }}>
            <thead>
              <tr className="text-uppercase text-muted small">
                <th className="ps-4">Submitted By</th>
                <th>Programme</th>
                <th>Preview</th>
                <th>Status</th>
                <th className="text-end pe-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTestimonials.map((t) => (
                <tr key={t.id}>
                  <td className="ps-4 fw-semibold" role="button" onClick={() => setSelectedTestimonial(t)}>
                    {t.submitted_by}
                  </td>
                  <td className="text-muted small">{t.programme}</td>
                  <td className="text-muted small" style={{ maxWidth: "260px" }}>
                    "{truncate(t.content)}"
                  </td>
                  <td>
                    <span className={`status-pill ${statusPillClass(t.status)}`}>{t.status}</span>
                  </td>
                  <td className="text-end pe-4">
                    {t.status !== "approved" && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success me-2"
                        onClick={() => handleStatusChange(t.id, "approved")}
                        disabled={updatingId === t.id}
                      >
                        Approve
                      </button>
                    )}
                    {t.status !== "rejected" && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() => handleStatusChange(t.id, "rejected")}
                        disabled={updatingId === t.id}
                      >
                        Reject
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setConfirmDeleteId(t.id)}
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

      {/* Full testimonial preview panel */}
      {selectedTestimonial && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ backgroundColor: "rgba(6, 21, 48, 0.5)", zIndex: 1050 }}
            onClick={() => setSelectedTestimonial(null)}
          />
          <div
            className="position-fixed top-0 end-0 h-100 bg-white shadow-lg p-4"
            style={{ width: "380px", maxWidth: "100vw", zIndex: 1051, overflowY: "auto" }}
          >
            <div className="d-flex justify-content-between align-items-start mb-4">
              <h5 className="text-navy fw-bold mb-0">Testimonial</h5>
              <button type="button" className="btn-close" onClick={() => setSelectedTestimonial(null)} />
            </div>

            <dl className="small">
              <dt className="text-muted">Submitted By</dt>
              <dd className="fw-semibold">{selectedTestimonial.submitted_by}</dd>

              <dt className="text-muted">Programme</dt>
              <dd>{selectedTestimonial.programme}</dd>

              <dt className="text-muted">Status</dt>
              <dd>
                <span className={`status-pill ${statusPillClass(selectedTestimonial.status)}`}>
                  {selectedTestimonial.status}
                </span>
              </dd>

              <dt className="text-muted">Full Testimonial</dt>
              <dd className="fst-italic">"{selectedTestimonial.content}"</dd>
            </dl>

            <div className="d-flex gap-2 mt-4">
              {selectedTestimonial.status !== "approved" && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success flex-grow-1"
                  onClick={async () => {
                    await handleStatusChange(selectedTestimonial.id, "approved");
                    setSelectedTestimonial(null);
                  }}
                >
                  Approve
                </button>
              )}
              {selectedTestimonial.status !== "rejected" && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary flex-grow-1"
                  onClick={async () => {
                    await handleStatusChange(selectedTestimonial.id, "rejected");
                    setSelectedTestimonial(null);
                  }}
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        show={Boolean(confirmDeleteId)}
        title="Delete this testimonial?"
        message="This action cannot be undone. The testimonial will be permanently removed."
        confirmLabel="Yes, Delete"
        variant="danger"
        onConfirm={performDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}

export default TestimonialsManage;