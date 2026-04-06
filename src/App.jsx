import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://lybzhjohcagptmdxijhi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5Ynpoam9oY2FncHRtZHhpamhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODYzMjcsImV4cCI6MjA5MDk2MjMyN30.RW_ql1fhJP8_Wt6DQcXW3a0vks4lUcV1WBC88zw3kZg"
);

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

const CATEGORY_COLORS = {
  gardening: { bg: "#d4edd4", accent: "#2a7a2a", text: "#1a4d1a" },
  plumbing:  { bg: "#d0e8f5", accent: "#1a6fa0", text: "#0d3d5c" },
  electrical:{ bg: "#fff3cc", accent: "#c47a00", text: "#6b4200" },
  cleaning:  { bg: "#ede0f5", accent: "#7a3aad", text: "#3d1a5c" },
  handyman:  { bg: "#fde8d8", accent: "#c45c20", text: "#6b2a00" },
  painting:  { bg: "#fce8e8", accent: "#c42a2a", text: "#6b0d0d" },
  other:     { bg: "#e8e8e8", accent: "#555555", text: "#222222" },
};

const EMPTY_FORM = {
  name: "", trade: "", category: "gardening",
  phone: "", email: "", recommended_by: "", note: "", rating: 5,
};

// ── helpers ──────────────────────────────────────────────────────────────────

const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 8,
  border: "1.5px solid #e0e0d8", fontSize: 14, fontFamily: "inherit",
  background: "#fafaf8", color: "#1a1a1a", outline: "none", boxSizing: "border-box",
};

const btn = (extra = {}) => ({
  border: "none", borderRadius: 8, padding: "10px 20px",
  fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: "0.02em",
  ...extra,
});

const StarRating = ({ value, onChange }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1,2,3,4,5].map(s => (
      <span key={s} onClick={() => onChange && onChange(s)}
        style={{ cursor: onChange ? "pointer" : "default", fontSize: 18,
          color: s <= value ? "#c47a00" : "#ccc", lineHeight: 1 }}>★</span>
    ))}
  </div>
);

// ── Auth screen ───────────────────────────────────────────────────────────────

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handle = async () => {
    setError(""); setLoading(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } },
      });
      if (error) setError(error.message);
      else setDone(true);
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else onAuth(data.user);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5ef", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ marginBottom: 32, textAlign: "center" }}>
        <img src="/loopin.logo.png" alt="LoopIn" style={{ height: 80, width: "auto" }} />
        <div style={{ fontSize: 11, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 10 }}>Your trusted loop of recommendations</div>
      </div>

      {done ? (
        <div style={{ background: "#fff", borderRadius: 14, padding: 32, maxWidth: 360, textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📬</div>
          <div style={{ fontFamily: "'Georgia', serif", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Check your email</div>
          <div style={{ fontSize: 14, color: "#666" }}>We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account then come back to log in.</div>
          <button onClick={() => { setMode("login"); setDone(false); }} style={btn({ background: "#1a1a14", color: "#e8c96a", marginTop: 20 })}>Back to login</button>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 14, padding: 32, width: "100%", maxWidth: 360, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {["login","signup"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={btn({
                flex: 1, background: mode === m ? "#1a1a14" : "#f0f0ea",
                color: mode === m ? "#e8c96a" : "#666",
              })}>{m === "login" ? "Log in" : "Sign up"}</button>
            ))}
          </div>

          {mode === "signup" && (
            <input style={{ ...inputStyle, marginBottom: 10 }} placeholder="Your name"
              value={name} onChange={e => setName(e.target.value)} />
          )}
          <input style={{ ...inputStyle, marginBottom: 10 }} placeholder="Email"
            type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <input style={{ ...inputStyle, marginBottom: 16 }} placeholder="Password"
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handle()} />

          {error && <div style={{ color: "#c42a2a", fontSize: 13, marginBottom: 12 }}>{error}</div>}

          <button onClick={handle} disabled={loading} style={btn({
            width: "100%", background: "#1a1a14", color: "#e8c96a",
            opacity: loading ? 0.6 : 1,
          })}>{loading ? "..." : mode === "login" ? "Log in" : "Create account"}</button>
        </div>
      )}
    </div>
  );
}

// ── Referral card ─────────────────────────────────────────────────────────────

function Card({ rec, onDelete, isOwn }) {
  const cat = CATEGORY_COLORS[rec.category] || CATEGORY_COLORS.other;
  const catInfo = CATEGORIES.find(c => c.id === rec.category) || CATEGORIES[7];
  return (
    <div style={{ background: "#fff", border: "1.5px solid #e8e8e0", borderRadius: 14,
      padding: "22px 24px", display: "flex", flexDirection: "column", gap: 12,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ background: cat.bg, color: cat.text, fontSize: 11, fontWeight: 700,
          letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px",
          borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 5 }}>
          {catInfo.icon} {catInfo.label}
        </span>
        {isOwn && (
          <button onClick={() => onDelete(rec.id)} style={{ background: "none", border: "none",
            cursor: "pointer", color: "#bbb", fontSize: 16, padding: 0, lineHeight: 1 }}>×</button>
        )}
      </div>
      <div>
        <div style={{ fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>{rec.name}</div>
        <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{rec.trade}</div>
      </div>
      <StarRating value={rec.rating} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {rec.phone && <a href={`tel:${rec.phone}`} style={{ fontSize: 14, color: cat.accent, textDecoration: "none", fontWeight: 600 }}>{rec.phone}</a>}
        {rec.email && <a href={`mailto:${rec.email}`} style={{ fontSize: 13, color: "#666", textDecoration: "none" }}>{rec.email}</a>}
      </div>
      {rec.note && (
        <div style={{ fontSize: 13, color: "#555", fontStyle: "italic", lineHeight: 1.5,
          borderLeft: `3px solid ${cat.bg}`, paddingLeft: 10 }}>"{rec.note}"</div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 6, paddingTop: 8,
        borderTop: "1px solid #f0f0ea", fontSize: 12, color: "#999" }}>
        <span style={{ fontSize: 14 }}>👤</span>
        <span>Recommended by <strong style={{ color: "#555" }}>{rec.recommended_by}</strong></span>
        {!isOwn && rec.profiles?.full_name && (
          <span style={{ marginLeft: "auto", fontSize: 11, background: "#f0f0ea", padding: "2px 8px", borderRadius: 10 }}>
            via {rec.profiles.full_name}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Friends panel ─────────────────────────────────────────────────────────────

function FriendsPanel({ user, onClose }) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [invites, setInvites] = useState([]);
  const [friends, setFriends] = useState([]);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadFriends();
    loadInvites();
  }, []);

  const loadInvites = async () => {
    const { data } = await supabase.from("invites").select("*").order("created_at", { ascending: false });
    setInvites(data || []);
  };

  const loadFriends = async () => {
    const { data } = await supabase.from("friendships")
      .select("*, friend:friend_id(id, email, raw_user_meta_data)")
      .eq("user_id", user.id).eq("status", "accepted");
    setFriends(data || []);
  };

  const sendInvite = async () => {
    if (!inviteEmail.trim()) return;
    setSending(true); setMsg("");
    const token = Math.random().toString(36).slice(2);
    const { error } = await supabase.from("invites").insert({
      invited_by: user.id, email: inviteEmail.trim(), token,
    });
    if (error) setMsg("Something went wrong.");
    else {
      setMsg(`Invite recorded for ${inviteEmail}! Share this link with them:`);
      setInviteEmail("");
      loadInvites();
    }
    setSending(false);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100,
      display: "flex", alignItems: "flex-end", justifyContent: "center" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "#fff", borderRadius: "20px 20px 0 0", padding: 32,
        width: "100%", maxWidth: 560, maxHeight: "80vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 700 }}>Your Circle</div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#aaa" }}>×</button>
        </div>

        {/* Invite section */}
        <div style={{ background: "#f5f5ef", borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Invite someone to your circle</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ ...inputStyle, flex: 1 }} placeholder="Their email address"
              value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendInvite()} />
            <button onClick={sendInvite} disabled={sending} style={btn({ background: "#1a1a14", color: "#e8c96a", whiteSpace: "nowrap" })}>
              {sending ? "..." : "Send invite"}
            </button>
          </div>
          {msg && (
            <div style={{ marginTop: 12, fontSize: 13, color: "#555" }}>
              {msg}
              {msg.includes("Share") && (
                <div style={{ marginTop: 6, background: "#fff", padding: "8px 12px", borderRadius: 8,
                  fontSize: 12, wordBreak: "break-all", border: "1px solid #e0e0d8" }}>
                  {window.location.origin}/?invite={invites[0]?.token}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Pending invites */}
        {invites.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#888", letterSpacing: "0.06em",
              textTransform: "uppercase", marginBottom: 12 }}>Pending invites</div>
            {invites.map(inv => (
              <div key={inv.id} style={{ display: "flex", justifyContent: "space-between",
                alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f0f0ea",
                fontSize: 14 }}>
                <span>{inv.email}</span>
                <span style={{ fontSize: 12, background: inv.accepted ? "#d4edd4" : "#f0f0ea",
                  color: inv.accepted ? "#2a7a2a" : "#888", padding: "2px 10px", borderRadius: 10 }}>
                  {inv.accepted ? "Joined ✓" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Friends list */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#888", letterSpacing: "0.06em",
            textTransform: "uppercase", marginBottom: 12 }}>Friends ({friends.length})</div>
          {friends.length === 0 ? (
            <div style={{ color: "#aaa", fontSize: 14 }}>No friends connected yet — send an invite above!</div>
          ) : friends.map(f => (
            <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 12,
              padding: "10px 0", borderBottom: "1px solid #f0f0ea" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1a1a14",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#e8c96a", fontSize: 14, fontWeight: 700 }}>
                {(f.friend?.raw_user_meta_data?.full_name || f.friend?.email || "?")[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{f.friend?.raw_user_meta_data?.full_name || "—"}</div>
                <div style={{ fontSize: 12, color: "#aaa" }}>{f.friend?.email}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main app ──────────────────────────────────────────────────────────────────

export default function TrustedCircle() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [referrals, setReferrals] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showFriends, setShowFriends] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("mine"); // mine | circle

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load referrals when user changes
  useEffect(() => {
    if (user) loadReferrals();
  }, [user, tab]);

  const loadReferrals = async () => {
    if (tab === "mine") {
      const { data } = await supabase.from("referrals").select("*")
        .eq("user_id", user.id).order("created_at", { ascending: false });
      setReferrals(data || []);
    } else {
      // Friends' referrals
      const { data: friendships } = await supabase.from("friendships")
        .select("friend_id").eq("user_id", user.id).eq("status", "accepted");
      const friendIds = (friendships || []).map(f => f.friend_id);
      if (friendIds.length === 0) { setReferrals([]); return; }
      const { data } = await supabase.from("referrals").select("*")
        .in("user_id", friendIds).order("created_at", { ascending: false });
      setReferrals(data || []);
    }
  };

  const handleAdd = async () => {
    if (!form.name.trim() || !form.trade.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("referrals").insert({ ...form, user_id: user.id });
    if (!error) { setForm(EMPTY_FORM); setShowForm(false); loadReferrals(); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    await supabase.from("referrals").delete().eq("id", id);
    setReferrals(prev => prev.filter(r => r.id !== id));
  };

  const filtered = referrals.filter(r => {
    const matchCat = activeCategory === "all" || r.category === activeCategory;
    const q = search.toLowerCase();
    return matchCat && (!q || r.name.toLowerCase().includes(q) ||
      r.trade.toLowerCase().includes(q) || (r.recommended_by || "").toLowerCase().includes(q));
  });

  const countByCategory = id => id === "all" ? referrals.length : referrals.filter(r => r.category === id).length;

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#f5f5ef", display: "flex",
      alignItems: "center", justifyContent: "center", color: "#aaa", fontFamily: "'Georgia', serif", fontSize: 18 }}>
      Loading…
    </div>
  );

  if (!user) return <AuthScreen onAuth={setUser} />;

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5ef", fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#1a1a14", padding: "20px 32px", display: "flex",
        alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img src="/loopin.logo.png" alt="LoopIn" style={{ height: 44, width: "auto" }} />
          <div style={{ fontSize: 11, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {user.user_metadata?.full_name || user.email}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setShowFriends(true)} style={btn({ background: "#2a2a20", color: "#aaa" })}>
            👥 My Loop
          </button>
          <button onClick={() => setShowForm(!showForm)} style={btn({ background: showForm ? "#333" : "#e8c96a", color: showForm ? "#aaa" : "#1a1a00" })}>
            {showForm ? "Cancel" : "+ Add Referral"}
          </button>
          <button onClick={() => supabase.auth.signOut()} style={btn({ background: "#2a2a20", color: "#888" })}>
            Sign out
          </button>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ background: "#fff", borderBottom: "1.5px solid #e8e8e0", padding: "24px 32px" }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{ fontFamily: "'Georgia', serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Share a referral</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <input style={inputStyle} placeholder="Name or business *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input style={inputStyle} placeholder="Trade (e.g. Gardener) *" value={form.trade} onChange={e => setForm({ ...form, trade: e.target.value })} />
              <input style={inputStyle} placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <input style={inputStyle} placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <input style={inputStyle} placeholder="Recommended by (e.g. Mum)" value={form.recommended_by} onChange={e => setForm({ ...form, recommended_by: e.target.value })} />
              <select style={{ ...inputStyle, appearance: "none" }} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.filter(c => c.id !== "all").map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
            <textarea style={{ ...inputStyle, marginTop: 12, minHeight: 72, resize: "vertical" }}
              placeholder="Notes — what made them stand out?" value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })} />
            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 13, color: "#888" }}>Rating:</span>
              <StarRating value={form.rating} onChange={v => setForm({ ...form, rating: v })} />
            </div>
            <button onClick={handleAdd} disabled={saving} style={btn({ marginTop: 16, background: "#1a1a14", color: "#e8c96a", opacity: saving ? 0.6 : 1 })}>
              {saving ? "Saving…" : "Save Referral"}
            </button>
          </div>
        </div>
      )}

      {/* Body */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[["mine","My Referrals"],["circle","My Loop's Referrals"]].map(([t,label]) => (
            <button key={t} onClick={() => setTab(t)} style={btn({
              background: tab === t ? "#1a1a14" : "#fff",
              color: tab === t ? "#e8c96a" : "#555",
              border: tab === t ? "1.5px solid #1a1a14" : "1.5px solid #e0e0d8",
            })}>{label}</button>
          ))}
        </div>

        {/* Search */}
        <input style={{ ...inputStyle, background: "#fff", marginBottom: 20, maxWidth: 380, display: "block", paddingLeft: 16 }}
          placeholder="🔍  Search by name, trade, or who referred..."
          value={search} onChange={e => setSearch(e.target.value)} />

        {/* Category tabs */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {CATEGORIES.map(cat => {
            const count = countByCategory(cat.id);
            const active = activeCategory === cat.id;
            return (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
                background: active ? "#1a1a14" : "#fff", color: active ? "#e8c96a" : "#555",
                border: active ? "1.5px solid #1a1a14" : "1.5px solid #e0e0d8",
                borderRadius: 20, padding: "6px 14px", fontSize: 13,
                fontWeight: active ? 700 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              }}>
                {cat.icon} {cat.label}
                <span style={{ background: active ? "#333" : "#f0f0ea", color: active ? "#aaa" : "#999",
                  borderRadius: 10, padding: "0 6px", fontSize: 11, fontWeight: 700 }}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#aaa", fontFamily: "'Georgia', serif", fontSize: 16 }}>
            {tab === "circle" ? "No referrals from your loop yet — invite some friends!" : search ? `No results for "${search}"` : "No referrals yet. Add the first one!"}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 18 }}>
            {filtered.map(rec => (
              <Card key={rec.id} rec={rec} onDelete={handleDelete} isOwn={tab === "mine"} />
            ))}
          </div>
        )}
      </div>

      {showFriends && <FriendsPanel user={user} onClose={() => setShowFriends(false)} />}
    </div>
  );
}
