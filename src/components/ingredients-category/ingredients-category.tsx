import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useAppSelector } from '../../services/store';
import { selectorsBurgerConstructor } from '../../services/slices/burgerConstructorSlice';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients: categoryIngredients }, ref) => {
  const bun = useAppSelector(selectorsBurgerConstructor.bun);
  const ingredients = useAppSelector(selectorsBurgerConstructor.ingredients);

  const burgerConstructor = {
    bun: {
      _id: bun?._id
    },
    ingredients
  };

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients } = burgerConstructor;
    const counters: { [key: string]: number } = {};
    ingredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });
    if (bun._id) counters[bun._id] = 2;
    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={categoryIngredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
