import fs from 'node:fs';
import path from 'node:path';

const [stationCsvPath, lineCsvPath, prefCsvPath] = process.argv.slice(2);

if (!stationCsvPath || !lineCsvPath || !prefCsvPath) {
  console.error('Usage: node scripts/generateStations.mjs ./raw/station.csv ./raw/line.csv ./raw/pref.csv');
  process.exit(1);
}

const TARGET_PREF_CODES = new Set(['11', '12', '13', '14']);
const ORIGIN_STATION_NAME = '武蔵野台';
const OUTPUT_PATH = path.resolve('src/data/stations.json');

const stations = readCsv(stationCsvPath);
const lines = readCsv(lineCsvPath);
const prefs = readCsv(prefCsvPath);

const lineByCode = new Map(lines.map((line) => [line.line_cd, line]));
const prefByCode = new Map(prefs.map((pref) => [pref.pref_cd, pref]));

const origin = stations.find(
  (station) => station.station_name === ORIGIN_STATION_NAME && station.e_status === '0',
);

if (!origin) {
  throw new Error(`${ORIGIN_STATION_NAME}駅がstation.csv内で見つかりませんでした。`);
}

const originLat = Number(origin.lat);
const originLon = Number(origin.lon);

const activeTargetStations = stations.filter((station) => {
  return station.e_status === '0' && TARGET_PREF_CODES.has(station.pref_cd) && station.station_g_cd !== origin.station_g_cd;
});

const grouped = new Map();

for (const station of activeTargetStations) {
  const groupCode = station.station_g_cd || station.station_cd;
  const pref = prefByCode.get(station.pref_cd);
  const line = lineByCode.get(station.line_cd);
  const lat = Number(station.lat);
  const lon = Number(station.lon);

  if (!pref || !line || !Number.isFinite(lat) || !Number.isFinite(lon)) {
    continue;
  }

  if (!grouped.has(groupCode)) {
    const distanceKm = calculateDistanceKm(originLat, originLon, lat, lon);
    grouped.set(groupCode, {
      id: `station-group-${groupCode}`,
      stationName: station.station_name,
      displayName: `${station.station_name}駅`,
      prefecture: pref.pref_name,
      prefectureCode: Number(station.pref_cd),
      lines: [],
      lat,
      lon,
      distanceKm,
      distanceBand: resolveDistanceBand(distanceKm),
      memo: '',
      tags: [],
    });
  }

  const current = grouped.get(groupCode);
  const lineCode = Number(station.line_cd);
  if (!current.lines.some((candidate) => candidate.lineCode === lineCode)) {
    current.lines.push({
      lineCode,
      lineName: line.line_name,
    });
  }
}

const generatedStations = [...grouped.values()].sort((a, b) => {
  if (a.prefectureCode !== b.prefectureCode) return a.prefectureCode - b.prefectureCode;
  return a.distanceKm - b.distanceKm;
});

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, JSON.stringify(generatedStations, null, 2), 'utf8');

console.log(`Generated ${generatedStations.length} stations -> ${OUTPUT_PATH}`);

function readCsv(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
  const rows = parseCsv(raw);
  const headers = rows[0];
  return rows.slice(1).filter((row) => row.length > 1).map((row) => {
    return Object.fromEntries(headers.map((header, index) => [header, row[index] ?? '']));
  });
}

function parseCsv(raw) {
  const rows = [];
  let row = [];
  let value = '';
  let inQuotes = false;

  for (let i = 0; i < raw.length; i += 1) {
    const char = raw[i];
    const next = raw[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(value);
      value = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(value);
      rows.push(row);
      row = [];
      value = '';
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  return rows;
}

function calculateDistanceKm(fromLat, fromLon, toLat, toLon) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(toLat - fromLat);
  const dLon = toRadians(toLon - fromLon);
  const lat1 = toRadians(fromLat);
  const lat2 = toRadians(toLat);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(earthRadiusKm * c * 10) / 10;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function resolveDistanceBand(distanceKm) {
  if (distanceKm <= 2) return 'within2km';
  if (distanceKm <= 7) return 'from2to7km';
  if (distanceKm <= 12) return 'from7to12km';
  if (distanceKm <= 18) return 'from12to18km';
  return 'over18km';
}
