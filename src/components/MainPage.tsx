import type { AnimalTheme, Station } from '../domain/station';
import { StationCard } from './StationCard';

type Props = {
  candidates: Station[];
  onRoll: () => void;
  onOpenSettings: () => void;
  onSelectDestination: (station: Station, animal: AnimalTheme) => void;
};

const animals: AnimalTheme[] = ['bear', 'rabbit', 'bird'];

export function MainPage({ candidates, onRoll, onOpenSettings, onSelectDestination }: Props) {
  return (
    <main className="page main-page">
      <section className="hero-card">
        <div className="hero-card__sparkle hero-card__sparkle--one" />
        <div className="hero-card__sparkle hero-card__sparkle--two" />
        <p className="eyebrow">起点：京王線 武蔵野台駅</p>
        <h1>娘とおでかけ駅ガチャ</h1>
        <p className="hero-card__lead">
          くま・うさぎ・とりが、今日のわくわく候補を3つ選びます。
        </p>
        <div className="hero-card__actions">
          <button type="button" className="primary-button" onClick={onRoll}>
            駅を3つ選ぶ
          </button>
          <button type="button" className="ghost-button" onClick={onOpenSettings}>
            設定を変える
          </button>
        </div>
      </section>

      {candidates.length > 0 && (
        <section className="candidate-section" aria-label="今日のおでかけ候補">
          <div className="section-heading">
            <p className="eyebrow">今日のおでかけ候補</p>
            <h2>どのカードを選ぶ？</h2>
          </div>
          <div className="candidate-grid">
            {candidates.map((station, index) => (
              <StationCard
                key={station.id}
                station={station}
                index={index}
                animal={animals[index]}
                onSelect={onSelectDestination}
              />
            ))}
          </div>
          <button type="button" className="secondary-button" onClick={onRoll}>
            もう一度選ぶ
          </button>
        </section>
      )}
    </main>
  );
}
