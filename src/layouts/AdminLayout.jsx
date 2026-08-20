import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Programmes", path: "/admin/programmes" },
  { label: "Applications", path: "/admin/applications" },
  { label: "Opportunities", path: "/admin/opportunities" },
  { label: "Articles", path: "/admin/articles" },
  { label: "Collegium", path: "/admin/collegium" },
  { label: "Testimonials", path: "/admin/testimonials" },
  { label: "Donations", path: "/admin/donations" },
  { label: "Users", path: "/admin/users" },
  { label: "Settings", path: "/admin/settings" },
];

function SidebarNav({ onLinkClick }) {
  return (
    <nav className="d-flex flex-column gap-1">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/admin"}
          onClick={onLinkClick}
          className={({ isActive }) =>
            `nav-link-glass text-decoration-none px-3 py-2 rounded ${
              isActive ? "active text-white fw-semibold" : "text-white-50"
            }`
          }
          style={{ fontSize: "0.95rem" }}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

function AdminLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Desktop sidebar — visible lg and up */}
      <aside
        className="glass-sidebar d-none d-lg-flex flex-column p-4"
        style={{ width: "260px", flexShrink: 0, position: "sticky", top: 0, height: "100vh" }}
      >
        <div className="d-flex align-items-center gap-2 mb-5 text-white">
          <span style={{ fontSize: "1.25rem" }}>⛪</span>
          <span className="fw-bold">Clarridge</span>
        </div>
        <SidebarNav />
      </aside>

      {/* Mobile offcanvas sidebar — below lg */}
      <div
        className={`offcanvas offcanvas-start glass-sidebar ${mobileNavOpen ? "show" : ""}`}
        style={{ visibility: mobileNavOpen ? "visible" : "hidden", width: "260px" }}
        tabIndex="-1"
      >
        <div className="offcanvas-header">
          <div className="d-flex align-items-center gap-2 text-white">
            <span style={{ fontSize: "1.25rem" }}>⛪</span>
            <span className="fw-bold">Clarridge</span>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={() => setMobileNavOpen(false)}
          />
        </div>
        <div className="offcanvas-body">
          <SidebarNav onLinkClick={() => setMobileNavOpen(false)} />
        </div>
      </div>

      {/* Backdrop for mobile nav */}
      {mobileNavOpen && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <main className="flex-grow-1" style={{ backgroundColor: "#f4f5f7", minWidth: 0 }}>
        <header className="glass-header d-flex justify-content-between align-items-center px-4 py-3 text-white">
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="btn btn-link text-white p-0 d-lg-none"
              onClick={() => setMobileNavOpen(true)}
              style={{ fontSize: "1.5rem", lineHeight: 1 }}
            >
              ☰
            </button>
            <div>
              <div className="text-uppercase small" style={{ opacity: 0.7, letterSpacing: "1px" }}>
                Admin
              </div>
              <h5 className="mb-0 fw-normal">Admin — Dashboard Overview</h5>
            </div>
          </div>
          <p className="mb-0 small text-end d-none d-md-block" style={{ opacity: 0.8, maxWidth: "320px" }}>
            Operator-facing home: applications, donations, and content all
            summarized in one view.
          </p>
        </header>

        <div className="p-3 p-lg-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;