import { useEffect, useState } from "react";
import { getAllUsers, approveUser } from "../../api/users";
import ConfirmDialog from "../../components/ConfirmDialog";

function UsersManage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [processingId, setProcessingId] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'approve', user }

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Only superusers can manage users.");
      } else {
        setError("Unable to load users.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleApprove = async () => {
    const user = confirmAction.user;
    setConfirmAction(null);
    setProcessingId(user.id);
    try {
      await approveUser(user.id);
      await loadUsers();
    } catch {
      setError("Unable to activate user.");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.first_name} ${u.last_name}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && u.is_active) ||
      (statusFilter === "pending" && !u.is_active);

    return matchesSearch && matchesStatus;
  });

  const pendingCount = users.filter((u) => !u.is_active).length;

  return (
    <div>
      <div className="text-uppercase text-muted small mb-1">Content</div>
      <h3 className="text-navy fw-bold mb-2">Manage Users</h3>

      {!loading && (
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <p className="text-muted mb-0">
            {users.length} user{users.length !== 1 ? "s" : ""} · {pendingCount} pending approval
          </p>
          <div className="d-flex gap-2 flex-wrap">
            <input
              type="text"
              className="form-control form-control-sm"
              style={{ width: "220px" }}
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Activated</option>
              <option value="pending">Pending Approval</option>
            </select>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p className="text-muted">Loading users...</p>
      ) : filteredUsers.length === 0 ? (
        <div className="glass-card bg-white p-4 text-center text-muted">
          {users.length === 0 ? "No users yet." : "No users match this search/filter."}
        </div>
      ) : (
        <div className="glass-card bg-white p-0 overflow-hidden" style={{ overflowX: "auto" }}>
          <table className="table table-row-hover mb-0" style={{ minWidth: "700px" }}>
            <thead>
              <tr className="text-uppercase text-muted small">
                <th className="ps-4">Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Joined</th>
                <th className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td className="ps-4 fw-semibold">
                    {u.first_name} {u.last_name}
                  </td>
                  <td className="text-muted small">{u.email}</td>
                  <td>
                    <span className={`status-pill ${u.is_active ? "status-approved" : "status-pending"}`}>
                      {u.is_active ? "Activated" : "Pending"}
                    </span>
                  </td>
                  <td className="text-muted small">
                    {new Date(u.date_joined).toLocaleDateString()}
                  </td>
                  <td className="text-end pe-4">
                    {!u.is_active && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success"
                        onClick={() => setConfirmAction({ type: "approve", user: u })}
                        disabled={processingId === u.id}
                      >
                        Activate as Admin
                      </button>
                    )}
                    {u.is_active && (
                      <span className="text-muted small">Admin</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        show={confirmAction?.type === "approve"}
        title="Activate this user as admin?"
        message={`${confirmAction?.user?.first_name} ${confirmAction?.user?.last_name} will be activated and granted admin privileges immediately.`}
        confirmLabel="Yes, Activate"
        onConfirm={handleApprove}
        onCancel={() => setConfirmAction(null)}
      />
    </div>
  );
}

export default UsersManage;