import { useState } from 'react';
import { callCreateWidgetKey } from '@api/widget-key/client';
import { DbGame } from '@model/game/sql';
import { DbNote } from '@model/note/sql';
import { WidgetKeyType } from '@model/widget-def/interface';
import { map2array } from '@utils/map2array';
import { SelectOption } from '@components/user-input/select';
import { Props } from '.';

interface State {
  selectedGame?: DbGame['gameId'] | undefined;
  selectedNote?: DbNote['noteId'] | undefined;
  selectedType?: WidgetKeyType | undefined;
}

type NoteSelectOption = SelectOption<DbNote['noteId']>;

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
      widgetDefId: state.selectedType,
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
        }, [] as NoteSelectOption[])
        .sort(selectOptionComparer)
    : [];

  const widgetOptions = props.widgetDefs.map((def) => ({
    label: def.name,
    value: def.widgetDefId,
  }));
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

function selectOptionComparer(
  a: NoteSelectOption,
  b: NoteSelectOption
): number {
  return a.label.localeCompare(b.label);
}
