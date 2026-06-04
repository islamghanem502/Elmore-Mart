
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));


const generateIngredients = async (message) => {
  const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;
  const useGroq = !!process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.warn('[recipeService] No API key found. Using fallback ingredients.');
    return ['لحمة', 'عيش', 'بصل', 'طماطم']; // Basic fallback
  }

  const systemPrompt = `
You are a culinary assistant for Elmore Mart.
Analyze the user's message requesting a recipe/dish (e.g., "حواوشي", "كشري", "مكرونة بشاميل").
Output a JSON array of the essential, standard ingredients needed to cook this dish, in simple, singular Arabic terms suitable for database search.
Limit the list to the most important 4 to 6 ingredients.

Example:
If query is about "حواوشي", output: ["لحمة مفرومة", "عيش بلدي", "بصل", "فلفل اخضر"]

You must respond with a JSON object containing:
{
  "recipeName": "اسم الأكلة باللغة العربية",
  "ingredients": ["مكون 1", "مكون 2", "مكون 3", ...]
}
Do not include any explanation or markdown formatting other than valid JSON.
`.trim();

  const messagesList = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `رسالة المستخدم: "${message}"` }
  ];

  const contents = [
    { role: 'user', parts: [{ text: `رسالة المستخدم: "${message}"` }] }
  ];

  try {
    let response;
    if (useGroq) {
      response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: messagesList,
          temperature: 0.1,
          response_format: { type: 'json_object' },
        }),
      });
    } else {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json',
          },
        }),
      });
    }

    if (!response.ok) {
      throw new Error(`Recipe ingredients API status ${response.status}`);
    }

    const data = await response.json();
    let raw;
    if (useGroq) {
      raw = data.choices?.[0]?.message?.content;
    } else {
      raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    }

    const parsed = JSON.parse(raw.trim());
    return {
      recipeName: parsed.recipeName || 'الوصفة',
      ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : ['لحمة', 'عيش'],
    };
  } catch (err) {
    console.error('[recipeService] generateIngredients failed:', err.message);
    return {
      recipeName: 'الوصفة',
      ingredients: ['لحمة', 'عيش', 'بصل', 'طماطم'],
    };
  }
};

/**
 * Reviews candidate products for each ingredient of a recipe and returns only compatible ones.
 */
const refineRecipeProducts = async (recipeName, servings, candidates = []) => {
  const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;
  const useGroq = !!process.env.GROQ_API_KEY;

  if (!apiKey || !candidates.length) {
    return candidates;
  }

  const systemPrompt = `
You are a culinary matching auditor for Elmore Mart.
The user wants to cook the recipe: "${recipeName}" for ${servings} person(s).
Below is a list of candidate supermarket products retrieved for each ingredient.
Your job is to filter the candidate list to keep ONLY products that are compatible and appropriate for making this specific recipe.
Filter out products that are incompatible (e.g. do not keep sweet bread or toast if the recipe is Hawawshi, do not keep basmati rice if the recipe is Egyptian Koshary unless no Egyptian rice is available).

You must respond with a JSON object containing a single key "relevantIds" which is an array of ID strings of the approved products.
Do not output any explanation or markdown formatting other than valid JSON.

Example output:
{
  "relevantIds": ["id1", "id2"]
}
`.trim();

  // Format candidate list for LLM review
  const candidateText = candidates
    .map((c) => {
      const prods = c.products
        .map((p) => `- ID: ${p._id.toString()} | Name: ${p.name} | Tags: ${p.tags?.join(', ') || ''}`)
        .join('\n');
      return `Ingredient: "${c.entity}"\nCandidates:\n${prods}`;
    })
    .join('\n\n');

  const messagesList = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: candidateText }
  ];

  const contents = [
    { role: 'user', parts: [{ text: candidateText }] }
  ];

  try {
    let response;
    if (useGroq) {
      response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: messagesList,
          temperature: 0.1,
          response_format: { type: 'json_object' },
        }),
      });
    } else {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json',
          },
        }),
      });
    }

    if (!response.ok) {
      throw new Error(`Recipe refinement API status ${response.status}`);
    }

    const data = await response.json();
    let raw;
    if (useGroq) {
      raw = data.choices?.[0]?.message?.content;
    } else {
      raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    }

    const parsed = JSON.parse(raw.trim());
    const relevantIds = Array.isArray(parsed.relevantIds) ? parsed.relevantIds : [];
    console.log('[recipeService] LLM approved product IDs for recipe:', relevantIds);

    // Apply the filter on the candidates array
    const refinedCandidates = candidates.map((group) => {
      const filteredProducts = group.products.filter((p) => relevantIds.includes(p._id.toString()));
      return {
        ...group,
        products: filteredProducts,
        found: filteredProducts.length > 0,
      };
    });

    return refinedCandidates;
  } catch (err) {
    console.error('[recipeService] refineRecipeProducts failed:', err.message);
    return candidates; // return unfiltered on failure
  }
};

module.exports = {
  generateIngredients,
  refineRecipeProducts,
};
