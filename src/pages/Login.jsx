import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import validateLogin from "../hooks/useLoginValidation";
import { loginUser } from "../api/auth";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../api/constants";
import { parseJwt } from "../utils/jwt";

function Login() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [slowStart, setSlowStart] = useState(false);
  const [serverError, setServerError] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const slowTimerRef = useRef(null);

  const { values, errors, touched, handleChange, handleBlur, validateAll } =
    useForm({ email: "", password: "" }, validateLogin);

  useEffect(() => {
    return () => {
      if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (submitting) return;

    if (!validateAll()) return;

    document.activeElement?.blur();

    setSubmitting(true);
    setSlowStart(false);
    slowTimerRef.current = setTimeout(() => setSlowStart(true), 3000);

    try {
      const response = await loginUser({
        username: values.email,
        password: values.password,
      });

      const { access, refresh } = response.data;
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(ACCESS_TOKEN, access);
      storage.setItem(REFRESH_TOKEN, refresh);

      const payload = parseJwt(access);
      if (payload?.is_staff || payload?.is_superuser) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        const backendMessage = err.response.data?.detail;
        setServerError(backendMessage || "Incorrect email or password.");
      } else if (err.response?.data) {
        setServerError("Something went wrong. Please try again.");
      } else {
        setServerError("Unable to reach the server. Please check your connection.");
      }
    } finally {
      if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
      setSubmitting(false);
      setSlowStart(false);
    }
  };

  const buttonLabel = submitting
    ? slowStart
      ? "Waking up our servers, almost there..."
      : "Logging in..."
    : "Log In";

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-white py-5 px-3">
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <div className="text-center mb-4">
          <h2 className="text-navy fw-bold">Welcome back</h2>
          <p className="text-muted">Log in to your account</p>
        </div>

        {serverError && (
          <div className="alert alert-danger py-2 small">{serverError}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
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

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={submitting}
              />
              <label className="form-check-label small text-muted" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <span
              role="button"
              className="small text-navy fw-semibold"
              onClick={() => !submitting && navigate("/forgot-password")}
            >
              Forgot password?
            </span>
          </div>

          <button type="submit" className="btn btn-navy w-100 py-2" disabled={submitting}>
            {buttonLabel}
          </button>
        </form>

        <p className="text-center text-muted mt-4 small">
          Don't have an account?{" "}
          <span
            role="button"
            className="text-navy fw-semibold"
            onClick={() => !submitting && navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;