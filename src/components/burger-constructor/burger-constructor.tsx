import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useAppSelector, useAppDispatch } from '../../services/store';
import {
  clearConstructor,
  selectorsBurgerConstructor
} from '../../services/slices/burgerConstructorSlice';
import { useNavigate } from 'react-router-dom';
import {
  postOrderBurger,
  resetCreatOrder,
  selectorsOrder
} from '../../services/slices/orderSlice';
import { selectorsUser } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const bun = useAppSelector(selectorsBurgerConstructor.bun);
  const ingredients = useAppSelector(selectorsBurgerConstructor.ingredients);
  const isAuthenticated = useAppSelector(selectorsUser.isAuthenticated);
  const orderRequest = useAppSelector(selectorsOrder.orderRequest);
  const orderModalData = useAppSelector(selectorsOrder.orderData);

  const constructorItems = {
    bun: bun,
    ingredients: ingredients
  };

  const onOrderClick = async () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!isAuthenticated) return navigate('/login');

    const order: string[] = constructorItems.bun
      ? [
          constructorItems.bun._id,
          ...constructorItems.ingredients.map((ingredient) => ingredient._id),
          constructorItems.bun._id
        ]
      : [];

    await dispatch(postOrderBurger(order));
    dispatch(clearConstructor());
  };

  const closeOrderModal = () => {
    dispatch(resetCreatOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
