const buildProductList = (reply, products, matchedQuery = null, type = 'product_list') => ({
  type,
  reply,
  products: products.map((p) => ({
    _id: p._id,
    name: p.name,
    price: p.price,
    image: p.image || null,
    available: p.available,
    categoryId: p.categoryId,
    matchedQuery,
  })),
});

const buildRecipeList = (reply, groups) => ({
  type: 'recipe_list',
  reply,
  groups: groups.map((g) => ({
    entity: g.entity,
    found: g.found,
    products: (g.products || []).map((p) => ({
      _id: p._id,
      name: p.name,
      price: p.price,
      image: p.image || null,
      available: p.available,
      categoryId: p.categoryId,
    })),
  })),
});


const buildMessage = (reply) => ({
  type: 'message',
  reply,
  products: [],
});

module.exports = { buildProductList, buildRecipeList, buildMessage };
