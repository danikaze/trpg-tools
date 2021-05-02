import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';
import { CharacterStatusProps } from '@model/widget-key/interface';
import { CharHpBar } from '@components/char-hp-bar';
import { useCharacterStatus } from './hooks';

export interface Props extends CharacterStatusProps {
  borderColor?: string;
  className?: string;
}

interface StyleProps {
  borderColor?: string;
  flashColor?: string;
  flashAnimationTime: number;
}

const useStyles = makeStyles<StyleProps>(() => ({
  root: {
    position: 'relative',
    display: 'flex',
    margin: 20,
  },
  imageShape: ({ borderColor }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    borderRadius: '50%',
    border: `5px solid ${borderColor || 'black'}`,
  }),
  image: {
    zIndex: 10,
    boxShadow: '0 0 15px 0px rgb(0 0 0 / 50%)',
  },
  imageDown: {
    filter: 'grayscale(100%)',
  },
  flash: ({ flashColor, flashAnimationTime }) => ({
    zIndex: 12,
    opacity: 0,
    background: flashColor || 'transparent',
    transition: `opacity ${flashAnimationTime}ms`,
  }),
  damageBorder: {
    zIndex: 11,
    opacity: 0,
    background: `radial-gradient(circle,
      rgba(0,0,0,0) 30%,
      rgba(255,0,0,1) 100%
    )`,
    backgroundSize: '100%',
    backgroundPosition: 'center',
    animation: `$heartbeat 2000ms`,
    animationIterationCount: 'infinite',
  },
  '@keyframes heartbeat': {
    '0%': { backgroundSize: '100%' },
    '10%': { backgroundSize: '150%' },
    '20%': { backgroundSize: '100%' },
    '30%': { backgroundSize: '150%' },
    '40%': { backgroundSize: '100%' },
    '50%': { backgroundSize: '105%' },
    '100%': { backgroundSize: '100%' },
  },
  paper: ({ borderColor }) => ({
    position: 'absolute',
    top: 10,
    left: 55,
    width: 300,
    height: 90,
    padding: 20,
    background: '#fffae4',
    border: `5px solid ${borderColor || 'black'}`,
    borderTopRightRadius: 50,
    boxShadow: '0 0 15px 0px rgb(0 0 0 / 50%)',
  }),
  data: {
    position: 'absolute',
    top: 0,
    left: 60,
    height: 55,
  },
  name: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    height: '100%',
  },
  hp: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    width: '280px !important',
  },
}));

type Styles = ReturnType<typeof useStyles>;

export const CharacterStatus: FunctionComponent<Props> = ({
  borderColor,
  className,
  ...props // tslint:disable-line:trailing-comma
}) => {
  const {
    title,
    hpCurrent,
    hpMax,
    hpTemp,
    imageUrl,
    damageOpacity,
    flash,

    isDown,
  } = useCharacterStatus(props);
  const styles = useStyles({
    borderColor,
    flashColor: flash.color,
    flashAnimationTime: flash.animationTime,
  });
  const HP_BAR_HEIGHT = 25;

  return (
    <div className={clsx(styles.root, className)}>
      {renderImage(styles, imageUrl, damageOpacity, isDown)}
      {renderFlash(styles, flash?.opacity)}
      <div className={styles.paper}>
        <div className={styles.data}>{renderName(styles, title)}</div>
        <CharHpBar
          className={styles.hp}
          current={Number(hpCurrent)}
          max={Number(hpMax)}
          temp={Number(hpTemp)}
          barHeight={HP_BAR_HEIGHT}
        />
      </div>
    </div>
  );
};

function renderName(styles: Styles, name: string): JSX.Element {
  return <div className={styles.name}>{name.split(' ')[0]}</div>;
}

function renderImage(
  styles: Styles,
  src: string | undefined,
  damageOpacity: number,
  isDown: boolean
): JSX.Element | null {
  if (!src) return null;

  const imgClasses = clsx(
    styles.imageShape,
    styles.image,
    isDown && styles.imageDown
  );
  return (
    <>
      <div
        className={clsx(styles.imageShape, styles.damageBorder)}
        style={{ opacity: damageOpacity }}
      />
      <img className={imgClasses} src={src} />
    </>
  );
}

function renderFlash(
  styles: Styles,
  opacity?: number
): JSX.Element | undefined {
  if (opacity === undefined) return;
  return (
    <div
      className={clsx(styles.imageShape, styles.flash)}
      style={{ opacity }}
    />
  );
}
