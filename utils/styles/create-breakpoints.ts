export interface Breakpoints<S extends string> {
  up: (min: S) => string;
  down: (max: S) => string;
  between: (start: S, end: S) => string;
}

export function createBreakpoints<S extends string>(
  breakpoints: { [breakpoint in S]: number }
): Breakpoints<S> {
  return {
    up: (min: S): string => `@media (min-width: ${breakpoints[min]}px)`,
    down: (max: S): string => `@media (max-width: ${breakpoints[max]}px)`,
    between: (start: S, end: S): string =>
      `@media (min-width: ${breakpoints[start]}px) and (max-width: ${breakpoints[end]}px)`,
  };
}
