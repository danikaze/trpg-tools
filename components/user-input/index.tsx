import { RefObject } from 'react';
import { Checkbox } from './checkbox';
import { Select } from './select';
import { TextInput } from './text-input';
import { TextArea } from './text-area';

export interface UserInputTypeProps {
  int: IntProps;
  textfield: TextfieldProps;
  textarea: TextareaProps;
  checkbox: CheckboxProps;
  select: SelectProps;
}
export type UserInputType = keyof UserInputTypeProps;

interface IntProps {
  type: 'int';
  defaultValue?: string | number;
  required?: boolean;
  min?: number;
  max?: number;
  onChange?: (value: string) => void;
  inputRef?: RefObject<HTMLInputElement>;
}

interface TextfieldProps {
  type: 'textfield';
  defaultValue?: string;
  required?: boolean;
  maxLength?: number;
  onChange?: (value: string) => void;
  inputRef?: RefObject<HTMLInputElement>;
}

interface TextareaProps {
  type: 'textarea';
  defaultValue?: string;
  required?: boolean;
  maxLength?: number;
  onChange?: (value: string) => void;
  inputRef?: RefObject<HTMLTextAreaElement>;
}

interface CheckboxProps {
  type: 'checkbox';
  defaultValue?: string | boolean;
  required?: boolean;
  onChange?: (value: boolean) => void;
  inputRef?: RefObject<HTMLInputElement>;
}

interface SelectProps {
  type: 'select';
  defaultValue?: string;
  required?: boolean;
  options: { label: string; value: string }[];
  onChange?: (value: string) => void;
  inputRef?: RefObject<HTMLSelectElement>;
}

export type Props<T extends UserInputType> = {
  className?: string;
  label?: string;
} & UserInputTypeProps[T];

export function UserInput<T extends UserInputType>(
  props: Props<T>
): JSX.Element {
  const commonProps = {
    className: props.className,
    label: props.label,
    required: props.required,
  };

  if (isIntProps(props)) {
    const { min, max, onChange, defaultValue, inputRef } = props;
    return (
      <TextInput
        {...commonProps}
        type="number"
        defaultValue={defaultValue as string}
        min={min}
        max={max}
        onChange={onChange}
        inputRef={inputRef}
      />
    );
  }

  if (isTextfieldProps(props)) {
    const { maxLength, onChange, defaultValue, inputRef } = props;
    return (
      <TextInput
        {...commonProps}
        type="text"
        defaultValue={defaultValue}
        maxLength={maxLength}
        onChange={onChange}
        inputRef={inputRef}
      />
    );
  }

  if (isTextareaProps(props)) {
    const { defaultValue, maxLength, onChange, inputRef } = props;

    return (
      <TextArea
        {...commonProps}
        defaultValue={defaultValue}
        maxLength={maxLength}
        onChange={onChange}
        inputRef={inputRef}
      />
    );
  }

  if (isCheckboxProps(props)) {
    const { defaultValue, onChange, inputRef } = props;

    return (
      <Checkbox
        {...commonProps}
        defaultValue={defaultValue}
        inputRef={inputRef}
        onChange={onChange}
      />
    );
  }

  if (isSelectProps(props)) {
    const { defaultValue, options, onChange, inputRef } = props;

    return (
      <Select
        {...commonProps}
        options={options}
        defaultValue={defaultValue}
        onChange={onChange}
        inputRef={inputRef}
      />
    );
  }

  throw new Error(`Unknown type of UserInput (${props.type})`);
}

function isIntProps(props: unknown): props is IntProps {
  return (props as IntProps).type === 'int';
}

function isTextfieldProps(props: unknown): props is TextfieldProps {
  return (props as TextfieldProps).type === 'textfield';
}

function isTextareaProps(props: unknown): props is TextareaProps {
  return (props as TextareaProps).type === 'textarea';
}

function isCheckboxProps(props: unknown): props is CheckboxProps {
  return (props as CheckboxProps).type === 'checkbox';
}

function isSelectProps(props: unknown): props is SelectProps {
  return (props as SelectProps).type === 'select';
}
