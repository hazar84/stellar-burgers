import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useAppSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { selectorsIngredients } from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const ingredients = useAppSelector(selectorsIngredients.ingredients);
  const { id } = useParams();
  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
