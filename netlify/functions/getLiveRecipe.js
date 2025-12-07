// netlify/functions/getLiveRecipe.js
import fetch from "node-fetch";

export async function handler() {
  try {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data.meals[0]),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}