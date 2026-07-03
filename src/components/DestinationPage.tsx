import type { AnimalTheme, Station } from '../domain/station';
import { animalLabels, distanceBandLabels } from '../domain/station';
import bearUrl from '../assets/bear.svg';
import rabbitUrl from '../assets/rabbit.svg';
import birdUrl from '../assets/bird.svg';

type Props = {
  station: Station;
  animal: AnimalTheme;
  onBack: () => void;
  onReroll: () => void;
};

const animalImages: Record<AnimalTheme, string> = {
  bear: bearUrl,
  rabbit: rabbitUrl,
  bird: birdUrl,
};

export function DestinationPage({ station, animal, onBack, onReroll }: Props) {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(station.displayName)}`;

  return (
    <main className={`page destination-page destination-page--${animal}`}>
      <div className="confetti confetti--one" />
      <div className="confetti confetti--two" />
      <div className="confetti confetti--three" />
      <section className="destination-card">
        <p className="eyebrow">{animalLabels[animal]}が選んだよ</p>
        <h1>今日の目的地</h1>
        <img className="destination-card__animal" src={animalImages[animal]} alt={`${animalLabels[animal]}のイラスト`} />
        <div className="destination-card__station">
          <span className="destination-card__ribbon">行ってみよう！</span>
          <h2>{station.displayName}</h2>
          <p>{station.prefecture} / {station.lines.map((line) => line.lineName).join(' / ')}</p>
          <p>武蔵野台駅から約{station.distanceKm.toFixed(1)}km・{distanceBandLabels[station.distanceBand]}</p>
        </div>
        <p className="destination-card__message">
          {station.memo} 今日はここを目的地にして、親子で小さな冒険を楽しもう。
        </p>
        <div className="destination-card__tags">
          {station.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
        <div className="destination-card__actions">
          <a className="primary-button" href={mapUrl} target="_blank" rel="noreferrer">
            地図で見る
          </a>
          <button type="button" className="secondary-button" onClick={onReroll}>
            もう一度ガチャ
          </button>
          <button type="button" className="ghost-button" onClick={onBack}>
            候補に戻る
          </button>
        </div>
      </section>
    </main>
  );
}
