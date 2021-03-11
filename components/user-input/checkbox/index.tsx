import clsx from 'clsx';
import { createRef, FunctionComponent, RefObject } from 'react';
import { makeStyles } from '@utils/styles';
import { Label } from '@components/user-input/label';

export interface Props {
  inputRef?: RefObject<HTMLInputElement>;
  defaultValue?: boolean | string;
  label?: string;
  required?: boolean;
  onChange?: (value: boolean) => void;
  className?: string;
}

const useStyles = makeStyles(() => ({
  root: {},
}));

type Styles = ReturnType<typeof useStyles>;

export const Checkbox: FunctionComponent<Props> = ({
  className,
  inputRef,
  defaultValue,
  label,
  required,
  onChange,
}) => {
  const styles = useStyles();
  const ref = inputRef || createRef<HTMLInputElement>();
  const changeHandler = onChange && (() => onChange(ref.current!.checked));

  return (
    <div className={clsx(styles.root, className)}>
      {label && <Label required={required}>{label}</Label>}
      <input
        type="checkbox"
        ref={ref}
        className={clsx(styles.root, className)}
        defaultChecked={isSelected(defaultValue)}
        onChange={changeHandler}
      />
    </div>
  );
};

function isSelected(value: boolean | string | undefined): boolean {
  return value === true || value === 'true';
}
