import React, {
  ChangeEvent,
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@utils/styles';
import {
  TREASURE_CR_QUANTITY_MIN,
  TREASURE_CR_QUANTITY_MAX,
} from '@utils/constants';
import {
  TreasureGeneratorType,
  QuantifiedCr,
  Treasure,
  TreasureCr,
} from '@utils/constants/treasures';
import { TextInput } from '@components/user-input/text-input';
import { Button } from '@components/user-input/button';

export interface Props {
  treasure: readonly Treasure[][];
  onSubmit: (
    type: TreasureGeneratorType,
    crs: QuantifiedCr[]
  ) => Promise<boolean>;
  className?: string;
}

interface State {
  type: TreasureGeneratorType;
  individualCrs: QuantifiedCr[];
  hoardCr: TreasureCr;
  grouping: GroupingType;
  treasure: readonly Treasure[][];
}

type GroupingType = 'none' | 'each' | 'all';

const CR_LIST = ['0-4', '5-10', '11-16', '17+'] as TreasureCr[];
const TYPE_LIST = ['individual', 'hoard'] as TreasureGeneratorType[];

const useStyles = makeStyles(() => ({
  root: {},
  // tabs
  typeTabs: {
    '& th': {
      fontWeight: 'bold',
    },
  },
  typeTab: {
    display: 'inline-block',
    margin: '20px',
    cursor: 'pointer',
    textTransform: 'capitalize',
  },
  typeTabSelected: {
    fontWeight: 'bold',
  },
  // table
  qtyCol: {
    width: 50,
  },
  removeButton: {
    cursor: 'pointer',
  },
  // results
  resultList: {
    listStyleType: 'decimal',
    padding: 20,
    '& li': {
      paddingLeft: 10,
      paddingBottom: 5,
    },
  },
}));

type Styles = ReturnType<typeof useStyles>;

function useTreasureForm(props: Props) {
  useEffect(() => {
    setState((state) => ({
      ...state,
      treasure: groupTreasures(state.grouping, props.treasure),
    }));
  }, [props.treasure]);

  const [state, setState] = useState<State>({
    type: 'individual',
    individualCrs: [{ cr: CR_LIST[0], quantity: 1 }],
    hoardCr: CR_LIST[0],
    grouping: 'all',
    treasure: groupTreasures('all', props.treasure),
  });

  function updateType(type: TreasureGeneratorType): void {
    setState((state) => ({
      ...state,
      type,
      treasure: [],
    }));
  }

  function addItem() {
    const crs = state.individualCrs;
    const cr = crs.length > 0 ? crs[crs.length - 1].cr : CR_LIST[0];

    setState((state) => ({
      ...state,
      individualCrs: [...crs, { cr, quantity: 1 }],
      treasure: [],
    }));
  }

  function updateCr(index: number, cr: TreasureCr) {
    if (state.type === 'hoard') {
      setState((state) => ({
        ...state,
        hoardCr: cr,
      }));
      return;
    }

    const crs = [...state.individualCrs];
    crs[index] = { cr, quantity: crs[index].quantity };

    setState((state) => ({
      ...state,
      individualCrs: crs,
      treasure: [],
    }));
  }

  function updateQuantity(index: number, quantity: number) {
    const crs = [...state.individualCrs];
    crs[index] = { quantity, cr: crs[index].cr };

    setState((state) => ({
      ...state,
      individualCrs: crs,
      treasure: [],
    }));
  }

  function removeItem(index: number) {
    setState((state) => {
      const crs = [...state.individualCrs];
      crs.splice(index, 1);

      return {
        ...state,
        individualCrs: crs,
        treasure: [],
      };
    });
  }

  async function generate() {
    const crs =
      state.type === 'individual'
        ? state.individualCrs
        : [{ quantity: 1, cr: state.hoardCr }];
    const ok = await props.onSubmit(state.type, crs);
    if (!ok) {
      setState((state) => ({
        ...state,
        individualCrs: [{ cr: CR_LIST[0], quantity: 1 }],
        hoardCr: CR_LIST[0],
        treasure: [],
      }));
    }
    return ok;
  }

  function setGroupingType(grouping: GroupingType) {
    setState((state) => ({
      ...state,
      grouping,
      treasure: groupTreasures(grouping, props.treasure),
    }));
  }

  return {
    setGroupingType,
    updateType,
    updateCr,
    updateQuantity,
    removeItem,
    generate,
    addItem: state.type === 'individual' ? addItem : undefined,
    type: state.type,
    crs: state.type === 'individual' ? state.individualCrs : state.hoardCr,
    treasure: state.treasure,
    grouping: state.grouping,
  };
}

export const TreasureForm: FunctionComponent<Props> = (props) => {
  const styles = useStyles(props);
  const {
    setGroupingType,
    updateType,
    addItem,
    updateCr,
    updateQuantity,
    removeItem,
    generate,
    type,
    crs,
    treasure,
    grouping,
  } = useTreasureForm(props);

  const groupingSelector =
    type === 'individual'
      ? renderGroupingSelector(grouping, setGroupingType)
      : undefined;
  const tabs = renderTabs(styles, type, updateType);
  const form =
    type === 'individual'
      ? renderIndividualForm(
          styles,
          crs as QuantifiedCr[],
          addItem,
          updateCr,
          updateQuantity,
          removeItem
        )
      : renderHoardForm(styles, updateCr, crs as TreasureCr);
  const result = renderTreasures(styles, treasure);

  return (
    <div className={styles.root}>
      {tabs}
      <Button onClick={generate}>Generate</Button>
      {form}
      {groupingSelector}
      {result}
    </div>
  );
};

function renderTabs(
  styles: Styles,
  selected: TreasureGeneratorType,
  updateType: (type: TreasureGeneratorType) => void
): JSX.Element {
  const tabs = TYPE_LIST.map((type) => {
    const setType =
      (selected !== type && (() => updateType(type))) || undefined;
    const classes = clsx(
      styles.typeTab,
      selected === type && styles.typeTabSelected
    );
    return (
      <div key={type} className={classes} onClick={setType}>
        {type}
      </div>
    );
  });

  return <div className={styles.typeTabs}>{tabs}</div>;
}

function renderGroupingSelector(
  selected: GroupingType,
  setGroupingType: (type: GroupingType) => void
) {
  const updateType = (ev: ChangeEvent<HTMLSelectElement>) => {
    setGroupingType(ev.target.value as GroupingType);
  };

  return (
    <select onChange={updateType} value={selected}>
      <option value="none">No Grouping</option>
      <option value="each">Group by item</option>
      <option value="all">Show only totals</option>
    </select>
  );
}

function renderIndividualForm(
  styles: Styles,
  crs: QuantifiedCr[],
  addItem: (() => void) | undefined,
  updateCr: (index: number, cr: TreasureCr) => void,
  updateQuantity: (index: number, quantity: number) => void,
  removeItem: (index: number) => void
): JSX.Element {
  const rows = crs.map((item, index) => {
    const crSelect = getCrSelect((cr) => updateCr(index, cr), item.cr);
    const onQuantityChange = (val: string) =>
      updateQuantity(index, Number(val));
    const qtyInput = (
      <TextInput
        type="number"
        min={TREASURE_CR_QUANTITY_MIN}
        max={TREASURE_CR_QUANTITY_MAX}
        value={String(item.quantity)}
        onChange={onQuantityChange}
      />
    );
    const onRemove = () => removeItem(index);
    const removeButton = (
      <div className={styles.removeButton} onClick={onRemove}>
        [Remove]
      </div>
    );

    return (
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{crSelect}</td>
        <td className={styles.qtyCol}>{qtyInput}</td>
        <td>{removeButton}</td>
      </tr>
    );
  });

  const addItemButton = addItem ? (
    <Button onClick={addItem}>Add more</Button>
  ) : undefined;

  return (
    <>
      {addItemButton}
      <table className={styles.typeTabs}>
        <thead>
          <tr>
            <th>#</th>
            <th>Challenge</th>
            <th className={styles.qtyCol}>Quantity</th>
            <th />
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </>
  );
}

function renderHoardForm(
  styles: Styles,
  updateCr: (index: number, cr: TreasureCr) => void,
  currentCr: TreasureCr
): JSX.Element {
  return getCrSelect((cr) => updateCr(0, cr), currentCr);
}

function getCrSelect(
  onChange: (cr: TreasureCr) => void,
  selected?: TreasureCr
): JSX.Element {
  const crOptions = CR_LIST.map((cr, i) => (
    <option key={i} value={cr}>
      {cr}
    </option>
  ));

  function changeHandler(ev: ChangeEvent<HTMLSelectElement>) {
    onChange(ev.target.value as TreasureCr);
  }

  return (
    <select onChange={changeHandler} value={selected}>
      {crOptions}
    </select>
  );
}

function renderTreasures(
  styles: Styles,
  treasure: readonly Treasure[][]
): JSX.Element | undefined {
  if (treasure.length === 0) return;

  const list = treasure.map((treasures, index) => {
    const texts = treasures.map((t) => `${t.quantity} ${t.data}`);
    return <li key={index}>{texts.join('; ')}</li>;
  });

  return <ol className={styles.resultList}>{list}</ol>;
}

function groupTreasures(
  grouping: GroupingType,
  treasure: readonly Treasure[][]
): readonly Treasure[][] {
  if (grouping === 'none' || treasure.length === 0) return treasure;

  const eachGroup = treasure.map((treasures) =>
    treasures.reduce(addTreasure, [] as Treasure[])
  );

  if (grouping === 'each') return eachGroup;

  return [
    eachGroup.reduce((total, treasures) => {
      treasures.forEach((item) => addTreasure(total, item));
      return total;
    }, [] as Treasure[]),
  ];
}

function addTreasure(treasures: Treasure[], treasure: Treasure): Treasure[] {
  const index = treasures.findIndex((i) => i.data === treasure.data);
  if (index !== -1) {
    const item = treasures[index];
    treasures[index] = {
      data: item.data,
      quantity: item.quantity += treasure.quantity,
    };
  } else {
    treasures.push({ ...treasure });
  }
  return treasures;
}
