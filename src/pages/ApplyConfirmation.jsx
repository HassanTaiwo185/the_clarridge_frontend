import { useLocation, useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";

function ApplyConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();

  const referenceNumber = location.state?.referenceNumber;

  return (
    <div>
      <PublicNavbar />

      <div className="container py-5 text-center" style={{ maxWidth: "500px" }}>
        <div
          className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
          style={{ width: "72px", height: "72px", backgroundColor: "var(--clarridge-navy)" }}
        >
          <span style={{ fontSize: "2rem", color: "#fff" }}>✓</span>
        </div>

        <h2 className="text-navy fw-normal mb-3">Application received.</h2>
        <p className="text-muted mb-4">Thank you for applying.</p>

        {referenceNumber && (
          <div className="border rounded p-4 mb-4 text-start">
            <div className="text-uppercase small text-muted mb-1" style={{ letterSpacing: "1px" }}>
              Reference Number
            </div>
            <div className="fw-bold text-navy mb-3" style={{ fontSize: "1.1rem" }}>
              {referenceNumber}
            </div>

            <div className="text-uppercase small text-muted mb-2" style={{ letterSpacing: "1px" }}>
              What Happens Next
            </div>
            <ul className="small text-muted mb-0 ps-3">
              <li>Your application will be reviewed by our team.</li>
              <li>Shortlisted candidates will be contacted via email.</li>
              <li>Add hello@theclarridge.org to your contacts.</li>
            </ul>
          </div>
        )}

        <button
          type="button"
          className="btn btn-outline-secondary px-4"
          onClick={() => navigate("/")}
        >
          Back to Programmes
        </button>
      </div>
    </div>
  );
}

export default ApplyConfirmation;