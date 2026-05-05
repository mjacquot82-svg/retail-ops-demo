import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getStoredProducts } from "../lib/productsStore";
import { createStoredQuickSale } from "../lib/salesStore";

const taxRate = 0.13;

function currency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function categoryOf(product) {
  return product.category || product.product_type || "General";
}

function priceOf(product) {
  const saved = Number(product.retail_price || product.price || product.unit_price || 0);
  if (saved > 0) return saved;
  const text = `${product.name || ""} ${categoryOf(product)}`.toLowerCase();
  if (text.includes("hoodie") || text.includes("sweater")) return 45;
  if (text.includes("hat") || text.includes("cap")) return 25;
  if (text.includes("shirt") || text.includes("tee")) return 20;
  return 10;
}

export default function QuickSale() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const completedSaleNumber = searchParams.get("completed");
  const [products] = useState(() => getStoredProducts().filter((product) => product.status !== "Inactive"));
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [notes, setNotes] = useState("");

  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map(categoryOf)))], [products]);
  const visibleProducts = activeCategory === "All" ? products : products.filter((product) => categoryOf(product) === activeCategory);
  const subtotal = cart.reduce((sum, item) => sum + item.line_total, 0);
  const taxTotal = subtotal * taxRate;
  const total = subtotal + taxTotal;

  function addProduct(product) {
    const unitPrice = priceOf(product);
    setCart((current) => {
      const existing = current.find((item) => item.product_id === product.id && item.unit_price === unitPrice);
      if (!existing) {
        return [
          ...current,
          {
            id: `cart-${Date.now()}-${product.id}`,
            product_id: product.id,
            name: product.name || "Product",
            color: product.colors?.[0] || "",
            size: product.sizes?.[0] || "",
            qty: 1,
            unit_price: unitPrice,
            line_total: unitPrice,
          },
        ];
      }
      return current.map((item) =>
        item.id === existing.id
          ? { ...item, qty: item.qty + 1, line_total: (item.qty + 1) * item.unit_price }
          : item
      );
    });
  }

  function changeQty(itemId, amount) {
    setCart((current) =>
      current
        .map((item) => {
          if (item.id !== itemId) return item;
          const qty = Math.max(0, item.qty + amount);
          return { ...item, qty, line_total: qty * item.unit_price };
        })
        .filter((item) => item.qty > 0)
    );
  }

  function completeSale() {
    if (!cart.length) return;
    const sale = createStoredQuickSale({
      customer_name: customerName.trim() || "Walk-in Customer",
      payment_method: paymentMethod,
      payment_status: paymentMethod === "Pay Later" ? "Unpaid" : "Paid",
      amount_paid: paymentMethod === "Pay Later" ? 0 : total,
      balance_due: paymentMethod === "Pay Later" ? total : 0,
      items: cart,
      subtotal,
      tax_rate: taxRate,
      tax_total: taxTotal,
      total,
      notes,
    });
    navigate(`/admin/sales/new?completed=${sale.sale_number}`);
  }

  if (completedSaleNumber) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ maxWidth: 640, margin: "48px auto", background: "white", borderRadius: 20, padding: 28, textAlign: "center" }}>
          <h1>Sale Completed</h1>
          <p>Sale #{completedSaleNumber} was saved.</p>
          <button onClick={() => navigate("/admin/sales/new")} style={{ padding: 14, borderRadius: 12, background: "#171717", color: "white", border: 0, fontWeight: 800 }}>Start Another Sale</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 18, background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <p style={{ margin: 0, color: "#64748b", fontWeight: 900, textTransform: "uppercase", fontSize: 12 }}>Counter Sale</p>
          <h1 style={{ margin: 0 }}>Tablet POS</h1>
        </div>
        <button onClick={() => navigate("/admin")} style={{ padding: "12px 16px", borderRadius: 12, border: "1px solid #cbd5e1", background: "white", fontWeight: 800 }}>Dashboard</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 360px", gap: 18 }}>
        <section style={{ background: "white", borderRadius: 20, padding: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 16 }}>
            {categories.map((category) => (
              <button key={category} onClick={() => setActiveCategory(category)} style={{ minHeight: 64, borderRadius: 16, border: activeCategory === category ? "2px solid #171717" : "1px solid #cbd5e1", background: activeCategory === category ? "#171717" : "white", color: activeCategory === category ? "white" : "#171717", fontWeight: 900 }}>
                {category}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: 12 }}>
            {visibleProducts.map((product) => (
              <button key={product.id} onClick={() => addProduct(product)} style={{ minHeight: 116, borderRadius: 18, border: "1px solid #e2e8f0", background: "white", padding: 16, textAlign: "left" }}>
                <strong style={{ display: "block", fontSize: 16 }}>{product.name}</strong>
                <span style={{ display: "block", color: "#64748b", margin: "8px 0" }}>{categoryOf(product)}</span>
                <span style={{ fontSize: 20, fontWeight: 900 }}>{currency(priceOf(product))}</span>
              </button>
            ))}
          </div>
        </section>

        <aside style={{ background: "white", borderRadius: 20, padding: 18, position: "sticky", top: 12 }}>
          <h2 style={{ marginTop: 0 }}>Cart</h2>
          <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Walk-in Customer" style={{ width: "100%", boxSizing: "border-box", padding: 12, borderRadius: 12, border: "1px solid #cbd5e1", marginBottom: 10 }} />
          <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #cbd5e1", marginBottom: 14 }}>
            <option>Cash</option>
            <option>Debit</option>
            <option>Credit</option>
            <option>E-transfer</option>
            <option>Pay Later</option>
          </select>

          <div style={{ display: "grid", gap: 10, maxHeight: "42vh", overflow: "auto" }}>
            {cart.length === 0 && <p style={{ color: "#64748b" }}>Tap a product to add it to the cart.</p>}
            {cart.map((item) => (
              <div key={item.id} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12 }}>
                <strong>{item.name}</strong>
                <p style={{ margin: "4px 0 10px", color: "#64748b" }}>{currency(item.unit_price)} each</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => changeQty(item.id, -1)} style={{ width: 38, height: 38, borderRadius: 12, border: "1px solid #cbd5e1", background: "white", fontWeight: 900 }}>-</button>
                    <strong>{item.qty}</strong>
                    <button onClick={() => changeQty(item.id, 1)} style={{ width: 38, height: 38, borderRadius: 12, border: "1px solid #cbd5e1", background: "white", fontWeight: 900 }}>+</button>
                  </div>
                  <strong>{currency(item.line_total)}</strong>
                </div>
              </div>
            ))}
          </div>

          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Optional note" style={{ width: "100%", boxSizing: "border-box", padding: 12, borderRadius: 12, border: "1px solid #cbd5e1", marginTop: 14, minHeight: 70 }} />
          <div style={{ borderTop: "1px solid #e2e8f0", marginTop: 14, paddingTop: 14, display: "grid", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Subtotal</span><strong>{currency(subtotal)}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Tax</span><strong>{currency(taxTotal)}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22 }}><span>Total</span><strong>{currency(total)}</strong></div>
          </div>
          <button disabled={!cart.length} onClick={completeSale} style={{ width: "100%", marginTop: 16, padding: 18, borderRadius: 16, border: 0, background: cart.length ? "#171717" : "#a8a29e", color: "white", fontWeight: 900 }}>Complete Sale</button>
        </aside>
      </div>
    </div>
  );
}
