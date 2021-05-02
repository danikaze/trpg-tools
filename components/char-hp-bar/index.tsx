import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { makeStyles } from '@utils/styles';

export interface Props {
  current: number;
  max: number;
  temp?: number;
  showText?: boolean;
  barHeight?: number;
  className?: string;
}

interface StyleProps {
  barHeight?: number;
}

const DEFAULT_BAR_HEIGHT = 15;
const useStyles = makeStyles<StyleProps>(() => ({
  root: {
    width: '100%',
  },
  text: {
    marginBottom: 5,
  },
  bar: ({ barHeight }) => ({
    display: 'flex',
    position: 'relative',
    width: '100%',
    height: barHeight || DEFAULT_BAR_HEIGHT,
    // border: '2px solid black',
    // borderRadius: 5,
    background: `linear-gradient(180deg,
      rgb(208 208 208) 8%,
      rgb(156 156 156) 4%,
      rgb(175 175 175) 36%,
      rgb(78 78 78) 100%
    )`,
  }),
  barSegment: {
    display: 'inline-block',
    height: '100%',
    transition: 'width 500ms',
  },
  barCurrent: {
    background: `linear-gradient(180deg,
      rgb(12 228 15) 8%,
      rgba(14,170,15,1) 4%,
      rgba(25,193,27,1) 36%,
      rgb(6 117 0) 100%
    )`,
  },
  barTemp: {
    background: `linear-gradient(180deg,
      rgb(170 212 255) 8%,
      rgb(80 128 218) 4%,
      rgb(111 178 247) 36%,
      rgb(0 83 142) 100%
    )`,
  },
}));

type Styles = ReturnType<typeof useStyles>;

export const CharHpBar: FunctionComponent<Props> = ({
  barHeight,
  className,
  ...props // tslint:disable-line: trailing-comma
}) => {
  const styles = useStyles({ barHeight });

  return (
    <div className={clsx(styles.root, className)}>
      {renderText(styles, props)}
      {renderBar(styles, props)}
    </div>
  );
};

function renderText(
  styles: Styles,
  { showText, current, max, temp }: Props
): JSX.Element | null {
  if (!showText) return null;
  const basicHp = `${Math.max(0, current)}/${max}`;
  const tempHp = !isNaN(temp!) && temp! > 0 ? ` +${temp}` : '';

  return (
    <div className={styles.text}>
      {basicHp}
      {tempHp}
    </div>
  );
}

function renderBar(styles: Styles, { current, max, temp }: Props): JSX.Element {
  // tslint:disable:no-magic-numbers
  const hpMax = max || 0;
  const hpCurrent = Math.max(0, current);
  const hpTemp = temp || 0;
  const hpTotal = hpMax + hpTemp;

  const currentPctg = ((hpCurrent / hpTotal) * 100).toFixed(2);
  const tempPctg =
    hpTemp > 0 && hpCurrent + hpTotal === hpTotal
      ? hpCurrent > 0
        ? 100 - Number(currentPctg)
        : ((hpTemp / hpMax) * 100).toFixed(2)
      : ((hpTemp / hpTotal) * 100).toFixed(2);

  return (
    <div className={styles.bar}>
      <div
        className={clsx(styles.barSegment, styles.barCurrent)}
        style={{ width: `${currentPctg}%` }}
      />
      <div
        className={clsx(styles.barSegment, styles.barTemp)}
        style={{ width: `${tempPctg}%` }}
      />
    </div>
  );
}
