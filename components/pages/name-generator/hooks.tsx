import { useState } from 'react';
import { Race } from '@utils/generate-name';
import { namesByRace } from '@utils/constants/names';
import { getFirstKey } from '@utils/get-first-key';

export interface RaceDef {
  key: Race;
  name: string;
}

export interface TypeDef {
  key: string;
  name: string;
}

export function useNameGenerator() {
  const [selectedRace, setRaceRaw] = useState<Race>('human');
  const [selectedType, setType] = useState<string>('male');
  const [currentLoad, setReload] = useState<number>(0);
  const reload = () => setReload(currentLoad + 1);

  const races = Object.entries(namesByRace).map(([key, def]) => ({
    key: key as Race,
    name: def.race,
    description: def.description,
  }));

  const raceDescription = namesByRace[selectedRace].description;

  const types = Object.entries(namesByRace[selectedRace].types).map(
    ([key, def]) => ({
      key,
      name: def.description as string,
    })
  );

  const setRace = (race: Race) => {
    const type = (getFirstKey(namesByRace[race].types) as unknown) as string;
    setType(type);
    setRaceRaw(race);
  };

  return {
    races,
    types,
    selectedRace,
    selectedType,
    raceDescription,
    setRace,
    setType,
    reload,
  };
}
