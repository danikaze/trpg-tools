import { FunctionComponent } from 'react';
import logoUrl from '@assets/images/trpg-d20-200px.png';

export type Props = {};

export const Index: FunctionComponent<Props> = ({}) => {
  return (
    <div>
      <img src={logoUrl} alt="TRPG Logo" />
    </div>
  );
};
