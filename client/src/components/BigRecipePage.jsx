import { useEffect, useState } from "react";
import React from "react";
import "./BigRecipePage.css"; //import recipe.css file
import { useParams } from "react-router-dom";
import BackToHome from "./backToHome";

// THIS COMPONENT DISPLAYS ONE RECIPE AND ITS STEPS AND INGREDIENTS
const BigRecipePage = () => {
  // const navigate = useNavigate();
  let { recipe_id } = useParams();
  const [fromMyRecipes, setFromMyRecipes] = useState(false);

  useEffect(() => {
    const previousPage = document.referrer;
    if (previousPage.includes("/myrecipes")) {
      setFromMyRecipes(true);
    }
  }, []);
  const [recipeData, setRecipeData] = useState({});
  const [recipeIngredients, setRecipeIngredients] = useState([]);

  // calling the ingredients for this specific recipe
  useEffect(() => {
    fetch(`http://localhost:3000/recipe/${recipe_id}`)
      .then((response) => response.json())
      .then((data) => {
        setRecipeData(data[0]);
      })
      .catch(() => {
        console.log("Cannot get recipe data from this time");
      });
    fetch(`http://localhost:3000/recipe/ingredients/${recipe_id}`)
      .then((response) => response.json())
      .then((data) => {
        setRecipeIngredients(data);
      })
      .catch(() => {
        console.log("Cannot get ingredients data from this time");
      });
  }, []);

  const handleError = (event) => {
    console.log("image failed to load - ", event);
    event.target.src = "/assets/recipeImages/Placeholder.png";
  };

  return (
    <>
      <div className="recipe-page-container">
        <div className="image-container">
          {/* image of the recipe */}
          <img
            src={recipeData.img}
            className="big-image"
            alt="recipe-img"
            onError={handleError}
          />
        </div>
        <div className="recipe-content-header">
          <div className="recipe-content">
            {/* Maps over the ingredients and gives back the ingredient names */}
            <div className="recipe-title">
              {/* name of the recipe */}
              <h2>{recipeData.recipe_name}</h2>
            </div>
            <div className="ingredients-title">
              <h4>Ingredients</h4>
            </div>
            <div className="ingredients-list">
              <ul>
                {recipeIngredients.map((ingredients, index) => (
                  <li key={index}>
                    <span>{ingredients.ingredients_name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="instructions-title">
              <h4>Instructions</h4>
            </div>
            <div className="recipe-instructions">
              <ol>
                {/* This is our display for the steps */}
                {recipeData.steps &&
                  recipeData.steps.map((steps, index) => (
                    <li key={index} className="stepsList">
                      {steps}
                    </li>
                  ))}
              </ol>
            </div>
          </div>
        </div>
        <BackToHome />
      </div>
    </>
  );
};

export default BigRecipePage;
