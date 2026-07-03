import { DISTANCE_BANDS, PREFECTURES, type DistanceBand, type Prefecture, type Station } from '../domain/station';
import type { WeightSettings } from '../domain/weights';

type WeightedItem<T> = {
  item: T;
  weight: number;
};

export function pickWeighted<T>(items: WeightedItem<T>[]): T {
  const validItems = items.filter((entry) => Number.isFinite(entry.weight) && entry.weight > 0);
  const totalWeight = validItems.reduce((sum, entry) => sum + entry.weight, 0);

  if (totalWeight <= 0) {
    throw new Error('抽選可能なウェイトがありません');
  }

  let random = Math.random() * totalWeight;

  for (const entry of validItems) {
    random -= entry.weight;
    if (random <= 0) {
      return entry.item;
    }
  }

  return validItems[validItems.length - 1].item;
}

export function pickStations(
  allStations: Station[],
  settings: WeightSettings,
  count = 3,
): Station[] {
  const picked: Station[] = [];
  let remaining = [...allStations];

  while (picked.length < count && remaining.length > 0) {
    const prefecture = pickAvailablePrefecture(remaining, settings);
    const distanceBand = pickAvailableDistanceBand(remaining, prefecture, settings);
    const candidates = remaining.filter(
      (station) => station.prefecture === prefecture && station.distanceBand === distanceBand,
    );

    if (candidates.length === 0) {
      break;
    }

    const station = candidates[Math.floor(Math.random() * candidates.length)];
    picked.push(station);
    remaining = remaining.filter((candidate) => candidate.id !== station.id);
  }

  return picked;
}

function pickAvailablePrefecture(stations: Station[], settings: WeightSettings): Prefecture {
  const weightedPrefectures = PREFECTURES
    .filter((prefecture) => stations.some((station) => station.prefecture === prefecture))
    .map((prefecture) => ({
      item: prefecture,
      weight: settings.prefectureWeights[prefecture] ?? 0,
    }));

  return pickWeighted(weightedPrefectures);
}

function pickAvailableDistanceBand(
  stations: Station[],
  prefecture: Prefecture,
  settings: WeightSettings,
): DistanceBand {
  const stationsInPrefecture = stations.filter((station) => station.prefecture === prefecture);

  const weightedBands = DISTANCE_BANDS
    .filter((distanceBand) => stationsInPrefecture.some((station) => station.distanceBand === distanceBand))
    .map((distanceBand) => ({
      item: distanceBand,
      weight: settings.distanceWeights[distanceBand] ?? 0,
    }));

  return pickWeighted(weightedBands);
}
