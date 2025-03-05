import React, { useEffect } from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './AddRecipe.css';
import BackToHome from './backToHome';

const AddRecipe = ({ user }) => {
    const navigate = useNavigate();
    // states associated with server
    const [recipe, setRecipe] = useState({
        recipe_name: '',
        description: '',
        img: '',
        ingredients_name: {},
        quantity_n_units: {},
        steps: {}
    }); // state that will send the data to the server
    const [moreIngredients, setMoreIngredients] = useState([]); // state that holds our use created inputFields for ingredients and quantity
    const [moreSteps, setMoreSteps] = useState([]); // state that holds the created input fields for more steps
    const [clerkData, setClerkData] = useState({}); // holds the clerkData when they login

    useEffect(() => {
        // because React is running asynchronously, you need to make sure it actually has user before going through useEffect you will will just get an empty object
        if (user) {
            setClerkData(user)
        }
    }, [user])
    // onchange for recipe
    const handleChange = (event, index) => {
        const { name, value } = event.target
        //recipeObj will represent our recipe Object

        // if we have one of the 3 multi-instanced datapoints then we will make them into objects, each with a unique key so we can later put that as an array to our backend
        if (name == "ingredients_name" || name == "quantity_n_units" || name == "steps") {
            setRecipe(recipeObj => {
                /* name will represent the name of one of the datapoints above and we give it a unique key with the input field being the value
                spread the recipe object, then [name] add the rest of the object. for instance if ingredients_name for [name] it will be:
                ingredients_name: {...recipeObj.ingredients_name}. This was a very sad process because i created it so deep when it was already having an issue, but it EVENTUALLY worked*/
                return { ...recipeObj, [name]: { ...recipeObj[name], [name + index]: value } }
            })
        } else {
            return setRecipe({ ...recipe, [name]: value })
        }
    }
    // this is our handler function to create more input fields
    const addInput = event => {
        event.preventDefault()
        // this empty object is going to just be what is set so they can add any number of input fields they want
        setMoreIngredients([...moreIngredients, {}])
    }
    // here is our handler for the steps field
    const addInput2 = event => {
        event.preventDefault()
        setMoreSteps([...moreSteps, {}])
    }
    // we capatilize only the first word in our recipes
    const capatilize = (data) => {
       return data.charAt(0).toUpperCase() + data.slice(1).toLowerCase()
    }
    // this is the event handler for submitting a recipe
    const handleSubmit = (event) => {
        // this will stop the page from refreshing
        event.preventDefault();

        // we are converting our Objects here back to arrays because i originally designed for them to be arrays and i'm not going back now! woohoo!
        let ingredients = Object.values(recipe.ingredients_name)
        let quantity = Object.values(recipe.quantity_n_units)
        let userSteps = Object.values(recipe.steps)

        fetch('http://localhost:3000/recipes', {
            //POST method that gives the state data to the server!
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            // we grab the function that capatilizes the recipe name here
            body: JSON.stringify(
                {
                    user_id: clerkData.user_id,
                    // we grab the function that capatilizes the recipe name here
                    recipe_name: recipe.recipe_name,
                    description: recipe.description || "N/A",
                    steps: userSteps,
                    img: recipe.img || "N/A"
                })

        })
            //parse the response to json
            .then(response => response.json())
            // it turns out we are going to need the recipe_id the server creates after making our recipe here, this means our ingredient fetch has to come from the response data
            // we grab the id from data.recipe_id
            .then(data => {
                console.log(data);
                // we run a post multiple times so if the user puts in a couple of ingredients they will send back each of those ingredients to the server
                let createdIngredients = ingredients.map((element, index) => {
                    return fetch('http://localhost:3000/ingredients', {
                        //POST method that gives the state data to the server!
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        // we send off the function to check duplicates so we never send an identical ingredient to the server
                        body: JSON.stringify({
                            ingredients_name: capatilize(element),
                            category: "N/A",
                            // after running into the console.log, i figured out that recipe_id is under an object called {result}
                            recipe_id: data.result.recipe_id,
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
                return Promise.all(createdIngredients);
            })
            .then(() => {
                navigate('/myrecipes', { replace: true })
                window.location.reload()
            })
            .catch(err => {
                console.log("Error posting recipe as this time from server", err)
            })

    }
    
    return (
        <> <div className="webpage">
            <h2 className='title kadwa-bold'>Create a New Recipe here!</h2>
            {/* this preventDefault prevents a refresh on Enter keypress in case our user accidentally does that */}
            <form className="recipeForm" onKeyDown={event => {
                if (event.key === "Enter") {
                    event.preventDefault()
                }
            }}>
                <div>
                    {/* input to grab all the ingredients of the user recipe */}
                    <label className='kadwa-bold block'>Recipe Name:</label>
                    <input
                        type="text"
                        name="recipe_name"
                        // the value set inside the client state
                        value={recipe.recipe_name}
                        onChange={handleChange}
                        placeholder="Add Recipe Name"
                        className='kadwa-regular inputField'
                        required
                    />
                </div>
                {/* button that adds an ingredient, pulled from bootstrap and imported a logo for an add symbol */}
                <div>
                    <label className='kadwa-bold'>Add an ingredient</label>
                    <button className="btn btn-secondary addInput" onClick={addInput}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                        </svg>
                    </button>
                </div>
                <div className="ingredientDiv">
                    {/* input to grab all the ingredients of the user recipe */}
                    <label className='kadwa-bold addInput'>Ingredient:</label>
                    <input
                        type="text"
                        name="ingredients_name"
                        // the value set inside the client state
                        value={recipe.ingredients_name[0]}
                        // onChange will update dynamically
                        onChange={(element) => handleChange(element, 0)}
                        placeholder="Add an Ingreident here"
                        className='kadwa-regular'
                    />

                    {/* input to grab all the ingredients of the user recipe */}
                    <label className='kadwa-bold addInput'>Quantity:</label>
                    <input
                        type="text"
                        name="quantity_n_units"
                        // the value set inside the client state
                        value={recipe.quantity_n_units[0]}
                        onChange={(element) => handleChange(element, 0)}
                        placeholder="Add Quantity"
                        className='kadwa-regular'
                        required
                    />
                    {/* below we have a bootstrap icon to signify adding another input */}
                </div>
                {/* if the user wants to make more ingredients and quantity*/}
                {moreIngredients.map((event, index) => {
                    return (
                        // make sure to pass a div with index so that there are unique indexes
                        <div key={index} className="ingredientDiv">
                            <label className='kadwa-bold addInput'>Ingredient:</label>
                            <input
                                type="text"
                                name="ingredients_name"
                                key={`I ${index}`}
                                // the value set inside the client state
                                value={recipe.ingredients_name[index + 1]}
                                // this on blur only activates when someone clicks outside the field
                                onChange={(element) => handleChange(element, index + 1)}
                                placeholder="Add an Ingreident here"
                                className='kadwa-regular'
                            />
                            <label className='kadwa-bold addInput'>Quantity</label>
                            <input
                                type="text"
                                name="quantity_n_units"
                                key={`Q ${index}`}
                                // the value set inside the client state
                                value={recipe.quantity_n_units[index + 1]}
                                onChange={(element) => handleChange(element, index + 1)}
                                placeholder="Add Quantity"
                                className='kadwa-regular'
                            />
                        </div>
                    )
                })}


                <div>
                    <label className='kadwa-bold block'>Description:
                        {/* after testing i decided textarea would be better as you can make this much bigger and the format is cleaner */}
                        <textarea
                            className='form-control'
                            type="text"
                            name="description"
                            rows="4"
                            // the value set inside the client state
                            value={recipe.description}
                            onChange={handleChange}
                            placeholder="Add a description (Optional)"
                        ></textarea>
                    </label>
                </div>
                <div>
                    <label className='kadwa-bold'>Add a step</label>
                    <button className="btn btn-secondary addInput" onClick={addInput2}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                        </svg>
                    </button>
                </div>

                <div className="align">

                    <label className='kadwa-bold'>Steps of Preperation:
                        <textarea
                            className='form-control inputField'
                            type="text"
                            name="steps"
                            rows="4"
                            // the value set inside the client state
                            value={recipe.steps[0]}
                            onChange={(element) => handleChange(element, 0)}
                            placeholder="Add Recipe Preperation Steps"
                            required
                        ></textarea>
                    </label>
                </div>

                {moreSteps.map((event, index) => {
                    return (
                        // make sure to pass a div with index so that there are unique indexes
                        <div key={index}>
                            <label className='kadwa-regular'>
                                <textarea
                                    className='form-control'
                                    type="text"
                                    name="steps"
                                    rows="4"
                                    // the value set inside the client state
                                    value={recipe.steps[index + 1]}
                                    onChange={(element) => handleChange(element, index + 1)}
                                    placeholder="Another Step"
                                    required
                                ></textarea>
                            </label>
                        </div>
                    )
                })}

                <div>
                    {/* input to grab all the ingredients of the user recipe */}
                    <label className='kadwa-bold block'>Image of Recipe:
                        <input
                            type="text"
                            name="img"
                            // the value set inside the client state
                            value={recipe.img}
                            onChange={handleChange}
                            placeholder="Add Image URL here"
                            required
                        />
                    </label>
                </div>

                <div>
                    <button type="submit" onClick={handleSubmit} className="Button">Add your finished Recipe here!</button>
                </div>

            </form>
        </div>
        </>
    )
}

export default AddRecipe