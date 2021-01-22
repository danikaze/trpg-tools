import { FunctionComponent } from 'react';
import Head from 'next/head';
import { makeStyles, ThemeProvider, useTheme } from '@utils/styles';
import { defaultTheme } from '@themes/default';
import { TopBar, TOPBAR_HEIGHT } from '@components/top-bar';
import { Footer, FOOTER_HEIGHT } from '@components/footer';
import { PRODUCT_NAME } from '@utils/constants';
import { SideBar } from './side-bar';

export interface Props {
  title: string;
  description: string;
  header?: string;
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

export const Page: FunctionComponent<Props> = ({
  title,
  description,
  header,
  children,
}) => {
  const styles = useStyles();
  const theme = useTheme();
  const h1 = header ? <h1 className={styles.header}>{header}</h1> : undefined;

  return (
    <>
      <Head>
        <title>
          {title} ※ {PRODUCT_NAME}
        </title>
        <meta name="Description" content={description} />
        <meta name="theme-color" content={theme.themeColor} />
      </Head>
      <ThemeProvider value={defaultTheme}>
        <div className={styles.grid}>
          <TopBar className={styles.top} />
          <SideBar className={styles.side} />
          <main className={styles.main}>
            {h1}
            {children}
          </main>
          <Footer className={styles.bottom} />
        </div>
      </ThemeProvider>
    </>
  );
};
