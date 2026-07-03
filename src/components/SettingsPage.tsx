import { useMemo, useState } from 'react';
import { DISTANCE_BANDS, distanceBandLabels, PREFECTURES, type DistanceBand, type Prefecture } from '../domain/station';
import { defaultWeightSettings, type WeightSettings } from '../domain/weights';
import { validateSettings } from '../services/settingsRepository';

type Props = {
  settings: WeightSettings;
  onSave: (settings: WeightSettings) => void;
  onReset: () => void;
  onBack: () => void;
};

export function SettingsPage({ settings, onSave, onReset, onBack }: Props) {
  const [draft, setDraft] = useState<WeightSettings>(settings);
  const error = useMemo(() => validateSettings(draft), [draft]);

  function updatePrefecture(prefecture: Prefecture, value: string) {
    setDraft((current) => ({
      ...current,
      prefectureWeights: {
        ...current.prefectureWeights,
        [prefecture]: toInputNumber(value),
      },
    }));
  }

  function updateDistance(distanceBand: DistanceBand, value: string) {
    setDraft((current) => ({
      ...current,
      distanceWeights: {
        ...current.distanceWeights,
        [distanceBand]: toInputNumber(value),
      },
    }));
  }

  function handleSave() {
    const validationError = validateSettings(draft);
    if (validationError) {
      return;
    }
    onSave(draft);
  }

  function handleReset() {
    setDraft(defaultWeightSettings);
    onReset();
  }

  const prefectureTotal = PREFECTURES.reduce((sum, prefecture) => sum + draft.prefectureWeights[prefecture], 0);
  const distanceTotal = DISTANCE_BANDS.reduce((sum, band) => sum + draft.distanceWeights[band], 0);

  return (
    <main className="page settings-page">
      <section className="settings-card">
        <p className="eyebrow">出やすさを調整</p>
        <h1>ガチャ設定</h1>
        <p className="settings-card__lead">
          合計100でなくてもOKです。入力値は「割合」ではなく「比率」として扱います。
        </p>

        <div className="settings-group">
          <div className="settings-group__header">
            <h2>都県の出やすさ</h2>
            <span>合計 {prefectureTotal}</span>
          </div>
          {PREFECTURES.map((prefecture) => (
            <label className="weight-row" key={prefecture}>
              <span>{prefecture}</span>
              <input
                type="number"
                min="0"
                step="1"
                value={draft.prefectureWeights[prefecture]}
                onChange={(event) => updatePrefecture(prefecture, event.target.value)}
              />
            </label>
          ))}
        </div>

        <div className="settings-group">
          <div className="settings-group__header">
            <h2>距離の出やすさ</h2>
            <span>合計 {distanceTotal}</span>
          </div>
          {DISTANCE_BANDS.map((band) => (
            <label className="weight-row" key={band}>
              <span>{distanceBandLabels[band]}</span>
              <input
                type="number"
                min="0"
                step="1"
                value={draft.distanceWeights[band]}
                onChange={(event) => updateDistance(band, event.target.value)}
              />
            </label>
          ))}
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <div className="settings-card__actions">
          <button type="button" className="primary-button" onClick={handleSave} disabled={Boolean(error)}>
            保存する
          </button>
          <button type="button" className="secondary-button" onClick={handleReset}>
            初期値に戻す
          </button>
          <button type="button" className="ghost-button" onClick={onBack}>
            戻る
          </button>
        </div>
      </section>
    </main>
  );
}

function toInputNumber(value: string): number {
  if (value.trim() === '') {
    return 0;
  }
  return Number(value);
}
