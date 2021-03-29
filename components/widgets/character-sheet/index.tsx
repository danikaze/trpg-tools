import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';
import { NoteData } from '@model/note';
import { NoteFieldDefinition } from '@model/note-definition';
import acImage from '@assets/images/ac.png';

export interface Props {
  note: NoteData;
  fields: Record<string, NoteFieldDefinition['noteFieldDefId']>;
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
  paper: {
    margin: 20,
    padding: 20,
    background: '#fffae4',
    boxShadow: '0 0 15px 0px rgb(0 0 0 / 50%)',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
  },
  // details block
  details: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: 10,
  },
  detailsLeft: {
    flexDirection: 'column',
    flexGrow: 1,
  },
  detailsRight: {},
  levelRaceClass: {},
  race: {},
  class: {},
  level: {},
  state: {},
  hp: {},
  ac: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    fontSize: 25,
    fontWeight: 'bold',
    backgroundImage: `url(${acImage})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  acValue: {
    position: 'relative',
    top: 7,
  },
  // stats block
  stats: {
    display: 'flex',
    flexDirection: 'column',
  },
  statGroup: {
    display: 'flex',
  },
  stat: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    border: '2px solid black',
    borderRadius: 5,
    background: 'white',
    margin: 5,
    marginBottom: 16,
    alignItems: 'center',
  },
  statName: {
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  statMod: {
    margin: 10,
    display: 'flex',
    fontSize: 30,
    width: 50,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'white',
  },
  statValue: {
    display: 'flex',
    border: '2px solid black',
    borderRadius: '100%',
    background: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 24,
    position: 'relative',
    marginBottom: -12,
  },
}));

type Styles = ReturnType<typeof useStyles>;

export const CharacterSheet: FunctionComponent<Props> = ({
  className,
  note,
  fields,
}) => {
  const styles = useStyles();
  const { content } = note;

  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.paper}>
        <div className={styles.name}>{note.title}</div>
        <div className={styles.details}>
          <div>
            <div className={styles.levelRaceClass}>
              Level {content[fields.level]} {content[fields.race]}{' '}
              {content[fields.class]}
            </div>
            <div className={styles.state}>
              <div className={styles.hp}>
                HP: {content[fields.hp]}/{content[fields.hpMax]}
              </div>
            </div>
          </div>
          <div>
            <div className={styles.ac}>
              <div className={styles.acValue}>{content[fields.ac]}</div>
            </div>
          </div>
        </div>
        <div className={styles.stats}>
          <div className={styles.statGroup}>
            {renderStat(styles, 'STR', content[fields.str])}
            {renderStat(styles, 'DEX', content[fields.dex])}
            {renderStat(styles, 'CON', content[fields.con])}
          </div>
          <div className={styles.statGroup}>
            {renderStat(styles, 'INT', content[fields.int])}
            {renderStat(styles, 'WIS', content[fields.wis])}
            {renderStat(styles, 'CHA', content[fields.cha])}
          </div>
        </div>
      </div>
    </div>
  );
};

function renderStat(styles: Styles, name: string, value: string): JSX.Element {
  // tslint:disable-next-line:no-magic-numbers
  const mod = Math.floor((Number(value) - 10) / 2);
  const modSign = mod > 0 ? '+' : '';

  return (
    <div className={styles.stat}>
      <div className={styles.statName}>{name}</div>
      <div className={styles.statMod}>
        {modSign}
        {mod}
      </div>
      <div className={styles.statValue}>{value}</div>
    </div>
  );
}
