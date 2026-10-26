# Sales & Revenue Dashboard (Full-Screen 100vh Single Screen)

A modern, responsive, **100vw × 100vh full-screen** **Sales & Revenue Dashboard** built with **HTML5, CSS3, vanilla JavaScript, and Chart.js**.

Designed to fit **entirely on one desktop screen with zero vertical scrolling**, matching the glowing dark purple, navy, magenta, and glowing orange aesthetic, while remaining responsive on mobile.

---

## 🖥 Full-Screen 100vh Fit & Tested Resolutions

- **Zero Vertical Page Scrolling on Desktop**: The layout occupies exactly `100vw × 100vh` with `overflow: hidden`.
- **Dynamic Flex & Grid Architecture**: Every card and Chart.js canvas wrapper (`.chart-fit-container`, `.donut-canvas-wrap`, `.gauge-canvas-wrap`) uses flexbox and CSS Grid with `min-height: 0` so charts adapt smoothly to the available viewport height without clipping or causing scrollbars.
- **Tested Resolutions**:
  - **1920 × 1080 (FHD Desktop)**: Ample breathing room, crisp visual hierarchy, balanced typography.
  - **1366 × 768 (Standard Laptop)**: Compact padding, auto-scaled chart heights, zero overflow.
  - **1440 × 900 (MacBook / Laptop)**: Clean proportional card heights.
  - **Mobile (< 1024px)**: Automatically switches to `overflow-y: auto` with stacked cards for comfortable touch interaction.

---

## ⚡ Live Data-Driven Engine (`subai(1).xlsx`)

All visual components are dynamically calculated from a single shared sales dataset:

| Component | Metric / Behavior |
| :--- | :--- |
| **Total Revenue** | **₹228,500** (`↑ 114.2%` target progress) |
| **Total Orders** | **10 Orders** (`100% Fulfilled`) |
| **Total Units Sold** | **39 Units** (`3.9` average units per basket) |
| **Average Order Value (AOV)** | **₹22,850** (`Peak Single Order: ₹108,000`) |
| **Revenue Growth Chart** | Cumulative & daily revenue curve across February order dates |
| **Monthly / Product Sales** | Glowing bar chart ranked by sales (Laptop ₹157.5k, Monitor ₹31k, etc.) |
| **Category Share Donut** | Electronics 82.5%, Accessories 11.5%, Audio 4.2%, Storage 1.8% |
| **Sales KPI Target Gauge** | Semicircle radial gauge tracking 114.2% quota attainment vs ₹200k base |
| **Key Metrics** | 6 dynamic progress indicators (Dominant category, top volume, median, etc.) |
| **Top Regions Panel** | Regional revenue shares (Bengaluru ₹157.5k, Mumbai ₹31k, etc.) |

---

## ✏️ Interactive Dataset Editor

Clicking **"Edit Records"** in the top-right header opens an overlay modal with the **Live Editable Sales Dataset**:
- **Inline Editing**: Change quantities, unit prices, products, categories, or regions.
- **Auto-Calculated Revenue**: `Revenue = Qty × Unit Price` updates instantly.
- **Add / Delete Orders**: Add new transactions or delete rows with immediate live recalculation of all charts and KPIs.
- **Reset to Defaults**: Restores the verified `subai(1).xlsx` 10 records.
- Closing the modal preserves the clean 100vh dashboard view without taking away vertical screen space.

---

## 🗂 File Directory

```text
├── index.html        # 100vh full-screen dashboard layout with modal editor
├── style.css         # Dark purple, navy, magenta & orange glowing theme
├── script.js         # Reactive engine computing all metrics from one shared dataset
├── data.js           # Shared default dataset from subai(1).xlsx
└── README.md         # Documentation & deployment guide
```

---

## 🚀 How to Run Locally

### Option 1: Direct Browser
Double-click `index.html` to open it in Chrome, Edge, Safari, or Firefox.

### Option 2: Local HTTP Server
```bash
# Python 3:
python3 -m http.server 8000
# Open http://localhost:8000 in your browser

# Or Node.js:
npx serve .
```

---

## 🌐 Simple Deployment Guide

### Deploy to GitHub Pages:
```bash
git init
git add .
git commit -m "Deploy 100vh Sales & Revenue Dashboard"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```
In repository settings, go to **Pages** > set source to branch **main** and folder **/(root)** > click **Save**.

### Deploy to Vercel:
1. Push repository to GitHub.
2. Sign in to [vercel.com](https://vercel.com) and click **"Add New..."** > **"Project"**.
3. Select your repository, keep root directory as `./`, and click **Deploy**.
