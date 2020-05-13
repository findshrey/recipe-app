const recipeNameElement = document.querySelector('#recipe-name')
const stepsElement = document.querySelector('#recipe-steps')
const removeElement = document.querySelector('#remove-recipe')
const dateElement = document.querySelector('#last-edited')

const recipeId = location.hash.substring(1)
let recipes = getSavedRecipes()

let recipe = recipes.find(function (recipe) {
   return recipe.id === recipeId
})

if (recipe === undefined) {
   location.assign('/index.html')
}

recipeNameElement.value = recipe.recipeName
stepsElement.value = recipe.steps
dateElement.textContent = generateLastEdited(recipe.updatedAt)

recipeNameElement.addEventListener('input', function (e) {
   recipe.recipeName = e.target.value
   recipe.updatedAt = moment().valueOf()
   dateElement.textContent = generateLastEdited(recipe.updatedAt)
   saveRecipes(recipes)
})

stepsElement.addEventListener('input', function (e) {
   recipe.steps = e.target.value
   recipe.updatedAt = moment().valueOf()
   dateElement.textContent = generateLastEdited(recipe.updatedAt)
   saveRecipes(recipes)
})

removeElement.addEventListener('click', function () {
   removeRecipe(recipe.id)
   saveRecipes(recipes)
   location.assign('/index.html')
})

document.querySelector('#new-ingredient').addEventListener('submit', function (e) {
   e.preventDefault()
   recipe.ingredients.push({
      id: uuidv4(),
      name: e.target.elements.ingredientName.value,
      obtained: false
   })
   recipe.updatedAt = moment().valueOf()
   dateElement.textContent = generateLastEdited(recipe.updatedAt)
   saveRecipes(recipes)
   renderRecipeIngredients(recipe.ingredients)
   e.target.elements.ingredientName.value = ''
})

renderRecipeIngredients(recipe.ingredients)

window.addEventListener('storage', function (e) {
   if (e.key === 'recipes') {
      recipes = JSON.parse(e.newValue)
   }
   
   recipe = recipes.find(function (recipe) {
      return recipe.id === recipeId
   })
   
   if (recipe === undefined) {
      location.assign('/index.html')
   }
   
   recipeNameElement.value = recipe.recipeName
   stepsElement.value = recipe.steps
   dateElement.textContent = generateLastEdited(recipe.updatedAt)
   renderRecipeIngredients(recipe.ingredients)
})