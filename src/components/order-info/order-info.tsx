import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  getOrderByNumber,
  selectorsOrder
} from '../../services/slices/orderSlice';
import { selectorsIngredients } from '../../services/slices/ingredientsSlice';
import { useParams } from 'react-router-dom';
import { selectorAllOrders } from '@selectors';

export const OrderInfo: FC = () => {
  const loading = useAppSelector(selectorsOrder.loadingOrderByNumber);
  const ingredients = useAppSelector(selectorsIngredients.ingredients);
  const { number } = useParams<{ number: string }>();
  const orderData = useAppSelector(selectorAllOrders(number));

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!orderData) {
      dispatch(getOrderByNumber(Number(number)));
    }
  }, [number, orderData, dispatch]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const numder = orderData.number ? `#${orderData.number}` : '';

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
      numder
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return loading ? <Preloader /> : <OrderInfoUI orderInfo={orderInfo} />;
};
