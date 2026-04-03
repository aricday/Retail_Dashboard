# Retail Merchandising Full-Stack Demo

A real-time inventory and trend command center for a simulated apparel retailer. It surfaces actionable inventory decisions — reorders, store transfers, and same-day fulfillment opportunities — driven by a deterministic scoring algorithm called "Pulse."

This bundle contains a complete demo stack for a retail trend and inventory command center:

- `backend/` — plain Node.js API that simulates an API gateway over Snowflake / BigQuery style warehouse queries
- `frontend/` — React + Vite + Recharts dashboard with charts, KPI cards, filters, and a detailed SKU action table
- `postman/` — Postman collection and environment for API testing and mock-style demos

## Demo scope

The sample data models a Midwest region with:

- 13 apparel SKUs across styles like **Eclectic Grandpa**, **Workwear Revival**, **Quiet Luxury**, **Quiet Prep**, and **Indie Sleaze 2.0**
- 6 Midwest stores
- Edge cases:
  - `RN-1011` low stock + trending
  - `RN-1012` transfer candidate
  - `RN-1013` same-day fulfillment candidate

## Pulse scoring logic

The API computes a deterministic `pulse_score` for every SKU based on:

- week-over-week demand growth
- average on-hand inventory
- regional inventory imbalance
- same-day fulfillment opportunity

Outputs are grounded in structured data and intentionally separated from narrative interpretation so the demo can speak clearly about trust and non-hallucination.

## Run locally

### 1) Start the API
No backend dependencies are required.
```bash
npm run start:api
```

The API runs on `http://localhost:3000`.

### 2) Install frontend dependencies
```bash
npm run install:all
```

### 3) Start the React dashboard
In a second terminal:
```bash
npm run start:web
```

The dashboard runs on the Vite default dev URL and points to `http://localhost:3000` by default.

## Key endpoints

- `GET /v1/health`
- `GET /v1/dashboard/summary`
- `GET /v1/catalog/styles`
- `GET /v1/catalog/items`
- `GET /v1/catalog/item-detail?sku=RN-1011`
- `GET /v1/inventory/store?store_id=MSP01`
- `GET /v1/inventory/snapshot?region=Midwest`
- `GET /v1/sales/trends/viral?region=Midwest&window_days=7`
- `POST /v1/analytics/pulse/query`
- `GET /v1/replenishment/recommendations?region=Midwest`

## Suggested demo flow

1. Open the dashboard and point out KPI cards and filters.
2. Show the `Eclectic Grandpa` filter and highlight `RN-1011`.
3. Show the `TRANSFER` filter to highlight `RN-1012`.
4. Show the `SAME_DAY_FULFILLMENT` filter to highlight `RN-1013`.
5. Open Postman and run `POST /v1/analytics/pulse/query` with:
```json
{
  "region": "Midwest",
  "question": "What should I act on today in the Midwest?",
  "limit": 5
}
```

## Startup and shutdown

### Option A — Local Node.js backend

**Start (two terminals):**
```bash
# Terminal 1 — API server (port 3000)
npm run start:api

# Terminal 2 — React dashboard (port 5173)
npm run start:web
```

Open the dashboard at `http://localhost:5173`. The API base URL field in the dashboard should read `http://localhost:3000`.

**Stop:**
```bash
pkill -f "node backend/server.js"
pkill -f vite
```

---

### Option B — Postman mock server

> Prerequisite: import `postman/RetailNext_Pulse_MockServer.postman_collection.json` into Postman, create a Mock Server from that collection, and copy the mock URL.

**Start (one terminal — frontend only):**
```bash
npm run start:web
```

Open the dashboard at `http://localhost:5173`. In the **API base URL** field at the top right, paste your Postman mock URL (e.g. `https://4d86fca1-2b08-4b4e-8e80-4e2e3a00088e.mock.pstmn.io`) and click **Connect**. No local API process is needed.

**Stop:**

```bash
pkill -f vite
```

---

## Technical notes for a technical audience

- The backend is intentionally shaped like an API gateway over a warehouse.
- The React app consumes APIs only; it does not bake in data.
- Pulse scoring is deterministic and inspectable.
- The `/v1/analytics/pulse/query` response includes a trust block that shows the reasoning is grounded in POS, inventory, catalog, and warehouse sources.