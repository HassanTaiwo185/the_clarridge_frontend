import { useNavigate } from "react-router-dom";

function StatCard({ label, value, sublabel, to }) {
  const navigate = useNavigate();
  const clickable = Boolean(to);

  return (
    <div
      className="glass-card p-4 h-100"
      onClick={() => clickable && navigate(to)}
      style={{ cursor: clickable ? "pointer" : "default" }}
    >
      <div className="text-uppercase text-muted small mb-2" style={{ letterSpacing: "0.5px" }}>
        {label}
      </div>
      <div className="fs-2 fw-bold text-navy mb-1">{value}</div>
      {sublabel && <div className="small text-success">{sublabel}</div>}
    </div>
  );
}

export default StatCard;