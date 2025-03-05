import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, data } from 'react-router-dom';
import './App.css'
import Home from './components/Home'
import BigRecipePage from './components/BigRecipePage'
import AddRecipe from './components/AddRecipe';
import { ClerkProvider, useUser } from "@clerk/clerk-react";
import "bootstrap/dist/css/bootstrap.min.css";
import MyRecipes from './components/MyRecipes';
import EditChanges from './components/EditChanges';

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

// this is the App we are publishing. useUser needs to be done inside the ClerkProvider so i just decided to wrap everything inside this function instead
function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <AppData />
    </ClerkProvider>
  )
}

function AppData() {
  // this is used with clerk to actually get the userData of someone who logs into clerk
  const { user } = useUser()
  // this state will hold our userData from the server for when someone logs in so we can transfer it to the MyRecipies page to load their specific recipies
  const [appUser, setAppUser] = useState({});

  const [recipe, setRecipe] = useState({});
  //sets the recipeId to the recipe that is clicked on
  const handleClick = recipe => {
    setRecipe(recipe);
  }

  // send the user object to the server
  // and get user_id back 
  useEffect(() => {
    if (user) {
      let userUrl = 'http://localhost:3000/users'
      fetch(userUrl, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(user),
      })
        .then(response => response.json())
        .then(data => {
          // console.log('data? - ',data);
          setAppUser(data.result)
          // console.log('data.result? - ',data.result);
        })
        .catch(err => console.log("error getting back user data", err))
    }
  }, [user?.id])

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home handleClick={handleClick} />} />
          <Route path='/addRecipe' element={<AddRecipe user={appUser} />}></Route>
          <Route path='/myrecipes' element={<MyRecipes user={appUser} />}></Route>
          {/* route for the recipe page */}
          <Route path='/recipes/:recipe_id' element={<BigRecipePage recipe={recipe} />} />
          <Route path='/editrecipe/:recipe_id' element={<EditChanges/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App

