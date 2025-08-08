import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useAppSelector } from '../../services/store';
import { selectorsFeed } from '../../services/slices/feedSlice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const feedOrders = useAppSelector(selectorsFeed.orders);

  const feed = {
    total: feedOrders.total,
    totalToday: feedOrders.total
  };

  const readyOrders = getOrders(feedOrders.orders, 'done');

  const pendingOrders = getOrders(feedOrders.orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
