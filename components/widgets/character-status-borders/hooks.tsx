import { Dispatch, SetStateAction, useState } from 'react';
import { Props } from '.';

interface State {
  hp: number;
  flash: {
    opacity?: number;
    color?: string;
    animationTime: number;
  };
}

type SetState = Dispatch<SetStateAction<State>>;
const FLASH_ANIMATION_TIME = 3000;
const FLASH_DELAY_BEFORE_ANIMATION_STARTS = 20;
const FLASH_INITIAL_OPACITY = 0.5;
const DAMAGE_SHOW_THRESHOLD_RATIO = 0.5;

export function useCharacterStatusBorders({ note, fields }: Props) {
  const { content } = note;

  const title = note.title;
  const hpCurrent = Number(content[fields.hp]) || 0;
  const hpMax = Number(content[fields.hpMax]) || 0;
  const hpTemp = Number(content[fields.hpTemp]) || 0;
  const imageUrl = content[fields.image];
  const totalHp = hpCurrent + hpTemp;

  const [state, setState] = useState<State>({
    hp: totalHp,
    flash: {
      animationTime: FLASH_ANIMATION_TIME,
    },
  });

  const showDmgThreshold = hpMax * DAMAGE_SHOW_THRESHOLD_RATIO;
  const damageOpacity =
    hpCurrent > 0 && hpCurrent < showDmgThreshold
      ? 1 - hpCurrent / showDmgThreshold
      : 0;

  if (totalHp !== state.hp) {
    showFlash(totalHp, totalHp < state.hp ? 'rgba(120,0,0,1)' : 'green');
  }

  function showFlash(hp: number, color: string) {
    setState((state) => {
      setTimeout(hideFlash, FLASH_DELAY_BEFORE_ANIMATION_STARTS);

      return {
        ...state,
        hp,
        flash: {
          ...state.flash,
          color,
          opacity: FLASH_INITIAL_OPACITY,
        },
        isDown: totalHp <= 0,
      };
    });
  }

  function hideFlash() {
    setState((state) => {
      setTimeout(removeFlashElement, state.flash.animationTime);

      return {
        ...state,
        flash: {
          ...state.flash,
          opacity: 0,
        },
      };
    });
  }

  function removeFlashElement() {
    setState((state) => ({
      ...state,
      flash: {
        ...state.flash,
        opacity: undefined,
      },
    }));
  }

  return {
    title,
    hpCurrent,
    hpMax,
    hpTemp,
    damageOpacity,
    imageUrl,
    flash: state.flash,
    isDown: hpCurrent <= 0,
  };
}
