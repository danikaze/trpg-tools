import { FunctionComponent } from 'react';
import Head from 'next/head';
import { defaultTheme } from '@themes/default';
import { makeStyles, ThemeProvider, useTheme } from '@utils/styles';
import { PRODUCT_NAME } from '@utils/constants';
import { TOPBAR_HEIGHT } from '@components/top-bar';
import { FOOTER_HEIGHT } from '@components/footer';

export interface Props {
  /** Document title to appear as the tab name */
  title: string;
  /** Content for the `<meta name="description">` tag */
  description: string;
}

const useStyles = makeStyles(({ breakpoints, palette }) => ({
  grid: {
    minHeight: '100%',
    width: '100%',
    margin: 0,
    background: palette.bg,
    display: 'grid',
    gridTemplateRows: `${TOPBAR_HEIGHT}px auto ${FOOTER_HEIGHT}px`,
    gridTemplateColumns: `0 auto`,
    gridTemplateAreas: '"top top" "side main" "bottom bottom"',
    [breakpoints.up('md')]: {
      gridTemplateColumns: `200px auto`,
    },
  },
  top: {
    gridArea: 'top',
  },
  side: {
    gridArea: 'side',
  },
  main: {
    gridArea: 'main',
    flexGrow: 1,
    padding: '20px 0',
    margin: 0,
    background: palette.paper,
    [breakpoints.up('sm')]: {
      padding: 20,
    },
  },
  bottom: {
    gridArea: 'bottom',
  },
  header: {
    marginBottom: 20,
    color: '#505050',
    fontWeight: 'bold',
    fontSize: 'x-large',
  },
}));

export const EmptyPage: FunctionComponent<Props> = ({
  title,
  description,
  children,
}) => {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <>
      <Head>
        <title>
          {title} ※ {PRODUCT_NAME}
        </title>
        <meta name="Description" content={description} />
        <meta name="theme-color" content={theme.themeColor} />
      </Head>
      <ThemeProvider value={defaultTheme}>{children}</ThemeProvider>
    </>
  );
};
