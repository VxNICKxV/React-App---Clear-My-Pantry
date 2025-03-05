import './Home.css'
import Recipes from './Recipes.jsx'
// import Ingredients from './ingredients'
import SearchIngredients from './SearchIngredients'
import { useState, useEffect } from 'react';
import Ingredients from './ingredients.jsx'
import Navbar from './Navbar.jsx';

function Home({ handleClick, recipeId }) {
  // this state will act as our conduit from component Ingredidents.jsx to SearchIngredients.jsx

  const [selectedIng, setSelectedIng] = useState([]);

  // update handler that updates our conduit state with the search vlaue from SearchIngredients
  const updateIngredients = (ingredient) => {
    IngredientUpdate(ingredient.toLowerCase());
  };

  return (
    <>
      <div className='home-title'>
        <h1>Clear My Pantry</h1>
      </div>
      < Navbar />
      <div className='home-container'>
        <div>
          {/* <h1>Ingredients</h1> */}
          {/* passing handler to child component SearchIngredients */}
          {/* <div>
          </div> */}
          {/* passing the state data to Ingredients.jsx */}
          <Ingredients setSelectedIng={setSelectedIng} selectedIng={selectedIng}/>
        </div>
        <div className="anchor">
          <Recipes selectedIngredients={selectedIng} />
        </div>
      </div>
    </>
  )


}
export default Home;



