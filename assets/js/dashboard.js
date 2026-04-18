/* ============================================================
 * NILOTICA SHEA — DASHBOARD LOGIC
 * ============================================================ */
(function () {
  'use strict';

  const D = window.NSC_DATA;
  if (!D) { console.error('Data not loaded'); return; }

  /* ---------- Helpers ---------- */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const fmt = (n, d = 0) => Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

  /* ---------- KPI computation ---------- */
  const totalBatches = D.BATCHES.length;
  const totalKg = D.BATCHES.reduce((s, b) => s + b.totalKg, 0);
  const activeFarmers = D.BATCHES.reduce((s, b) => s + b.farmerCount, 0);
  const eudrReady = D.BATCHES.filter(b =>
    b.eudr.polygons && b.eudr.gpsPoints && b.eudr.collectionDate && b.eudr.noDeforestation && b.eudr.producerDetails
  ).length;
  const eudrPct = Math.round((eudrReady / totalBatches) * 100);
  const readyForDispatch = D.BATCHES.filter(b => b.stage === 'dispatch').length;

  const setKpi = (id, value, isInt = true) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.dataset.target = value;
    el.textContent = isInt ? '0' : '0.0';
  };

  setKpi('kpi-batches', totalBatches);
  setKpi('kpi-kg', totalKg);
  setKpi('kpi-farmers', activeFarmers);
  setKpi('kpi-groups', D.GROUPS.length);
  setKpi('kpi-eudr', eudrPct);
  setKpi('kpi-dispatch', readyForDispatch);

  /* ---------- Counter animation ---------- */
  function animateCounter(el, target, duration = 1100) {
    const start = performance.now();
    const from = 0;
    const isInt = Number.isInteger(Number(target));
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = from + (target - from) * eased;
      el.textContent = isInt ? fmt(Math.round(val)) : fmt(val, 1);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = fmt(target, isInt ? 0 : 1);
    }
    requestAnimationFrame(step);
  }

  // Kick off counters slightly staggered
  setTimeout(() => {
    $$('.counter').forEach((el, i) => {
      const target = parseFloat(el.dataset.target || '0');
      setTimeout(() => animateCounter(el, target), i * 90);
    });
  }, 300);

  /* ---------- Pipeline rendering ---------- */
  function renderPipeline() {
    const byStage = {};
    D.STAGES.forEach(s => byStage[s.key] = { count: 0, kg: 0 });
    D.BATCHES.forEach(b => {
      if (!byStage[b.stage]) byStage[b.stage] = { count: 0, kg: 0 };
      byStage[b.stage].count += 1;
      byStage[b.stage].kg += b.totalKg;
    });
    const wrap = document.getElementById('pipeline');
    if (!wrap) return;
    wrap.innerHTML = D.STAGES.map((s, i) => {
      const data = byStage[s.key];
      const active = data.count > 0 ? ' active' : '';
      const num = String(i + 1).padStart(2, '0');
      return `
        <div class="pipeline-stage${active}">
          <div class="pipeline-stage-num">STAGE ${num}</div>
          <div class="pipeline-stage-label">${s.label}</div>
          <div class="pipeline-stage-count">${data.count}</div>
          <div class="pipeline-stage-kg">${fmt(data.kg)} KG</div>
        </div>
      `;
    }).join('');
  }
  renderPipeline();

  /* ---------- Batch table ---------- */
  function renderBatchTable() {
    const tbody = document.getElementById('batch-tbody');
    if (!tbody) return;
    tbody.innerHTML = D.BATCHES.map(b => {
      const groups = b.groupIds.map(gid => D.GROUPS.find(g => g.id === gid)?.district).filter(Boolean);
      const uniqueDistricts = [...new Set(groups)];
      return `
        <tr>
          <td><a href="batch.html?id=${b.id}" class="batch-id">${b.id}</a></td>
          <td>${b.harvestDate}</td>
          <td>${uniqueDistricts.join(', ')}</td>
          <td>${fmt(b.totalKg)} kg</td>
          <td>${b.farmerCount}</td>
          <td><span class="stage-pill ${b.stage}">${b.stageLabel}</span></td>
          <td><a href="batch.html?id=${b.id}" class="view-link">View</a></td>
        </tr>
      `;
    }).join('');
  }
  renderBatchTable();

  /* ---------- Certifications ---------- */
  function renderCerts() {
    const wrap = document.getElementById('cert-list');
    if (!wrap) return;
    const statusLabels = {
      in_progress: 'In Progress',
      pending_audit: 'Pending Audit',
      planned: 'Planned',
      certified: 'Certified'
    };
    wrap.innerHTML = D.COOP.certifications.map(c => {
      const iconMap = { usda_organic: 'OR', eu_organic: 'EU', fairtrade: 'FT' };
      return `
        <div class="cert">
          <div class="cert-label">
            <div class="cert-icon">${iconMap[c.code] || '★'}</div>
            ${c.label}
          </div>
          <div class="cert-status ${c.status}">${statusLabels[c.status] || c.status}</div>
        </div>
      `;
    }).join('');
  }
  renderCerts();

  /* ---------- Map (Leaflet) ---------- */
  function renderMap() {
    const el = document.getElementById('map');
    if (!el || typeof L === 'undefined') return;

    const map = L.map('map', {
      center: [3.05, 32.70],
      zoom: 8,
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true
    });

    // Dark tile layer (Carto Dark Matter)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors, © CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Collection groups (neon green pins)
    D.GROUPS.forEach(g => {
      const marker = L.circleMarker([g.lat, g.lng], {
        radius: 7,
        color: '#00ff88',
        weight: 2,
        fillColor: '#00ff88',
        fillOpacity: 0.35
      }).addTo(map);
      marker.bindPopup(
        `<strong>${g.name}</strong><br/>` +
        `${g.village}, ${g.district}<br/>` +
        `Members: ${g.members}<br/>` +
        `<span style="color:#d4a84a">${g.id}</span>`
      );
    });

    // Processing facility (gold diamond)
    const hq = D.COOP.hq;
    const hqIcon = L.divIcon({
      className: 'hq-icon',
      html: '<div style="width:14px;height:14px;background:#d4a84a;transform:rotate(45deg);border:2px solid #050607;box-shadow:0 0 10px #d4a84a;"></div>',
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });
    L.marker([hq.lat, hq.lng], { icon: hqIcon }).addTo(map)
      .bindPopup(`<strong>${hq.name}</strong><br/>Cooperative HQ & Processing`);

    // Batch coordinate polygons (optional: overlay polygons from active batches)
    D.BATCHES.filter(b => b.stage === 'dispatch' || b.stage === 'storage').forEach(b => {
      b.coordinates.forEach(poly => {
        L.polygon(poly, {
          color: '#d4a84a',
          weight: 1.3,
          fillColor: '#d4a84a',
          fillOpacity: 0.12,
          dashArray: '3,3'
        }).addTo(map).bindPopup(
          `<strong>${b.id}</strong><br/>Collection zone<br/>${b.stageLabel}`
        );
      });
    });

    // Fit to markers
    const bounds = L.latLngBounds(D.GROUPS.map(g => [g.lat, g.lng]));
    bounds.extend([hq.lat, hq.lng]);
    map.fitBounds(bounds, { padding: [40, 40] });
  }
  setTimeout(renderMap, 200);

  /* ---------- Contribution chart (Chart.js) ---------- */
  function renderContributionChart() {
    const ctx = document.getElementById('chart-contribution');
    if (!ctx || typeof Chart === 'undefined') return;

    // Aggregate kg per district from batches & groups
    const districtKg = {};
    D.GROUPS.forEach(g => { districtKg[g.district] = 0; });
    D.BATCHES.forEach(b => {
      // Distribute batch kg across contributing groups by member count
      const gs = b.groupIds.map(gid => D.GROUPS.find(x => x.id === gid)).filter(Boolean);
      const totalMem = gs.reduce((s, g) => s + g.members, 0) || 1;
      gs.forEach(g => {
        districtKg[g.district] += Math.round(b.totalKg * (g.members / totalMem));
      });
    });
    const labels = Object.keys(districtKg);
    const data = labels.map(k => districtKg[k]);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: ctx => {
            const c = ctx.chart.ctx;
            const g = c.createLinearGradient(0, 0, 0, 280);
            g.addColorStop(0, 'rgba(0,255,136,0.9)');
            g.addColorStop(1, 'rgba(0,255,136,0.15)');
            return g;
          },
          borderColor: '#00ff88',
          borderWidth: 1,
          borderRadius: 1,
          barThickness: 22
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#11151a',
            borderColor: '#1f262d',
            borderWidth: 1,
            titleColor: '#e8ecef',
            bodyColor: '#00ff88',
            titleFont: { family: 'Space Grotesk', size: 12, weight: '600' },
            bodyFont: { family: 'JetBrains Mono', size: 12 },
            padding: 10,
            displayColors: false,
            callbacks: {
              label: (ctx) => fmt(ctx.parsed.y) + ' kg'
            }
          }
        },
        scales: {
          x: {
            grid: { display: false, drawBorder: false },
            ticks: {
              color: '#9aa3ad',
              font: { family: 'JetBrains Mono', size: 10 }
            }
          },
          y: {
            grid: { color: '#1f262d', drawBorder: false },
            ticks: {
              color: '#5a636d',
              font: { family: 'JetBrains Mono', size: 10 },
              callback: v => fmt(v)
            },
            beginAtZero: true
          }
        }
      }
    });
  }
  setTimeout(renderContributionChart, 300);

  /* ---------- QC pass-rate chart ---------- */
  function renderQCChart() {
    const ctx = document.getElementById('chart-qc');
    if (!ctx || typeof Chart === 'undefined') return;

    const params = ['moisture', 'ffa', 'peroxide', 'impurities', 'aflatoxin'];
    const labels = ['Moisture', 'FFA', 'Peroxide', 'Impurities', 'Aflatoxin'];
    const tested = D.BATCHES.filter(b => b.qc && b.qc.moisture !== null);
    const passRates = params.map(p => {
      const passed = tested.filter(b => b.qc[p + 'Pass'] === true).length;
      return tested.length ? Math.round((passed / tested.length) * 100) : 0;
    });

    new Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          data: passRates,
          backgroundColor: 'rgba(212, 168, 74, 0.15)',
          borderColor: '#d4a84a',
          borderWidth: 1.5,
          pointBackgroundColor: '#d4a84a',
          pointBorderColor: '#050607',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#11151a',
            borderColor: '#1f262d',
            borderWidth: 1,
            titleColor: '#e8ecef',
            bodyColor: '#d4a84a',
            titleFont: { family: 'Space Grotesk', size: 12, weight: '600' },
            bodyFont: { family: 'JetBrains Mono', size: 12 },
            padding: 10,
            displayColors: false,
            callbacks: { label: (c) => c.parsed.r + '% pass rate' }
          }
        },
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: {
              color: '#5a636d',
              backdropColor: 'transparent',
              font: { family: 'JetBrains Mono', size: 9 },
              stepSize: 25
            },
            grid: { color: '#1f262d' },
            angleLines: { color: '#1f262d' },
            pointLabels: {
              color: '#9aa3ad',
              font: { family: 'JetBrains Mono', size: 10 }
            }
          }
        }
      }
    });
  }
  setTimeout(renderQCChart, 350);

  /* ---------- Live clock in topbar ---------- */
  function updateClock() {
    const el = document.getElementById('live-time');
    if (!el) return;
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    el.textContent = `${hh}:${mm}:${ss} EAT`;
  }
  updateClock();
  setInterval(updateClock, 1000);

})();
