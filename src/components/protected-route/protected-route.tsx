import { Preloader } from '@ui';
import { useAppSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { selectorsUser } from '../../services/slices/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const checkUser = useAppSelector(selectorsUser.isAuthChecked);
  const user = useAppSelector(selectorsUser.dataUser);
  const location = useLocation();

  if (!checkUser) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/profile' };

    return (
      <Navigate
        replace
        to={from}
        state={{ background: from?.state?.background }}
      />
    );
  }

  return children;
};
