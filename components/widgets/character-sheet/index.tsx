import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';
import { CharacterSheetProps } from '@model/widget-key/interface';
import { CharHpBar } from '@components/char-hp-bar';
import acBgImage from '@assets/images/ac-bg.png';
import statBgImage from '@assets/images/stat-bg.png';
import sheetBgImage from '@assets/images/sheet-bg.png';

export interface Props extends CharacterSheetProps {
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
    width: 740,
    height: 514,
    backgroundImage: `url(${sheetBgImage})`,
  },
  name: {
    position: 'absolute',
    top: 35,
    left: 50,
    fontSize: 35,
    fontWeight: 'bold',
  },
  levelRaceClass: {
    fontSize: 24,
    position: 'absolute',
    top: 70,
    left: 50,
  },
  details: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  image: {
    position: 'absolute',
    top: 110,
    left: 40,
    width: 320,
    height: 370,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },
  race: {},
  class: {},
  level: {},
  hpBar: {
    position: 'absolute',
    top: 100,
    left: 360,
    width: '200px !important',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  ac: {
    position: 'absolute',
    top: 60,
    right: 67,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 77,
    height: 88,
    fontSize: 12,
    fontWeight: 'bold',
    backgroundImage: `url(${acBgImage})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  acText: {
    position: 'absolute',
    top: 58,
  },
  acValue: {
    position: 'absolute',
    top: 20,
    fontSize: 28,
  },
  // stats block
  stats: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: 40,
    right: 40,
    width: 340,
    height: 280,
  },
  statGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 10,
    marginRight: 10,
  },
  stat: {
    backgroundImage: `url(${statBgImage})`,
    backgroundSize: 'cover',
    width: 102,
    height: 120,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 16,
    paddingBottom: 12,
    alignItems: 'center',
  },
  statName: {
    position: 'absolute',
    top: 10,
    fontSize: 12,
    fontWeight: 'bold',
  },
  statMod: {
    position: 'absolute',
    top: 35,
    fontSize: 30,
    fontWeight: 'bold',
  },
  statValue: {
    position: 'absolute',
    bottom: 14,
    fontSize: 16,
    fontWeight: 'bold',
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
      <div className={styles.name}>{note.title}</div>
      <div className={styles.levelRaceClass}>
        Level {content[fields.level]} {content[fields.race]}{' '}
        {content[fields.class]}
      </div>
      {renderImage(styles, content[fields.image])}
      <CharHpBar
        showText
        className={styles.hpBar}
        current={Number(content[fields.hp])}
        max={Number(content[fields.hpMax])}
        temp={Number(content[fields.hpTemp])}
      />
      <div className={styles.ac}>
        <div className={styles.acValue}>{content[fields.ac]}</div>
        <div className={styles.acText}>AC</div>
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
  );
};

function renderImage(styles: Styles, src?: string): JSX.Element | null {
  if (!src) return null;
  return (
    <div className={styles.image} style={{ backgroundImage: `url(${src})` }} />
  );
}

function renderStat(styles: Styles, name: string, value: string): JSX.Element {
  // tslint:disable-next-line:no-magic-numbers
  const modValue = Math.floor((Number(value) - 10) / 2);
  const modSign = modValue > 0 ? '+' : '';
  const modText = isNaN(modValue) ? '' : `${modSign}${modValue}`;

  return (
    <div className={styles.stat}>
      <div className={styles.statName}>{name}</div>
      <div className={styles.statMod}>{modText}</div>
      <div className={styles.statValue}>{value}</div>
    </div>
  );
}
