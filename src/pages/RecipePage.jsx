import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { searchFood } from '../services/foodApi';
import RecipeDetail from '../components/RecipeDetail.jsx';

const RecipePage = () => {
  const { id } = useParams(); // Extract recipe ID from URL parameters
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        
        // We will try with multiple generic search queries
        const possibleQueries = ['chicken', 'egg', 'beef', 'pasta'];
        let foundRecipe = null;

        // Iterate through the queries to find the recipe by ID
        for (const query of possibleQueries) {
          const results = await searchFood(query);
          foundRecipe = results.find(
            (result) => result.recipe.uri.split('#recipe_')[1] === id
          );

          if (foundRecipe) {
            break; // Stop searching once the recipe is found
          }
        }

        if (foundRecipe) {
          setRecipe(foundRecipe.recipe);
        } else {
          console.error('Recipe not found');
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!recipe) {
    return <div className="text-center text-gray-600">Recipe not found.</div>;
  }

  return <RecipeDetail recipe={recipe} />;
};

export default RecipePage;