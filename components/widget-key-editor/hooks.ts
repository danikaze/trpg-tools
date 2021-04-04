import { useState } from 'react';
import { callCreateWidgetKey } from '@api/widget-key/client';
import { DbGame } from '@model/game/sql';
import { DbNote } from '@model/note/sql';
import { WidgetKeyType } from '@model/widget-key/interface';
import { map2array } from '@utils/map2array';
import { SelectOption } from '@components/user-input/select';
import { Props } from '.';

interface State {
  selectedGame?: DbGame['gameId'] | undefined;
  selectedNote?: DbNote['noteId'] | undefined;
  selectedType?: WidgetKeyType | undefined;
}

export function useWidgetKeyEditor(props: Props) {
  const [state, setState] = useState<State>({});

  async function createGame() {
    if (!state.selectedType || !state.selectedNote) return;
    const name = prompt('Name for the widget?');
    if (!name) return;

    const widgetKeyId = await callCreateWidgetKey(
      state.selectedType,
      name,
      state.selectedNote
    );
    if (!widgetKeyId) return;

    props.onCreate({
      widgetKeyId,
      name,
      type: state.selectedType,
      data: {
        noteId: state.selectedNote,
      },
    });
  }

  function selectGame(gameId: DbGame['gameId']) {
    setState({
      ...state,
      selectedGame: gameId,
    });
  }

  function selectNote(noteId: DbNote['noteId']) {
    setState({
      ...state,
      selectedNote: noteId,
    });
  }

  function selectType(widgetType: string) {
    setState({
      ...state,
      selectedType: widgetType as WidgetKeyType,
    });
  }

  const gameOptions = map2array(props.notesByGame, (gameId, game) => ({
    label: game.name,
    value: gameId as string,
  })).sort(selectOptionComparer);

  const noteOptions = state.selectedGame
    ? map2array(props.notesByGame[state.selectedGame].defs)
        .reduce((notes, def) => {
          notes.push(
            ...def.notes.map((note) => ({
              label: note.title,
              value: note.noteId,
            }))
          );
          return notes;
        }, [] as SelectOption[])
        .sort(selectOptionComparer)
    : [];

  const widgetOptions = [
    { label: 'Character Sheet', value: 'charSheet' },
    { label: 'Character Status', value: 'charStatus' },
  ];
  const createDisabled = !state.selectedType || !state.selectedNote;

  return {
    selectGame,
    selectNote,
    createGame,
    selectType,
    createDisabled,
    gameOptions,
    noteOptions,
    widgetOptions,
    selectedGame: state.selectedGame,
    selectedNote: state.selectedNote,
    selectedType: state.selectedType,
  };
}

function selectOptionComparer(a: SelectOption, b: SelectOption): number {
  return a.label.localeCompare(b.label);
}
