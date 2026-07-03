import { defaultWeightSettings, type WeightSettings } from '../domain/weights';
import { DISTANCE_BANDS, PREFECTURES } from '../domain/station';

const STORAGE_KEY = 'daughter_odekake_station_weights_v1';

export function loadSettings(): WeightSettings {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return defaultWeightSettings;
  }

  try {
    const parsed = JSON.parse(raw) as WeightSettings;
    return sanitizeSettings(parsed);
  } catch {
    return defaultWeightSettings;
  }
}

export function saveSettings(settings: WeightSettings): void {
  const sanitized = sanitizeSettings(settings);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
}

export function resetSettings(): WeightSettings {
  localStorage.removeItem(STORAGE_KEY);
  return defaultWeightSettings;
}

export function validateSettings(settings: WeightSettings): string | null {
  const prefectureValues = PREFECTURES.map((prefecture) => settings.prefectureWeights[prefecture]);
  const distanceValues = DISTANCE_BANDS.map((band) => settings.distanceWeights[band]);

  if ([...prefectureValues, ...distanceValues].some((value) => !Number.isInteger(value))) {
    return 'ウェイトは整数で入力してください。';
  }

  if ([...prefectureValues, ...distanceValues].some((value) => value < 0)) {
    return 'マイナスの値は設定できません。';
  }

  if (prefectureValues.every((value) => value === 0)) {
    return '都県のウェイトは、少なくとも1つは1以上にしてください。';
  }

  if (distanceValues.every((value) => value === 0)) {
    return '距離のウェイトは、少なくとも1つは1以上にしてください。';
  }

  return null;
}

function sanitizeSettings(settings: WeightSettings): WeightSettings {
  return {
    prefectureWeights: {
      東京都: toSafeInteger(settings.prefectureWeights?.東京都, defaultWeightSettings.prefectureWeights.東京都),
      埼玉県: toSafeInteger(settings.prefectureWeights?.埼玉県, defaultWeightSettings.prefectureWeights.埼玉県),
      神奈川県: toSafeInteger(settings.prefectureWeights?.神奈川県, defaultWeightSettings.prefectureWeights.神奈川県),
      千葉県: toSafeInteger(settings.prefectureWeights?.千葉県, defaultWeightSettings.prefectureWeights.千葉県),
    },
    distanceWeights: {
      within2km: toSafeInteger(settings.distanceWeights?.within2km, defaultWeightSettings.distanceWeights.within2km),
      from2to7km: toSafeInteger(settings.distanceWeights?.from2to7km, defaultWeightSettings.distanceWeights.from2to7km),
      from7to12km: toSafeInteger(settings.distanceWeights?.from7to12km, defaultWeightSettings.distanceWeights.from7to12km),
      from12to18km: toSafeInteger(settings.distanceWeights?.from12to18km, defaultWeightSettings.distanceWeights.from12to18km),
      over18km: toSafeInteger(settings.distanceWeights?.over18km, defaultWeightSettings.distanceWeights.over18km),
    },
  };
}

function toSafeInteger(value: unknown, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return fallback;
  }
  return Math.round(value);
}
