import { useEffect, useState } from 'react';
import { Props, RaceDef, TypeDef } from '.';
import { callGenerateNames } from '@api/names/get';
import { NameType, Race } from '@utils/generate-name';

interface State {
  race: RaceDef;
  type: string;
  reload: number;
  names: string[];
}

interface HistoryState {
  race: Race;
  type: string;
}

export function useNameGenerator({
  races,
  defaultRace,
  defaultType,
  defaultNames,
}: Props) {
  useEffect(() => {
    function handleStateChange(ev: PopStateEvent) {
      const data = ev.state as HistoryState;
      loadNameList(data.race, data.type);
    }

    updateData(state.race.key, state.type, true);
    window.addEventListener('popstate', handleStateChange);
    return () => window.removeEventListener('popstate', handleStateChange);
  }, []);

  const [state, setState] = useState<State>({
    race: getRace(races, defaultRace as Race),
    type: defaultType as string,
    reload: 0,
    names: defaultNames,
  });

  const updateData = (raceKey: Race, typeKey?: string, first?: true) => {
    const race = getRace(races, raceKey);
    const type = getRaceType(race, typeKey as NameType<Race>).key;
    history[first ? 'replaceState' : 'pushState'](
      { type, race: race.key } as HistoryState,
      document.title,
      `/name-generator/${raceKey}/${race.types.length < 2 ? '' : type}`
    );
    loadNameList(raceKey, type);
  };

  const loadNameList = async <R extends Race>(raceKey: R, type: string) => {
    const race = getRace(races, raceKey);
    setState((state) => ({
      ...state,
      race,
      type,
      names: [],
    }));
    const res = await callGenerateNames(raceKey, type);
    setState((state) => ({
      race,
      type,
      reload: state.reload + 1,
      names: res.data,
    }));
  };

  const updateType = (type: string) => updateData(state.race.key, type);
  const reload = () => loadNameList(state.race.key, state.type);

  return {
    updateType,
    reload,
    races,
    updateRace: updateData,
    selectedRace: state.race,
    selectedType: state.type,
    names: state.names,
  };
}

function getRace(races: RaceDef[], race: Race): RaceDef {
  return races.find((item) => item.key === race) || races[0];
}

function getRaceType(race: RaceDef, type: NameType<Race>): TypeDef {
  return race.types.find((item) => item.key === type) || race.types[0];
}
