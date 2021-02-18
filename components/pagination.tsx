import { FunctionComponent, ReactNode } from 'react';
import { makeStyles } from '@utils/styles';

interface PageLinkProps {
  page?: number;
  children: ReactNode;
}
type PageLinkComponent<P extends PageLinkProps> = FunctionComponent<P>;

interface Props<L extends PageLinkProps = PageLinkProps> {
  totalPages: number;
  page: number;
  LinkElem: PageLinkComponent<L>;
}

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  page: {
    margin: '0 20px',
  },
}));

export const Pagination: FunctionComponent<Props> = (props) => {
  const styles = useStyles();
  const { page, totalPages, LinkElem } = props;

  if (totalPages < 2) {
    return null;
  }

  const prev = page > 0 && <LinkElem page={page - 1}>⇦</LinkElem>;
  const next = page < totalPages - 1 && <LinkElem page={page + 1}>⇨</LinkElem>;

  return (
    <div className={styles.root}>
      {prev}{' '}
      <div className={styles.page}>
        Page {page + 1}/{totalPages}
      </div>{' '}
      {next}
    </div>
  );
};
