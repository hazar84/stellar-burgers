import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useAppSelector } from '../../services/store';
import { selectorsUser } from '../../services/slices/userSlice';

export const AppHeader: FC = () => {
  const userName = useAppSelector(selectorsUser.userName);

  return <AppHeaderUI userName={userName} />;
};
