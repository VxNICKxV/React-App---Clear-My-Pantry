import React, { useEffect } from 'react'
import { useState } from 'react';
import './MyRecipes.css';
import { Navigate, useNavigate } from 'react-router-dom';
import BackToHome from './backToHome';

const MyRecipes = ({ user }) => {
  const navigate = useNavigate()
  const [recipeData, setRecipeData] = useState([]);

  // we navigate to the editrecipes page and also pass it the user clerk data
  let handleChange = (user, id) => {
    navigate(`/editrecipe/${id}`, { state: {user} })
  }
  // loading recipes data from backend for a user
  useEffect(() => {
    if (user.user_id) {
      fetch(`http://localhost:3000/recipesAndIngredients/${user.user_id}`)
        .then(response => response.json())
        .then(userRecipes => {
          setRecipeData(userRecipes)
        })
        .catch(err => console.error(err))
    }
  }, [user])

  // handles in case the user has no img, we display a stock from from assets
  const handleError = (event) => {
    console.log('image failed to load - ', event);
    event.target.src = '/assets/recipeImages/Placeholder.png'
  }

  let displayRecipes = recipeData.map(recipe => {
    
    return (
      <div key={recipe.recipe_id} className="container">
        <div className="myRecipeCard">
          <img src={recipe.img} className="myImg" onError={handleError}/>
          <div className="middleCardDiv">
            <h4>{recipe.recipe_name}</h4>
            <p>{recipe.description}</p>
          </div>
          <button className="editButton" onClick={() => handleChange(user, recipe.recipe_id)}>Edit Recipe</button>
          <button className="editButton" onClick={() => navigate(`/recipes/${recipe.recipe_id}`)}>View Recipe</button>
        </div>
        {/* <div className="ingDiv">
          <ul className="listTitle"><strong>Ingredients:</strong></ul>
          {recipe.ingredients.map(ing => {
            return (
              <li key={ing.ingredients_id} className='list'>
                {ing.ingredients_name}: {ing.quantity_n_units}
              </li>
            )
          })}
        </div>

        <div className="ingDiv">
          <ol className="listTitle"><strong>Instructions:</strong>
          {recipe.steps.map((step, index) => {
            return (
              <li key={index} className=''>
                {step}
              </li>
            )
          })}
          </ol>
        </div> */}
      </div>
    )
  })

  return (
    <>
      <div className="webpage">
        <h2>My Recipes!</h2>
        {displayRecipes}
      </div>
      <br />
      <BackToHome />
    </>
  )
}

export default MyRecipes
