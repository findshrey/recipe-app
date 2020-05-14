let recipes = getSavedRecipes()

const filters = {
   searchText: '',
   sortBy: 'alphabetical'
}

renderRecipeList(recipes, filters)

document.querySelector('#search-recipe').addEventListener('input', (e) => {
   filters.searchText = e.target.value
   renderRecipeList(recipes, filters)
})

document.querySelector('#create-recipe').addEventListener('click', () => {
   const id = uuidv4()
   const timestamp = moment().valueOf() 
   
   recipes.push({
      id: id,
      recipeName: '',
      steps: '',
      ingredients: [],
      createdAt: timestamp,
      updatedAt: timestamp
   })
   saveRecipes(recipes)
   location.assign(`/edit.html#${id}`)
})

document.querySelector('#sort-by').addEventListener('change', (e) => {
   filters.sortBy = e.target.value
   renderRecipeList(recipes, filters)
})

window.addEventListener('storage', (e) => {
   if (e.key === 'recipes') {
      recipes = JSON.parse(e.newValue)
      renderRecipeList(recipes, filters)
   }
})