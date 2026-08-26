import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { label: "About", type: "scroll", target: "about" },
  { label: "Programmes", type: "scroll", target: "programmes" },
  { label: "The Observatory", type: "scroll", target: "observatory" },
  { label: "Collegium", type: "scroll", target: "collegium" },
  { label: "Impact", type: "scroll", target: "impact" },
  { label: "Calendar", type: "page", path: "/calendar" },
  { label: "Articles", type: "page", path: "/articles" },
];

function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (link) => {
    setMobileOpen(false);

    if (link.type === "page") {
      navigate(link.path);
      return;
    }

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(link.target)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(link.target)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isActive = (link) => {
    if (link.type === "page") return location.pathname === link.path;
    return false; // scroll-based sections don't get a static active state without scroll-spy logic
  };

  return (
    <>
      <nav className="bg-white border-bottom sticky-top">
        <div className="container d-flex align-items-center justify-content-between py-3">
          <Link to="/" className="d-flex align-items-center gap-2 text-decoration-none">
            <span style={{ fontSize: "1.4rem" }}>⛪</span>
            <div>
              <div className="text-uppercase text-muted" style={{ fontSize: "0.65rem", letterSpacing: "1px" }}>
                THE
              </div>
              <div className="text-navy fw-bold" style={{ fontSize: "1.1rem", lineHeight: 1 }}>
                Clarridge
              </div>
            </div>
          </Link>

          <div className="d-none d-lg-flex align-items-center gap-4">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                type="button"
                className="btn btn-link text-decoration-none p-0 fw-semibold"
                style={{
                  fontSize: "0.95rem",
                  color: isActive(link) ? "var(--clarridge-navy)" : "#495057",
                }}
                onClick={() => handleNavClick(link)}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="d-none d-lg-flex align-items-center gap-2">
            <button type="button" className="btn btn-outline-secondary btn-sm px-3" onClick={() => navigate("/apply")}>
              Apply
            </button>
            <button type="button" className="btn btn-navy btn-sm px-3" onClick={() => navigate("/donate")}>
              Donate
            </button>
          </div>

          <button
            type="button"
            className="btn d-lg-none border rounded-pill px-3 py-2 d-flex align-items-center gap-2"
            onClick={() => setMobileOpen(true)}
          >
            <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>☰</span>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(6, 21, 48, 0.6)", zIndex: 1070 }}
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="position-absolute top-0 end-0 p-4"
            style={{ backgroundColor: "var(--clarridge-navy)", width: "85%", maxWidth: "340px", height: "100vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-end mb-4">
              <button type="button" className="btn-close btn-close-white" onClick={() => setMobileOpen(false)} />
            </div>
            <div className="d-flex flex-column">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  className="btn btn-link text-white fw-bold text-decoration-none py-3 border-bottom text-start"
                  style={{ borderColor: "rgba(255,255,255,0.15)", fontSize: "1.05rem" }}
                  onClick={() => handleNavClick(link)}
                >
                  {link.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn w-100 mt-4 py-2 fw-bold"
              style={{ backgroundColor: "var(--clarridge-gold)", borderColor: "var(--clarridge-gold)", color: "#fff" }}
              onClick={() => {
                setMobileOpen(false);
                navigate("/apply");
              }}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default PublicNavbar;