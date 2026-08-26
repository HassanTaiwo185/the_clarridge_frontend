import { useEffect, useState } from "react";
import { getImpactStats, updateImpactStats } from "../../api/impact";
import ConfirmDialog from "../../components/ConfirmDialog";

function ImpactManage() {
  const [form, setForm] = useState({ students_reached: 0, universities: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [confirmSave, setConfirmSave] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await getImpactStats();
      setForm({
        students_reached: res.data.students_reached,
        universities: res.data.universities,
      });
    } catch {
      setError("Unable to load impact stats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleSaveClick = () => {
    setError("");
    setSuccess("");
    setConfirmSave(true);
  };

  const performSave = async () => {
    setConfirmSave(false);
    setSaving(true);
    try {
      await updateImpactStats({
        students_reached: Number(form.students_reached),
        universities: Number(form.universities),
      });
      setSuccess("Impact stats updated successfully.");
    } catch (err) {
      const backendData = err.response?.data;
      if (backendData) {
        const firstError = Object.values(backendData)[0];
        setError(Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else {
        setError("Unable to save. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="text-uppercase text-muted small mb-1">Content</div>
      <h3 className="text-navy fw-bold mb-2">Manage Impact Stats</h3>
      <p className="text-muted mb-4">
        Programmes count is calculated automatically. Students Reached and Universities are set manually here.
      </p>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <div className="glass-card bg-white p-4" style={{ maxWidth: "500px" }}>
          <div className="mb-3">
            <label className="fw-semibold text-navy mb-2 d-block">Students Reached</label>
            <input
              type="number"
              min="0"
              className="form-control"
              value={form.students_reached}
              onChange={(e) => setForm({ ...form, students_reached: e.target.value })}
              disabled={saving}
            />
          </div>

          <div className="mb-4">
            <label className="fw-semibold text-navy mb-2 d-block">Universities</label>
            <input
              type="number"
              min="0"
              className="form-control"
              value={form.universities}
              onChange={(e) => setForm({ ...form, universities: e.target.value })}
              disabled={saving}
            />
          </div>

          <button type="button" className="btn btn-navy" onClick={handleSaveClick} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}

      <ConfirmDialog
        show={confirmSave}
        title="Save impact stats?"
        message="This will update the numbers shown on the public homepage."
        confirmLabel="Yes, Save"
        onConfirm={performSave}
        onCancel={() => setConfirmSave(false)}
      />
    </div>
  );
}

export default ImpactManage;