import { ChangeEvent, FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';
import { generateName, Race, NameType } from '@utils/generate-name';
import { getUniqueElems } from '@utils/get-unique-elems';
import { RaceDef, TypeDef, useNameGenerator } from './hooks';

export type Props = {};

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

const SHOW_NAMES = 10;

export const NameGenerator: FunctionComponent<Props> = ({}) => {
  const styles = useStyles();
  const {
    races,
    types,
    selectedRace,
    selectedType,
    raceDescription,
    setRace,
    setType,
    reload,
  } = useNameGenerator();

  return (
    <div className={styles.root}>
      <div className={styles.selector}>
        {getRaceSelector(races, selectedRace, setRace)}
        {' ⇒ '}
        {getTypeSelector(types, selectedType, setType)}
      </div>
      <div className={styles.description}>{raceDescription}</div>
      <ul className={styles.results}>
        {getNames(selectedRace, selectedType as never)}
      </ul>
      <button onClick={reload}>See more names</button>
    </div>
  );
};

function getRaceSelector(
  races: RaceDef[],
  selectedRace: Race,
  setRace: (race: Race) => void
): JSX.Element {
  const options = races.map(({ key, name }) => (
    <option key={key} value={key} selected={selectedRace === key}>
      {name}
    </option>
  ));

  const updateRace = (ev: ChangeEvent<HTMLSelectElement>) => {
    setRace(ev.target.value as Race);
  };

  return <select onChange={updateRace}>{options}</select>;
}

function getTypeSelector(
  types: TypeDef[],
  selectedType: string,
  setType: (type: string) => void
) {
  const options = types.map(({ key, name }) => (
    <option key={key} value={key} selected={selectedType === key}>
      {name}
    </option>
  ));

  const updateRace = (ev: ChangeEvent<HTMLSelectElement>) => {
    setType(ev.target.value);
  };

  return <select onChange={updateRace}>{options}</select>;
}

function getNames<R extends Race>(race: R, type: NameType<R>): JSX.Element[] {
  const names: string[] = [];

  for (let i = 0; i < SHOW_NAMES; i++) {
    names.push(generateName(race, type));
  }

  return getUniqueElems(names).map((name, i) => <li key={i}>{name}</li>);
}
