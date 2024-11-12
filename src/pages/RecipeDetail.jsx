import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const RecipeDetail = () => {
  const { id } = useParams(); // Extract the recipe ID from the URL parameters

  // Get the specific recipe from the Redux store
  const recipe = useSelector((state) =>
    state.suggestions.suggestions.find((suggestion) => suggestion.id === id)
  );

  if (!recipe) {
    return <div className="text-center text-gray-600">Recipe not found. Please go back and try again.</div>;
  }

  const {
    label,
    image,
    source,
    url,
    yield: servings,
    dietLabels,
    healthLabels,
    cautions,
    ingredientLines,
    calories,
    totalWeight,
    totalNutrients,
    cuisineType,
    mealType,
    dishType,
  } = recipe;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{label}</h1>
      <img src={image} alt={label} className="w-full h-64 object-cover rounded-md mb-4" />

      <div className="mb-4">
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold">
          Recipe Source: {source}
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Diet & Health Labels</h2>
          <p><strong>Diet Labels:</strong> {dietLabels.length > 0 ? dietLabels.join(', ') : 'None'}</p>
          <p><strong>Health Labels:</strong> {healthLabels.length > 0 ? healthLabels.join(', ') : 'None'}</p>
          <p><strong>Cautions:</strong> {cautions.length > 0 ? cautions.join(', ') : 'None'}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
          <p><strong>Cuisine Type:</strong> {cuisineType ? cuisineType.join(', ') : 'Unknown'}</p>
          <p><strong>Meal Type:</strong> {mealType ? mealType.join(', ') : 'Unknown'}</p>
          <p><strong>Dish Type:</strong> {dishType ? dishType.join(', ') : 'Unknown'}</p>
          <p><strong>Servings:</strong> {servings}</p>
          <p><strong>Total Weight:</strong> {totalWeight.toFixed(2)} g</p>
          <p><strong>Calories:</strong> {calories.toFixed(2)} kcal</p>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">Nutritional Information</h2>
        <div className="bg-white border border-gray-800 p-4 rounded-md shadow-md max-w-md font-sans">
          <div className="text-3xl font-extrabold pb-2 border-b-4 border-black">Nutrition Facts</div>
          <div className="text-sm mt-1">Servings per container: <span className="font-bold">{servings || 1}</span></div>
          <div className="flex justify-between text-lg font-bold mt-2 border-b-4 border-black pb-2">
            <div>Serving size</div>
            <div>1 serving</div>
          </div>

          <div className="flex justify-between items-center mt-3 text-4xl font-extrabold border-b-2 border-black pb-2">
            <div>Calories</div>
            <div>{calories ? calories.toFixed(0) : 0}</div>
          </div>

          <div className="text-right font-medium text-sm mt-2">% Daily Value *</div>

          {Object.entries(totalNutrients).map(([key, nutrient]) => (
            <div key={key} className="flex justify-between border-t py-2">
              <span className="font-bold">{nutrient.label}</span>
              <span>
                {nutrient.quantity.toFixed(2)} {nutrient.unit}
              </span>
            </div>
          ))}

          <div className="flex flex-col mt-4 text-xs border-t pt-2">
            <div>* The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.</div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
        <ul className="list-disc list-inside">
          {ingredientLines.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeDetail;