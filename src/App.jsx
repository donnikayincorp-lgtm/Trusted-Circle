import { useState, useEffect } from "react";

const CATEGORIES = [
  { id: "all", label: "All", icon: "◈" },
  { id: "gardening", label: "Gardening", icon: "✿" },
  { id: "plumbing", label: "Plumbing", icon: "⌁" },
  { id: "electrical", label: "Electrical", icon: "⚡" },
  { id: "cleaning", label: "Cleaning", icon: "◎" },
  { id: "handyman", label: "Handyman", icon: "⚒" },
  { id: "painting", label: "Painting", icon: "▨" },
  { id: "other", label: "Other", icon: "⊕" },
];

const SAMPLE_DATA = [
  {
    id: 1,
    name: "Mike Rosario",
    trade: "Gardener",
    category: "gardening",
    phone: "(555) 204-8831",
    email: "mike.gardens@email.com",
    recommendedBy: "Sarah (your sister)",
    note: "Did our whole backyard overhaul. Reliable, fair price.",
    rating: 5,
    addedDate: "Feb 2025",
  },
  {
    id: 2,
    name: "Delta Plumbing Co.",
    trade: "Plumber",
    category: "plumbing",
    phone: "(555) 781-0042",
    email: "",
    recommendedBy: "Dad",
    note: "Fixed the leak fast. Call ahead — books out 2 weeks.",
    rating: 4,
    addedDate: "Jan 2025",
  },
  {
    id: 3,
    name: "Bright Electric",
    trade: "Electrician",
    category: "electrical",
    phone: "(555) 320-9910",
    email: "info@brightelectric.com",
    recommendedBy: "Tom & Lisa (neighbors)",
    note: "Installed new panel. Very professional.",
    rating: 5,
    addedDate: "Mar 2025",
  },
];

const CATEGORY_COLORS = {
  gardening: { bg: "#d4edd4", accent: "#2a7a2a", text: "#1a4d1a" },
  plumbing: { bg: "#d0e8f5", accent: "#1a6fa0", text: "#0d3d5c" },
  electrical: { bg: "#fff3cc", accent: "#c47a00", text: "#6b4200" },
  cleaning: { bg: "#ede0f5", accent: "#7a3aad", text: "#3d1a5c" },
  handyman: { bg: "#fde8d8", accent: "#c45c20", text: "#6b2a00" },
  painting: { bg: "#fce8e8", accent: "#c42a2a", text: "#6b0d0d" },
  other: { bg: "#e8e8e8", accent: "#555555", text: "#222222" },
};

const StarRating = ({ value, onChange }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <span
        key={s}
        onClick={() => onChange && onChange(s)}
        style={{
          cursor: onChange ? "pointer" : "default",
          fontSize: 18,
          color: s <= value ? "#c47a00" : "#ccc",
          lineHeight: 1,
        }}
      >
        ★
      </span>
    ))}
  </div>
);

const Card = ({ rec, onDelete }) => {
  const cat = CATEGORY_COLORS[rec.category] || CATEGORY_COLORS.other;
  const catInfo = CATEGORIES.find((c) => c.id === rec.category) || CATEGORIES[7];

  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #e8e8e0",
        borderRadius: 14,
        padding: "22px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.2s",
        position: "relative",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.12)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)")}
    >
      {/* Category pill */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span
          style={{
            background: cat.bg,
            color: cat.text,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "4px 10px",
            borderRadius: 20,
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          {catInfo.icon} {catInfo.label}
        </span>
        <button
          onClick={() => onDelete(rec.id)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#bbb",
            fontSize: 16,
            padding: 0,
            lineHeight: 1,
          }}
          title="Remove"
        >
          ×
        </button>
      </div>

      {/* Name + trade */}
      <div>
        <div style={{ fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 700, color: "#1a1a1a", lineHeight: 1.2 }}>
          {rec.name}
        </div>
        <div style={{ fontSize: 13, color: "#888", marginTop: 2, letterSpacing: "0.03em" }}>{rec.trade}</div>
      </div>

      <StarRating value={rec.rating} />

      {/* Contact */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {rec.phone && (
          <a
            href={`tel:${rec.phone}`}
            style={{ fontSize: 14, color: cat.accent, textDecoration: "none", fontWeight: 600, letterSpacing: "0.02em" }}
          >
            {rec.phone}
          </a>
        )}
        {rec.email && (
          <a
            href={`mailto:${rec.email}`}
            style={{ fontSize: 13, color: "#666", textDecoration: "none" }}
          >
            {rec.email}
          </a>
        )}
      </div>

      {/* Note */}
      {rec.note && (
        <div
          style={{
            fontSize: 13,
            color: "#555",
            fontStyle: "italic",
            lineHeight: 1.5,
            borderLeft: `3px solid ${cat.bg}`,
            paddingLeft: 10,
          }}
        >
          "{rec.note}"
        </div>
      )}

      {/* Referred by */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          paddingTop: 8,
          borderTop: "1px solid #f0f0ea",
          fontSize: 12,
          color: "#999",
        }}
      >
        <span style={{ fontSize: 14 }}>👤</span>
        <span>
          Recommended by <strong style={{ color: "#555" }}>{rec.recommendedBy}</strong>
        </span>
        <span style={{ marginLeft: "auto" }}>{rec.addedDate}</span>
      </div>
    </div>
  );
};

const EMPTY_FORM = {
  name: "",
  trade: "",
  category: "gardening",
  phone: "",
  email: "",
  recommendedBy: "",
  note: "",
  rating: 5,
};

export default function TrustedCircle() {
  const [referrals, setReferrals] = useState(() => {
    try {
      const saved = localStorage.getItem("tc_referrals");
      return saved ? JSON.parse(saved) : SAMPLE_DATA;
    } catch {
      return SAMPLE_DATA;
    }
  });

  const [activeCategory, setActiveCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("tc_referrals", JSON.stringify(referrals));
    } catch {}
  }, [referrals]);

  const filtered = referrals.filter((r) => {
    const matchCat = activeCategory === "all" || r.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.trade.toLowerCase().includes(q) ||
      r.recommendedBy.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const handleAdd = () => {
    if (!form.name.trim() || !form.trade.trim()) return;
    const newRec = {
      ...form,
      id: Date.now(),
      addedDate: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };
    setReferrals((prev) => [newRec, ...prev]);
    setForm(EMPTY_FORM);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setReferrals((prev) => prev.filter((r) => r.id !== id));
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1.5px solid #e0e0d8",
    fontSize: 14,
    fontFamily: "inherit",
    background: "#fafaf8",
    color: "#1a1a1a",
    outline: "none",
    boxSizing: "border-box",
  };

  const countByCategory = (id) =>
    id === "all" ? referrals.length : referrals.filter((r) => r.category === id).length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5ef",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        color: "#1a1a1a",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#1a1a14",
          padding: "28px 32px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: 26,
              fontWeight: 700,
              color: "#f0ede6",
              letterSpacing: "-0.02em",
            }}
          >
            Trusted Circle
          </div>
          <div style={{ fontSize: 12, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>
            Private referrals from people you trust
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            background: showForm ? "#333" : "#e8c96a",
            color: showForm ? "#aaa" : "#1a1a00",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            letterSpacing: "0.02em",
            transition: "background 0.15s",
          }}
        >
          {showForm ? "Cancel" : "+ Add Referral"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div
          style={{
            background: "#fff",
            borderBottom: "1.5px solid #e8e8e0",
            padding: "24px 32px",
          }}
        >
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ fontFamily: "'Georgia', serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>
              Share a referral
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <input
                style={inputStyle}
                placeholder="Name or business *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                style={inputStyle}
                placeholder="Trade (e.g. Gardener) *"
                value={form.trade}
                onChange={(e) => setForm({ ...form, trade: e.target.value })}
              />
              <input
                style={inputStyle}
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <input
                style={inputStyle}
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                style={inputStyle}
                placeholder="Recommended by (e.g. Mum)"
                value={form.recommendedBy}
                onChange={(e) => setForm({ ...form, recommendedBy: e.target.value })}
              />
              <select
                style={{ ...inputStyle, appearance: "none" }}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.label}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              style={{ ...inputStyle, marginTop: 12, minHeight: 72, resize: "vertical" }}
              placeholder="Notes (optional) — what made them stand out?"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
            />
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 13, color: "#888" }}>Rating:</span>
              <StarRating value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
            </div>
            <button
              onClick={handleAdd}
              style={{
                marginTop: 16,
                background: "#1a1a14",
                color: "#e8c96a",
                border: "none",
                borderRadius: 8,
                padding: "11px 28px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.03em",
              }}
            >
              Save Referral
            </button>
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        {/* Search */}
        <input
          style={{
            ...inputStyle,
            background: "#fff",
            marginBottom: 20,
            maxWidth: 380,
            display: "block",
            paddingLeft: 16,
          }}
          placeholder="🔍  Search by name, trade, or who referred..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {CATEGORIES.map((cat) => {
            const count = countByCategory(cat.id);
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  background: active ? "#1a1a14" : "#fff",
                  color: active ? "#e8c96a" : "#555",
                  border: active ? "1.5px solid #1a1a14" : "1.5px solid #e0e0d8",
                  borderRadius: 20,
                  padding: "6px 14px",
                  fontSize: 13,
                  fontWeight: active ? 700 : 400,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.15s",
                }}
              >
                {cat.icon} {cat.label}
                <span
                  style={{
                    background: active ? "#333" : "#f0f0ea",
                    color: active ? "#aaa" : "#999",
                    borderRadius: 10,
                    padding: "0 6px",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#aaa",
              fontFamily: "'Georgia', serif",
              fontSize: 16,
            }}
          >
            {search ? `No results for "${search}"` : "No referrals in this category yet."}
            <div style={{ fontSize: 13, marginTop: 8, fontFamily: "inherit" }}>
              Add the first one with the button above.
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 18,
            }}
          >
            {filtered.map((rec) => (
              <Card key={rec.id} rec={rec} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
