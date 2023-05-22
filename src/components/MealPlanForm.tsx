

import React, { useState } from 'react';
import axios from 'axios';

interface MealContainerProps {
  title: string;
  mealType: string;
  ingredients: string[];
  instructions: string[];
}

const MealContainer: React.FC<MealContainerProps> = ({
  title,
  mealType,
  ingredients,
  instructions,
}) => {
  return (
    <div className="bg-white shadow-md rounded-md p-4 my-8">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      <h3 className="text-lg font-medium text-gray-500 mb-4">{mealType}</h3>
      <div className="mb-4">
        <h4 className="text-lg font-semibold mb-2">Ingredients</h4>
        <ul className="list-disc list-inside ml-4">
          {ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-2">Instructions</h4>
        <ol className="list-decimal list-inside ml-4">
          {instructions.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

const MealPlanForm: React.FC = () => {
  const [preferredFoods, setPreferredFoods] = useState('');
  const [notPreferredFoods, setNotPreferredFoods] = useState('');
  const [mealType, setMealType] = useState('breakfast');
  const [mealStyle, setMealStyle] = useState('regular');
  const [numOfDays, setNumOfDays] = useState('1');
  const [mealContainers, setMealContainers] = useState<MealContainerProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response: any = await axios.post('/api/generate-meal-plan', {
        preferredFoods,
        notPreferredFoods,
        mealType,
        mealStyle,
        numOfDays,
      });

      console.log(response.data);

      const { mealPlan }: any = response.data;
      if(mealPlan){
        setMealContainers(JSON.parse(mealPlan));
      } else {
        setError("Something went wrong, try again.");
      }
      
    } catch (error) {
      console.error(error);
      setError('Failed to generate meal plan. Please try again.');
    }

    setIsLoading(false);
  };

  const handleFormReset = () => {
    setPreferredFoods('');
    setNotPreferredFoods('');
    setMealType('breakfast');
    setMealStyle('regular');
    setNumOfDays('1');
    setMealContainers([]);
    setError('');
  };

  return (
    <div>
      <form className="bg-white shadow-md rounded-md p-4" onSubmit={handleFormSubmit} onReset={handleFormReset}>
        <div className="mb-4">
          <label htmlFor="preferredFoods" className="text-lg font-semibold mb-2">
            Preferred Foods
          </label>
          <input
            type="text"
            id="preferredFoods"
            value={preferredFoods}
            onChange={(e) => setPreferredFoods(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="notPreferredFoods" className="text-lg font-semibold mb-2">
            Not Preferred Foods
          </label>
          <input
            type="text"
            id="notPreferredFoods"
            value={notPreferredFoods}
            onChange={(e) => setNotPreferredFoods(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="mealType" className="text-lg font-semibold mb-2">
            Meal Type
          </label>
          <select
            id="mealType"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="dessert">Dessert</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="mealStyle" className="text-lg font-semibold mb-2">
            Meal Style
          </label>
          <div>
            <label className="mr-4">
              <input
                type="radio"
                name="mealStyle"
                value="regular"
                checked={mealStyle === 'regular'}
                onChange={() => setMealStyle('regular')}
                className="mr-1"
              />
              Regular Meal
            </label>
            <label>
              <input
                type="radio"
                name="mealStyle"
                value="mealPrep"
                checked={mealStyle === 'mealPrep'}
                onChange={() => setMealStyle('mealPrep')}
                className="mr-1"
              />
              Meal Prep
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="numOfDays" className="text-lg font-semibold mb-2">
            Number of Days
          </label>
          <select
            id="numOfDays"
            value={numOfDays}
            onChange={(e) => setNumOfDays(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
          </select>
        </div>

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
          <button
            type="reset"
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset
          </button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
      {mealContainers.map((meal, index) => (
        <MealContainer
          key={index}
          title={meal.title}
          mealType={meal.mealType}
          ingredients={meal.ingredients}
          instructions={meal.instructions}
        />
      ))}
    </div>
  );
};

export default MealPlanForm;
