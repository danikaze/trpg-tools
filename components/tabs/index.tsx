import clsx from 'clsx';
import { ReactNode, useState } from 'react';
import { makeStyles } from '@utils/styles';

export interface TabData<T> {
  label: string;
  value: T;
}

export interface Props<T> {
  tabs: TabData<T>[];
  defaultValue?: T;
  className?: string;
  onChange?: (value: T) => void;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
  },
  tab: {
    cursor: 'pointer',
    marginLeft: 5,
    marginRight: 5,
  },
  selected: {
    fontWeight: 'bold',
  },
}));

type Styles = ReturnType<typeof useStyles>;

export function Tabs<T>({ tabs, defaultValue, onChange, className }: Props<T>) {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = useState<T | undefined>(
    defaultValue || tabs[0]?.value
  );
  const changeHandler = (value: T) => {
    setSelectedTab(value);
    onChange && onChange(value);
  };

  const tabElems = tabs.reduce((elems, { label, value }, i) => {
    const classes = clsx(styles.tab, selectedTab === value && styles.selected);
    const onClick = () => changeHandler(value);
    const elem = (
      <div key={i} className={classes} onClick={onClick}>
        {label}
      </div>
    );

    elems.push(elem, '|');

    return elems;
  }, [] as ReactNode[]);
  tabElems.pop();

  return <div className={clsx(styles.root, className)}>{tabElems}</div>;
}
