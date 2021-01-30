import { useState } from 'react';
import { Props, RaceDef } from '.';
import { callGenerateNames } from '@api/names/get';
import { Race } from '@utils/generate-name';

export function useNameGenerator({
  races,
  defaultRace,
  defaultType,
  defaultNames,
}: Props) {
  const [selectedRace, setRace] = useState<RaceDef>(
    getRace(races, defaultRace)
  );
  const [selectedType, setType] = useState<string>(defaultType as string);
  const [currentLoad, setReload] = useState<number>(0);
  const [names, setNames] = useState<string[]>(defaultNames);

  const loadNameList = async <R extends Race>(raceKey: R, type: string) => {
    setNames([]);
    const res = await callGenerateNames(raceKey, type);
    setRace(getRace(races, raceKey));
    setType(type as string);
    setReload(currentLoad + 1);
    setNames(res.data);
  };

  const updateRace = (race: Race) => {
    const type = getRace(races, race).types[0].key;
    loadNameList(race, type);
  };

  const updateType = (type: string) => loadNameList(selectedRace.key, type);

  const reload = () => loadNameList(selectedRace.key, selectedType);

  return {
    races,
    selectedRace,
    selectedType,
    names,
    updateRace,
    updateType,
    reload,
  };
}

function getRace(races: RaceDef[], race: string): RaceDef {
  return races.find((item) => item.key === race)!;
}
