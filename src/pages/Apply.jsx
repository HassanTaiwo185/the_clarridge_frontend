import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import { submitApplication } from "../api/applications";

const STEPS = ["Personal Info", "Documents", "Review"];

function Apply() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    date_of_birth: "",
    university: "",
    level: "",
    course_of_study: "",
    statement_of_purpose: "",
  });
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [cvTranscript, setCvTranscript] = useState(null);

  const validateStep = () => {
    if (currentStep === 0) {
      if (
        !form.full_name.trim() ||
        !form.email.trim() ||
        !form.phone_number.trim() ||
        !form.date_of_birth ||
        !form.university.trim() ||
        !form.level.trim() ||
        !form.course_of_study.trim() ||
        !form.statement_of_purpose.trim()
      ) {
        setError("Please fill in all personal information fields.");
        return false;
      }
    }
    if (currentStep === 1) {
      if (!passportPhoto || !cvTranscript) {
        setError("Please upload both your passport photo and CV/transcript.");
        return false;
      }
    }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setError("");
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const data = new FormData();
      data.append("full_name", form.full_name);
      data.append("email", form.email);
      data.append("phone_number", form.phone_number);
      data.append("date_of_birth", form.date_of_birth);
      data.append("university", form.university);
      data.append("level", form.level);
      data.append("course_of_study", form.course_of_study);
      data.append("statement_of_purpose", form.statement_of_purpose);
      data.append("passport_photo", passportPhoto);
      data.append("cv_transcript", cvTranscript);

      const res = await submitApplication(data);

      navigate("/apply/confirmation", {
        state: {
          referenceNumber: `CA-${new Date().getFullYear()}-${String(res.data.id).padStart(4, "0")}`,
          fullName: form.full_name,
        },
      });
    } catch (err) {
      const backendData = err.response?.data;
      if (backendData) {
        const firstError = Object.values(backendData)[0];
        setError(Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else {
        setError("Unable to submit your application. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PublicNavbar />

      <div style={{ backgroundColor: "var(--clarridge-navy)" }} className="text-white py-4">
        <div className="container">
          <div className="small text-uppercase fw-semibold mb-1" style={{ color: "var(--clarridge-gold)", letterSpacing: "1px" }}>
            Apply
          </div>
          <h1 className="fw-normal mb-0" style={{ fontSize: "1.5rem" }}>
            Application Flow — Step {currentStep + 1} of {STEPS.length}
          </h1>
        </div>
      </div>

      <div className="container py-5" style={{ maxWidth: "700px" }}>
        <div className="d-flex justify-content-between mb-5">
          {STEPS.map((label, idx) => (
            <div key={label} className="text-center flex-fill">
              <div
                className="mx-auto mb-2 d-flex align-items-center justify-content-center rounded-circle fw-bold"
                style={{
                  width: "36px",
                  height: "36px",
                  backgroundColor: idx <= currentStep ? "var(--clarridge-navy)" : "#e5e7eb",
                  color: idx <= currentStep ? "#fff" : "#6c757d",
                }}
              >
                {idx + 1}
              </div>
              <div className={`small ${idx === currentStep ? "text-navy fw-semibold" : "text-muted"}`}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {currentStep === 0 && (
          <div>
            <h4 className="text-navy fw-normal mb-4">Personal Information</h4>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="fw-semibold small mb-1 d-block">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="fw-semibold small mb-1 d-block">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="fw-semibold small mb-1 d-block">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your phone number"
                  value={form.phone_number}
                  onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="fw-semibold small mb-1 d-block">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.date_of_birth}
                  onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                />
              </div>
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="fw-semibold small mb-1 d-block">University</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your university"
                  value={form.university}
                  onChange={(e) => setForm({ ...form, university: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="fw-semibold small mb-1 d-block">Level</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 300 Level"
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <label className="fw-semibold small mb-1 d-block">Course of Study</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Law"
                  value={form.course_of_study}
                  onChange={(e) => setForm({ ...form, course_of_study: e.target.value })}
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="fw-semibold small mb-1 d-block">Statement of Purpose</label>
              <textarea
                className="form-control"
                rows={5}
                placeholder="Tell us why you're applying and what you hope to gain..."
                value={form.statement_of_purpose}
                onChange={(e) => setForm({ ...form, statement_of_purpose: e.target.value })}
              />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <h4 className="text-navy fw-normal mb-4">Documents</h4>

            <label className="fw-semibold small mb-1 d-block">Upload Passport Photograph</label>
            <div
              className="border rounded p-4 text-center mb-4"
              style={{ borderStyle: "dashed", backgroundColor: "#f8f9fb", cursor: "pointer" }}
              onClick={() => document.getElementById("passport-input").click()}
            >
              <div style={{ fontSize: "1.5rem" }}>↑</div>
              <p className="mb-1 fw-semibold">Click to upload or drag and drop</p>
              <p className="small text-muted mb-0">JPG, PNG up to 5MB</p>
              {passportPhoto && <p className="small text-success mt-2 mb-0">{passportPhoto.name} selected</p>}
              <input
                id="passport-input"
                type="file"
                accept="image/jpeg,image/png"
                className="d-none"
                onChange={(e) => setPassportPhoto(e.target.files[0])}
              />
            </div>

            <label className="fw-semibold small mb-1 d-block">Upload CV / Transcript</label>
            <div
              className="border rounded p-3 d-flex justify-content-between align-items-center"
              style={{ backgroundColor: "#f8f9fb", cursor: "pointer" }}
              onClick={() => document.getElementById("cv-input").click()}
            >
              <span className="small">
                {cvTranscript ? cvTranscript.name : "Click to upload PDF"}
              </span>
              {cvTranscript && <span className="small text-success fw-semibold">Uploaded ✓</span>}
              <input
                id="cv-input"
                type="file"
                accept="application/pdf"
                className="d-none"
                onChange={(e) => setCvTranscript(e.target.files[0])}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h4 className="text-navy fw-normal mb-4">Review Your Application</h4>
            <dl className="small">
              <dt className="text-muted">Full Name</dt>
              <dd className="fw-semibold">{form.full_name}</dd>
              <dt className="text-muted">Email</dt>
              <dd>{form.email}</dd>
              <dt className="text-muted">Phone</dt>
              <dd>{form.phone_number}</dd>
              <dt className="text-muted">Date of Birth</dt>
              <dd>{form.date_of_birth}</dd>
              <dt className="text-muted">University</dt>
              <dd>{form.university}</dd>
              <dt className="text-muted">Level</dt>
              <dd>{form.level}</dd>
              <dt className="text-muted">Course of Study</dt>
              <dd>{form.course_of_study}</dd>
              <dt className="text-muted">Statement of Purpose</dt>
              <dd style={{ whiteSpace: "pre-wrap" }}>{form.statement_of_purpose}</dd>
              <dt className="text-muted">Passport Photo</dt>
              <dd>{passportPhoto?.name}</dd>
              <dt className="text-muted">CV / Transcript</dt>
              <dd>{cvTranscript?.name}</dd>
            </dl>
          </div>
        )}

        <div className="d-flex gap-2 mt-5">
          {currentStep > 0 && (
            <button type="button" className="btn btn-outline-secondary px-4" onClick={handleBack} disabled={submitting}>
              Back
            </button>
          )}
          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              className="btn fw-bold px-4"
              style={{ backgroundColor: "var(--clarridge-gold)", borderColor: "var(--clarridge-gold)", color: "#fff" }}
              onClick={handleNext}
            >
              Save &amp; Continue
            </button>
          ) : (
            <button
              type="button"
              className="btn fw-bold px-4"
              style={{ backgroundColor: "var(--clarridge-gold)", borderColor: "var(--clarridge-gold)", color: "#fff" }}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Apply;