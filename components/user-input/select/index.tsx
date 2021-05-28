import clsx from 'clsx';
import { createRef, RefObject, useState } from 'react';
import { makeStyles } from '@utils/styles';
import { Label } from '@components/user-input/label';
import { getTextValidator } from '@components/user-input/get-validator';

export interface SelectOption<T> {
  label: string;
  value: T;
}

export interface Props<T> {
  inputRef?: RefObject<HTMLSelectElement>;
  defaultValue?: T;
  value?: T;
  label?: string;
  options: SelectOption<T>[];
  required?: boolean;
  onChange?: (value: T) => void;
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {},
  error: {
    borderColor: 'red',
  },
}));

type Styles = ReturnType<typeof useStyles>;

export function Select<T extends string>({
  className,
  inputRef,
  defaultValue,
  value,
  label,
  options,
  required,
  onChange,
}: Props<T>) {
  const styles = useStyles();
  const [isValid, setValid] = useState<boolean>(true);
  const ref = inputRef || createRef<HTMLSelectElement>();
  const validate = getTextValidator(undefined, ref, setValid, required);
  const changeHandler =
    (validate || onChange) &&
    (() => {
      validate && validate();
      onChange && onChange(ref.current!.value as T);
    });
  const optionsList = options.map(({ label, value }) => (
    <option key={value} value={value}>
      {label}
    </option>
  ));

  optionsList.unshift(<option key="_empty" />);

  return (
    <div className={clsx(styles.root, className)}>
      {label && <Label required={required}>{label}</Label>}
      <select
        ref={ref}
        className={clsx(styles.root, className, !isValid && styles.error)}
        defaultValue={defaultValue}
        value={value}
        onChange={changeHandler}
      >
        {optionsList}
      </select>
    </div>
  );
}
