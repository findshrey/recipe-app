// Read existing recipes from localStorage
const getSavedRecipes = () => {
   const JSONrecipes = localStorage.getItem('recipes')
   
   try {
      return JSONrecipes ? JSON.parse(JSONrecipes) : []
   } catch (e) {
      return []
   }
}

// Save the recipes to localStorage
const saveRecipes = (recipes) => {
   localStorage.setItem('recipes', JSON.stringify(recipes))
}

// Render application recipes
const renderRecipeList = (recipes, filters) => {
   recipes = sortRecipies(recipes, filters.sortBy)
   const filteredRecipes = recipes.filter((recipe) => recipe.recipeName.toLowerCase().includes(filters.searchText.toLowerCase()))

   document.querySelector('#recipe-list').innerHTML = ''

   filteredRecipes.forEach((recipe) => {
      const recipeCard = generateRecipeDOM(recipe)
      
      document.querySelector('#recipe-list').appendChild(recipeCard)
   })
}

// Generate the DOM structure for a individual recipe
const generateRecipeDOM = (recipe) => {
   const recipeCard = document.createElement('a')
   const cardTitle = document.createElement('div')
   const cardSummary = document.createElement('div')

   recipeCard.setAttribute('href', `/edit.html#${recipe.id}`)

   cardTitle.textContent = recipe.recipeName
   cardSummary.textContent = generateCardSummary(recipe)
   
   recipeCard.appendChild(cardTitle).appendChild(cardSummary)

   return recipeCard
}

const generateCardSummary = (recipe) => {
   const obtainedRecipes = recipe.ingredients.filter((ingredient) => ingredient.obtained)

   if (obtainedRecipes.length === recipe.ingredients.length) {
      return 'You have all the items'
   } else if (!obtainedRecipes.length) {  // i.e. 0
      return 'You have none of the items'
   } else {
      return 'You have some of the items'
   }
}

// Sort the recipies by one of three ways
const sortRecipies = (recipes, sortBy) => {
   if (sortBy === 'alphabetical') {
      return recipes.sort((a, b) => {
         if (a.recipeName.toLowerCase() < b.recipeName.toLowerCase()) {
            return -1
         } else if (b.recipeName.toLowerCase() < a.recipeName.toLowerCase()) {
            return 1
         } else {
            return 0
         }
      })
   } else if (sortBy === 'byEdited') {
      return recipes.sort((a, b) => {
         if (a.updatedAt > b.updatedAt) {
            return -1
         } else if (b.updatedAt > a.updatedAt) {
            return 1
         } else {
            return 0
         }
      })
   } else if (sortBy === 'byCreated') {
      return recipes.sort((a, b) => {
         if (a.createdAt > b.createdAt) {
            return -1
         } else if (b.createdAt > a.createdAt) {
            return 1
         } else {
            return 0
         }
      })
   }
}

// Get the ingredients summary
const ingredientSummary = (missingIngredients) => {
   const summary = document.createElement('p')
   summary.textContent = `Missing Ingredients: ${missingIngredients.length}`
   return summary
}

// Render recipe ingredients
const renderRecipeIngredients = (ingredients) => {
   const missingIngredients = ingredients.filter((ingredient) => !ingredient.obtained)

   document.querySelector('#ingredient-list').innerHTML = ''
   document.querySelector('#ingredient-list').appendChild(ingredientSummary(missingIngredients))

   ingredients.forEach((ingredient) => {
   const ingredientEl = generateIngredient(ingredient)
      document.querySelector('#ingredient-list').appendChild(ingredientEl)
   })
}

// Generate DOM element for individual ingredient
const generateIngredient = (ingredient) => {
   const ingredientEl = document.createElement('div')
   const checkbox = document.createElement('input')
   const ingredientName = document.createElement('span')
   const removeButton = document.createElement('button')

   // Setup ingredient checkbox
   checkbox.setAttribute('type', 'checkbox')
   checkbox.checked = ingredient.obtained
   ingredientEl.appendChild(checkbox)
   checkbox.addEventListener('change', (e) => {
      ingredient.obtained = e.target.checked
      recipe.updatedAt = moment().valueOf()
      dateElement.textContent = generateLastEdited(recipe.updatedAt)
      saveRecipes(recipes)
      renderRecipeIngredients(recipe.ingredients)
   })

   // Setup ingredient name
   ingredientName.textContent = ingredient.name
   ingredientEl.appendChild(ingredientName)

   // Setup the remove button
   removeButton.textContent = 'x'
   ingredientEl.appendChild(removeButton)
   removeButton.addEventListener('click', () => {
      removeIngredient(ingredient.id)
      recipe.updatedAt = moment().valueOf()
      dateElement.textContent = generateLastEdited(recipe.updatedAt)
      saveRecipes(recipes)
      renderRecipeIngredients(recipe.ingredients)
   })
   return ingredientEl
}

const removeIngredient = (id) => {
   const ingredientIndex = recipe.ingredients.findIndex((ingredient) => ingredient.id === id)

   if (ingredientIndex > -1) {
      recipe.ingredients.splice(ingredientIndex, 1)
   }
}

const removeRecipe = (id) => {
   const recipeIndex = recipes.findIndex((recipe) => recipe.id === id)

   if (recipeIndex > -1) {
      recipes.splice(recipeIndex, 1)
   }
}

// Generate the last edited message
const generateLastEdited = (timestamp) => `Last Edited ${moment(timestamp).fromNow()}`