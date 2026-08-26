import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { isCurrentUserSuperuser } from "../utils/jwt";

const navItems = [
  { label: "Dashboard", path: "/admin" },
  { label: "Programmes", path: "/admin/programmes" },
  { label: "Applications", path: "/admin/applications" },
  { label: "Opportunities", path: "/admin/opportunities" },
  { label: "Articles", path: "/admin/articles" },
  { label: "Collegium", path: "/admin/collegium" },
  { label: "Testimonials", path: "/admin/testimonials" },
  { label: "Users", path: "/admin/users", superuserOnly: true },
    { label: "Observatory", path: "/admin/observatory" },
    { label: "Team Members", path: "/admin/team" },
{ label: "Impact", path: "/admin/impact" },
  { label: "Calendar", path: "/admin/calendar" },
  { label: "Settings", path: "/admin/settings" },

  
];

function SidebarNav({ onLinkClick }) {
  const isSuperuser = isCurrentUserSuperuser();
  const visibleNavItems = navItems.filter((item) => !item.superuserOnly || isSuperuser);

  return (
    <nav className="d-flex flex-column gap-1">
      {visibleNavItems.map((item) => (
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
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden" }}>
      <aside
        className="glass-sidebar d-none d-lg-flex flex-column p-4"
        style={{ width: "260px", flexShrink: 0, height: "100vh", overflowY: "auto" }}
      >
        <div className="d-flex align-items-center gap-2 mb-5 text-white">
          <span style={{ fontSize: "1.25rem" }}>⛪</span>
          <span className="fw-bold">Clarridge</span>
        </div>
        <SidebarNav />
      </aside>

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

      {mobileNavOpen && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        <header className="glass-header d-flex justify-content-between align-items-center px-4 py-3 text-white" style={{ flexShrink: 0 }}>
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

        </header>

        <div style={{ flex: 1, overflowY: "auto", backgroundColor: "#f4f5f7", padding: "1.5rem" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;