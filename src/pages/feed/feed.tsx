import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { getFeed, selectorsFeed } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const feedOrders = useAppSelector(selectorsFeed.orders);
  const loading = useAppSelector(selectorsFeed.loading);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getFeed());
  }, [dispatch]);

  const handleFeeds = () => {
    dispatch(getFeed());
  };

  return (
    <>
      {loading && <Preloader />}
      {!loading && (
        <FeedUI orders={feedOrders.orders} handleGetFeeds={handleFeeds} />
      )}
    </>
  );
};
