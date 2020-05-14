const recipeNameElement = document.querySelector('#recipe-name')
const stepsElement = document.querySelector('#recipe-steps')
const removeElement = document.querySelector('#remove-recipe')
const dateElement = document.querySelector('#last-edited')

const recipeId = location.hash.substring(1)
let recipes = getSavedRecipes()

let recipe = recipes.find((recipe) => recipe.id === recipeId)

if (!recipe) {
   location.assign('/index.html')
}

recipeNameElement.value = recipe.recipeName
stepsElement.value = recipe.steps
dateElement.textContent = generateLastEdited(recipe.updatedAt)

recipeNameElement.addEventListener('input', (e) => {
   recipe.recipeName = e.target.value
   recipe.updatedAt = moment().valueOf()
   dateElement.textContent = generateLastEdited(recipe.updatedAt)
   saveRecipes(recipes)
})

stepsElement.addEventListener('input', (e) => {
   recipe.steps = e.target.value
   recipe.updatedAt = moment().valueOf()
   dateElement.textContent = generateLastEdited(recipe.updatedAt)
   saveRecipes(recipes)
})

removeElement.addEventListener('click', () => {
   removeRecipe(recipe.id)
   saveRecipes(recipes)
   location.assign('/index.html')
})

document.querySelector('#new-ingredient').addEventListener('submit', (e) => {
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

window.addEventListener('storage', (e) => {
   if (e.key === 'recipes') {
      recipes = JSON.parse(e.newValue)
      recipe = recipes.find((recipe) => recipe.id === recipeId)

      if (!recipe) {
         location.assign('/index.html')
      }
   
      recipeNameElement.value = recipe.recipeName
      stepsElement.value = recipe.steps
      dateElement.textContent = generateLastEdited(recipe.updatedAt)
      renderRecipeIngredients(recipe.ingredients)
   }
})