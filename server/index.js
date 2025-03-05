// handles http requests, routes, and middleware
const express = require('express')
// allows cross-origin-resouce-sharing (cors allows or prevents websites access to the server)
const cors = require('cors')
// logs http requests
const morgan = require('morgan')
// import the connections pantryConn file
const { connectDb, pool } = require('./connections/pantryConn.js')
require('dotenv').config();
// start express in the app
const app = express();
// parses data from incoming requests
app.use(express.json());
// gives app the ability to read public files from the client!
app.use(express.static("../client"))
// gives our server the ability to read data from the url from urlencoded
app.use(express.urlencoded({ extended: false }))
// set default port if none exists
const PORT = process.env.PORT || 3000;
// middelwares
// logs http requests in developer mode
app.use(morgan('dev'))
// create cors in the app
app.use(cors())
// connect to database to establish connection from pantryConn.js
connectDb();

// Define routes
// Home route - Simple health check endpoint
app.get('/', (req, res) => {
    res.status(200).send(`Recipes are up and running on PORT:${PORT}`);
});

// READ
// GET /recipes - Get all recipes from database
app.get('/recipes/', (req, res) => {

    const id = Number(req.params.id)

    //Query to use for the db on the read route
    // const query = `SELECT * FROM pantryschema.recipes ORDER BY recipe_id DESC;`
    const query = `SELECT  r.recipe_id, r.recipe_name, r.description, r.img, r.steps, json_agg(i.*) as ingredients
    FROM pantryschema.recipes AS r
    JOIN pantryschema.ingredients AS i ON r.recipe_id = i.recipe_id
    GROUP BY r.recipe_id, r.recipe_name, r.description, r.img, r.steps;`

    console.log('get for all recipes', query)

    //Call off to the databaase
    pool.query(query)
        .then(data => {
            // console.log(data)
            res.json(data.rows)
        })
        .catch(err => {
            console.log("Error reading recipe data: ", err)
            res.status(500).json({ message: "Unable to retrieve recipe data at this time." })
        })
})

app.get('/users', (req, res) => {
    //Query to use for the db on the read route
    const query = `SELECT * FROM pantryschema.users;`

    //Call off to the databaase
    pool.query(query)
        .then(data => {
            res.json(data.rows)
        })
        .catch(err => {
            console.log("Error getting data: ", err)
            res.status(500).json({ message: "Unable to retrieve user data at this time." })
        })
})

// GET /recipes/id - Get specific recipedata from database based on recipe_id
app.get('/recipe/:recipe_id', (req, res) => {

    let { recipe_id } = req.params

    //Query to use for the db on the read route
    //$1 is a placeholder to prevent sql attacks or something
    const query = `
      SELECT r.recipe_name, r.img, r.description, r.steps 
      FROM pantryschema.recipes r
      WHERE r.recipe_id = '${recipe_id}';`

    //Call off to the database
    pool.query(query)
        .then(data => {
            res.json(data.rows)
        })
        .catch(err => {
            console.log("Error reading recipe data: ", err)
            res.status(500).json({ message: "Unable to retrieve recipe data at this time." })
        })
})

// GET /ingredients - get all ingredients from database
app.get('/ingredients', (req, res) => {

    //Query to use for the db on the read route
    // we do a right join to join just the recipe_id
    const query = `SELECT DISTINCT ingredients_name, ingredients_id FROM pantryschema.ingredients ORDER BY ingredients_name ASC;`

    //Call off to the databaase
    pool.query(query)
        .then(data => {
            res.json(data.rows)
        })
        .catch(err => {
            console.log("Error getting data: ", err)
            res.status(500).json({ message: "Unable to retrieve ingredient data at this time." })
        })
})

// grab all recipes for a user
app.get('/recipes/:user_id', (req, res) => {
    // we need to grab only the user created recipes with this route. So we will have to combine all 3 tables and check against their respective shared keys
    const user_id = Number(req.params.user_id)

    const query = `SELECT u.user_id, r.*
    FROM pantryschema.users AS u
    RIGHT JOIN pantryschema.recipes AS r ON u.user_id = r.user_id
    WHERE u.user_id = ${user_id};`

    pool.query(query)
        .then(data => {
            res.json(data.rows)
            // console.log(data.rows)
        })
        .catch(err => {
            console.log("Error getting user recipe Data:", err)
            res.status(500).json({ message: "Unable to get the user recipes at this time" })
        })
})

// getting all ingredients for a recipe
app.get('/recipe/ingredients/:recipe_id', (req, res) => {
    console.log('get for recipe req.params:', req.params)
    let { recipe_id } = req.params

    let query = `
      SELECT r.recipe_id, i.* 
      FROM pantryschema.ingredients i 
      JOIN pantryschema.recipes r 
      ON i.recipe_id = r.recipe_id 
      WHERE r.recipe_id = '${recipe_id}';`
    console.log(query)
    pool.query(query)
        .then(data => {
            res.json(data.rows)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ message: "Error grabbing ingredients from this recipe", err })
        })
})

// we are grabbing all the ingredient and recipe data at once for a user
app.get('/recipesAndIngredients/:user_id', (req, res) => {
    let user_id = Number(req.params.user_id)

    const query = `SELECT u.user_id, r.*, json_agg(i.*) as ingredients
    FROM pantryschema.users AS u
    RIGHT JOIN pantryschema.recipes AS r ON u.user_id = r.user_id
    LEFT JOIN pantryschema.ingredients AS i ON r.recipe_id = i.recipe_id
    WHERE u.user_id = ${user_id}
    GROUP BY u.user_id, r.recipe_id;`

    pool.query(query)
        .then(data => {
            res.json(data.rows)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ message: "Error grabbing user recipe data", err })
        })
})

app.get(`/recipes/selected/:ingredients_id`, (req, res) => {
    

    let selectedIngredients = Number(req.params.ingredients_id)
    console.log("get for selected ingredient id Req.params: ", selectedIngredients)
    const query =  `SELECT r.recipe_id, r.recipe_name, r.img
                    FROM pantryschema.recipes r 
                    JOIN pantryschema.ingredients i ON r.recipe_id = i.recipe_id 
                    WHERE i.ingredients_id IN (${selectedIngredients}) 
                    GROUP BY r.recipe_id, r.recipe_name 
                    HAVING COUNT(DISTINCT i.ingredients_name) = 1`
    
    pool.query(query)
    .then(data => {
        res.json(data.rows)
    })
    .catch(err => {
        console.log(err);
        res.status(400).json({ message: "Error grabbing user recipe data", err })
    })

})
//gets the selected ingredient with search bar
app.get(`/ingredients/:ingredients_name`, (req, res) => {
    let typedIngredient = req.params.ingredients_name;
    const query = `SELECT ingredients_id FROM pantryschema.ingredients WHERE LOWER(ingredients_name) = LOWER('${typedIngredient}')`
    pool.query(query)
    .then(data => {
        res.json(data.rows)
    })
    .catch(err => {
        console.log(err);
        res.status(400).json({message: "Error finding ingredient", err})
    })
})


// this fetch is so we can grab ONLY the recipes that contain specific ingredient names
app.get('/recipes/selected/:recipe_id', (req, res) => {
    let selectedIngredients = ((req.params))

    const query = `SELECT r.recipe_id, r.recipe_name 
            FROM pantryschema.recipes r 
            JOIN pantryschema.ingredients i ON r.recipe_id = i.recipe_id 
            WHERE i.ingredients_id IN (${selectedIngredients}) 
            GROUP BY r.recipe_id, r.recipe_name 
            HAVING COUNT(DISTINCT i.ingredients_name) = ${selectedIngredients.length}`

    pool.query(query)
        .then(data => {
            res.json(data.rows)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ message: "Error grabbing user recipe data", err })
        })

})
// add new user if the user does not exist in the db
app.post('/users', (req, res) => {
    let data = req.body;
    // this checks to see if the database id matches with the req.body id from clerk
    let querySelect = `SELECT user_id FROM pantryschema.users WHERE ('${data.id}' = clerk_user_id)`

    // we run our query with the SELECT to see if the id's match
    pool.query(querySelect)
        .then(result => {
            // if the results come back with an actual result, it will return an array with something in it, otherwise it will retrn an empty array.
            // therefore if it matches, we want to send a response saying there is already a matches uer
            if (result.rows.length > 0) {
                // respond with a creation status and
                console.log(result.rows[0])
                res.status(200).json({ message: "There is a matched user already!", result: result.rows[0] })
            } else {
                // this inserts the new user into the database
                let queryInsert = `INSERT INTO pantryschema.users 
                ( clerk_user_id, email, seconds_since_epoch) VALUES('${data.id}', '${data.email}', EXTRACT(EPOCH FROM NOW())
                ) RETURNING *`
                pool.query(queryInsert)
                    .then(result => {
                        console.log(result.rows[0])
                        res.status(201).json({ message: "New user added!", result: result.rows[0] })
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(400).json({ message: "Unable to insert a user at this time", err })
                    })
            }

        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "Unable to check with the server", err })
        })



    // if clerk_user_id exist, send it back to the client
    // so that client now has my database generated user.user_id
    // SELECT statement if user_id does not match then insert a new user into the database
})

// add new recipes to the database
app.post("/recipes", (req, res) => {
    // store the users data in the request body
    const { user_id, description, recipe_name, img, steps } = req.body
    // // get the user id from the query params
    // query for inserting recipes to the db
    const query = `INSERT INTO pantryschema.recipes
                    ( user_id, description, recipe_name, img, steps )
                    VALUES(${user_id}, '${description}', '${recipe_name}', '${img}', 
                    ARRAY[${steps.map(step => `'${step}'`).join(', ')}]
                    ) RETURNING *`// we had a slight issue with the steps because they are an array and i had to make it so it would send correctly by using ARRAY. 

    // if there is a description,user id, recipe name, and img - get the data from the db 
    if (description && user_id && recipe_name && img) {
        // if the fields are provided, run the query to insert the recipe into the db
        pool.query(query)
            .then(result => {
                // if successful, respond with a message and shows the results from the database
                res.status(201).json({ message: "Success", result: result.rows[0] })
            })
            .catch(err => {
                console.log(err)
                res.status(400).json({ message: "Error: Unable to create an item at this time", err })
            })
    } else {
        res.status(400).json({ message: "Oops no description received", description, user_id, recipe_name, img })
    }
})

// add a new ingredient to the database
app.post('/ingredients', (req, res) => {

    const { ingredients_name, category, recipe_id, quantity_n_units } = req.body

    //Query to use for the db on the post route to insert ingredients. also return the values of ingredients after
    const query = `INSERT INTO pantryschema.ingredients (ingredients_name, category, recipe_id, quantity_n_units) 
    VALUES ('${ingredients_name}', '${category}', '${recipe_id}', '${quantity_n_units}') RETURNING *;`

    if (ingredients_name && quantity_n_units) {
        pool.query(query)
            .then(result => {
                // remember we use result.rows[0] because RETURNING will add it to the top of the rows object
                res.status(201).json({ message: "Ingredient added successfully to the server", result: result.rows[0] })
            })
            .catch(err => {
                res.status(500).json({ message: "Unable to retrieve ingredient data at this time.", err, })
            })
    } else {
        // in case the server doesn't get the ingredient
        res.status(500).json({ message: "Oops no ingredient was received" })
    }
})
// update recipe data for a specific recipe
app.put('/recipes/:recipe_id', (req, res) => {
    const {recipe_id} = req.params
    // store the users data in the request body
    const { description, recipe_name, img, steps, } = req.body
    // // get the user id from the query params
    // query for inserting recipes to the db
    const query = `UPDATE pantryschema.recipes
                    SET recipe_id = ${recipe_id}, description = '${description}', recipe_name = '${recipe_name}', img = '${img}', 
                    steps = ARRAY[${steps.map((step, index) => `'${step}'`).join(', ')}]
                    WHERE recipe_id = ${recipe_id}
                    RETURNING *`
    // if there is a description, recipe name, and img - get the data from the db 
    if (description && recipe_name && img) {
        // if the fields are provided, run the query to insert the recipe into the db
        pool.query(query)
            .then(result => {
                // if successful, respond with a message and shows the results from the database
                res.status(201).json({ message: "Success", result: result.rows[0] })
            })
            .catch(err => {
                console.log(err)
                res.status(400).json({ message: "Error: Unable to update at this time", err })
            })
    } else {
        res.status(400).json({ message: "Oops missing one of the variables.", description, user_id, recipe_name, img })
    }
})

// update an ingredient of a specific recipe
app.put('/ingredients/:ingredients_id', (req, res) => {
    const { ingredients_id } = req.params
    const { ingredients_name, quantity_n_units } = req.body

    const query = `UPDATE pantryschema.ingredients 
    SET ingredients_name = '${ingredients_name}', quantity_n_units = '${quantity_n_units}'
    WHERE ingredients_id = ${ingredients_id}
    RETURNING *;`

    if (ingredients_name && quantity_n_units) {
        pool.query(query)
            .then(result => {
                // remember we use result.rows[0] because RETURNING will add it to the top of the rows object
                res.status(200).json({ message: "Update sucessful!", result: result.rows })
            })
            .catch(err => {
                res.status(500).json({ message: "Unable to update ingredients", err, })
            })
    } else {
        // in case the server doesn't get the ingredient
        res.status(500).json({ message: "Oops no ingredient was received" })
    }
})
// Delete - DELETE - /bucket/:id
// delete route to remove items by their recipe ids
app.delete("/recipes/:recipe_id", (req, res) => {
    // destructuring - removes the recipe id from the route params
    const { recipe_id } = req.params
    // query for deleting recipes that match the id
    // returning displays recipe data 
    const query = `
    DELETE FROM pantryschema.recipes
    WHERE recipe_id = ${recipe_id}
    RETURNING *;
    `
    // helper sends the delete query request to the database
    pool.query(query)
        // if delete query is successful, send the recipe data to the client
        .then(result => {
            // recipe data that was deleted after the request was sent
            res.json(result.rows[0])
        })
        // if the query is unsucessful, send an error message and status code
        .catch(err => {
            console.log(err)
            // error for debugging if the delete request was unsuccessful
            res.status(500).json({ message: "Error, unable to delete item in db!" })
        })
})

app.delete("/ingredients/:recipe_id", (req, res) => {
    // destructuring - removes the recipe id from the route params
    const { recipe_id } = req.params
    // query for deleting recipes that match the id
    // returning displays recipe data 
    const query = `
    DELETE FROM pantryschema.ingredients
    WHERE recipe_id = ${recipe_id}
    RETURNING *;
    `
    // helper sends the delete query request to the database
    pool.query(query)
        // if delete query is successful, send the recipe data to the client
        .then(result => {
            // recipe data that was deleted after the request was sent
            res.json(result.rows[0])
        })
        // if the query is unsucessful, send an error message and status code
        .catch(err => {
            console.log(err)
            // error for debugging if the delete request was unsuccessful
            res.status(500).json({ message: "Error, unable to delete item in db!" })
        })
})
// app is ready and listening for commands on selected PORT
app.listen(PORT, () => console.log(`App listening on PORT:${PORT}`));












