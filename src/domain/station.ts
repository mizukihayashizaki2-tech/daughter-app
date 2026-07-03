export type Prefecture = '東京都' | '埼玉県' | '神奈川県' | '千葉県';

export type DistanceBand =
  | 'within2km'
  | 'from2to7km'
  | 'from7to12km'
  | 'from12to18km'
  | 'over18km';

export type AnimalTheme = 'bear' | 'rabbit' | 'bird';

export type StationLine = {
  lineCode: number;
  lineName: string;
};

export type Station = {
  id: string;
  stationName: string;
  displayName: string;
  prefecture: Prefecture;
  prefectureCode: number;
  lines: StationLine[];
  lat?: number;
  lon?: number;
  distanceKm: number;
  distanceBand: DistanceBand;
  memo: string;
  tags: string[];
};

export const PREFECTURES: Prefecture[] = ['東京都', '埼玉県', '神奈川県', '千葉県'];

export const DISTANCE_BANDS: DistanceBand[] = [
  'within2km',
  'from2to7km',
  'from7to12km',
  'from12to18km',
  'over18km',
];

export const distanceBandLabels: Record<DistanceBand, string> = {
  within2km: '2km以内',
  from2to7km: '2km〜7km',
  from7to12km: '7km〜12km',
  from12to18km: '12km〜18km',
  over18km: '18km以上',
};

export const animalLabels: Record<AnimalTheme, string> = {
  bear: 'くまさん',
  rabbit: 'うさぎさん',
  bird: 'とりさん',
};
