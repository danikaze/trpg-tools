import clsx from 'clsx';
import { createRef, FunctionComponent, RefObject, useState } from 'react';
import { makeStyles } from '@utils/styles';
import { Label } from '@components/user-input/label';
import { getTextValidator } from '@components/user-input/get-validator';

export type TextInputType =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'image'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';

export interface Props {
  className?: string;
  inputRef?: RefObject<HTMLInputElement>;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  required?: boolean;
  maxLength?: number;
  pattern?: string;
  title?: string;
  type?: TextInputType;
  min?: number;
  max?: number;
  onChange?: (value: string) => void;
}

const useStyles = makeStyles(() => ({
  root: {
    margin: 10,
  },
  error: {
    borderColor: 'red',
  },
}));

export const TextInput: FunctionComponent<Props> = ({
  className,
  inputRef,
  label,
  placeholder,
  defaultValue,
  value,
  required,
  maxLength,
  pattern,
  title,
  type,
  min,
  max,
  onChange,
}) => {
  const styles = useStyles();
  const [isValid, setValid] = useState<boolean>(true);
  const ref = inputRef || createRef<HTMLInputElement>();
  const validate = getTextValidator(pattern, ref, setValid, required);
  const changeHandler =
    (validate || onChange) &&
    (() => {
      validate && validate();
      onChange && onChange(ref.current!.value);
    });

  return (
    <div className={clsx(styles.root, className)}>
      {label && <Label required={required}>{label}</Label>}
      <input
        className={(!isValid && styles.error) || ''}
        ref={ref}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        maxLength={maxLength}
        pattern={pattern}
        title={title}
        onChange={changeHandler}
        type={type}
        min={min}
        max={max}
      />
    </div>
  );
};
