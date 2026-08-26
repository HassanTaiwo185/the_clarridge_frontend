import { useEffect, useState } from "react";
import {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "../../api/calendar";
import ConfirmDialog from "../../components/ConfirmDialog";

function CalendarManage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null); // null | "new" | actual id
  const [form, setForm] = useState({
    title: "",
    description: "",
    week_label: "",
    start_date: "",
    end_date: "",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [confirmSave, setConfirmSave] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await getCalendarEvents();
      setEvents(res.data);
    } catch {
      setError("Unable to load calendar events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", week_label: "", start_date: "", end_date: "" });
    setFormError("");
  };

  const openCreate = () => {
    resetForm();
    setEditingId("new");
  };

  const openEdit = (event) => {
    setForm({
      title: event.title,
      description: event.description || "",
      week_label: event.week_label,
      start_date: event.start_date,
      end_date: event.end_date,
    });
    setFormError("");
    setEditingId(event.id);
  };

  const closeForm = () => {
    setEditingId(null);
    resetForm();
  };

  const handleSaveClick = () => {
    if (!form.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!form.week_label.trim()) {
      setFormError("Week label is required.");
      return;
    }
    if (!form.start_date || !form.end_date) {
      setFormError("Start and end dates are required.");
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
        description: form.description,
        week_label: form.week_label,
        start_date: form.start_date,
        end_date: form.end_date,
      };
      if (editingId === "new") {
        await createCalendarEvent(payload);
      } else {
        await updateCalendarEvent(editingId, payload);
      }
      await loadEvents();
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
      await deleteCalendarEvent(id);
      await loadEvents();
    } catch {
      setError("Unable to delete event.");
    }
  };

  return (
    <div>
      <div className="text-uppercase text-muted small mb-1">Content</div>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-2">
        <h3 className="text-navy fw-bold mb-0">Manage Calendar</h3>
        {editingId === null && (
          <button type="button" className="btn btn-navy" onClick={openCreate}>
            + Add New Event
          </button>
        )}
      </div>

      {!loading && (
        <p className="text-muted mb-4">
          {events.length} event{events.length !== 1 ? "s" : ""}
        </p>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {editingId && (
        <div className="glass-card bg-white p-4 mb-4">
          <h6 className="fw-bold mb-3">
            {editingId === "new" ? "Add New Event" : `Edit: ${form.title}`}
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
              <label className="fw-semibold text-navy mb-2 d-block">Week Label</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Week 1 or Weeks 1-2"
                value={form.week_label}
                onChange={(e) => setForm({ ...form, week_label: e.target.value })}
                disabled={saving}
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <label className="fw-semibold text-navy mb-2 d-block">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                disabled={saving}
              />
            </div>
            <div className="col-md-6">
              <label className="fw-semibold text-navy mb-2 d-block">End Date</label>
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
            <label className="fw-semibold text-navy mb-2 d-block">
              Description <span className="text-muted fw-normal">(optional)</span>
            </label>
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
        <p className="text-muted">Loading events...</p>
      ) : events.length === 0 ? (
        <div className="glass-card bg-white p-4 text-center text-muted">
          No events yet. Click "+ Add New Event" to create one.
        </div>
      ) : (
        <div className="glass-card bg-white p-0 overflow-hidden" style={{ overflowX: "auto" }}>
          <table className="table table-row-hover mb-0" style={{ minWidth: "700px" }}>
            <thead>
              <tr className="text-uppercase text-muted small">
                <th className="ps-4">Title</th>
                <th>Week</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td className="ps-4 fw-semibold">{e.title}</td>
                  <td className="text-muted small">{e.week_label}</td>
                  <td className="text-muted small">{e.start_date}</td>
                  <td className="text-muted small">{e.end_date}</td>
                  <td className="text-end pe-4">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => openEdit(e)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setConfirmDeleteId(e.id)}
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
        title="Save this event?"
        message="This will publish or update the calendar event visible to the public."
        confirmLabel="Yes, Save"
        onConfirm={performSave}
        onCancel={() => setConfirmSave(false)}
      />

      <ConfirmDialog
        show={Boolean(confirmDeleteId)}
        title="Delete this event?"
        message="This action cannot be undone."
        confirmLabel="Yes, Delete"
        variant="danger"
        onConfirm={performDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
}

export default CalendarManage;