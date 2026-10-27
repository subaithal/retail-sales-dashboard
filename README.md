# Sales & Revenue Dashboard (retail-sales-dashboard)

A deployment-ready, full-screen (100vw × 100vh) **Sales & Revenue Dashboard** website with dark purple, navy, magenta, and glowing pink-orange gradients. All KPI cards, charts, gauges, key metrics, and regional rankings fit onto a single desktop screen with **zero vertical scrolling** and update **100% dynamically** from a shared dataset.

---

## 📦 What's Included in the Project

The project is structured for immediate GitHub push, static hosting, and seamless Vercel deployment:

```text
retail-sales-dashboard/
├── index.html                   # 100vh single-screen dashboard layout & modal editor
├── style.css                    # Glowing dark purple, navy, magenta theme CSS
├── script.js                    # Reactive engine computing all metrics from one shared dataset
├── data.js                      # Shared default dataset from subai(1).xlsx
├── vercel.json                  # Vercel deployment configuration
├── package.json                 # Project dependencies & Vite build scripts
├── vite.config.ts               # Modern Vite configuration
├── tsconfig.json                # TypeScript compiler configuration
├── .gitignore                   # Ignores node_modules, dist, logs
├── README.md                    # Setup, GitHub & Vercel deployment instructions
├── retail-sales-dashboard.zip   # Complete downloadable archive of all project files
├── public/                      # Static assets & public zip copy for direct download
└── src/                         # Optional source directory for framework extension
```

---

## ⚡ Verified Dataset Metrics (`subai(1).xlsx`)

All numbers on the dashboard are calculated directly from the shared dataset:
- **Total Revenue**: **₹228,500** (`↑ 114.2%` target progress)
- **Total Orders**: **10 Orders** (`100% Fulfilled & delivered`)
- **Total Units Sold**: **39 Units** (`3.9` average units per basket)
- **Average Order Value (AOV)**: **₹22,850** (`Peak Single Order: ₹108,000`)
- **Top Product**: **Laptop (₹157,500 / 68.9% share)**
- **Top Volume Item**: **Mouse (15 Units / 38.5% volume)**
- **Dominant Category**: **Electronics (₹188,500 / 82.5% share)**
- **Top Region**: **Bengaluru (₹157,500 / 68.9%)**, followed by **Mumbai (₹31,000)**

---

## 📥 Option A: Download Project ZIP Directly

You can obtain the entire project folder in two ways:
1. **From the live dashboard**: Click the **"Download ZIP"** button in the top-right header to download `retail-sales-dashboard.zip`.
2. **From the repository**: `retail-sales-dashboard.zip` is included in the project root.

To extract:
```bash
unzip retail-sales-dashboard.zip
cd retail-sales-dashboard
```

---

## 🚀 How to Run Locally

### Option 1: Double-Click (Zero Setup)
Simply open `index.html` in any web browser (Chrome, Edge, Safari, Firefox). All Chart.js visualizations render immediately.

### Option 2: Local HTTP Server
```bash
# Python 3:
python3 -m http.server 8000
# Open http://localhost:8000 in your browser

# Or Node.js:
npx serve .
```

### Option 3: Vite Dev Server
```bash
npm install
npm run dev
# Starts on http://localhost:3000
```

---

## 🐙 Step-by-Step GitHub Upload Guide

Follow these steps to upload the project to your GitHub repository named **`retail-sales-dashboard`**:

### Step 1: Create the Repository on GitHub
1. Log into your GitHub account at [github.com](https://github.com).
2. Click the **`+`** icon in the top right corner and select **New repository**.
3. Name your repository: **`retail-sales-dashboard`**.
4. Choose **Public** (or **Private**).
5. **Do NOT check** "Initialize this repository with a README" (we already have a complete one).
6. Click **Create repository**.

### Step 2: Push from your Computer
Open your terminal in the `retail-sales-dashboard` folder and run:

```bash
# 1. Initialize git (if not already done)
git init

# 2. Stage all project files
git add .

# 3. Commit the files
git commit -m "Initial commit of Sales & Revenue Dashboard"

# 4. Set the main branch
git branch -M main

# 5. Add your GitHub remote repository (replace with your GitHub username)
git remote add origin https://github.com/<your-username>/retail-sales-dashboard.git

# 6. Push code to GitHub
git push -u origin main
```

---

## ▲ Step-by-Step Vercel Deployment Guide

### Method 1: Deploy with Vercel Web Dashboard (Recommended & Automatic)

1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click the **"Add New..."** button and select **Project**.
3. In the "Import Git Repository" list, locate **`retail-sales-dashboard`** and click **Import**.
4. In the configuration screen:
   - **Project Name**: `retail-sales-dashboard`
   - **Framework Preset**: Vercel will automatically detect **Vite** (via `vercel.json`).
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.
6. Within 20–30 seconds, Vercel will output a live production URL (e.g., `https://retail-sales-dashboard-yourname.vercel.app`) with automatic SSL/HTTPS and CDN caching!
7. Any future commits pushed to `main` on GitHub will trigger automatic zero-downtime redeployments.

### Method 2: Deploy with Vercel CLI

If you have Node.js and the Vercel CLI installed:
```bash
npm i -g vercel
vercel login
vercel --prod
```
Accept the defaults and your dashboard will be live in seconds.
