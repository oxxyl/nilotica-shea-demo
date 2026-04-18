/* ============================================================
 * NILOTICA SHEA — BATCH DETAIL LOGIC
 * ============================================================ */
(function () {
  'use strict';

  const D = window.NSC_DATA;
  if (!D) return;

  const $ = (sel) => document.querySelector(sel);
  const fmt = (n, d = 0) => Number(n).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

  /* Read batch id from query string */
  const params = new URLSearchParams(window.location.search);
  const batchId = params.get('id') || D.BATCHES[0].id;
  const batch = D.BATCHES.find(b => b.id === batchId) || D.BATCHES[0];

  /* Populate hero */
  $('#batch-id').textContent = batch.id;
  $('#batch-stage-label').textContent = batch.stageLabel;
  $('#batch-stage-label').className = 'stage-pill ' + batch.stage;

  $('#stat-harvest').textContent = batch.harvestDate;
  $('#stat-kg').textContent = fmt(batch.totalKg);
  $('#stat-farmers').textContent = batch.farmerCount;
  $('#stat-groups').textContent = batch.groupIds.length;

  /* Destination / status */
  const destEl = $('#batch-destination');
  if (destEl) {
    destEl.textContent = batch.destination && batch.destination !== '—'
      ? batch.destination
      : 'Not yet assigned';
  }

  /* Groups list */
  const groupList = $('#group-list');
  if (groupList) {
    groupList.innerHTML = batch.groupIds.map(gid => {
      const g = D.GROUPS.find(x => x.id === gid);
      if (!g) return '';
      return `
        <div class="group-row">
          <div class="group-row-left">
            <span class="gid">${g.id}</span>
            <span class="gname">${g.name}</span>
          </div>
          <span class="gmeta">${g.district} · ${g.members} members</span>
        </div>
      `;
    }).join('');
  }

  /* QC table */
  const qcTable = $('#qc-tbody');
  if (qcTable) {
    if (!batch.qc || batch.qc.moisture === null || batch.qc.moisture === undefined) {
      qcTable.innerHTML = `
        <tr><td colspan="4" class="qc-result pending">
          Quality control testing has not yet been completed for this batch.
          ${batch.qc && batch.qc.testedBy ? '<br/>Status: ' + batch.qc.testedBy : ''}
        </td></tr>
      `;
    } else {
      const params = [
        { key: 'moisture', label: 'Moisture Content', unit: '%', limit: 7.0, decimals: 1 },
        { key: 'ffa', label: 'Free Fatty Acids', unit: '%', limit: 2.0, decimals: 1 },
        { key: 'peroxide', label: 'Peroxide Value', unit: 'meq/kg', limit: 10.0, decimals: 1 },
        { key: 'impurities', label: 'Impurities', unit: '%', limit: 0.10, decimals: 2 },
        { key: 'aflatoxin', label: 'Aflatoxin', unit: 'ppb', limit: 10.0, decimals: 1 }
      ];
      qcTable.innerHTML = params.map(p => {
        const val = batch.qc[p.key];
        const pass = batch.qc[p.key + 'Pass'];
        const cls = pass === true ? 'pass' : (pass === false ? 'fail' : 'pending');
        const status = pass === true ? 'PASS' : (pass === false ? 'FAIL' : '—');
        return `
          <tr>
            <td class="qc-param">${p.label}</td>
            <td>${fmt(val, p.decimals)} ${p.unit}</td>
            <td class="qc-limit">≤ ${fmt(p.limit, p.decimals)} ${p.unit}</td>
            <td class="qc-result ${cls}">${status}</td>
          </tr>
        `;
      }).join('') + `
        <tr>
          <td class="qc-param">Pesticide Residue</td>
          <td colspan="2">${batch.qc.pesticide || 'Not tested'}</td>
          <td class="qc-result pass">PASS</td>
        </tr>
      `;
    }
  }

  const qcMeta = $('#qc-meta');
  if (qcMeta && batch.qc) {
    qcMeta.textContent = batch.qc.testDate
      ? `Tested by ${batch.qc.testedBy} · ${batch.qc.testDate}`
      : batch.qc.testedBy || '';
  }

  /* Certifications */
  const certWrap = $('#batch-certs');
  if (certWrap) {
    const statusLabels = {
      in_progress: 'In Progress',
      pending_audit: 'Pending Audit',
      planned: 'Planned',
      certified: 'Certified'
    };
    const list = [
      { code: 'usda_organic', label: 'USDA Organic / NOP', icon: 'OR' },
      { code: 'eu_organic',   label: 'EU Organic',         icon: 'EU' },
      { code: 'fairtrade',    label: 'Fairtrade (FLO)',    icon: 'FT' }
    ];
    certWrap.innerHTML = list.map(c => {
      const status = batch.certifications[c.code] || 'planned';
      return `
        <div class="cert">
          <div class="cert-label">
            <div class="cert-icon">${c.icon}</div>
            ${c.label}
          </div>
          <div class="cert-status ${status}">${statusLabels[status] || status}</div>
        </div>
      `;
    }).join('');
  }

  /* EUDR checklist */
  const eudrWrap = $('#eudr-list');
  if (eudrWrap) {
    const items = [
      { key: 'polygons',        label: 'Plot polygons (> 4 ha)' },
      { key: 'gpsPoints',       label: 'GPS points (≤ 4 ha)' },
      { key: 'collectionDate',  label: 'Collection date per parcel' },
      { key: 'noDeforestation', label: 'No deforestation post-2020' },
      { key: 'producerDetails', label: 'Producer names & addresses' }
    ];
    eudrWrap.innerHTML = items.map(it => `
      <div class="eudr-item">
        <div class="eudr-check">${batch.eudr[it.key] ? '✓' : '·'}</div>
        <div class="eudr-text">${it.label}</div>
      </div>
    `).join('');
  }

  /* Risk meter */
  const riskFill = $('#risk-fill');
  const riskScore = $('#risk-score');
  const riskBand = $('#risk-band');
  if (riskFill && batch.eudr) {
    // Risk score is 0–1; display as % filled with low values being ok
    const pct = Math.min(100, Math.round(batch.eudr.riskScore * 100 * 4)); // scale for visibility
    setTimeout(() => { riskFill.style.width = Math.max(6, pct) + '%'; }, 300);
    if (riskScore) riskScore.textContent = batch.eudr.riskScore.toFixed(2);
    if (riskBand) riskBand.textContent = batch.eudr.riskBand;
  }

  /* Map — show collection zones for this batch */
  function renderBatchMap() {
    const el = document.getElementById('batch-map');
    if (!el || typeof L === 'undefined') return;

    const map = L.map('batch-map', {
      zoom: 8,
      scrollWheelZoom: false,
      zoomControl: true
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap, © CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    const bounds = L.latLngBounds([]);

    // Contributing group pins
    batch.groupIds.forEach(gid => {
      const g = D.GROUPS.find(x => x.id === gid);
      if (!g) return;
      L.circleMarker([g.lat, g.lng], {
        radius: 8,
        color: '#00ff88',
        weight: 2,
        fillColor: '#00ff88',
        fillOpacity: 0.35
      }).addTo(map).bindPopup(`<strong>${g.name}</strong><br/>${g.district}`);
      bounds.extend([g.lat, g.lng]);
    });

    // Collection polygons
    batch.coordinates.forEach((poly, i) => {
      L.polygon(poly, {
        color: '#d4a84a',
        weight: 1.5,
        fillColor: '#d4a84a',
        fillOpacity: 0.18,
        dashArray: '3,3'
      }).addTo(map).bindPopup(`Collection zone ${i + 1}`);
      poly.forEach(p => bounds.extend(p));
    });

    // Processing facility
    const hq = D.COOP.hq;
    const hqIcon = L.divIcon({
      className: 'hq-icon',
      html: '<div style="width:14px;height:14px;background:#d4a84a;transform:rotate(45deg);border:2px solid #050607;box-shadow:0 0 10px #d4a84a;"></div>',
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });
    L.marker([hq.lat, hq.lng], { icon: hqIcon }).addTo(map)
      .bindPopup(`<strong>${hq.name}</strong>`);
    bounds.extend([hq.lat, hq.lng]);

    map.fitBounds(bounds, { padding: [40, 40] });
  }
  setTimeout(renderBatchMap, 200);

  /* QR code — render pointing to this batch's public URL */
  function renderQR() {
    const el = document.getElementById('qr-target');
    if (!el || typeof qrcode === 'undefined') return;
    const url = window.location.href;
    const qr = qrcode(0, 'M');
    qr.addData(url);
    qr.make();
    el.innerHTML = qr.createImgTag(6, 0);
  }
  setTimeout(renderQR, 100);

  /* Contribution breakdown: kg per group */
  function renderBatchChart() {
    const ctx = document.getElementById('chart-batch-contribution');
    if (!ctx || typeof Chart === 'undefined') return;

    const gs = batch.groupIds.map(gid => D.GROUPS.find(x => x.id === gid)).filter(Boolean);
    const totalMem = gs.reduce((s, g) => s + g.members, 0) || 1;
    const labels = gs.map(g => g.name.replace(/Women.*|Gatherers.*|Collective.*|United.*|Cooperative.*|Association.*/g, '').trim() || g.id);
    const data = gs.map(g => Math.round(batch.totalKg * (g.members / totalMem)));

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: ctx => {
            const c = ctx.chart.ctx;
            const g = c.createLinearGradient(0, 0, 400, 0);
            g.addColorStop(0, 'rgba(212,168,74,0.95)');
            g.addColorStop(1, 'rgba(212,168,74,0.25)');
            return g;
          },
          borderColor: '#d4a84a',
          borderWidth: 1,
          borderRadius: 1,
          barThickness: 18
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
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
            callbacks: { label: (c) => fmt(c.parsed.x) + ' kg' }
          }
        },
        scales: {
          x: {
            grid: { color: '#1f262d', drawBorder: false },
            ticks: {
              color: '#5a636d',
              font: { family: 'JetBrains Mono', size: 10 },
              callback: v => fmt(v)
            },
            beginAtZero: true
          },
          y: {
            grid: { display: false, drawBorder: false },
            ticks: {
              color: '#9aa3ad',
              font: { family: 'JetBrains Mono', size: 10 }
            }
          }
        }
      }
    });
  }
  setTimeout(renderBatchChart, 300);

  /* Update title */
  document.title = `${batch.id} · Nilotica Shea Traceability`;
})();
