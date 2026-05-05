import { Link } from "react-router-dom";
import { getStoredQuickSales } from "../lib/salesStore";

function currency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function isToday(isoDate) {
  if (!isoDate) return false;
  const date = new Date(isoDate);
  const today = new Date();
  return date.toDateString() === today.toDateString();
}

function SnapshotCard({ title, value, helper, to }) {
  const Wrapper = to ? Link : "div";
  return (
    <Wrapper
      to={to}
      style={{
        display: "block",
        textDecoration: "none",
        background: "#ffffff",
        borderRadius: "18px",
        padding: "20px",
        border: "1px solid #e7e5e4",
      }}
    >
      <p style={{ margin: 0, fontWeight: 800, fontSize: "13px" }}>{title}</p>
      <h2 style={{ margin: "8px 0 4px", fontSize: "28px" }}>{value}</h2>
      {helper && <p style={{ margin: 0, color: "#64748b" }}>{helper}</p>}
    </Wrapper>
  );
}

function ActionCard({ to, title, description, primary }) {
  return (
    <Link
      to={to}
      style={{
        display: "block",
        textDecoration: "none",
        background: primary ? "#171717" : "#ffffff",
        color: primary ? "#ffffff" : "#171717",
        border: "1px solid #e2e8f0",
        borderRadius: "18px",
        padding: "20px",
      }}
    >
      <h3 style={{ margin: "0 0 8px" }}>{title}</h3>
      <p style={{ margin: 0 }}>{description}</p>
    </Link>
  );
}

export default function Dashboard() {
  const quickSales = getStoredQuickSales();

  const todaysSales = quickSales.filter((sale) => isToday(sale.created_at));
  const todaysSalesTotal = todaysSales.reduce((total, sale) => total + Number(sale.total || 0), 0);

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: "0 0 8px" }}>Retail Dashboard</h1>
        <p style={{ color: "#64748b" }}>
          Use this as the home screen for counter sales, customers, and products.
        </p>
      </div>

      <Link
        to="/admin/sales/new"
        style={{
          display: "block",
          textDecoration: "none",
          background: "#171717",
          color: "#ffffff",
          borderRadius: "20px",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ margin: "0 0 8px" }}>Start Counter Sale</h2>
        <p style={{ margin: 0 }}>
          Quickly create a sale for walk-in customers and stocked products.
        </p>
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginBottom: "24px" }}>
        <SnapshotCard
          title="Today’s Sales"
          value={currency(todaysSalesTotal)}
          helper={`${todaysSales.length} sale${todaysSales.length === 1 ? "" : "s"} today`}
          to="/admin/sales"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
        <ActionCard
          to="/admin/sales"
          title="Sales History"
          description="View past sales and transaction history."
        />
        <ActionCard
          to="/admin/customers"
          title="Customers"
          description="Manage customer records and repeat buyers."
        />
        <ActionCard
          to="/admin/products"
          title="Products / Inventory"
          description="Manage products and inventory for counter sales."
        />
      </div>
    </div>
  );
}
