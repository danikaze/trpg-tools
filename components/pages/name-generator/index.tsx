import { ChangeEvent, FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';
import { NameType, Race } from '@utils/generate-name';
import { useNameGenerator } from './hooks';
import { NameGeneratorMode } from '@api/names/interface';

export interface TypeDef {
  key: string;
  name: string;
}
export interface RaceDef {
  key: Race;
  name: string;
  description: string;
  types: TypeDef[];
}
export interface Props {
  races: RaceDef[];
  defaultRace: Race;
  defaultType: NameType<Race>;
  defaultNames: string[];
  defaultMode: NameGeneratorMode;
}

const useStyles = makeStyles(() => ({
  root: {},
  selector: {
    display: 'block',
    margin: '20px 0',
  },
  description: {
    margin: '20px 0',
  },
  results: {
    margin: '20px 0',
    '& li': {
      margin: '7px 0',
      fontSize: 20,
    },
  },
}));

export const NameGenerator: FunctionComponent<Props> = (props) => {
  const styles = useStyles();
  const {
    races,
    selectedRace,
    selectedType,
    selectedMode,
    names,
    updateRace,
    updateType,
    updateMode,
    reload,
  } = useNameGenerator(props);

  return (
    <div className={styles.root}>
      <div className={styles.selector}>
        {getRaceSelector(races, selectedRace, updateRace)}
        {' ⇒ '}
        {getTypeSelector(selectedRace.types, selectedType, updateType)}
        {' ⇒ '}
        {getModeSelector(selectedMode, updateMode)}
        {' ⇒ '}
        <button onClick={reload}>Reload names</button>
      </div>
      <div className={styles.description}>{selectedRace.description}</div>
      <ul className={styles.results}>{getNames(names)}</ul>
    </div>
  );
};

function getRaceSelector(
  races: RaceDef[],
  selectedRace: RaceDef,
  setRace: (race: Race) => void
): JSX.Element {
  const options = races.map(({ key, name }) => (
    <option key={key} value={key}>
      {name}
    </option>
  ));

  const updateRace = (ev: ChangeEvent<HTMLSelectElement>) => {
    setRace(ev.target.value as Race);
  };

  return (
    <select value={selectedRace.key} onChange={updateRace}>
      {options}
    </select>
  );
}

function getTypeSelector(
  types: TypeDef[],
  selectedType: string,
  setType: (type: string) => void
) {
  const options = types.map(({ key, name }) => (
    <option key={key} value={key}>
      {name}
    </option>
  ));

  const updateRace = (ev: ChangeEvent<HTMLSelectElement>) => {
    setType(ev.target.value);
  };

  return (
    <select value={selectedType} onChange={updateRace}>
      {options}
    </select>
  );
}

function getModeSelector(
  selectedMode: NameGeneratorMode,
  setMode: (mode: NameGeneratorMode) => void
) {
  const updateMode = (ev: ChangeEvent<HTMLSelectElement>) => {
    setMode(ev.target.value as NameGeneratorMode);
  };

  const values: Record<NameGeneratorMode, string> = {
    markov: 'Super randomizer',
    mix: 'Mixed options',
    original: 'Only original sources',
  };

  const options = Object.entries(values).map(([value, name]) => (
    <option key={value} value={value}>
      {name}
    </option>
  ));

  return (
    <select value={selectedMode} onChange={updateMode}>
      {options}
    </select>
  );
}

function getNames(names: string[]): JSX.Element[] {
  return names.map((name, i) => <li key={i}>{name}</li>);
}
