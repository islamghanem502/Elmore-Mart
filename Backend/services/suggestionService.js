const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const generateSuggestionKeywords = async (message) => {
  const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;
  const useGroq = !!process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.warn('[suggestionService] No API key found. Using fallback keywords.');
    return ['دايت', 'صحي', 'لايت', 'فاكهة', 'خضروات'];
  }

  const systemPrompt = `
You are a healthy eating and shopping advisor for Elmore Mart.
Analyze the user's message where they ask for recommendations or suggestions (e.g., "عاوز أكل للرجيم", "سناكس صحي خفيف").
Output a JSON array of the best Arabic search keywords or tags (singular, simple terms) that would help retrieve appropriate products from our supermarket database.
Limit the output to 3 to 5 highly relevant terms.

Example:
If message is "عاوز أكل للرجيم", output: ["دايت", "لايت", "شوفان", "قليل الدسم"]

You must respond with a JSON object containing a single key "keywords" which is an array of strings. Do not include any explanation or markdown formatting other than valid JSON.
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
      throw new Error(`Suggestion keywords API status ${response.status}`);
    }

    const data = await response.json();
    let raw;
    if (useGroq) {
      raw = data.choices?.[0]?.message?.content;
    } else {
      raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    }

    const parsed = JSON.parse(raw.trim());
    return Array.isArray(parsed.keywords) ? parsed.keywords : ['دايت', 'صحي'];
  } catch (err) {
    console.error('[suggestionService] generateSuggestionKeywords failed:', err.message);
    return ['دايت', 'صحي', 'لايت', 'فاكهة', 'خضروات'];
  }
};

/**
 * Reviews candidate products for suggestions and filters them to match the user's specific request.
 */
const refineSuggestions = async (message, products = []) => {
  const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;
  const useGroq = !!process.env.GROQ_API_KEY;

  if (!apiKey || !products.length) {
    return products;
  }

  const systemPrompt = `
You are a product suggestion auditor for Elmore Mart.
The user requested suggestions with the message: "${message}".
Below is a list of candidate products retrieved from our database.
Your job is to audit this list and filter it to keep ONLY the products that are highly relevant and compatible with the user's request.
For example, if the user requested diet food ("أكل للرجيم"), filter out sugary drinks, high-fat chips, or heavy bakeries, and keep fruits, oats, low-fat dairy, etc.

You must respond with a JSON object containing a single key "relevantIds" which is an array of ID strings of the approved products.
Do not output any explanation or markdown formatting other than valid JSON.

Example output:
{
  "relevantIds": ["id1", "id2"]
}
`.trim();

  const candidateText = products
    .map((p) => `ID: ${p._id.toString()} | Name: ${p.name} | Description: ${p.description || ''} | Tags: ${p.tags?.join(', ') || ''}`)
    .join('\n');

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
      throw new Error(`Suggestions refinement API status ${response.status}`);
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
    console.log('[suggestionService] LLM approved products for suggestions:', relevantIds);

    const filtered = products.filter((p) => relevantIds.includes(p._id.toString()));
    return filtered;
  } catch (err) {
    console.error('[suggestionService] refineSuggestions failed:', err.message);
    return products; 
  }
};

module.exports = {
  generateSuggestionKeywords,
  refineSuggestions,
};
