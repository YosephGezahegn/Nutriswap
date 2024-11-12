import axios from 'axios';

const BASE_URL = 'https://api.edamam.com/search';
const APP_ID = '2ba6c4af';
const APP_KEY = '85b0a40c803717b78498';

// Function to search for food recipes based on a query
export const searchFood = async (query) => {
  try {
    // Using URL parameters with explicit concatenation
    const url = `${BASE_URL}?q=${query}&?app_id=${APP_ID}&app_key=${APP_KEY}&count=1`;
    const response = await axios.get(url);
    return response.data.hits;
  } catch (error) {
    console.error('Error fetching food data:', error);
    throw error;
  }
};

// Function to get nutrient information for a specific food query
export const getNutrients = async (query) => {
  try {
    const url = `${BASE_URL}?q=${query}&?app_id=${APP_ID}&app_key=${APP_KEY}&count=1`;
    const response = await axios.get(url);
    if (response.data.hits.length > 0) {
      return response.data.hits[0].recipe.totalNutrients;
    } else {
      throw new Error('No nutrients found for the given food.');
    }
  } catch (error) {
    console.error('Error fetching nutrients:', error);
    throw error;
  }
};