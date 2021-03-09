import { RefObject } from 'react';

export function getTextValidator(
  pattern: string | undefined,
  ref: RefObject<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  setValid: (valid: boolean) => void,
  required: boolean | undefined
) {
  if (!pattern && !required) return;
  const regEx = pattern && new RegExp(`^${pattern}$`);
  return () => {
    const { value } = ref.current!;
    const requiredOk = !required || value.trim().length > 0;
    const patternOk = !regEx || regEx.test(value);
    setValid(requiredOk && patternOk);
  };
}
