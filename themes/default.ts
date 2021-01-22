import { createBreakpoints } from '@utils/styles/create-breakpoints';
import { Theme } from '@utils/styles/theme';

const colors = {
  main: '#cfed57',
  bg: '#cecece',
  shadow: 'rgba(0, 0, 0, 0.30)',
};

export const defaultTheme: Theme = {
  themeColor: colors.main,

  breakpoints: createBreakpoints({
    sm: 412,
    md: 455,
    lg: 760,
  }),

  boxShadow: {
    full: `0 0 10px 0 ${colors.shadow}`,
    top: `0 -10px 13px -10px ${colors.shadow}`,
    right: `10px 0 13px -10px ${colors.shadow}`,
    bottom: `0 10px 13px -10px ${colors.shadow}`,
    left: `-10px 0 13px -10px ${colors.shadow}`,
  },

  palette: {
    bg: colors.bg,
    paper: '#fefefe',
  },
};
