import type { DistanceBand, Prefecture } from './station';

export type WeightSettings = {
  prefectureWeights: Record<Prefecture, number>;
  distanceWeights: Record<DistanceBand, number>;
};

export const defaultWeightSettings: WeightSettings = {
  prefectureWeights: {
    東京都: 70,
    埼玉県: 15,
    神奈川県: 10,
    千葉県: 5,
  },
  distanceWeights: {
    within2km: 5,
    from2to7km: 40,
    from7to12km: 25,
    from12to18km: 20,
    over18km: 10,
  },
};
