const Product = require('../models/Product');

const searchProducts = async ({
  query,
  categoryId,
  maxPrice,
  sortBy,
  limit = 10,
} = {}) => {
  const baseFilter = { available: true };

  // Category filter
  if (categoryId) {
    baseFilter.categoryId = categoryId;
  }

  // Price ceiling filter
  if (maxPrice) {
    baseFilter.price = { $lte: maxPrice };
  }

  let products = [];

  if (query && query.trim()) {
    const trimmedQuery = query.trim();

    // 1. MongoDB Text Index Search (BM25-like)
    const textFilter = { ...baseFilter, $text: { $search: trimmedQuery } };
    const textProjection = { score: { $meta: 'textScore' } };
    const textSort = sortBy === 'price' ? { price: 1 } : { score: { $meta: 'textScore' } };

    let textResults = [];
    try {
      textResults = await Product.find(textFilter, textProjection)
        .sort(textSort)
        .limit(limit)
        .populate('categoryId', 'name slug');
    } catch (err) {
      console.warn('[searchService] MongoDB text search failed or index missing, falling back to regex:', err.message);
    }

    // 2. Case-insensitive Regex search for multi-word compatibility (stable fallback)
    const terms = trimmedQuery.split(/\s+/).filter(Boolean);
    let regexResults = [];

    if (terms.length > 0) {
      const regexConditions = terms.map(term => ({
        $or: [
          { name: { $regex: term, $options: 'i' } },
          { tags: { $regex: term, $options: 'i' } }
        ]
      }));

      const regexFilter = {
        ...baseFilter,
        $and: regexConditions
      };

      const regexSort = sortBy === 'price' ? { price: 1 } : { createdAt: -1 };
      regexResults = await Product.find(regexFilter)
        .sort(regexSort)
        .limit(limit)
        .populate('categoryId', 'name slug');
    }

    const seen = new Set();
    const merged = [];

    for (const p of textResults) {
      const id = p._id.toString();
      seen.add(id);
      merged.push(p);
    }

    for (const p of regexResults) {
      const id = p._id.toString();
      if (!seen.has(id)) {
        seen.add(id);
        merged.push(p);
      }
    }

    products = merged.slice(0, limit);
  } else {
    const sort = sortBy === 'price' ? { price: 1 } : { createdAt: -1 };
    products = await Product.find(baseFilter)
      .sort(sort)
      .limit(limit)
      .populate('categoryId', 'name slug');
  }

  return products;
};

module.exports = { searchProducts };
