import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useForm from "../hooks/useForm";
import validateOtp from "../hooks/useOtpValidation";
import { verifyEmail } from "../api/auth";

function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const { values, errors, touched, handleChange, handleBlur, validateAll, setErrors } =
    useForm({ otp: "" }, validateOtp);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (submitting) return;

    if (!email) {
      setServerError("Missing email. Please register again.");
      return;
    }

    if (!validateAll()) return;

    document.activeElement?.blur();

    setSubmitting(true);
    try {
      await verifyEmail({ email, otp: values.otp });
      navigate("/verified");
    } catch (err) {
      if (err.response?.data) {
        const backendErrors = {};
        Object.entries(err.response.data).forEach(([field, messages]) => {
          backendErrors[field] = Array.isArray(messages) ? messages[0] : messages;
        });
        setErrors((prev) => ({ ...prev, ...backendErrors }));

        if (!("otp" in backendErrors) && !("email" in backendErrors)) {
          setServerError("Something went wrong. Please try again.");
        }
      } else {
        setServerError("Unable to reach the server. Please check your connection.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-white py-5 px-3">
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm mb-4 d-inline-flex align-items-center gap-1"
          onClick={() => navigate(-1)}
          style={{ minHeight: "38px", paddingLeft: "1rem", paddingRight: "1rem" }}
          disabled={submitting}
        >
          ← Back
        </button>

        <div className="text-center mb-4">
          <h2 className="text-navy fw-bold">Verify your email</h2>
          <p className="text-muted">
            We sent a 6-digit code to <strong>{email || "your email"}</strong>
          </p>
        </div>

        {serverError && (
          <div className="alert alert-danger py-2 small">{serverError}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-floating mb-4">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              name="otp"
              id="otp"
              className={`form-control text-center ${
                touched.otp && errors.otp ? "is-invalid" : ""
              }`}
              placeholder="Enter code"
              value={values.otp}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 6);
                handleChange({ target: { name: "otp", value: digitsOnly } });
              }}
              onBlur={handleBlur}
              style={{ letterSpacing: "0.5em", fontSize: "1.25rem" }}
              disabled={submitting}
            />
            <label htmlFor="otp">6-Digit Code</label>
            {touched.otp && errors.otp && (
              <div className="invalid-feedback">{errors.otp}</div>
            )}
          </div>

          <button type="submit" className="btn btn-navy w-100 py-2" disabled={submitting}>
            {submitting ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <p className="text-center text-muted mt-4 small">
          Code expires in 3 minutes. Didn't get it? Check your spam folder or{" "}
          <span
            role="button"
            className="text-navy fw-semibold"
            onClick={() => !submitting && navigate("/signup")}
          >
            register again
          </span>
          .
        </p>
      </div>
    </div>
  );
}

export default VerifyEmail;