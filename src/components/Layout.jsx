import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getActiveStaffUser, setActiveStaffUser } from "../lib/staffUsersStore";

const APP_NAME = "Retail Ops";
const STAFF_TAGLINE = "Manage counter sales, products, customers, invoices, and sales history";

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" style={{ width: "18px", height: "18px", fill: "currentColor" }}>
      <path d="M13.5 22v-8.2h2.8l.4-3.2h-3.2V8.56c0-.93.26-1.56 1.6-1.56H16.8V4.14c-.3-.04-1.34-.14-2.56-.14-2.54 0-4.28 1.55-4.28 4.28v2.2H7.08v3.2h2.88V22h3.54Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" style={{ width: "18px", height: "18px", fill: "none", stroke: "currentColor", strokeWidth: 1.8 }}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function getAdminSections(role) {
  const isOwner = role === "Owner";
  return [
    {
      title: "Counter",
      links: [
        { to: "/admin/sales/new", label: "Counter Sale" },
        { to: "/admin/sales", label: "Sales History" },
      ],
    },
    {
      title: "Records",
      links: [
        ...(isOwner ? [{ to: "/admin/products", label: "Products / Inventory" }] : []),
        { to: "/admin/customers", label: "Customers" },
        ...(isOwner ? [{ to: "/admin/staff-users", label: "Staff Users" }] : []),
      ],
    },
  ];
}

function getActiveSidebarLink(pathname) {
  if (pathname === "/admin") return "/admin";
  if (pathname === "/admin/sales/new") return "/admin/sales/new";
  if (pathname === "/admin/sales") return "/admin/sales";
  if (pathname.startsWith("/admin/customers")) return "/admin/customers";
  if (pathname.startsWith("/admin/products")) return "/admin/products";
  if (pathname.startsWith("/admin/staff-users")) return "/admin/staff-users";
  return "";
}

function WorkspaceBadge({ isAdmin }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", borderRadius: "999px", padding: "7px 11px", background: isAdmin ? "#171717" : "#f8fafc", color: isAdmin ? "#ffffff" : "#292524", border: isAdmin ? "1px solid #171717" : "1px solid #d6d3d1", fontSize: "12px", fontWeight: 800, textTransform: "uppercase" }}>
      <span style={{ width: "8px", height: "8px", borderRadius: "999px", background: isAdmin ? "#22c55e" : "#94a3b8" }} />
      {isAdmin ? "Staff Workspace" : "Customer Portal"}
    </span>
  );
}

function ActiveStaffBadge({ staffUser }) {
  if (!staffUser) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", borderRadius: "999px", padding: "7px 11px", background: "#ecfdf5", color: "#047857", border: "1px solid #a7f3d0", fontSize: "12px", fontWeight: 900 }}>
      Logged in as: {staffUser.name} ({staffUser.role})
    </span>
  );
}

function SwitchStaffButton({ isAdmin }) {
  const navigate = useNavigate();
  if (!isAdmin) return null;
  return (
    <button onClick={() => { setActiveStaffUser(null); navigate("/login"); }} style={{ border: "1px solid #d6d3d1", background: "#ffffff", borderRadius: "999px", padding: "8px 12px", fontSize: "12px", fontWeight: 900 }}>
      Switch Staff
    </button>
  );
}

function AdminSidebar({ pathname, staffUser }) {
  const activeLink = getActiveSidebarLink(pathname);
  const adminSections = getAdminSections(staffUser?.role || "Staff");

  return (
    <aside style={{ width: "245px", position: "sticky", top: "116px", background: "#ffffff", border: "1px solid #e7e5e4", borderRadius: "20px", padding: "16px" }}>
      <Link to="/admin" style={{ display: "block", borderRadius: "14px", padding: "12px", marginBottom: "12px", background: activeLink === "/admin" ? "#171717" : "#f8fafc", color: activeLink === "/admin" ? "#ffffff" : "#171717", fontWeight: 800 }}>
        Dashboard
      </Link>

      {adminSections.map((section) => (
        <div key={section.title} style={{ marginTop: "14px" }}>
          <p style={{ fontSize: "11px", fontWeight: 800 }}>{section.title}</p>
          {section.links.map((link) => (
            <Link key={link.to} to={link.to} style={{ display: "block", padding: "10px", marginTop: "6px", borderRadius: "12px" }}>
              {link.label}
            </Link>
          ))}
        </div>
      ))}

      <Link to="/" style={{ display: "block", marginTop: "18px" }}>
        Public Site
      </Link>
    </aside>
  );
}

export default function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const activeStaffUser = isAdmin ? getActiveStaffUser() : null;

  return (
    <div>
      <header style={{ padding: "12px 20px", borderBottom: "1px solid #e7e5e4" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "22px", fontWeight: 700 }}>{APP_NAME}</span>
          <WorkspaceBadge isAdmin={isAdmin} />
          {isAdmin && <ActiveStaffBadge staffUser={activeStaffUser} />}
          <SwitchStaffButton isAdmin={isAdmin} />
        </div>
      </header>

      {isAdmin ? (
        <div style={{ display: "flex" }}>
          <AdminSidebar pathname={location.pathname} staffUser={activeStaffUser} />
          <main style={{ flex: 1 }}>
            <Outlet />
          </main>
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
}
