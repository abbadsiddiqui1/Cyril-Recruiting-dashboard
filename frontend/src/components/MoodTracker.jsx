import { useState, useEffect } from "react";
import { moodApi } from "../api";

const MOODS = [
  { emoji: "🔥", label: "In the zone", value: 5 },
  { emoji: "💪", label: "Focused", value: 4 },
  { emoji: "😐", label: "Neutral", value: 3 },
  { emoji: "😓", label: "Tired", value: 2 },
  { emoji: "😔", label: "Struggling", value: 1 },
];

export default function MoodTracker() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");

  // Load mood check-ins from the backend on mount. Newest first.
  useEffect(() => {
    moodApi.list()
      .then((data) => setLogs([...data].reverse()))
      .catch(() => setError("Couldn't load mood logs — is the backend running on :8080?"));
  }, []);

  const logMood = async () => {
    if (!selected) return;
    const today = new Date().toLocaleDateString();
    try {
      const saved = await moodApi.create({ date: today, mood: selected, note });
      setLogs((ls) => [saved, ...ls]);
      setSelected(null); setNote("");
    } catch { setError("Save failed — entry may not be persisted."); }
  };

  const del = async (id) => {
    setLogs((ls) => ls.filter((l) => l.id !== id));
    try { await moodApi.remove(id); }
    catch { setError("Delete failed."); }
  };

  const avg = logs.length ? (logs.slice(0, 7).reduce((s, l) => s + l.mood.value, 0) / Math.min(logs.length, 7)).toFixed(1) : "—";

  return (
    <div>
      <div className="page-header">
        <h2>🌡️ Mood Tracker</h2>
        <p>7-day average: {avg} · {logs.length} entries total</p>
      </div>

      {error && <div className="card mb-16" style={{ borderColor: "var(--red)", color: "var(--red)", fontSize: 13 }}>{error}</div>}

      <div className="grid-2 gap-16">
        {/* Log mood */}
        <div className="card">
          <div className="section-label mb-16">How are you feeling today?</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 16 }}>
            {MOODS.map((m) => (
              <div
                key={m.value}
                className={`mood-btn ${selected?.value === m.value ? "selected" : ""}`}
                onClick={() => setSelected(m)}
              >
                <div>{m.emoji}</div>
                <p>{m.label}</p>
              </div>
            ))}
          </div>
          <textarea
            className="textarea"
            placeholder="Optional note — what's on your mind?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{ minHeight: 80, marginBottom: 12 }}
          />
          <button className="btn btn-primary" onClick={logMood} disabled={!selected} style={{ opacity: selected ? 1 : 0.5 }}>
            Log Mood
          </button>
        </div>

        {/* Trend */}
        <div className="card">
          <div className="section-label mb-16">Last 7 Days</div>
          {logs.slice(0, 7).length === 0 && <p style={{ color: "var(--muted)", fontSize: 13 }}>No entries yet. Start logging.</p>}
          {logs.slice(0, 7).map((l) => (
            <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 22 }}>{l.mood.emoji}</span>
              <div style={{ flex: 1 }}>
                <div className="flex-between">
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{l.mood.label}</span>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{l.date}</span>
                </div>
                {l.note && <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{l.note}</p>}
              </div>
              <div className="progress-wrap" style={{ width: 60 }}>
                <div className="progress-fill" style={{ width: `${(l.mood.value / 5) * 100}%` }} />
              </div>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 12 }} onClick={() => del(l.id)}>✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
