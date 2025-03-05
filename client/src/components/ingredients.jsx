import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import './Ingredients.css'
import SearchIngredients from './SearchIngredients'


const Ingredients = ({ setSelectedIng }) => {

  //state that will be set with the data from the ingredients table
  const [ingredients, setIngredients] = useState([]);
  // user selected ingredients state. It starts off empty and will update with user input
  const [ingID, addIngIDs] = useState([]);
  //function to find all id's with matching name
  const findIng = (name) => {
    fetch(`http://localhost:3000/ingredients/${name}`)
    .then(response => response.json())
    .then(data => {
      //for each id that matches the name, run the handleToggle function
      data.forEach((item) => {
        handleToggle(item.ingredients_id)
        
      })
    })
    .catch(error => console.log("Error reading ingredients data: ", error))
  }

  // handler for the toggle state tied to our ingridents. It has the ingredients_id from our OnClick function below
  const handleToggle = (id) => {
    //lets make a function that will update our state with what the user clicks on!
    addIngIDs((list) => {
      // checks if there is a matching id in the state
      if (list.includes(id)) {
        // filter so that it matches for the id against itself, therefore always returning an empty array.
        // example: if the state has an id of 5 the filter will check for 5 !== 5 and then because that's false it returns an empty array
        return list.filter((userId) => userId !== id)
      } else {
        // returns the list (the AddIngIDs State) plus any id listed
        return [...list, id]
      }
    
    })    
  }
  useEffect(() => {
    
    setSelectedIng(ingID);
  }, [ingID, setSelectedIng]);

  useEffect(() => {
    //if(isLoaded) -- for when we have users
    fetch('http://localhost:3000/ingredients')
      .then(response => response.json())
      .then(data => {
        const uniqueIngredients = data.filter((value, index, self) => 
          index === self.findIndex((t) => (
            t.ingredients_name.toLowerCase() === value.ingredients_name.toLowerCase()
          ))
        );
        setIngredients(uniqueIngredients);
        console.log(data)
      })
      .catch(error => console.log("Error reading ingredients data: ", error))
  }, [])
  return (
    // <div className='ingredient-container'>
    <div className='ingredients-container'>
      <div className='ingredients'>
        <SearchIngredients ingID={ingID} handleToggle={handleToggle} setSelectedIng={setSelectedIng} />

        {/* <h1>Ingredients List</h1> */}
        {/* checks that ingredients exist, then maps them */}
        {ingredients && ingredients.map((ingredients) => (
          <div className='buttons'key={ingredients.ingredients_name}>
            {/* <div className="content"> */}
            {/* returns the names of all our ingredients in our database */}
            <button
              key={ingredients.ingredients_name} type="button"
              onClick={() => {
                // handleToggle(ingredients.ingredients_id);
                findIng(ingredients.ingredients_name.toLowerCase());
              }}
                //toggles the class of all id's with the matching name regardless of case
                className={`btn btn-sm btn-outline-primary shared ${ingID.includes(ingredients.ingredients_id) ? "activatedButton" : ""}`}>
                {ingredients.ingredients_name}
              </button>
              {/* </div> */}
          </div>
        ))}
        {/* </div> */}
      </div>

    </div>
  )
}
export default Ingredients

