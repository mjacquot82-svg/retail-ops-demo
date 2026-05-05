import { Link } from "react-router-dom";

function Card({ title, text, to, primary }) {
  const Wrapper = to ? Link : "div";
  return (
    <Wrapper
      to={to}
      style={{
        display: "block",
        textDecoration: "none",
        background: primary ? "#171717" : "#ffffff",
        color: primary ? "#ffffff" : "#171717",
        border: "1px solid #e2e8f0",
        borderRadius: "22px",
        padding: "24px",
        minHeight: "130px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
    >
      <h2 style={{ margin: "0 0 8px", fontSize: "24px" }}>{title}</h2>
      <p style={{ margin: 0, color: primary ? "#e7e5e4" : "#64748b", lineHeight: 1.5 }}>{text}</p>
    </Wrapper>
  );
}

export default function Home() {
  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 18px" }}>
      <section style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "26px", padding: "30px", marginBottom: "22px" }}>
        <p style={{ margin: "0 0 8px", color: "#64748b", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "12px" }}>
          Retail Operations Demo
        </p>
        <h1 style={{ margin: "0 0 12px", fontSize: "38px", lineHeight: 1.1 }}>A simple front-counter system for local stores.</h1>
        <p style={{ margin: "0 0 22px", color: "#475569", fontSize: "18px", maxWidth: "760px", lineHeight: 1.5 }}>
          Manage counter sales, products, customers, invoices, and sales history from one clean workspace.
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link to="/admin" style={{ background: "#171717", color: "#ffffff", textDecoration: "none", padding: "14px 18px", borderRadius: "14px", fontWeight: 900 }}>
            Staff Workspace
          </Link>
          <Link to="/admin/sales/new" style={{ background: "#ffffff", color: "#171717", textDecoration: "none", padding: "14px 18px", borderRadius: "14px", fontWeight: 900, border: "1px solid #cbd5e1" }}>
            Open Counter Sale
          </Link>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "22px" }}>
        <Card to="/admin/sales/new" primary title="Counter Sale" text="Tablet-friendly checkout with large buttons and a live cart." />
        <Card to="/admin/products" title="Products / Inventory" text="Keep a clean product catalog for staff to sell from." />
        <Card to="/admin/customers" title="Customers" text="Save customer records for repeat buyers and invoices." />
        <Card to="/admin/sales" title="Sales History" text="Review completed sales and payment activity." />
      </section>

      <section style={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "22px", padding: "22px" }}>
        <h2 style={{ marginTop: 0 }}>Built for small local stores</h2>
        <p style={{ color: "#64748b", lineHeight: 1.6 }}>
          This demo is focused on fast in-store use: tap products, build a cart, choose payment method, and complete the sale.
        </p>
      </section>
    </main>
  );
}
