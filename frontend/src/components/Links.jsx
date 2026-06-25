import { useState, useEffect } from "react";
import { linksApi } from "../api";

// Default links now live in the backend seed (resources/seed/links.json) and are
// loaded into the DB on first run.

const CATS = ["All", "Projects", "DSA", "Jobs", "Programs", "Other"];

export default function Links() {
  const [links, setLinks] = useState([]);
  const [error, setError] = useState("");
  const [cat, setCat] = useState("All");
  const [form, setForm] = useState({ title: "", url: "", category: "Jobs", notes: "" });
  const [search, setSearch] = useState("");

  // Load links from the backend on mount. Newest first.
  useEffect(() => {
    linksApi.list()
      .then((data) => setLinks([...data].reverse()))
      .catch(() => setError("Couldn't load links — is the backend running on :8080?"));
  }, []);

  const add = async () => {
    if (!form.title || !form.url) return alert("Title and URL required");
    let url = form.url;
    if (!url.startsWith("http")) url = "https://" + url;
    try {
      const saved = await linksApi.create({ ...form, url });
      setLinks((ls) => [saved, ...ls]);
      setForm({ title: "", url: "", category: "Jobs", notes: "" });
    } catch { setError("Save failed — link may not be persisted."); }
  };

  const del = async (id) => {
    if (!confirm("Remove link?")) return;
    setLinks((ls) => ls.filter((l) => l.id !== id));
    try { await linksApi.remove(id); }
    catch { setError("Delete failed."); }
  };

  const filtered = links.filter((l) => {
    if (cat !== "All" && l.category !== cat) return false;
    if (search && !l.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <h2>🔗 Links</h2>
        <p>{links.length} saved links</p>
      </div>

      {error && <div className="card mb-16" style={{ borderColor: "var(--red)", color: "var(--red)", fontSize: 13 }}>{error}</div>}

      {/* Add link */}
      <div className="card mb-16">
        <div className="section-label mb-16">Add Link</div>
        <div className="grid-2 gap-16">
          <input className="input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className="input" placeholder="https://..." value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
          <select className="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATS.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
          </select>
          <input className="input" placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </div>
        <button className="btn btn-primary mt-16" onClick={add}>Save Link</button>
      </div>

      {/* Filters */}
      <div className="flex gap-8 mb-16" style={{ flexWrap: "wrap", alignItems: "center" }}>
        <input className="input" style={{ width: 200 }} placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        {CATS.map((c) => (
          <button key={c} className={`btn btn-sm ${cat === c ? "btn-primary" : "btn-ghost"}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      {/* Link Grid */}
      <div className="grid-2 gap-16">
        {filtered.map((l) => (
          <div key={l.id} className="card-sm">
            <div className="flex-between mb-8">
              <span className="tag">{l.category}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => del(l.id)}>🗑️</button>
            </div>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
              <a href={l.url} target="_blank" rel="noreferrer" style={{ color: "var(--text)", textDecoration: "none" }}>{l.title}</a>
            </h4>
            <p style={{ fontSize: 11, color: "var(--accent)", marginBottom: l.notes ? 6 : 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.url}</p>
            {l.notes && <p style={{ fontSize: 11, color: "var(--muted)" }}>{l.notes}</p>}
            <a href={l.url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{ marginTop: 10 }}>Open →</a>
          </div>
        ))}
        {filtered.length === 0 && <p style={{ color: "var(--muted)", fontSize: 13 }}>No links found.</p>}
      </div>
    </div>
  );
}