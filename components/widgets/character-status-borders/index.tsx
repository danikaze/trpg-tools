import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';
import { CharacterStatusProps } from '@model/widget-key/interface';
import { useCharacterStatusBorders } from './hooks';
import downImage from '@assets/images/broken-glass.png';

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
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  flash: ({ flashColor, flashAnimationTime }) => ({
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 12,
    opacity: 0,
    background: flashColor || 'transparent',
    transition: `opacity ${flashAnimationTime}ms`,
  }),
  downBorder: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 11,
    background: `radial-gradient(circle,
      rgba(0,0,0,0) 30%,
      rgba(0,0,0,1) 100%
    )`,
    backgroundSize: '100%',
    backgroundPosition: 'center',
  },
  damageBorder: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 11,
    opacity: 0,
    background: `radial-gradient(circle,
      rgba(0,0,0,0) 30%,
      rgba(120,0,0,1) 100%
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
  down: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
}));

type Styles = ReturnType<typeof useStyles>;

export const CharacterStatusBorders: FunctionComponent<Props> = ({
  borderColor,
  className,
  ...props // tslint:disable-line:trailing-comma
}) => {
  const { damageOpacity, flash, isDown } = useCharacterStatusBorders(props);
  const styles = useStyles({
    borderColor,
    flashColor: flash.color,
    flashAnimationTime: flash.animationTime,
  });

  return (
    <div className={clsx(styles.root, className)}>
      {renderBorders(styles, damageOpacity, isDown)}
      {renderFlash(styles, flash?.opacity)}
      {renderDown(styles, isDown)}
    </div>
  );
};

function renderBorders(
  styles: Styles,
  damageOpacity: number,
  isDown: boolean
): JSX.Element | null {
  return isDown ? (
    <div className={styles.downBorder} />
  ) : (
    <div className={styles.damageBorder} style={{ opacity: damageOpacity }} />
  );
}

function renderFlash(
  styles: Styles,
  opacity?: number
): JSX.Element | undefined {
  if (opacity === undefined) return;
  return <div className={styles.flash} style={{ opacity }} />;
}

function renderDown(styles: Styles, isDown: boolean): JSX.Element | null {
  if (!isDown) return null;
  return <img className={styles.down} src={downImage} />;
}
