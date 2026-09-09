# AutoAssess — Frontend (Phase 1)

React + Vite frontend for AutoAssess. Covers the Phase 1 flow only:
upload a question paper, upload the matching answer sheets, watch the
pipeline run (OCR → question mapping → scoring), and view results.

It runs **fully standalone right now** on mock data, so you can hand it
to the backend team while FastAPI/OCR/Mongo are still being built, and
swap in the real API later by changing one flag.

## Run it

```bash
npm install
npm run dev
```

Opens on `http://localhost:5173`. It starts in **mock mode**: uploads
are stored in memory in the browser, and a fake pipeline advances the
status every ~1.5s so every screen (upload, progress stepper, results
table) is clickable end to end without a backend.

## Project layout

```
src/
  api/
    client.js        <- EVERY network call lives here. This is the only
                         file the backend team needs to look at.
    mockData.js       <- in-memory fake backend used while MOCK_MODE=true
  context/
    AssessmentContext.jsx   <- shared list of assessment batches
  components/
    Sidebar.jsx
    StatusTag.jsx
    UploadZone.jsx    <- drag-and-drop / click-to-browse file picker
    ResultsTable.jsx  <- expandable per-student, per-question results
  pages/
    Dashboard.jsx         "/"                 list of batches
    NewAssessment.jsx     "/new"              3-step upload flow
    AssessmentDetail.jsx  "/assessments/:id"  live status + results
```

## Connecting the real FastAPI backend

1. Copy `.env.example` to `.env.local`.
2. Set `VITE_MOCK_MODE=false`.
3. Either:
   - keep `VITE_API_BASE_URL=/api` and run the backend on `localhost:8000`
     — `vite.config.js` already proxies `/api/*` there in dev, so there's
     no CORS setup needed locally, **or**
   - set `VITE_API_BASE_URL` to wherever FastAPI is actually deployed.
4. Implement the routes below exactly as shaped — every component
   already expects these response shapes, so nothing else in the
   frontend needs to change.

### Required routes

```
POST   /api/assessments
       multipart/form-data: title (str), question_paper (file), answer_sheets (file[])
       -> 201 { id, title, status: "queued", student_count, created_at }

GET    /api/assessments
       -> 200 [ { id, title, status, progress, student_count, created_at }, ... ]

GET    /api/assessments/{id}
       -> 200 {
            id, title, student_count, created_at,
            status: "queued" | "ocr" | "mapping" | "scoring" | "done" | "failed",
            progress: 0-100,
            error?: string   // only when status == "failed"
          }

GET    /api/assessments/{id}/results
       -> 200 [
            {
              student_id, student_name,
              total_score, max_score,
              questions: [
                { question_no, attempted, score, max_score,
                  verdict: "correct" | "partial" | "incorrect" }
              ]
            }, ...
          ]

GET    /api/assessments/{id}/export?format=csv
       -> file download (Content-Disposition: attachment)
```

`status` is a state machine: `queued → ocr → mapping → scoring → done`
(or `failed` at any point). The frontend polls `GET /api/assessments/{id}`
every 1.5s and re-renders the progress stepper from `status`/`progress`
alone — the backend does not need to push anything.

### CORS (only if you don't use the dev proxy)

If you set `VITE_API_BASE_URL` to a different origin instead of using
the `/api` proxy, enable CORS in FastAPI:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # add your deployed frontend origin too
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Suggested Mongo documents (via PyMongo)

Two collections map directly onto the routes above:

- `assessments` — one doc per batch: `_id`, `title`, `status`, `progress`,
  `student_count`, `created_at`, file paths/refs for the question paper
  and answer sheets, `error`.
- `results` — one doc per student per assessment: `assessment_id`,
  `student_id`, `student_name`, `total_score`, `max_score`, `questions[]`.

Keep OCR output (raw Olm-OCR text per sheet) in a third collection or a
field on the assessment doc if you want it inspectable later — the
frontend doesn't need it for Phase 1, but you'll want it for debugging
mis-scored answers.

## Notes for whoever wires this up

- `UploadZone` already sends real `File` objects — `createAssessment()`
  in `client.js` builds the `FormData` and does a real `XMLHttpRequest`
  (not `fetch`) specifically so upload progress can be shown; you don't
  need to touch that logic, just implement the endpoint.
- The results table expects one row per student per question. If your
  scoring pipeline works question-first instead of student-first,
  pivot it server-side before returning — don't reshape it in the
  frontend.
- Nothing here handles auth yet. When you add it, the single place to
  attach a token is the `request()` helper at the top of `client.js`.
