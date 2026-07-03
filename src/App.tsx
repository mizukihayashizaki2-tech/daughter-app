import { useMemo, useState } from 'react';
import stations from './data/stations.json';
import { MainPage } from './components/MainPage';
import { SettingsPage } from './components/SettingsPage';
import { DestinationPage } from './components/DestinationPage';
import type { AnimalTheme, Station } from './domain/station';
import type { WeightSettings } from './domain/weights';
import { pickStations } from './utils/lottery';
import { loadSettings, resetSettings, saveSettings } from './services/settingsRepository';
import './styles.css';

type Page = 'main' | 'settings' | 'destination';

type SelectedDestination = {
  station: Station;
  animal: AnimalTheme;
};

export default function App() {
  const allStations = useMemo(() => stations as Station[], []);
  const [settings, setSettings] = useState<WeightSettings>(() => loadSettings());
  const [page, setPage] = useState<Page>('main');
  const [candidates, setCandidates] = useState<Station[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<SelectedDestination | null>(null);

  function rollStations() {
    try {
      const nextCandidates = pickStations(allStations, settings, 3);
      setCandidates(nextCandidates);
      setSelectedDestination(null);
      setPage('main');
    } catch (error) {
      alert(error instanceof Error ? error.message : '駅の抽選に失敗しました');
    }
  }

  function handleSaveSettings(nextSettings: WeightSettings) {
    saveSettings(nextSettings);
    setSettings(nextSettings);
    setPage('main');
  }

  function handleResetSettings() {
    const nextSettings = resetSettings();
    setSettings(nextSettings);
  }

  function handleSelectDestination(station: Station, animal: AnimalTheme) {
    setSelectedDestination({ station, animal });
    setPage('destination');
  }

  if (page === 'settings') {
    return (
      <SettingsPage
        settings={settings}
        onSave={handleSaveSettings}
        onReset={handleResetSettings}
        onBack={() => setPage('main')}
      />
    );
  }

  if (page === 'destination' && selectedDestination) {
    return (
      <DestinationPage
        station={selectedDestination.station}
        animal={selectedDestination.animal}
        onBack={() => setPage('main')}
        onReroll={rollStations}
      />
    );
  }

  return (
    <MainPage
      candidates={candidates}
      onRoll={rollStations}
      onOpenSettings={() => setPage('settings')}
      onSelectDestination={handleSelectDestination}
    />
  );
}
