/* ============================================================
 * NILOTICA SHEA TRACEABILITY — DEMO DATA
 * ------------------------------------------------------------
 * All data in this file is SYNTHETIC. Names are common Acholi/Luo
 * first names paired with fictional surnames. GPS coordinates are
 * realistic for Northern Uganda but do not correspond to any real
 * farm, person or facility. For demonstration purposes only.
 * ============================================================ */

const COOP = {
  name: "Nilotica Shea Company Limited",
  form: "Producer Company",
  registered: 2024,
  hq: { name: "Gulu Processing Facility", lat: 2.7746, lng: 32.2990 },
  districts: ["Gulu", "Kitgum", "Agago", "Pader", "Lamwo", "Amuru", "Omoro", "Nwoya"],
  members: 148,
  groups: 10,
  seasonKg: 2984,
  certifications: [
    { code: "usda_organic", label: "USDA Organic / NOP", status: "in_progress", since: "2026-01-15" },
    { code: "eu_organic",   label: "EU Organic",         status: "in_progress", since: "2026-02-02" },
    { code: "fairtrade",    label: "Fairtrade (FLO)",    status: "planned",     since: "—" }
  ]
};

/* ---------- Collection groups (aggregation centres) ---------- */
const GROUPS = [
  { id: "GRP-001", name: "Paicho Women's Group",        village: "Paicho",        district: "Gulu",   lat: 2.8912, lng: 32.3611, members: 18 },
  { id: "GRP-002", name: "Awach Shea Gatherers",        village: "Awach",         district: "Gulu",   lat: 3.0456, lng: 32.4120, members: 14 },
  { id: "GRP-003", name: "Mucwini Women United",        village: "Mucwini",       district: "Kitgum", lat: 3.3667, lng: 33.0833, members: 21 },
  { id: "GRP-004", name: "Kitgum Matidi Collective",    village: "Kitgum Matidi", district: "Kitgum", lat: 3.2789, lng: 32.8901, members: 12 },
  { id: "GRP-005", name: "Patongo Gatherers",           village: "Patongo",       district: "Agago",  lat: 2.7800, lng: 33.2333, members: 16 },
  { id: "GRP-006", name: "Lira Palwo Women",            village: "Lira Palwo",    district: "Agago",  lat: 2.9167, lng: 33.1667, members: 11 },
  { id: "GRP-007", name: "Atanga Shea Cooperative",     village: "Atanga",        district: "Pader",  lat: 2.9434, lng: 33.0111, members: 15 },
  { id: "GRP-008", name: "Padibe Women United",         village: "Padibe",        district: "Lamwo",  lat: 3.6500, lng: 32.9500, members: 13 },
  { id: "GRP-009", name: "Amuru Gatherers Association", village: "Amuru",         district: "Amuru",  lat: 2.9333, lng: 32.0000, members: 17 },
  { id: "GRP-010", name: "Anaka Shea Women",            village: "Anaka",         district: "Nwoya",  lat: 2.6833, lng: 32.0167, members: 11 }
];

/* ---------- Farmers (synthetic, Acholi/Luo names) ---------- */
// 148 farmers distributed across the 10 groups. Shortened to 30 named
// exemplars; the rest rendered as "GRP-00X-Mxx" identifiers at group level.
const FARMERS = [
  { id: "F-0001", name: "Akello Grace",    groupId: "GRP-001", kg: 22, trees: 18 },
  { id: "F-0002", name: "Lamwaka Betty",   groupId: "GRP-001", kg: 19, trees: 15 },
  { id: "F-0003", name: "Apiyo Susan",     groupId: "GRP-001", kg: 24, trees: 21 },
  { id: "F-0004", name: "Aciro Nighty",    groupId: "GRP-002", kg: 17, trees: 14 },
  { id: "F-0005", name: "Auma Christine",  groupId: "GRP-002", kg: 21, trees: 19 },
  { id: "F-0006", name: "Adong Florence",  groupId: "GRP-003", kg: 25, trees: 23 },
  { id: "F-0007", name: "Laker Evelyn",    groupId: "GRP-003", kg: 20, trees: 17 },
  { id: "F-0008", name: "Achan Margaret",  groupId: "GRP-003", kg: 18, trees: 16 },
  { id: "F-0009", name: "Aol Molly",       groupId: "GRP-004", kg: 23, trees: 20 },
  { id: "F-0010", name: "Atim Lucy",       groupId: "GRP-004", kg: 19, trees: 18 },
  { id: "F-0011", name: "Anena Harriet",   groupId: "GRP-005", kg: 22, trees: 19 },
  { id: "F-0012", name: "Adoch Jennifer",  groupId: "GRP-005", kg: 20, trees: 17 },
  { id: "F-0013", name: "Akumu Pauline",   groupId: "GRP-006", kg: 16, trees: 14 },
  { id: "F-0014", name: "Amono Beatrice",  groupId: "GRP-006", kg: 18, trees: 16 },
  { id: "F-0015", name: "Okot Consolata",  groupId: "GRP-007", kg: 21, trees: 19 },
  { id: "F-0016", name: "Piloya Joyce",    groupId: "GRP-007", kg: 23, trees: 20 },
  { id: "F-0017", name: "Lanyero Stella",  groupId: "GRP-007", kg: 19, trees: 17 },
  { id: "F-0018", name: "Aciro Rose",      groupId: "GRP-008", kg: 22, trees: 19 },
  { id: "F-0019", name: "Acen Filda",      groupId: "GRP-008", kg: 20, trees: 18 },
  { id: "F-0020", name: "Abalo Santa",     groupId: "GRP-009", kg: 24, trees: 21 },
  { id: "F-0021", name: "Opoka Janet",     groupId: "GRP-009", kg: 18, trees: 16 },
  { id: "F-0022", name: "Alum Scovia",     groupId: "GRP-009", kg: 21, trees: 19 },
  { id: "F-0023", name: "Akidi Patricia",  groupId: "GRP-010", kg: 19, trees: 17 },
  { id: "F-0024", name: "Angom Brenda",    groupId: "GRP-010", kg: 22, trees: 20 },
  { id: "F-0025", name: "Oyella Milly",    groupId: "GRP-001", kg: 20, trees: 18 },
  { id: "F-0026", name: "Ayaa Rebecca",    groupId: "GRP-002", kg: 23, trees: 20 },
  { id: "F-0027", name: "Awor Immaculate", groupId: "GRP-005", kg: 19, trees: 17 },
  { id: "F-0028", name: "Arach Doreen",    groupId: "GRP-008", kg: 21, trees: 19 },
  { id: "F-0029", name: "Atoo Vicky",      groupId: "GRP-004", kg: 18, trees: 16 },
  { id: "F-0030", name: "Ladwar Josephine",groupId: "GRP-003", kg: 24, trees: 21 }
];

/* ---------- Pipeline stages ---------- */
const STAGES = [
  { key: "harvest",     label: "Harvest",            order: 1 },
  { key: "collection",  label: "Collection Point",   order: 2 },
  { key: "processing",  label: "Processing",         order: 3 },
  { key: "qc",          label: "Quality Control",    order: 4 },
  { key: "storage",     label: "Storage",            order: 5 },
  { key: "dispatch",    label: "Dispatch / Export",  order: 6 }
];

/* ---------- Batches (5 batches at different stages) ---------- */
// Each batch has: contributing groups, farmer count, total kg, QC results,
// certification flags, EUDR readiness, deforestation risk.
const BATCHES = [
  {
    id: "NSC-2026-001",
    harvestDate: "2026-02-14",
    closedDate: "2026-02-20",
    stage: "dispatch",
    stageLabel: "Ready for Dispatch",
    totalKg: 612,
    farmerCount: 28,
    groupIds: ["GRP-001", "GRP-002", "GRP-003"],
    destination: "EU Buyer — Hamburg, Germany",
    qc: {
      moisture: 6.8, moistureLimit: 7.0, moisturePass: true,
      ffa: 1.4, ffaLimit: 2.0, ffaPass: true,
      peroxide: 4.2, peroxideLimit: 10.0, peroxidePass: true,
      impurities: 0.05, impuritiesLimit: 0.10, impuritiesPass: true,
      pesticide: "not detected", pesticidePass: true,
      aflatoxin: 1.8, aflatoxinLimit: 10.0, aflatoxinPass: true,
      testedBy: "UNBS + Internal QC", testDate: "2026-02-22"
    },
    certifications: { usda_organic: "pending_audit", eu_organic: "pending_audit", fairtrade: "planned" },
    eudr: { polygons: true, gpsPoints: true, collectionDate: true, noDeforestation: true, producerDetails: true, riskScore: 0.04, riskBand: "negligible" },
    coordinates: [
      [[2.885, 32.355], [2.900, 32.370], [2.895, 32.380], [2.880, 32.372]],
      [[3.040, 32.408], [3.052, 32.418], [3.048, 32.428], [3.035, 32.420]],
      [[3.362, 33.080], [3.375, 33.088], [3.372, 33.098], [3.360, 33.090]]
    ]
  },
  {
    id: "NSC-2026-002",
    harvestDate: "2026-02-18",
    closedDate: "2026-02-25",
    stage: "storage",
    stageLabel: "In Bulk Storage",
    totalKg: 548,
    farmerCount: 24,
    groupIds: ["GRP-004", "GRP-005", "GRP-006"],
    destination: "—",
    qc: {
      moisture: 7.1, moistureLimit: 7.0, moisturePass: false,
      ffa: 1.7, ffaLimit: 2.0, ffaPass: true,
      peroxide: 5.0, peroxideLimit: 10.0, peroxidePass: true,
      impurities: 0.08, impuritiesLimit: 0.10, impuritiesPass: true,
      pesticide: "not detected", pesticidePass: true,
      aflatoxin: 2.3, aflatoxinLimit: 10.0, aflatoxinPass: true,
      testedBy: "Internal QC", testDate: "2026-02-27"
    },
    certifications: { usda_organic: "pending_audit", eu_organic: "pending_audit", fairtrade: "planned" },
    eudr: { polygons: true, gpsPoints: true, collectionDate: true, noDeforestation: true, producerDetails: true, riskScore: 0.06, riskBand: "negligible" },
    coordinates: [
      [[3.270, 32.885], [3.285, 32.895], [3.282, 32.905], [3.268, 32.897]],
      [[2.775, 33.228], [2.788, 33.238], [2.785, 33.248], [2.772, 33.240]]
    ]
  },
  {
    id: "NSC-2026-003",
    harvestDate: "2026-03-03",
    closedDate: "2026-03-10",
    stage: "qc",
    stageLabel: "Awaiting QC Results",
    totalKg: 674,
    farmerCount: 31,
    groupIds: ["GRP-007", "GRP-008"],
    destination: "—",
    qc: {
      moisture: null, moistureLimit: 7.0, moisturePass: null,
      ffa: null, ffaLimit: 2.0, ffaPass: null,
      peroxide: null, peroxideLimit: 10.0, peroxidePass: null,
      impurities: null, impuritiesLimit: 0.10, impuritiesPass: null,
      pesticide: null, pesticidePass: null,
      aflatoxin: null, aflatoxinLimit: 10.0, aflatoxinPass: null,
      testedBy: "Pending — UNBS scheduled 2026-04-22", testDate: null
    },
    certifications: { usda_organic: "pending_audit", eu_organic: "pending_audit", fairtrade: "planned" },
    eudr: { polygons: true, gpsPoints: true, collectionDate: true, noDeforestation: true, producerDetails: true, riskScore: 0.08, riskBand: "negligible" },
    coordinates: [
      [[2.938, 33.005], [2.952, 33.015], [2.950, 33.025], [2.935, 33.017]],
      [[3.645, 32.945], [3.658, 32.955], [3.655, 32.965], [3.642, 32.957]]
    ]
  },
  {
    id: "NSC-2026-004",
    harvestDate: "2026-03-15",
    closedDate: null,
    stage: "processing",
    stageLabel: "In Processing",
    totalKg: 582,
    farmerCount: 26,
    groupIds: ["GRP-009", "GRP-010"],
    destination: "—",
    qc: {
      moisture: null, ffa: null, peroxide: null, impurities: null,
      pesticide: null, aflatoxin: null, testedBy: "Not yet sampled", testDate: null,
      moistureLimit: 7.0, ffaLimit: 2.0, peroxideLimit: 10.0, impuritiesLimit: 0.10, aflatoxinLimit: 10.0
    },
    certifications: { usda_organic: "pending_audit", eu_organic: "pending_audit", fairtrade: "planned" },
    eudr: { polygons: true, gpsPoints: true, collectionDate: true, noDeforestation: true, producerDetails: true, riskScore: 0.05, riskBand: "negligible" },
    coordinates: [
      [[2.928, 31.995], [2.942, 32.005], [2.940, 32.015], [2.925, 32.008]],
      [[2.678, 32.012], [2.692, 32.022], [2.688, 32.032], [2.675, 32.024]]
    ]
  },
  {
    id: "NSC-2026-005",
    harvestDate: "2026-03-28",
    closedDate: null,
    stage: "collection",
    stageLabel: "At Collection Point",
    totalKg: 568,
    farmerCount: 22,
    groupIds: ["GRP-001", "GRP-005", "GRP-009"],
    destination: "—",
    qc: null,
    certifications: { usda_organic: "pending_audit", eu_organic: "pending_audit", fairtrade: "planned" },
    eudr: { polygons: true, gpsPoints: true, collectionDate: true, noDeforestation: true, producerDetails: true, riskScore: 0.05, riskBand: "negligible" },
    coordinates: [
      [[2.885, 32.355], [2.900, 32.370], [2.895, 32.380], [2.880, 32.372]],
      [[2.775, 33.228], [2.788, 33.238], [2.785, 33.248], [2.772, 33.240]],
      [[2.928, 31.995], [2.942, 32.005], [2.940, 32.015], [2.925, 32.008]]
    ]
  }
];

/* ---------- Quality thresholds (for reference displays) ---------- */
const QC_THRESHOLDS = {
  moisture:   { max: 7.0,  unit: "%",    label: "Moisture Content" },
  ffa:        { max: 2.0,  unit: "%",    label: "Free Fatty Acids (FFA)" },
  peroxide:   { max: 10.0, unit: "meq/kg", label: "Peroxide Value" },
  impurities: { max: 0.10, unit: "%",    label: "Impurities" },
  aflatoxin:  { max: 10.0, unit: "ppb",  label: "Aflatoxin" }
};

/* ---------- Expose ---------- */
window.NSC_DATA = { COOP, GROUPS, FARMERS, STAGES, BATCHES, QC_THRESHOLDS };
