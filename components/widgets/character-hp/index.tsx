import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';
import { CharacterStatusProps } from '@model/widget-key/interface';
import { useCharacterStatusBorders as useCharacterHp } from './hooks';

export interface Props extends CharacterStatusProps {
  borderColor?: string;
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    textShadow: '0 0 5px black',
  },
  hpRatio: {
    display: 'flex',
    color: '#fff',
    textStroke: '2px #008422',
    fontWeight: 'bolder',
  },
  hpValue: {},
  hpTemp: {
    color: '#b4e3ff',
    textStroke: '2px #000c96',
    fontWeight: 'bolder',
  },
}));

type Styles = ReturnType<typeof useStyles>;

export const CharacterHp: FunctionComponent<Props> = ({
  borderColor,
  className,
  ...props // tslint:disable-line:trailing-comma
}) => {
  const { hpCurrent, hpMax, hpTemp } = useCharacterHp(props);
  const styles = useStyles();

  const elemHpTemp =
    hpTemp > 0 ? <div className={styles.hpTemp}>+{hpTemp}</div> : null;

  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.hpRatio}>
        <div className={styles.hpValue}>{hpCurrent}</div>/
        <div className={styles.hpValue}>{hpMax}</div>
      </div>
      {elemHpTemp}
    </div>
  );
};
