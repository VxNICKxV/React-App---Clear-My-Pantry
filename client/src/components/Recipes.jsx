//  1: import files and packages
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Recipe.css";
import body from "../recipeBody/pantry";

//base url for fetching data from the server
const baseURL = "http://localhost:3000";
function Recipes({ selectedIngredients }) {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState(new Set());
  const [allRecipes, setAllRecipes] = useState([]);
  // collection of recipes from server
  useEffect(() => {
    console.log("selectedIngredients: ", selectedIngredients)
    if (selectedIngredients.length) {
      //if(isLoaded) -- for when we have users
      // empty the recipes array before adding new recipes
      setRecipes([]);
      selectedIngredients.forEach((selectedId) => {
        for (const r of allRecipes) {
          for (const ingredient of r.ingredients) {
            if (ingredient.ingredients_id == selectedId) {
              setRecipes((prevRecipes) => {
                const newRecipes = [...prevRecipes, r];
                const uniqueRecipes = Array.from(new Set(newRecipes.map(recipe => recipe.recipe_id)))
                .map(id => newRecipes.find(recipe => recipe.recipe_id === id));
                return uniqueRecipes;
              });
              break;
            }
          }
        }
      });
    } else {
      //if(isLoaded) -- for when we have users
      fetch(baseURL + "/recipes")
        .then((response) => response.json())
        .then((data) => {
          setRecipes(data);
          setAllRecipes(data);
        })
        .catch((error) => console.log("Error reading data: ", error));
    }
  }, [selectedIngredients]);

  //navigates to the recipe page based on the recipe clicked on
  const navigateToRecipe = (recipe) => {
    navigate(`/recipes/${recipe.recipe_id}`);
  };

  const handleError = (event) => {
    console.log('image failed to load - ', event);
    event.target.src = '/assets/recipeImages/Placeholder.png'
  }

  return (
    <>
      <div className="uniqueCard">
        {Array.from(recipes).map((recipe, index) => (
          // adds an on click to each recipe and returns the recipe id for the recipe that was clicked
          <div
            key={index}
            className="recipe"
            onClick={() => navigateToRecipe(recipe)}>
            <img src={recipe.img} alt="recipe-img" className="recipe-img" onError={handleError} />
            <div className="content">
              <div className="name">{recipe.recipe_name}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Recipes;
