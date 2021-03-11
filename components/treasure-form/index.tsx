import React, { ChangeEvent, FunctionComponent } from 'react';
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
import { CR_LIST, GroupingType, TYPE_LIST, useTreasureForm } from './hooks';

export interface Props {
  treasure: readonly Treasure[][];
  onSubmit: (
    type: TreasureGeneratorType,
    crs: QuantifiedCr[]
  ) => Promise<boolean>;
  className?: string;
}

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
