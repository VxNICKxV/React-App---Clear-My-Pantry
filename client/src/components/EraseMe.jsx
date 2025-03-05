      //   fetch(baseURL + `/recipes/selected/${selectedId}`)
      //     .then((response) => response.json())
      //     .then((data) => {
      //       console.log("Seleced ingredients data", selectedId);
            
      //       //iterate through the recipe data to make sure the state doesn't show repeating values
      //       //Ask Piyush if there's a better way for this
      //       setRecipes((prevRecipes) => {
      //         const newRecipes = [...prevRecipes, ...data];
      //         //filter out repeating recipes
      //         const uniqueRecipes = Array.from(new Set(newRecipes.map(recipe => recipe.recipe_id)))
      //           .map(id => newRecipes.find(recipe => recipe.recipe_id === id));
      //         return uniqueRecipes;
      //       });
      //       console.log("recipes: ", recipes)
      //     })
      //     .catch((error) => console.log("Error reading data: ", error));
      // });
