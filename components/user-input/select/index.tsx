import clsx from 'clsx';
import { createRef, FunctionComponent, RefObject, useState } from 'react';
import { makeStyles } from '@utils/styles';
import { Label } from '@components/user-input/label';
import { getTextValidator } from '@components/user-input/get-validator';

export interface SelectOption {
  label: string;
  value: string;
}

export interface Props {
  inputRef?: RefObject<HTMLSelectElement>;
  defaultValue?: string;
  label?: string;
  options: SelectOption[];
  required?: boolean;
  onChange?: (value: string) => void;
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {},
  error: {
    borderColor: 'red',
  },
}));

type Styles = ReturnType<typeof useStyles>;

export const Select: FunctionComponent<Props> = ({
  className,
  inputRef,
  defaultValue,
  label,
  options,
  required,
  onChange,
}) => {
  const styles = useStyles();
  const [isValid, setValid] = useState<boolean>(true);
  const ref = inputRef || createRef<HTMLSelectElement>();
  const validate = getTextValidator(undefined, ref, setValid, required);
  const changeHandler =
    (validate || onChange) &&
    (() => {
      validate && validate();
      onChange && onChange(ref.current!.value);
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
        onChange={changeHandler}
      >
        {optionsList}
      </select>
    </div>
  );
};
