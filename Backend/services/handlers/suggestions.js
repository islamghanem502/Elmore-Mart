const Category = require('../../models/Category');
const { searchProducts } = require('../searchService');
const { generateSuggestionKeywords, refineSuggestions } = require('../suggestionService');

const calculateScore = (product, keywords = []) => {
  if (!keywords.length) return 0;
  const name = (product.name || '').toLowerCase();
  const tags = Array.isArray(product.tags) ? product.tags.map((t) => t.toLowerCase()) : [];
  const desc = (product.description || '').toLowerCase();

  let score = 0;

  for (const keyword of keywords) {
    const kw = keyword.toLowerCase();
    
    // Tag matches (prioritized for suggestions)
    if (tags.includes(kw)) {
      score += 30;
    } else {
      for (const tag of tags) {
        if (tag.includes(kw) || kw.includes(tag)) {
          score += 10;
        }
      }
    }

    // Name match
    if (name.includes(kw)) {
      score += 20;
    }

    // Description match
    if (desc.includes(kw)) {
      score += 5;
    }
  }

  return score;
};

const handle = async ({ categoryHint, descriptors = [], entities = [], message }) => {
  let categoryId = null;

  if (categoryHint) {
    const category = await Category.findOne({
      $or: [
        { name: { $regex: categoryHint, $options: 'i' } },
        { slug: { $regex: categoryHint, $options: 'i' } },
      ],
    });
    if (category) {
      categoryId = category._id;
    }
  }

  // Generate relevant search keywords
  let keywords = [];
  if (message) {
    console.log('[suggestions] Generating search keywords for message:', message);
    keywords = await generateSuggestionKeywords(message);
    console.log('[suggestions] Keywords generated:', keywords);
  } else {
    keywords = [...(descriptors || []), ...(entities || [])];
  }

  if (!keywords.length && !categoryId) {
    return {
      products: [],
      matchedQuery: null,
    };
  }

  // Search candidate products for each keyword in parallel
  const searchResults = await Promise.all(
    keywords.map((kw) => searchProducts({ query: kw, categoryId, limit: 6 }))
  );

  // Flatten, deduplicate and score products
  const seen = new Set();
  const candidates = [];
  for (const group of searchResults) {
    for (const p of group) {
      const id = p._id.toString();
      if (!seen.has(id)) {
        seen.add(id);
        const productObj = p.toObject();
        productObj.matchScore = calculateScore(productObj, keywords);
        candidates.push(productObj);
      }
    }
  }

  // Sort by matching score descending
  candidates.sort((a, b) => b.matchScore - a.matchScore);

  console.log(
    '[suggestions] Candidate products before refinement:',
    candidates.map((p) => ({ name: p.name, score: p.matchScore }))
  );

  // Audit and refine suggestions using LLM
  let refined = candidates;
  if (message) {
    console.log('[suggestions] Refining suggestions via LLM for user alignment...');
    refined = await refineSuggestions(message, candidates);
  }

  // Fallback: Keep top matches if LLM filtered everything
  if (!refined.length && candidates.length > 0) {
    console.log('[suggestions] LLM refined all candidates away. Falling back to top scorers.');
    refined = candidates.filter((p) => p.matchScore >= 10);
  }

  const finalProducts = refined.slice(0, 5);

  return {
    products: finalProducts,
    matchedQuery: keywords.join(' '),
  };
};

module.exports = { handle };
