import { useState, useEffect } from "react";
import { companiesApi } from "../api";

function daysUntil(dateStr) {
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.ceil((new Date(dateStr) - today) / (1000*60*60*24));
}

const TIER_BADGE = {
  "Big Tech": "badge-bigtec",
  "Strong Tech": "badge-strong",
  "Fintech/Banks": "badge-fintech",
  "Quant/Trading": "badge-fintech",
  "NYC Startups": "badge-nyc",
  "Well-Funded Startups": "badge-well",
  "Great Targets": "badge-great",
};

const RESULTS = ["", "offer", "rejected", "withdrawn"];

function normCompany(s) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

export default function DuplicateReview() {
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    companiesApi.list()
      .then(setCompanies)
      .catch(() => setError("Couldn't load companies — is the backend running on :8080?"));
  }, []);

  const persist = async (updated) => {
    setCompanies((cs) => cs.map((c) => c.id === updated.id ? updated : c));
    try { await companiesApi.update(updated.id, updated); }
    catch { setError("Save failed — change may not be persisted."); }
  };

  const toggle = (id, field) => {
    const c = companies.find((x) => x.id === id);
    if (c) persist({ ...c, [field]: !c[field] });
  };

  const setResult = (id, val) => {
    const c = companies.find((x) => x.id === id);
    if (c) persist({ ...c, result: val });
  };

  const deleteCompany = async (id) => {
    if (!confirm("Delete this company row?")) return;
    setCompanies((cs) => cs.filter((c) => c.id !== id));
    try { await companiesApi.remove(id); }
    catch { setError("Delete failed."); }
  };

  // group by normalized company name, keep only groups with 2+ entries
  const groups = {};
  companies.forEach((c) => {
    const key = normCompany(c.company);
    (groups[key] = groups[key] || []).push(c);
  });

  const duplicateGroups = Object.values(groups)
    .filter((g) => g.length > 1)
    .filter((g) => !search || g[0].company.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.length - a.length || a[0].company.localeCompare(b[0].company));

  const rows = duplicateGroups.flat();
  const companyCount = duplicateGroups.length;

  return (
    <div>
      <div className="page-header flex-between">
        <div>
          <h2>🔁 Review Duplicates</h2>
          <p>{companyCount} companies with multiple entries · {rows.length} rows to review</p>
        </div>
      </div>

      <div className="card mb-16" style={{ fontSize: 13, color: "var(--muted)" }}>
        These are companies with more than one row in your tracker — some are genuinely different open roles (e.g. a company with several distinct postings), others may be leftover duplicates from merging in outside lists. Review each group and edit/delete as needed; changes save the same as Career Tracker.
      </div>

      {error && <div className="card mb-16" style={{ borderColor: "var(--red)", color: "var(--red)", fontSize: 13 }}>{error}</div>}

      <div className="card mb-16">
        <div className="flex gap-8" style={{ flexWrap: "wrap", alignItems: "center" }}>
          <input className="input" style={{ width: 200 }} placeholder="Search company..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <span style={{ fontSize: 12, color: "var(--muted)" }}>{rows.length} rows</span>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Company</th>
              <th>Tier</th>
              <th>Opens</th>
              <th>Applied</th>
              <th>OA</th>
              <th>Interview</th>
              <th>Result</th>
              <th>Priority</th>
              <th>Notes</th>
              <th>Link</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {duplicateGroups.map((group, gi) => group.map((c, ri) => {
              const days = daysUntil(c.opens);
              let dayLabel = days <= 0 ? "🟢 Open" : days <= 14 ? `🔴 ${days}d` : days <= 30 ? `🟡 ${days}d` : `${days}d`;
              const isGroupStart = ri === 0;
              return (
                <tr key={c.id} style={isGroupStart && gi > 0 ? { borderTop: "2px solid var(--border, #333)" } : undefined}>
                  <td className="mono" style={{ color: "var(--muted)", fontSize: 11 }}>{c.id}</td>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{c.company}</td>
                  <td><span className={`badge ${TIER_BADGE[c.tier] || "badge-great"}`}>{c.tier.replace(" Startups","").replace("Well-Funded","WF")}</span></td>
                  <td className="mono" style={{ fontSize: 11 }}>{dayLabel}</td>
                  <td><input type="checkbox" className="check" checked={c.applied} onChange={() => toggle(c.id, "applied")} /></td>
                  <td><input type="checkbox" className="check" checked={c.oa} onChange={() => toggle(c.id, "oa")} /></td>
                  <td><input type="checkbox" className="check" checked={c.interview} onChange={() => toggle(c.id, "interview")} /></td>
                  <td>
                    <select className="select" style={{ padding: "3px 6px", fontSize: 11, width: 90 }} value={c.result} onChange={(e) => setResult(c.id, e.target.value)}>
                      {RESULTS.map((r) => <option key={r} value={r}>{r || "—"}</option>)}
                    </select>
                  </td>
                  <td>{"⭐".repeat(c.priority)}</td>
                  <td style={{ fontSize: 11, color: "var(--muted)", maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.notes}</td>
                  <td>
                    {c.url ? (
                      <a href={`https://${c.url.replace("https://","").replace("http://","")}`} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontSize: 11 }}>Open →</a>
                    ) : "—"}
                  </td>
                  <td>
                    <div className="flex gap-8">
                      <button className="btn btn-danger btn-sm" onClick={() => deleteCompany(c.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              );
            }))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
