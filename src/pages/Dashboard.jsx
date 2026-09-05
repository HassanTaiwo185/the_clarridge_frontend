import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import StatCard from "../components/StatCard";

function statusPillClass(status) {
  if (status === "approved") return "status-approved";
  if (status === "shortlisted") return "status-shortlisted";
  return "status-pending";
}

function DashboardOverview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalApplications: null,
    openProgrammes: null,
    publishedArticles: null,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [applicationsRes, programmesRes, articlesRes] = await Promise.all([
          api.get("/applications/"),
          api.get("/programmes/"),
          api.get("/articles/"),
        ]);

        const applications = applicationsRes.data;
        const programmes = programmesRes.data;
        const articles = articlesRes.data;

        setStats({
          totalApplications: applications.length,
          openProgrammes: programmes.filter((p) => p.status === "open").length,
          publishedArticles: articles.length,
        });

        setRecentApplications(applications.slice(0, 5));
      } catch (err) {
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-muted">Loading dashboard...</p>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <div className="text-uppercase text-muted small mb-1">Dashboard</div>
      <h3 className="text-navy fw-bold mb-4">Overview</h3>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <StatCard
            label="Total Applications"
            value={stats.totalApplications}
            to="/admin/applications"
          />
        </div>
        <div className="col-12 col-md-4">
          <StatCard
            label="Open Programmes"
            value={stats.openProgrammes}
            to="/admin/programmes"
          />
        </div>
        <div className="col-12 col-md-4">
          <StatCard
            label="Published Articles"
            value={stats.publishedArticles}
            to="/admin/articles"
          />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12">
          <div className="glass-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0">Recent Applications</h6>
              <span
                role="button"
                className="small text-navy fw-semibold"
                onClick={() => navigate("/admin/applications")}
              >
                View all →
              </span>
            </div>
            {recentApplications.length === 0 ? (
              <p className="text-muted small mb-0">No applications yet.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="table table-sm table-row-hover mb-0">
                  <thead>
                    <tr className="text-uppercase text-muted small">
                      <th>Name</th>
                      <th>Applied</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApplications.map((app) => (
                      <tr key={app.id} onClick={() => navigate("/admin/applications")}>
                        <td>{app.full_name}</td>
                        <td className="text-muted small">
                          {new Date(app.date_applied).toLocaleDateString()}
                        </td>
                        <td>
                          <span className={`status-pill ${statusPillClass(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;