const { searchProducts } = require('../searchService');
const { generateIngredients, refineRecipeProducts } = require('../recipeService');


const handle = async ({ entities = [], servings = 1, message }) => {
  let recipeName = 'الوصفة';
  let targetIngredients = entities;

  // Use LLM to extract recipe name and list of standard Arabic ingredients
  if (message) {
    console.log('[recipeMode] Generating ingredients for message:', message);
    const gen = await generateIngredients(message);
    recipeName = gen.recipeName;
    targetIngredients = gen.ingredients;
    console.log(`[recipeMode] Dish: "${recipeName}", Ingredients:`, targetIngredients);
  }

  if (!targetIngredients.length) {
    return {
      groups: [],
    };
  }

  // 1. Search candidate products for each ingredient in parallel
  const searchResults = await Promise.all(
    targetIngredients.map(async (entity) => {
      const products = await searchProducts({ query: entity, limit: 3 });
      return {
        entity,
        products: products.map((p) => p.toObject()),
        found: products.length > 0,
      };
    })
  );

  // 2. Refine products to ensure compatibility with the recipe
  console.log('[recipeMode] Refining candidate products for recipe compatibility...');
  const refinedGroups = await refineRecipeProducts(recipeName, servings, searchResults);

  return {
    groups: refinedGroups,
  };
};

module.exports = { handle };
