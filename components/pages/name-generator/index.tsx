import { ChangeEvent, FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';
import { NameType, Race } from '@utils/generate-name';
import { useNameGenerator } from './hooks';

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
    names,
    updateRace,
    updateType,
    reload,
  } = useNameGenerator(props);

  return (
    <div className={styles.root}>
      <div className={styles.selector}>
        {getRaceSelector(races, selectedRace, updateRace)}
        {' ⇒ '}
        {getTypeSelector(selectedRace.types, selectedType, updateType)}{' '}
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

function getNames(names: string[]): JSX.Element[] {
  return names.map((name, i) => <li key={i}>{name}</li>);
}
