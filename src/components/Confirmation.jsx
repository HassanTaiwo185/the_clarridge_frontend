import { useNavigate } from "react-router-dom";

function Confirmation({
  title = "Success",
  message = "Your request was completed successfully.",
  buttonLabel = "Continue",
  buttonTo = "/",
  icon = "✓",
}) {
  const navigate = useNavigate();

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-white py-5 px-3">
      <div className="w-100 text-center" style={{ maxWidth: "420px" }}>
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
          style={{
            width: "72px",
            height: "72px",
            backgroundColor: "rgba(10, 31, 68, 0.08)",
            fontSize: "2rem",
            color: "var(--clarridge-navy)",
          }}
        >
          {icon}
        </div>

        <h2 className="text-navy fw-bold mb-3">{title}</h2>
        <p className="text-muted mb-4">{message}</p>

        <button
          type="button"
          className="btn btn-navy w-100 py-2"
          onClick={() => navigate(buttonTo)}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

export default Confirmation;