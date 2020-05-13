// Read existing recipes from localStorage
const getSavedRecipes = function () {
   const JSONrecipes = localStorage.getItem('recipes')

   if (JSONrecipes !== null) {
      return JSON.parse(JSONrecipes)
   } else {
      return []
   }
}

// Save the recipes to localStorage
const saveRecipes = function (recipes) {
   localStorage.setItem('recipes', JSON.stringify(recipes))
}

// Render application recipes
const renderRecipeList = function (recipes, filters) {
   recipes = sortRecipies(recipes, filters.sortBy)
   const filteredRecipes = recipes.filter(function (recipe) {
      return recipe.recipeName.toLowerCase().includes(filters.searchText.toLowerCase())
   })

   document.querySelector('#recipe-list').innerHTML = ''

   filteredRecipes.forEach(function (recipe) {
      const recipeCard = generateRecipeDOM(recipe)
      
      document.querySelector('#recipe-list').appendChild(recipeCard)
   })
}

// Generate the DOM structure for a individual recipe
const generateRecipeDOM = function (recipe) {
   const recipeCard = document.createElement('a')
   const cardTitle = document.createElement('div')
   const cardSummary = document.createElement('div')

   recipeCard.setAttribute('href', `/edit.html#${recipe.id}`)

   cardTitle.textContent = recipe.recipeName
   cardSummary.textContent = generateCardSummary(recipe)
   
   recipeCard.appendChild(cardTitle).appendChild(cardSummary)

   return recipeCard
}

const generateCardSummary = function (recipe) {
   const obtainedRecipes = recipe.ingredients.filter(function (ingredient) {
      return ingredient.obtained
   })

   if (obtainedRecipes.length === recipe.ingredients.length) {
      return 'You have all the items'
   } else if (obtainedRecipes.length === 0) {
      return 'You have none of the items'
   } else {
      return 'You have some of the items'
   }
}

// Sort the recipies by one of three ways
const sortRecipies = function (recipes, sortBy) {
   if (sortBy === 'alphabetical') {
      return recipes.sort(function (a, b) {
         if (a.recipeName.toLowerCase() < b.recipeName.toLowerCase()) {
            return -1
         } else if (b.recipeName.toLowerCase() < a.recipeName.toLowerCase()) {
            return 1
         } else {
            return 0
         }
      })
   } else if (sortBy === 'byEdited') {
      return recipes.sort(function (a, b) {
         if (a.updatedAt > b.updatedAt) {
            return -1
         } else if (b.updatedAt > a.updatedAt) {
            return 1
         } else {
            return 0
         }
      })
   } else if (sortBy === 'byCreated') {
      return recipes.sort(function (a, b) {
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
const ingredientSummary = function (missingIngredients) {
   const summary = document.createElement('p')
   summary.textContent = `Missing Ingredients: ${missingIngredients.length}`
   return summary
}

// Render recipe ingredients
const renderRecipeIngredients = function (ingredients) {
   const missingIngredients = ingredients.filter(function (ingredient) {
      return !ingredient.obtained
   })

   document.querySelector('#ingredient-list').innerHTML = ''
   document.querySelector('#ingredient-list').appendChild(ingredientSummary(missingIngredients))

   ingredients.forEach(function (ingredient) {
   // const ingredientEl = generateIngredient(ingredient)
      document.querySelector('#ingredient-list').appendChild(generateIngredient(ingredient))
   })
}

// Generate DOM element for individual ingredient
const generateIngredient = function (ingredient) {
   const ingredientEl = document.createElement('div')
   const checkbox = document.createElement('input')
   const ingredientName = document.createElement('span')
   const removeButton = document.createElement('button')

   // Setup ingredient checkbox
   checkbox.setAttribute('type', 'checkbox')
   checkbox.checked = ingredient.obtained
   ingredientEl.appendChild(checkbox)
   checkbox.addEventListener('change', function (e) {
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
   removeButton.addEventListener('click', function () {
      removeIngredient(ingredient.id)
      recipe.updatedAt = moment().valueOf()
      dateElement.textContent = generateLastEdited(recipe.updatedAt)
      saveRecipes(recipes)
      renderRecipeIngredients(recipe.ingredients)
   })

   return ingredientEl
}

const removeIngredient = function (id) {
   const ingredientIndex = recipe.ingredients.findIndex(function (ingredient) {
      return ingredient.id === id
   })

   if (ingredientIndex > -1) {
      recipe.ingredients.splice(ingredientIndex, 1)
   }
}

const removeRecipe = function (id) {
   const recipeIndex = recipes.findIndex(function (recipe) {
      return recipe.id === id
   })

   if (recipeIndex > -1) {
      recipes.splice(recipeIndex, 1)
   }
}

// Generate the last edited message
const generateLastEdited = function (timestamp) {
   return `Last Edited ${moment(timestamp).fromNow()}`
}