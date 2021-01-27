import clsx from 'clsx';
import { createRef, FunctionComponent, RefObject, useState } from 'react';
import { makeStyles } from '@utils/styles';
import { Label } from './label';
import { getTextValidator } from './utils/get-validator';

export interface Props {
  className?: string;
  inputRef?: RefObject<HTMLTextAreaElement>;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  required?: boolean;
  maxLength?: number;
  pattern?: string;
  title?: string;
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

export const TextArea: FunctionComponent<Props> = ({
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
  onChange,
}) => {
  const styles = useStyles();
  const [isValid, setValid] = useState<boolean>(true);
  const ref = inputRef || createRef<HTMLTextAreaElement>();
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
      <textarea
        className={(!isValid && styles.error) || ''}
        ref={ref}
        defaultValue={defaultValue}
        value={value}
        maxLength={maxLength}
        placeholder={placeholder}
        title={title}
        onChange={changeHandler}
      />
    </div>
  );
};
