import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { getOrders, selectorsOrders } from '../../services/slices/ordersSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectorsOrders.orders);
  const loading = useAppSelector(selectorsOrders.loading);

  useEffect(() => {
    dispatch(getOrders());
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
