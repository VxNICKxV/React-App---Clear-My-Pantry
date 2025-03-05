import React, { useEffect } from 'react'
import { useState } from 'react';
import './EditChange.css';
import { Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';

const EditChanges = () => {
    const navigate = useNavigate()
    const { user } = useLocation()
    const { recipe_id } = useParams()
    // these states hold our GET requested recipe and ingredient data
    const [recipe, setRecipe] = useState([]);
    const [ingredients, setIngredients] = useState([]);

    const [recipePOST, setRecipePOST] = useState({
        recipe_name: '',
        description: '',
        img: '',
        ingredients_name: {},
        quantity_n_units: {},
        steps: {}
    });

    // this is done simply to scroll to the top of the page
    useEffect(() => {
        window.scroll(0, 0)
    }, [])
    // loading recipes data from backend for a specific recipe
    useEffect(() => {

        fetch(`http://localhost:3000/recipe/${recipe_id}`)
            .then(response => response.json())
            .then(data => {
                // we need to take our data from the database and return it in the same form we created it as in the AddRecipe.jsx
                let stepsObject = {};
                if (Array.isArray(data[0].steps) && data[0].steps.length > 0) {
                    data[0].steps.forEach((data, index) => {
                        stepsObject[`steps${index}`] = data
                    })
                }
                // returning all our data in an array makes it easy to iterate over
                setRecipe(data[0])
                // this will be our return data eventually so lets give it some initial values
                setRecipePOST({
                    recipe_name: data[0].recipe_name,
                    description: data[0].description,
                    img: data[0].img,
                    ingredients_name: {},
                    quantity_n_units: {},
                    steps: stepsObject
                })
            })
            .catch(() => {
                console.log("Cannot get recipe data from this time")
            })

        fetch(`http://localhost:3000/recipe/ingredients/${recipe_id}`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                // before i was checking for the data it would return with an empty object. I think this is because of the timing and how i'm running asynchronous code, so this checks the array if it exist and if its actually populated with what we want.
                if (Array.isArray(data) && data.length > 0) {
                    setIngredients(data)
                    // the issue is that the way i origianlly put my data in was in the form of an object, so i want to get it back as an object and update it the same way i created it.
                    setRecipePOST(previousObj => {
                        const ingredients_nameObject = {};
                        const quantity_n_unitsObject = {};

                        // create an object with a bunch of key's named their name with an index cause this is how we made it originally
                        data.forEach((ingData, index) => {
                            // below we have ingredients_name[index] and quantity_n_units[index] 
                            ingredients_nameObject[`ingredients_name${ingData.ingredients_id}`] = ingData.ingredients_name,
                                quantity_n_unitsObject[`quantity_n_units${ingData.ingredients_id}`] = ingData.quantity_n_units
                        })
                        // get our state, and update the ingredients_name and quantity
                        return {
                            ...previousObj,
                            ingredients_name: ingredients_nameObject,
                            quantity_n_units: quantity_n_unitsObject
                        };
                    })
                }

            })
            .catch(() => {
                console.log("Cannot get ingredients data from this time")
            })
    }, [recipe_id])

    // this is what handles our inputs being changed and updating a state to send to the server
    const handleChange = (event, id) => {
        const { name, value } = event.target
        //recipeObj will represent our recipe Object

        // if we have one of the 3 multi-instanced datapoints then we will make them into objects, each with a unique key so we can later put that as an array to our backend
        if (name == "ingredients_name" || name == "quantity_n_units" || name == "steps") {
            setRecipePOST(recipeObj => {
                return { ...recipeObj, [name]: { ...recipeObj[name], [name + id]: value } }
            })
        } else {
            return setRecipePOST({ ...recipePOST, [name]: value })
        }
    }
    // capitalize the first letter and lowercase everythine else!
    const capatilize = (data) => {
        return data.charAt(0).toUpperCase() + data.slice(1).toLowerCase()
    }
    // handles in case the user has no img, we display a stock from from assets
    const handleError = (event) => {
        console.log('image failed to load - ', event);
        event.target.src = '/assets/recipeImages/Placeholder.png'
    }

    const handleSubmit = (event) => {

        // we are converting our Objects here back to arrays because i originally designed for them to be arrays and i'm not going back now! woohoo!
        let ingredients = Object.values(recipePOST.ingredients_name)
        let ingredientsId = Object.keys(recipePOST.ingredients_name).map(id => parseInt(id.slice(16)))
        let quantity = Object.values(recipePOST.quantity_n_units)
        let userSteps = Object.values(recipePOST.steps)
        
        let updatedData = () => {
            let promises = [];
        let updatedRecipe = fetch(`http://localhost:3000/recipes/${recipe_id}`, {
            //PUT method updating our data
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            // we grab the function that capatilizes the recipe name here
            body: JSON.stringify(
                {
                    // we grab the function that capatilizes the recipe name here
                    recipe_name: recipePOST.recipe_name,
                    description: recipePOST.description || "N/A",
                    steps: userSteps,
                    img: recipePOST.img
                })

        })
            //parse the response to json
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                console.log("Error posting recipe as this time from server", err)
            })
        promises.push(updatedRecipe)
        // we run a post multiple times so if the user puts in a couple of ingredients they will send back each of those ingredients to the server
        let updatedIngredients = ingredients.map((element, index) => {
            return fetch(`http://localhost:3000/ingredients/${ingredientsId[index]}`, {
                //POST method that gives the state data to the server!
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                // we send off the function to check duplicates so we never send an identical ingredient to the server
                body: JSON.stringify({
                    ingredients_name: capatilize(element),
                    category: "N/A",
                    // after running into the console.log, i figured out that recipe_id is under an object called {result}
                    recipe_id: recipe_id,
                    quantity_n_units: quantity[index]
                })

            })
                //parse the response to json
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                })
                .catch(err => {
                    console.log("error posting ingredients from server", err)
                })
        })
        promises.push(updatedIngredients)
        return promises;
    };
        // Promise.All will navigate us back to myRecipes after we are done updating
        Promise.all(updatedData())
            .then(() => {
                navigate('/myrecipes', { replace: true })
            })
            .catch(err => {
                console.log("Could not reload the page, fetches not finished", err)
            })
    }

    // this deletes the given recipe
    const handleDelete = (recipe_id) => {

        // we put this out so that someone doesn't accidentally press delete and remove their recipe! confirmation!
        const confirmed = window.confirm('Are you sure you want to remove this recipe?')
        if (confirmed) {
            // we delete ingredients first since it shares the recipe_id with the recipe table
            fetch(`http://localhost:3000/ingredients/${recipe_id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            })
                .then(response => response.json())
                .then(data => {
                    // now we delete the recipe data after ingredients are done
                    fetch(`http://localhost:3000/recipes/${recipe_id}`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" }
                    })
                        .then(response => response.json())
                        .then(data => {
                            // after we are done, we go back to the my/recipes route
                            navigate('/myrecipes', { replace: true })
                        })
                        .catch(err => console.log("Could not delete recipe at this time", err))

                })
                .catch(err => console.log("Could not delete ingredients at this time", err))
        }
    }
    console.log(recipePOST.img)
    let displayRecipes =
        <div className="container">
            <div className="editRecipeCard">
                <div>

                    <img src={recipePOST.img} className="img" onError={handleError} />
                    <input type="text" name="img" value={recipePOST.img} onChange={handleChange} />
                </div>
                <div>
                    <h4>
                        <input type="text" name="recipe_name" value={recipePOST.recipe_name} onChange={handleChange} />
                    </h4>
                    <p>
                        <input type="text" name="description" value={recipePOST.description} onChange={handleChange} />
                    </p>
                </div>
                {/* edit and delete buttons here */}
                <button className="updateButton" onClick={() => handleSubmit()}>Update Recipe</button>
                <button className="deleteButton" onClick={() => handleDelete(recipe_id)}>Delete Recipe</button>
            </div>
            {/* this div has our mapped ingredients as well as inputs for each ingredinet of the recipe */}
            <div className="ingDiv">
                <ul className="listTitle"><strong>Ingredients:</strong></ul>
                {ingredients.map((ing, index) => {
                    return (
                        <li key={index} className='list'>
                            <input type="text" name="ingredients_name"
                                value={recipePOST.ingredients_name[`ingredients_name${ing.ingredients_id}`]}
                                onChange={(e) => handleChange(e, ing.ingredients_id)} />
                            <input type="text" name="quantity_n_units"
                                value={recipePOST.quantity_n_units[`quantity_n_units${ing.ingredients_id}`]} className='space'
                                onChange={(e) => handleChange(e, ing.ingredients_id)} />
                        </li>
                    )
                })}
            </div>

            <div className="ingDiv">
                <ol className="listTitle"><strong>Instructions:</strong></ol>
                {/* checking to make sure the array exist before trying to display */}
                {Array.isArray(recipe.steps) && recipe.steps.length > 0 ? (
                    recipe.steps.map((step, index) => {
                        return (
                            <li key={index}>
                                <input type="text" name="steps" value={recipePOST.steps[`steps${index}`]} className="steps" onChange={(e) => handleChange(e, index)} />
                            </li>
                        )
                    })
                ) : (<p>no step data</p>)}
            </div>
        </div>

    return (
        <>
            <div className="webpage">
                <h2>Change it up?</h2>
                {displayRecipes}
            </div>
        </>
    )
}

export default EditChanges
