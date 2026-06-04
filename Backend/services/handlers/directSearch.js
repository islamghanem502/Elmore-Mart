const { searchProducts } = require('../searchService');
const { refineProducts } = require('../refinementService');


//Calculates a matching score for a product based on the search entity.

const calculateScore = (product, entity) => {
  if (!entity) return 0;
  const name = (product.name || '').toLowerCase();
  const tags = Array.isArray(product.tags) ? product.tags.map((t) => t.toLowerCase()) : [];
  const desc = (product.description || '').toLowerCase();
  const query = entity.toLowerCase();

  let score = 0;

  // 1. Exact match or substring on name
  if (name === query) {
    score += 100;
  } else if (name.includes(query)) {
    score += 50;
  }

  // 2. Word matches on name
  const queryWords = query.split(/\s+/).filter(Boolean);
  const nameWords = name.split(/\s+/).filter(Boolean);
  let nameMatches = 0;
  for (const qw of queryWords) {
    if (nameWords.includes(qw)) {
      nameMatches++;
    }
  }
  score += nameMatches * 15;

  // 3. Exact match or partial match on tags
  if (tags.includes(query)) {
    score += 40;
  } else {
    let tagMatches = 0;
    for (const tag of tags) {
      if (tag.includes(query) || query.includes(tag)) {
        tagMatches++;
      }
    }
    score += tagMatches * 8;
  }

  // 4. Matches on description
  if (desc.includes(query)) {
    score += 5;
  }

  return score;
};


const handle = async ({ entities = [], message }) => {
  if (!entities.length) {
    return {
      products: [],
    };
  }

  // Run all entity searches in parallel
  const searchResults = await Promise.all(
    entities.map((entity) =>
      searchProducts({ query: entity, limit: 5 }).then((products) =>
        products.map((p) => ({ ...p.toObject(), matchedQuery: entity }))
      )
    )
  );

  // Flatten and deduplicate by _id, calculating scores
  const seen = new Set();
  const merged = [];
  for (const group of searchResults) {
    for (const product of group) {
      const id = product._id.toString();
      if (!seen.has(id)) {
        seen.add(id);
        product.matchScore = calculateScore(product, product.matchedQuery);
        merged.push(product);
      }
    }
  }

  // Sort by match score descending
  merged.sort((a, b) => b.matchScore - a.matchScore);

  console.log(
    '[directSearch] Candidate products before refinement:',
    merged.map((p) => ({ name: p.name, score: p.matchScore }))
  );

  // Apply LLM Refinement Layer
  let refined = merged;
  if (message) {
    refined = await refineProducts(message, merged);
  }

  // Fallback: If LLM returned nothing but we had good matches, keep top-scoring ones
  if (!refined.length && merged.length > 0) {
    console.log('[directSearch] LLM refined all products away. Falling back to top scoring matches.');
    const topScorers = merged.filter((p) => p.matchScore >= 15);
    refined = topScorers.slice(0, 2);
  }

  return {
    products: refined,
    matchedQuery: entities.join(' '),
  };
};

module.exports = { handle };
