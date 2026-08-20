import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import validateSignup from "../hooks/useSignupValidation";
import { registerUser } from "../api/auth";

function Signup() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const { values, errors, touched, handleChange, handleBlur, validateAll, setErrors } =
    useForm(
      {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
        phone_number: "",
        date_of_birth: "",
      },
      validateSignup
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (submitting) return; // hard guard against double-submission

    if (!validateAll()) return;

    document.activeElement?.blur();

    setSubmitting(true);
    try {
      await registerUser(values);
      navigate(`/verify-email?email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      if (err.response?.data) {
        const backendErrors = {};
        Object.entries(err.response.data).forEach(([field, messages]) => {
          backendErrors[field] = Array.isArray(messages) ? messages[0] : messages;
        });
        setErrors((prev) => ({ ...prev, ...backendErrors }));

        if (!Object.keys(backendErrors).some((f) => f in values)) {
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
        <div className="text-center mb-4">
          <h2 className="text-navy fw-bold">The Clarridge</h2>
          <p className="text-muted">Create your account</p>
        </div>

        {serverError && (
          <div className="alert alert-danger py-2 small">{serverError}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-floating mb-3">
            <input
              type="text"
              name="first_name"
              id="first_name"
              className={`form-control ${touched.first_name && errors.first_name ? "is-invalid" : ""}`}
              placeholder="First Name"
              value={values.first_name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={submitting}
            />
            <label htmlFor="first_name">First Name</label>
            {touched.first_name && errors.first_name && (
              <div className="invalid-feedback">{errors.first_name}</div>
            )}
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              name="last_name"
              id="last_name"
              className={`form-control ${touched.last_name && errors.last_name ? "is-invalid" : ""}`}
              placeholder="Last Name"
              value={values.last_name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={submitting}
            />
            <label htmlFor="last_name">Last Name</label>
            {touched.last_name && errors.last_name && (
              <div className="invalid-feedback">{errors.last_name}</div>
            )}
          </div>

          <div className="form-floating mb-3">
            <input
              type="email"
              name="email"
              id="email"
              className={`form-control ${touched.email && errors.email ? "is-invalid" : ""}`}
              placeholder="Email Address"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={submitting}
            />
            <label htmlFor="email">Email Address</label>
            {touched.email && errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              name="phone_number"
              id="phone_number"
              className={`form-control ${touched.phone_number && errors.phone_number ? "is-invalid" : ""}`}
              placeholder="Phone Number"
              value={values.phone_number}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={submitting}
            />
            <label htmlFor="phone_number">Phone Number</label>
            {touched.phone_number && errors.phone_number && (
              <div className="invalid-feedback">{errors.phone_number}</div>
            )}
          </div>

          <div className="form-floating mb-3">
            <input
              type="date"
              name="date_of_birth"
              id="date_of_birth"
              className={`form-control ${touched.date_of_birth && errors.date_of_birth ? "is-invalid" : ""}`}
              placeholder="Date of Birth"
              value={values.date_of_birth}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={submitting}
            />
            <label htmlFor="date_of_birth">Date of Birth</label>
            {touched.date_of_birth && errors.date_of_birth && (
              <div className="invalid-feedback">{errors.date_of_birth}</div>
            )}
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              name="password"
              id="password"
              className={`form-control ${touched.password && errors.password ? "is-invalid" : ""}`}
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={submitting}
            />
            <label htmlFor="password">Password</label>
            {touched.password && errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          <div className="form-floating mb-4">
            <input
              type="password"
              name="confirm_password"
              id="confirm_password"
              className={`form-control ${touched.confirm_password && errors.confirm_password ? "is-invalid" : ""}`}
              placeholder="Confirm Password"
              value={values.confirm_password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={submitting}
            />
            <label htmlFor="confirm_password">Confirm Password</label>
            {touched.confirm_password && errors.confirm_password && (
              <div className="invalid-feedback">{errors.confirm_password}</div>
            )}
          </div>

          <button type="submit" className="btn btn-navy w-100 py-2" disabled={submitting}>
            {submitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>


        <p className="text-center text-muted mt-4 small">
          Already have an account?{" "}
          <span
            role="button"
            className="text-navy fw-semibold"
            onClick={() => !submitting && navigate("/login")}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}

export default Signup;