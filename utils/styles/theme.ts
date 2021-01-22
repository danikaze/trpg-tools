import { Breakpoints } from './create-breakpoints';

export type Theme = {
  themeColor: string;

  breakpoints: Breakpoints<'sm' | 'md' | 'lg'>;

  boxShadow: {
    full: string;
    top: string;
    right: string;
    bottom: string;
    left: string;
  };

  palette: {
    bg: string;
    paper: string;
  };
};
