/**
 * Sales & Revenue Dashboard — Core Reactive Application Logic
 * Single shared dataset drives all 5 charts, KPI cards, and key metrics.
 * Add, edit, or delete operations update all components in real-time.
 */

(function () {
  'use strict';

  // Shared Reactive Dataset
  let salesDataset = [];

  // Chart.js Instances
  let revenueLineChart = null;
  let monthlySalesChart = null;
  let productBarChart = null;
  let categoryDonutChart = null;
  let regionalRevenueChart = null;

  // Category Color Palette
  const CATEGORY_COLORS = {
    Electronics: '#d946ef', // Magenta
    Accessories: '#8b5cf6', // Purple
    Audio: '#06b6d4',       // Cyan
    Storage: '#f97316',     // Orange
    Peripherals: '#10b981', // Emerald
    Office: '#f43f5e',      // Rose
    Other: '#a855f7'
  };

  const DYNAMIC_PALETTE = ['#d946ef', '#8b5cf6', '#06b6d4', '#f97316', '#10b981', '#f43f5e', '#eab308', '#3b82f6'];

  /**
   * Currency Formatter for INR (₹)
   */
  function formatINR(amount) {
    if (isNaN(amount) || amount === null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Compact Currency Formatter (e.g. ₹228.5k)
   */
  function formatCompactINR(amount) {
    if (isNaN(amount) || amount === null) return '₹0';
    if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(2) + 'Cr';
    if (amount >= 100000) return '₹' + (amount / 1000).toFixed(1) + 'k';
    if (amount >= 1000) return '₹' + (amount / 1000).toFixed(1) + 'k';
    return '₹' + amount;
  }

  /**
   * Load Dataset from localStorage or default source
   */
  function loadDataset() {
    const saved = localStorage.getItem('retail_sales_active_data_v3');
    if (saved) {
      try {
        salesDataset = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved dataset, reverting to default:', e);
        salesDataset = JSON.parse(JSON.stringify(window.DEFAULT_SALES_RECORDS || []));
      }
    } else if (window.DEFAULT_SALES_RECORDS && window.DEFAULT_SALES_RECORDS.length > 0) {
      salesDataset = JSON.parse(JSON.stringify(window.DEFAULT_SALES_RECORDS));
    } else {
      salesDataset = [];
    }

    // Ensure all records have computed revenue, quantities, and unique ids
    salesDataset.forEach((row, index) => {
      if (!row.id) row.id = 'rec_' + (index + 1) + '_' + Date.now();
      row.quantity = Number(row.quantity) || 1;
      row.unitPrice = Number(row.unitPrice) || 0;
      row.revenue = row.quantity * row.unitPrice;
    });
  }

  /**
   * Save Active Dataset
   */
  function saveDataset() {
    try {
      localStorage.setItem('retail_sales_active_data_v3', JSON.stringify(salesDataset));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }

  /**
   * Calculate all Aggregations Dynamically from the Shared Dataset
   */
  function computeAnalytics() {
    const totalOrders = salesDataset.length;
    let totalRevenue = 0;
    let totalUnits = 0;
    const revenues = [];

    const categoryMap = {};
    const productMap = {};
    const dateMap = {};
    const regionMap = {};

    salesDataset.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      const rev = Number(item.revenue) || (qty * price);

      totalRevenue += rev;
      totalUnits += qty;
      revenues.push(rev);

      // Category
      const cat = (item.category || 'Other').trim();
      if (!categoryMap[cat]) categoryMap[cat] = { name: cat, revenue: 0, units: 0 };
      categoryMap[cat].revenue += rev;
      categoryMap[cat].units += qty;

      // Product
      const prod = (item.product || 'Other').trim();
      if (!productMap[prod]) productMap[prod] = { name: prod, revenue: 0, units: 0 };
      productMap[prod].revenue += rev;
      productMap[prod].units += qty;

      // Date
      const d = (item.date || '2024-02-01').trim();
      if (!dateMap[d]) dateMap[d] = 0;
      dateMap[d] += rev;

      // Region
      const reg = (item.region || item.city || 'Other').trim();
      if (!regionMap[reg]) regionMap[reg] = { region: reg, revenue: 0, orders: 0 };
      regionMap[reg].revenue += rev;
      regionMap[reg].orders += 1;
    });

    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const targetRevenue = (window.DASHBOARD_CONFIG && window.DASHBOARD_CONFIG.targetRevenue) || 200000;
    const targetAchievementRate = targetRevenue > 0 ? ((totalRevenue / targetRevenue) * 100).toFixed(1) : '0';

    // Categories array with share
    const categories = Object.values(categoryMap).map((c, i) => {
      const share = totalRevenue > 0 ? ((c.revenue / totalRevenue) * 100).toFixed(1) : '0';
      const color = CATEGORY_COLORS[c.name] || DYNAMIC_PALETTE[i % DYNAMIC_PALETTE.length];
      return { ...c, share: Number(share), color };
    }).sort((a, b) => b.revenue - a.revenue);

    // Products array sorted by revenue descending
    const products = Object.values(productMap).sort((a, b) => b.revenue - a.revenue);

    // Daily & Cumulative Timeline sorted chronologically
    const sortedDates = Object.keys(dateMap).sort();
    let cumulative = 0;
    const timeline = sortedDates.map((d) => {
      const dailyRev = dateMap[d];
      cumulative += dailyRev;
      const parts = d.split('-');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const label = parts.length === 3 ? `${parseInt(parts[2], 10)} ${months[parseInt(parts[1], 10) - 1]}` : d;
      return { date: d, label, dailyRevenue: dailyRev, cumulativeRevenue: cumulative };
    });

    // Top Regions sorted by revenue descending
    const topRegions = Object.values(regionMap).map((r) => {
      const share = totalRevenue > 0 ? ((r.revenue / totalRevenue) * 100).toFixed(1) : '0';
      return { ...r, share: Number(share) };
    }).sort((a, b) => b.revenue - a.revenue);

    // Median & Max calculation
    revenues.sort((a, b) => a - b);
    let medianOrderValue = 0;
    if (revenues.length > 0) {
      const mid = Math.floor(revenues.length / 2);
      medianOrderValue = revenues.length % 2 !== 0 ? revenues[mid] : Math.round((revenues[mid - 1] + revenues[mid]) / 2);
    }
    const maxOrderRevenue = revenues.length > 0 ? revenues[revenues.length - 1] : 0;

    const topVolumeProduct = Object.values(productMap).sort((a, b) => b.units - a.units)[0] || { name: 'None', units: 0 };
    const topCategory = categories[0] || { name: 'None', share: 0 };

    return {
      totalOrders,
      totalRevenue,
      totalUnits,
      averageOrderValue,
      targetRevenue,
      targetAchievementRate,
      medianOrderValue,
      maxOrderRevenue,
      categories,
      products,
      timeline,
      topRegions,
      topVolumeProduct,
      topCategory
    };
  }

  /**
   * Update All 4 KPI Cards Dynamically
   */
  function updateKPICards(analytics) {
    const revEl = document.getElementById('kpi-val-revenue');
    const ordersEl = document.getElementById('kpi-val-orders');
    const unitsEl = document.getElementById('kpi-val-units');
    const aovEl = document.getElementById('kpi-val-aov');

    if (revEl) revEl.textContent = formatINR(analytics.totalRevenue);
    if (ordersEl) ordersEl.textContent = analytics.totalOrders.toLocaleString('en-IN');
    if (unitsEl) unitsEl.textContent = analytics.totalUnits.toLocaleString('en-IN');
    if (aovEl) aovEl.textContent = formatINR(analytics.averageOrderValue);

    const targetBadge = document.getElementById('kpi-target-badge');
    if (targetBadge) {
      targetBadge.textContent = `↑ ${analytics.targetAchievementRate}%`;
    }

    const unitsSub = document.getElementById('kpi-units-sub');
    if (unitsSub) {
      const avgUnits = analytics.totalOrders > 0 ? (analytics.totalUnits / analytics.totalOrders).toFixed(1) : '0';
      unitsSub.textContent = `${avgUnits} Avg`;
    }

    const peakSub = document.getElementById('kpi-peak-sub');
    if (peakSub) {
      peakSub.textContent = `Peak ${formatCompactINR(analytics.maxOrderRevenue)}`;
    }

    const liveBadge = document.getElementById('header-live-badge');
    if (liveBadge) {
      liveBadge.textContent = `${analytics.totalOrders} Orders • ${formatINR(analytics.totalRevenue)}`;
    }
  }

  /**
   * 1. Revenue Trend Line Chart
   */
  function updateRevenueLineChart(analytics) {
    const canvas = document.getElementById('revenueLineChart');
    if (!canvas || typeof Chart === 'undefined') return;
    const ctx = canvas.getContext('2d');

    const labels = analytics.timeline.map((t) => t.label);
    const cumulativeData = analytics.timeline.map((t) => t.cumulativeRevenue);

    const fillGradient = ctx.createLinearGradient(0, 0, 0, 220);
    fillGradient.addColorStop(0, 'rgba(217, 70, 239, 0.38)');
    fillGradient.addColorStop(0.5, 'rgba(244, 63, 94, 0.15)');
    fillGradient.addColorStop(1, 'rgba(139, 92, 246, 0.0)');

    const lineGradient = ctx.createLinearGradient(0, 0, canvas.width || 600, 0);
    lineGradient.addColorStop(0, '#f97316');
    lineGradient.addColorStop(0.5, '#ec4899');
    lineGradient.addColorStop(1, '#8b5cf6');

    if (!revenueLineChart) {
      revenueLineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Cumulative Revenue',
              data: cumulativeData,
              borderColor: lineGradient,
              borderWidth: 2.5,
              backgroundColor: fillGradient,
              fill: true,
              tension: 0.38,
              pointBackgroundColor: '#f43f5e',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 1.5,
              pointRadius: 3.5,
              pointHoverRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 300 },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` Cumulative: ${formatINR(ctx.raw)}`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#94a3b8', font: { size: 9.5 } }
            },
            y: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: {
                color: '#cbd5e1',
                font: { size: 9.5 },
                callback: (v) => formatCompactINR(v)
              }
            }
          }
        }
      });
    } else {
      revenueLineChart.data.labels = labels;
      revenueLineChart.data.datasets[0].data = cumulativeData;
      revenueLineChart.update();
    }

    const tagEl = document.getElementById('line-chart-tag');
    if (tagEl) tagEl.textContent = `Total: ${formatCompactINR(analytics.totalRevenue)}`;
  }

  /**
   * 2. Monthly Sales Chart (Sales by Date Timeline)
   */
  function updateMonthlySalesChart(analytics) {
    const canvas = document.getElementById('monthlySalesChart');
    if (!canvas || typeof Chart === 'undefined') return;
    const ctx = canvas.getContext('2d');

    const labels = analytics.timeline.map((t) => t.label);
    const dailyData = analytics.timeline.map((t) => t.dailyRevenue);

    const barGradient = ctx.createLinearGradient(0, 0, 0, 180);
    barGradient.addColorStop(0, '#06b6d4'); // Cyan
    barGradient.addColorStop(0.6, '#8b5cf6'); // Purple
    barGradient.addColorStop(1, '#4f46e5'); // Indigo

    if (!monthlySalesChart) {
      monthlySalesChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Daily Sales',
              data: dailyData,
              backgroundColor: barGradient,
              hoverBackgroundColor: '#22d3ee',
              borderRadius: 4,
              borderSkipped: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 300 },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) => ` Sales: ${formatINR(ctx.raw)}`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#94a3b8', font: { size: 9.5 } }
            },
            y: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: {
                color: '#cbd5e1',
                font: { size: 9.5 },
                callback: (v) => formatCompactINR(v)
              }
            }
          }
        }
      });
    } else {
      monthlySalesChart.data.labels = labels;
      monthlySalesChart.data.datasets[0].data = dailyData;
      monthlySalesChart.update();
    }
  }

  /**
   * 3. Product Performance Bar Chart
   */
  function updateProductBarChart(analytics) {
    const canvas = document.getElementById('productBarChart');
    if (!canvas || typeof Chart === 'undefined') return;
    const ctx = canvas.getContext('2d');

    const labels = analytics.products.map((p) => p.name);
    const revenues = analytics.products.map((p) => p.revenue);

    const barGradient = ctx.createLinearGradient(0, 0, 0, 160);
    barGradient.addColorStop(0, '#ec4899');
    barGradient.addColorStop(0.5, '#d946ef');
    barGradient.addColorStop(1, '#6366f1');

    if (!productBarChart) {
      productBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Product Sales',
              data: revenues,
              backgroundColor: barGradient,
              hoverBackgroundColor: '#f43f5e',
              borderRadius: 5,
              borderSkipped: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 300 },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => ` Total: ${formatINR(context.raw)}`
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: '#cbd5e1', font: { size: 8.5 } }
            },
            y: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: {
                color: '#94a3b8',
                font: { size: 8.5 },
                callback: (v) => formatCompactINR(v)
              }
            }
          }
        }
      });
    } else {
      productBarChart.data.labels = labels;
      productBarChart.data.datasets[0].data = revenues;
      productBarChart.update();
    }

    const topProd = analytics.products[0];
    const topProdTag = document.getElementById('bar-chart-top-tag');
    if (topProdTag) {
      topProdTag.textContent = topProd ? `Top: ${topProd.name} (${formatCompactINR(topProd.revenue)})` : 'No items';
    }
  }

  /**
   * 4. Category Share Doughnut Chart
   */
  function updateCategoryDonutChart(analytics) {
    const canvas = document.getElementById('categoryDonutChart');
    if (!canvas || typeof Chart === 'undefined') return;
    const ctx = canvas.getContext('2d');

    const labels = analytics.categories.map((c) => c.name);
    const revenues = analytics.categories.map((c) => c.revenue);
    const colors = analytics.categories.map((c) => c.color);

    if (!categoryDonutChart) {
      categoryDonutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [
            {
              data: revenues,
              backgroundColor: colors,
              borderColor: '#070614',
              borderWidth: 2,
              hoverOffset: 5
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 300 },
          cutout: '72%',
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const val = context.raw;
                  const total = analytics.totalRevenue;
                  const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                  return ` ${context.label}: ${formatINR(val)} (${pct}%)`;
                }
              }
            }
          }
        }
      });
    } else {
      categoryDonutChart.data.labels = labels;
      categoryDonutChart.data.datasets[0].data = revenues;
      categoryDonutChart.data.datasets[0].backgroundColor = colors;
      categoryDonutChart.update();
    }

    const legendEl = document.getElementById('donut-legend-items');
    if (legendEl) {
      if (analytics.categories.length === 0) {
        legendEl.innerHTML = '<span style="font-size:0.65rem; color:var(--text-dim);">No categories</span>';
      } else {
        legendEl.innerHTML = analytics.categories
          .map((cat) => `
            <div class="donut-legend-item">
              <div class="legend-left">
                <span class="legend-dot" style="background-color: ${cat.color};"></span>
                <span style="color: #cbd5e1;">${cat.name}</span>
              </div>
              <div class="legend-pct">${cat.share}%</div>
            </div>
          `)
          .join('');
      }
    }
  }

  /**
   * 5. Regional Revenue Chart (Horizontal Bar Chart)
   */
  function updateRegionalRevenueChart(analytics) {
    const canvas = document.getElementById('regionalRevenueChart');
    if (!canvas || typeof Chart === 'undefined') return;
    const ctx = canvas.getContext('2d');

    const regions = analytics.topRegions.slice(0, 6);
    const labels = regions.map((r) => r.region.split('(')[0].trim());
    const revenues = regions.map((r) => r.revenue);

    const barGradient = ctx.createLinearGradient(0, 0, 200, 0);
    barGradient.addColorStop(0, '#8b5cf6');
    barGradient.addColorStop(0.6, '#ec4899');
    barGradient.addColorStop(1, '#f97316');

    if (!regionalRevenueChart) {
      regionalRevenueChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              axis: 'y',
              label: 'Revenue',
              data: revenues,
              backgroundColor: barGradient,
              hoverBackgroundColor: '#fb923c',
              borderRadius: 4,
              borderSkipped: false
            }
          ]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 300 },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => ` Revenue: ${formatINR(context.raw)}`
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: {
                color: '#94a3b8',
                font: { size: 8 },
                callback: (v) => formatCompactINR(v)
              }
            },
            y: {
              grid: { display: false },
              ticks: { color: '#cbd5e1', font: { size: 8 } }
            }
          }
        }
      });
    } else {
      regionalRevenueChart.data.labels = labels;
      regionalRevenueChart.data.datasets[0].data = revenues;
      regionalRevenueChart.update();
    }
  }

  /**
   * Update Key Metrics List Dynamically
   */
  function updateKeyMetrics(analytics) {
    const container = document.getElementById('key-metrics-container');
    if (!container) return;

    const dynamicMetrics = [
      {
        label: 'Target Achievement',
        value: `${analytics.targetAchievementRate}%`,
        progress: Math.min(Number(analytics.targetAchievementRate) || 0, 100),
        color: 'magenta'
      },
      {
        label: 'Top Category Share',
        value: `${analytics.topCategory.name} (${analytics.topCategory.share}%)`,
        progress: Math.min(analytics.topCategory.share || 0, 100),
        color: 'cyan'
      },
      {
        label: 'Top Volume Driver',
        value: `${analytics.topVolumeProduct.name} (${analytics.topVolumeProduct.units}u)`,
        progress: Math.min(analytics.totalUnits > 0 ? (analytics.topVolumeProduct.units / analytics.totalUnits) * 100 : 0, 100),
        color: 'orange'
      },
      {
        label: 'Median Order Value',
        value: formatINR(analytics.medianOrderValue),
        progress: 65,
        color: 'emerald'
      },
      {
        label: 'Highest Single Order',
        value: formatINR(analytics.maxOrderRevenue),
        progress: 90,
        color: 'magenta'
      },
      {
        label: 'Avg Basket Size',
        value: analytics.totalOrders > 0 ? `${(analytics.totalUnits / analytics.totalOrders).toFixed(1)} u/ord` : '0 u',
        progress: 75,
        color: 'cyan'
      }
    ];

    container.innerHTML = dynamicMetrics
      .map((m) => `
        <div class="metric-row">
          <div class="metric-row-top">
            <span class="metric-name">${m.label}</span>
            <span class="metric-value">${m.value}</span>
          </div>
          <div class="metric-progress-track">
            <div class="metric-progress-fill ${m.color}" style="width: ${m.progress}%;"></div>
          </div>
        </div>
      `)
      .join('');
  }

  /**
   * Master Recalculate & Re-render Function
   */
  function recalculateAndRenderAll() {
    saveDataset();
    const analytics = computeAnalytics();

    updateKPICards(analytics);
    updateRevenueLineChart(analytics);
    updateMonthlySalesChart(analytics);
    updateProductBarChart(analytics);
    updateCategoryDonutChart(analytics);
    updateRegionalRevenueChart(analytics);
    updateKeyMetrics(analytics);
    renderEditableTable();
  }

  /**
   * Render the Editable Sales Data Table
   */
  function renderEditableTable() {
    const tbody = document.getElementById('editable-table-body');
    const countLabel = document.getElementById('editable-table-count');
    if (!tbody) return;

    if (countLabel) {
      const totalRev = salesDataset.reduce((s, r) => s + (Number(r.revenue) || 0), 0);
      countLabel.textContent = `${salesDataset.length} Records • Total: ${formatINR(totalRev)}`;
    }

    if (salesDataset.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center; padding: 24px; color: var(--text-dim); font-size: 0.8rem;">
            No sales records. Click "＋ Add Record" below to insert an order!
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = salesDataset
      .map((row) => `
        <tr data-id="${row.id}" class="editable-row">
          <td style="width: 100px;">
            <input type="text" class="table-cell-input order-id-input" value="${row.orderId || ''}" data-field="orderId" placeholder="ORD-1001" />
          </td>
          <td style="width: 120px;">
            <input type="date" class="table-cell-input" value="${row.date || ''}" data-field="date" />
          </td>
          <td>
            <input type="text" class="table-cell-input" value="${row.product || ''}" data-field="product" placeholder="Product name" />
          </td>
          <td style="width: 110px;">
            <input type="text" class="table-cell-input" value="${row.category || ''}" data-field="category" placeholder="Category" />
          </td>
          <td style="width: 65px;">
            <input type="number" min="1" step="1" class="table-cell-input text-center qty-input" value="${row.quantity}" data-field="quantity" />
          </td>
          <td style="width: 95px;">
            <input type="number" min="0" step="50" class="table-cell-input price-input" value="${row.unitPrice}" data-field="unitPrice" />
          </td>
          <td style="width: 110px; text-align: right; font-weight: 700; color: #fff;" class="row-revenue-cell">
            ${formatINR(row.revenue)}
          </td>
          <td>
            <input type="text" class="table-cell-input" value="${row.region || row.city || ''}" data-field="region" placeholder="City / Region" />
          </td>
          <td style="width: 40px; text-align: center;">
            <button class="delete-row-btn" data-id="${row.id}" title="Delete this record" aria-label="Delete">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </td>
        </tr>
      `)
      .join('');
  }

  /**
   * Handle Inline Table Input Changes (Live Reactive Update)
   */
  function handleCellChange(e) {
    const target = e.target;
    if (!target.classList.contains('table-cell-input')) return;

    const rowEl = target.closest('tr');
    if (!rowEl) return;
    const rowId = rowEl.getAttribute('data-id');
    const field = target.getAttribute('data-field');

    const record = salesDataset.find((r) => r.id === rowId);
    if (!record) return;

    let val = target.value;
    if (field === 'quantity') {
      val = Math.max(1, parseInt(val, 10) || 1);
      record.quantity = val;
    } else if (field === 'unitPrice') {
      val = Math.max(0, parseFloat(val) || 0);
      record.unitPrice = val;
    } else {
      record[field] = val;
    }

    // Auto-recalculate revenue for this record
    record.revenue = record.quantity * record.unitPrice;

    // Update row revenue cell text immediately
    const revCell = rowEl.querySelector('.row-revenue-cell');
    if (revCell) revCell.textContent = formatINR(record.revenue);

    // Save and immediately recalculate all charts, KPIs, and metrics
    saveDataset();
    const analytics = computeAnalytics();
    updateKPICards(analytics);
    updateRevenueLineChart(analytics);
    updateMonthlySalesChart(analytics);
    updateProductBarChart(analytics);
    updateCategoryDonutChart(analytics);
    updateRegionalRevenueChart(analytics);
    updateKeyMetrics(analytics);

    const countLabel = document.getElementById('editable-table-count');
    if (countLabel) {
      countLabel.textContent = `${salesDataset.length} Records • Total: ${formatINR(analytics.totalRevenue)}`;
    }
  }

  /**
   * Add a New Sales Record Row
   */
  function addNewRecord() {
    const nextNum = salesDataset.length + 1;
    const today = new Date().toISOString().slice(0, 10);

    const newRecord = {
      id: 'rec_' + Date.now(),
      orderId: `ORD-${1000 + nextNum}`,
      date: today,
      product: 'New Product',
      category: 'Electronics',
      quantity: 1,
      unitPrice: 5000,
      revenue: 5000,
      region: 'Bengaluru (South)',
      city: 'Bengaluru',
      paymentMethod: 'UPI',
      status: 'Delivered'
    };

    salesDataset.push(newRecord);
    recalculateAndRenderAll();

    // Focus on the newly created row's product input
    setTimeout(() => {
      const rows = document.querySelectorAll('.editable-row');
      const lastRow = rows[rows.length - 1];
      if (lastRow) {
        const input = lastRow.querySelector('input[data-field="product"]');
        if (input) {
          input.focus();
          input.select();
        }
      }
    }, 50);
  }

  /**
   * Delete a Record
   */
  function deleteRecord(id) {
    if (!id) return;
    salesDataset = salesDataset.filter((r) => r.id !== id);
    recalculateAndRenderAll();
  }

  /**
   * Reset to Original subai(1).xlsx Defaults
   */
  function resetToDefault() {
    localStorage.removeItem('retail_sales_active_data_v3');
    salesDataset = JSON.parse(JSON.stringify(window.DEFAULT_SALES_RECORDS || []));
    recalculateAndRenderAll();
  }

  /**
   * Setup Event Listeners
   */
  function setupEventListeners() {
    const tableContainer = document.getElementById('editable-table-body');
    if (tableContainer) {
      tableContainer.addEventListener('input', handleCellChange);
      tableContainer.addEventListener('change', handleCellChange);

      tableContainer.addEventListener('click', (e) => {
        const delBtn = e.target.closest('.delete-row-btn');
        if (delBtn) {
          const id = delBtn.getAttribute('data-id');
          deleteRecord(id);
        }
      });
    }

    const addBtn = document.getElementById('add-record-btn');
    if (addBtn) addBtn.addEventListener('click', addNewRecord);

    const resetBtn = document.getElementById('reset-dataset-btn');
    if (resetBtn) resetBtn.addEventListener('click', resetToDefault);

    // Modal Open & Close Event Listeners
    const modal = document.getElementById('data-edit-modal');
    const openModalBtn = document.getElementById('open-data-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');

    if (openModalBtn && modal) {
      openModalBtn.addEventListener('click', () => {
        modal.classList.add('active');
      });
    }

    if (closeModalBtn && modal) {
      closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
      }
    });
  }

  /**
   * Initialize Global Chart Configuration & Dashboard
   */
  function init() {
    if (typeof Chart === 'undefined') {
      // Retry in 50ms if Chart.js is still loading asynchronously
      setTimeout(init, 50);
      return;
    }

    Chart.defaults.color = '#94a3b8';
    Chart.defaults.font.family = "'Inter', -apple-system, sans-serif";
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(18, 16, 38, 0.94)';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(217, 70, 239, 0.4)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 9;
    Chart.defaults.plugins.tooltip.cornerRadius = 7;
    Chart.defaults.plugins.tooltip.titleColor = '#ffffff';
    Chart.defaults.plugins.tooltip.bodyColor = '#e2e8f0';

    loadDataset();
    recalculateAndRenderAll();
    setupEventListeners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
