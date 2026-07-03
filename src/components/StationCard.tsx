import type { AnimalTheme, Station } from '../domain/station';
import { animalLabels, distanceBandLabels } from '../domain/station';
import bearUrl from '../assets/bear.svg';
import rabbitUrl from '../assets/rabbit.svg';
import birdUrl from '../assets/bird.svg';

type Props = {
  station: Station;
  index: number;
  animal: AnimalTheme;
  onSelect: (station: Station, animal: AnimalTheme) => void;
};

const animalImages: Record<AnimalTheme, string> = {
  bear: bearUrl,
  rabbit: rabbitUrl,
  bird: birdUrl,
};

export function StationCard({ station, index, animal, onSelect }: Props) {
  const lineNames = station.lines.map((line) => line.lineName).join(' / ');

  return (
    <button
      type="button"
      className={`station-card station-card--${animal}`}
      onClick={() => onSelect(station, animal)}
      aria-label={`${station.displayName}を今日の目的地にする`}
    >
      <img className="station-card__animal" src={animalImages[animal]} alt="" aria-hidden="true" />
      <div className="station-card__content">
        <div className="station-card__badge">候補 {index + 1}・{animalLabels[animal]}</div>
        <h2>{station.displayName}</h2>
        <p className="station-card__meta">{station.prefecture} / {lineNames}</p>
        <p className="station-card__distance">武蔵野台駅から約{station.distanceKm.toFixed(1)}km・{distanceBandLabels[station.distanceBand]}</p>
        <p className="station-card__memo">{station.memo}</p>
        <div className="station-card__tags">
          {station.tags.slice(0, 3).map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
        <span className="station-card__select">ここに行く！</span>
      </div>
    </button>
  );
}
