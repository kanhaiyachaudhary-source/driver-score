# Driver Scoring Service

Hybrid Next.js app — exposes a `POST /api/score` endpoint AND a UI form. Both go through the same scoring engine and same response.

- **Email flow (Power Automate):** extracts name/dob/license_number from email body, attaches license image, calls `POST /api/score`, gets `is_good_driver` + `risk_level` + `driver_score`, forwards to Guidewire PolicyCenter.
- **UI flow (web form):** user fills the same fields and uploads license image. Form internally calls the same `POST /api/score`. UI shows only a "Submission successful" message — the score result is what would be forwarded to Guidewire (just like the email flow).

---

## Run locally

```bash
npm install
npm run dev
```

App runs at: **http://localhost:3000**

- UI: http://localhost:3000
- API: `POST http://localhost:3000/api/score`
- Sample licenses: http://localhost:3000/api/samples

---

## Deploy to Vercel (recommended)

```bash
npm i -g vercel
vercel
```

Follow the prompts — you'll get a public HTTPS URL in 60 seconds. Paste that URL into Power Automate's HTTP step.

---

## API contract

### `POST /api/score`

Accepts EITHER `multipart/form-data` (when sending an image) OR `application/json` (when not).

**Form fields / JSON keys:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `license_number` | string | **yes** | Driver license number |
| `name` | string | no | Full name |
| `dob` | string | no | Date of birth (YYYY-MM-DD) |
| `email` | string | no | Driver email |
| `document` | file | no | License image/PDF (form-data only) |

**Response:**

```json
{
  "request_id": "MJZ8XK4T-A2BD",
  "name": "Rahul Sharma",
  "dob": "1990-05-15",
  "email": "rahul@example.com",
  "license_number": "DL-MH-001-A1",
  "document_filename": "license.jpg",
  "is_good_driver": true,
  "driver_score": 0,
  "risk_level": "Excellent",
  "risk_description": "Exemplary driving record",
  "reasons": ["Clean driving record — no violations or accidents"],
  "mvr_summary": {
    "license_number": "DL-MH-001-A1",
    "years_licensed": 12,
    "violations": [],
    "accidents": 0,
    "license_status": "Valid",
    "policy_status": "Active",
    "driver_status": "Rated",
    "special_indicators": []
  },
  "scored_at": "2026-04-29T10:32:11.456Z"
}
```

`is_good_driver` is `true` when `driver_score < 40`.

---

## Risk levels (10 tiers)

| Score range | Level | Description |
|-------------|-------|-------------|
| 0–5 | Excellent | Exemplary driving record |
| 6–15 | Very Low | Minimal risk profile |
| 16–25 | Low | Below average risk |
| 26–35 | Moderate-Low | Slightly below average risk |
| 36–50 | Moderate | Average risk profile |
| 51–65 | Considerable | Above average risk |
| 66–75 | Elevated | Notably elevated risk |
| 76–85 | High | High risk profile |
| 86–95 | Very High | Significantly elevated risk |
| 96–100 | Critical | Severe risk — immediate review required |

---

## Mock database (20 entries)

The app has **20 hardcoded license records** for reproducible demos. Mix of:

- **5 Excellent drivers** — `DL-MH-001-A1` to `DL-GJ-005-E5`
- **3 Low risk** — `DL-MH-006-F6`, `DL-RJ-007-G7`, `DL-WB-008-H8`
- **4 Moderate risk** — `DL-UP-009-I9` to `DL-PB-012-L2`
- **5 High risk** — `DL-HR-013-M3` to `DL-DL-017-Q7`
- **3 Critical** (DUI, suspended, SR-22) — `DL-XX-018-R8`, `DL-YY-019-S9`, `DL-ZZ-020-T0`

Any license number not in this list still gets a deterministic mock score (same input → same output).

The full list is also available via `GET /api/samples`.

---

## Test the API

### Using curl

```bash
# Excellent driver
curl -X POST http://localhost:3000/api/score \
  -H "Content-Type: application/json" \
  -d '{"name":"Rahul Sharma","dob":"1990-05-15","license_number":"DL-MH-001-A1","email":"rahul@example.com"}'

# Critical driver (DUI + SR-22)
curl -X POST http://localhost:3000/api/score \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","license_number":"DL-ZZ-020-T0"}'

# With image (form-data)
curl -X POST http://localhost:3000/api/score \
  -F "name=Rahul Sharma" \
  -F "dob=1990-05-15" \
  -F "license_number=DL-MH-001-A1" \
  -F "email=rahul@example.com" \
  -F "document=@/path/to/license.jpg"
```

### Using the UI

Open http://localhost:3000 and fill the form.

---

## Power Automate integration

In your Power Automate flow:

1. **Trigger** — When new email arrives in Outlook
2. **Action: Compose** — Extract `name`, `dob`, `license_number` from email body using regex/split
3. **Action: HTTP** —
   - Method: `POST`
   - URI: `https://your-vercel-url.vercel.app/api/score`
   - Headers: `Content-Type: application/json`
   - Body: `{ "name": "@{outputs('Compose_Name')}", "dob": "@{outputs('Compose_DOB')}", "license_number": "@{outputs('Compose_License')}", "email": "@{triggerOutputs()?['body/from']}" }`
4. **Action: Parse JSON** — parse the response from the scoring endpoint
5. **Action: HTTP** (call Guidewire PolicyCenter API) — pass `is_good_driver` and `driver_score` from previous step

Guidewire decides what to do based on the flag (issue policy if good, create underwriting issue if bad). **No condition needed in Power Automate.**

---

## Project structure

```
driver-scorer/
├── app/
│   ├── api/
│   │   ├── score/route.ts      # POST /api/score
│   │   └── samples/route.ts    # GET  /api/samples
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                # UI form
├── lib/
│   ├── mockData.ts             # 20 hardcoded license records
│   └── scoring.ts              # scoring engine + 10 risk levels
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```
