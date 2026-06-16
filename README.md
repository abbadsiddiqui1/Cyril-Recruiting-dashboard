Here's what's manual for anyone using it:
---

```markdown
# CyrilHQ — Your Personal Command Center

> Built by [@CyrilAnnoh](https://www.linkedin.com/in/cyrilannoh) · If you use this, tag me on LinkedIn for credit 🙏

A full-stack personal dashboard for CS students in internship recruiting season.
Built for my own Summer 2027 recruiting grind — feel free to fork and make it yours.

## Features
- **Career Tracker** — 100 companies pre-loaded, track Applied/OA/Interview/Result, add new companies, opening date countdown
- **NeetCode 150** — Track all 150 problems, mark mastered/in progress, add pattern notes
- **Notes** — Capture DSA patterns, ideas, follow-ups by tag
- **Links** — Save important career/DSA/project links
- **Mood Tracker** — Daily check-ins
- **Reminders** — Send yourself email reminders, schedule future ones
- 📧 **Auto Emails** — Daily NeetCode reminder (9am) + Weekly digest (Monday 8am)

---

## Personalize It First (Manual Steps)

Before running, update these to match your info:

**1. Your email** — search and replace `cyrrilann@gmail.com` with your own Gmail across:
- `backend/src/main/resources/application.properties`
- `backend/src/main/java/com/dashboard/scheduler/WeeklyDigestScheduler.java`
- `frontend/src/components/Reminders.jsx`

**2. Your companies** — `frontend/src/data/companies.js` has 100 companies pre-loaded for a NYC CS student. Clear them out and add your own targets, or keep them as a starting point.

**3. Your NeetCode progress** — same file (`companies.js`), scroll to `NEETCODE_150`. Update `status` fields to reflect what you've already solved: `"not started"`, `"in progress"`, or `"mastered"`.- also this follows NEETCODE 150 TRACKER.

**4. Weekly email links** — `backend/src/main/java/com/dashboard/scheduler/WeeklyDigestScheduler.java` has company links specific to my recruiting targets. Swap them for yours.

---

## Setup

### Prerequisites
- Node.js 18+
- Java 21
- Maven

### 1. Frontend
```bash
cd frontend
npm install
npm run dev
```
Opens at http://localhost:5173

### 2. Backend (Email)

**First — get a Gmail App Password:**
1. Go to myaccount.google.com
2. Security → 2-Step Verification → App Passwords
3. Generate password for "Mail" → "Other device" → name it "CyrilHQ"
4. Copy the 16-character password

**Then update the config:**
```
backend/src/main/resources/application.properties
```
Replace `YOUR_GMAIL_APP_PASSWORD` with your actual app password.

**Run the backend:**
```bash
cd backend
export JAVA_HOME=/opt/homebrew/opt/openjdk@21
mvn spring-boot:run
```
Runs on http://localhost:8080

### 3. Test it works
Visit http://localhost:8080/api/reminders/health → should return `{ "status": "CyrilHQ backend running ✅" }`

---

## Deploy to Vercel (Frontend)

```bash
cd frontend
npm run build
```
Push to GitHub → connect to Vercel → deploy.

Set environment variable in Vercel:
```
VITE_BACKEND_URL=https://your-backend-url.com
```

## Deploy Backend (Railway)
Push to GitHub → connect Railway → set env vars for mail config.

---

## Data Persistence
All data (companies, notes, links, mood) is saved in **localStorage** — persists across sessions in the same browser. No database needed for the frontend.

Email scheduling uses an in-memory scheduler — scheduled reminders reset if the backend restarts. For production, swap to a database-backed scheduler.

---

*Built by Cyril Annoh · NYC College of Technology (CUNY) · CS Student · Bronx, NY*
```

---
