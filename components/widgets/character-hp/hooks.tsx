import { Dispatch, SetStateAction, useState } from 'react';
import { Props } from '.';

interface State {
  tween: {
    hpCurrent: Tween;
    hpMax: Tween;
    hpTemp: Tween;
  };
  hpCurrent: number;
  hpMax: number;
  hpTemp: number;
}

type SetState = Dispatch<SetStateAction<State>>;

export function useCharacterStatusBorders({ note, fields }: Props) {
  const { content } = note;
  const hpCurrent = Number(content[fields.hp]) || 0;
  const hpMax = Number(content[fields.hpMax]) || 0;
  const hpTemp = Number(content[fields.hpTemp]) || 0;

  const [state, setState] = useState<State>({
    hpCurrent,
    hpTemp,
    hpMax,
    tween: {
      hpCurrent: new Tween(hpCurrent)
        .onChange(updateFn('hpCurrent'))
        .transform(Math.round),
      hpMax: new Tween(hpMax).onChange(updateFn('hpMax')).transform(Math.round),
      hpTemp: new Tween(hpTemp)
        .onChange(updateFn('hpTemp'))
        .transform(Math.round),
    },
  });

  function updateFn(key: 'hpCurrent' | 'hpMax' | 'hpTemp'): () => void {
    return () =>
      setState((state: State) => ({
        ...state,
        [key]: state.tween[key].value,
      }));
  }

  state.tween.hpCurrent.tweenTo(hpCurrent);
  state.tween.hpMax.tweenTo(hpMax);
  state.tween.hpTemp.tweenTo(hpTemp);

  return {
    hpCurrent: state.hpCurrent,
    hpMax: state.hpMax,
    hpTemp: state.hpTemp,
  };
}

class Tween {
  // tslint:disable:member-ordering
  public static readonly EASE_TIME = 2000;
  public static readonly INTERVAL = 17;

  public value: number;

  private readonly duration: number;
  private current: number;
  private interval?: number;
  private startValue: number;
  private range: number;
  private startTime: number;
  private onChangeCallback?: () => void;
  private transformCallback: (value: number) => number = (x) => x;

  constructor(value: number, duration = Tween.EASE_TIME) {
    this.value = value;
    this.current = value;
    this.startValue = value;
    this.duration = duration;
    this.range = 0;
    this.startTime = 0;
    this.update = this.update.bind(this);
  }

  private static easeInOutCubic(x: number): number {
    // tslint:disable:no-magic-numbers
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  public onChange(callback: () => void) {
    this.onChangeCallback = callback;
    return this;
  }

  public transform(callback: (value: number) => number) {
    this.transformCallback = callback;
    return this;
  }

  public tweenTo(value: number) {
    if (this.interval || value === this.current) return;

    this.range = value - this.current;
    this.startValue = this.current;
    this.startTime = Date.now();
    this.interval =
      (typeof window !== 'undefined' &&
        window.setInterval(this.update, Tween.INTERVAL)) ||
      undefined;
  }

  private stop(): void {
    if (!this.interval) return;
    clearInterval(this.interval);
    this.interval = undefined;
  }

  private update(): void {
    const x = (Date.now() - this.startTime) / this.duration;
    const progress = Math.min(1, Math.max(0, x));
    const value = this.startValue + this.range * Tween.easeInOutCubic(progress);

    if (progress >= 1) {
      this.stop();
    }

    this.current = value;
    const transformedValue = this.transformCallback(value);
    if (this.value === transformedValue) return;
    this.value = transformedValue;
    this.onChangeCallback && this.onChangeCallback();
  }
}
