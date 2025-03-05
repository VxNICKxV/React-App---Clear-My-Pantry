import React from 'react'
import { useState } from 'react'

const SearchIngredients = ({ingID, handleToggle, setSelectedIng}) => {
    // This will be the state that holds our ingredient input to be added
    const [ingredient, AddIngredient] = useState("")
    // this handler will update the searchbar for the value our user wants to add
    const handleIngredient = (event) => {
        if(event.key === "Enter") {
        fetch(`http://localhost:3000/ingredients/${ingredient}`)
        .then(response => response.json())
        .then(data => {
            //updates the state of the selected ingredients. If an ingredient is on the list twice, it selects the first one.
            data.forEach((item) => {
                handleToggle(item.ingredients_id)
                setSelectedIng(ingID)
            })
        })
        .catch(error => console.log("Error reading ingredients data: ", error))
            // this will have the UI field reset back to empty when you press enter.
            // otherwise when the user enters an ingredient and presses enter, it stays there and isn't user friendly!
            AddIngredient("")
        } 
    }
    return (
        <>
        <div className='ingredients'>
            {/* text box to enter new ingredient */}
            {/* /* we use an onKeyDown for Users that press ENTER to update the value of the input. value of the searchbar is our state */}
            <input type="text" name="New Ingredient" id="newIng" value={ingredient} 
            onKeyDown={handleIngredient} onChange={(element => AddIngredient(element.target.value))}/>
            {/* // onChange updates the state to have the value the user inputed */}
            {/* onChange={(element => AddIngredient(element.target.value))}/> */}
            {/* submit button for new ingredient. Will have a listener to add to state of ingredients */}
            {/* we use onClick for people who PRESS submit! */}
            <input type="button" value="Submit" />
            </div>
        </>
    )
}

export default SearchIngredients
