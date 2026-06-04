const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const refineProducts = async (message, products = []) => {
  if (!products.length) return [];

  const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;
  const useGroq = !!process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.warn('[refinementService] No API key found. Skipping LLM refinement.');
    return products;
  }

  const systemPrompt = `
You are a product relevance auditor for Elmore Mart (an online supermarket).
Review the user's query and a list of candidate products fetched from our database.
Filter the candidates to keep ONLY products that are truly relevant to what the user wants.

Rules:
1. If the user asks for "حليب بالشوكولاتة" (chocolate milk), filter out "كرواسون بالشوكولاتة" (chocolate croissant) or plain "حليب" (milk).
2. Filter out products that are unrelated category-wise or flavor-wise.
3. You must respond with a JSON object containing a single key "relevantIds" which is an array of the ID strings of the relevant products.
4. Do not output any commentary, markdown (except valid JSON), or code blocks.

Example output:
{
  "relevantIds": ["6a1fd1938df564b2313ee8b7", "6a2089f840cf8900a96c1e6b"]
}
`.trim();

  const candidateList = products
    .map((p) => `ID: ${p._id.toString()} | Name: ${p.name} | Tags: ${p.tags?.join(', ') || ''}`)
    .join('\n');

  const userPrompt = `
User Query: "${message}"

Candidate Products:
${candidateList}

Output the JSON object with the relevant IDs.
`.trim();

  // Format contents for Gemini
  const contents = [
    { role: 'user', parts: [{ text: userPrompt }] }
  ];

  // Format messages for Groq
  const messagesList = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  const maxAttempts = 2;
  let lastErr;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
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
            temperature: 0,
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
              temperature: 0,
              responseMimeType: 'application/json',
            },
          }),
        });
      }

      if (response.status === 503 || response.status === 429) {
        const errText = await response.text();
        lastErr = new Error(`Relevance API ${response.status}: ${errText.substring(0, 100)}`);
        if (attempt < maxAttempts) {
          console.warn(`[refinementService] attempt ${attempt} failed (${response.status}), retrying in 1.5s…`);
          await sleep(1500);
          continue;
        }
        throw lastErr;
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Relevance API error ${response.status}: ${errText.substring(0, 200)}`);
      }

      const data = await response.json();
      let raw;
      if (useGroq) {
        raw = data.choices?.[0]?.message?.content;
      } else {
        raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
      }

      if (!raw) throw new Error('Empty response from Relevance LLM');
      const parsed = JSON.parse(raw.trim());

      const relevantIds = Array.isArray(parsed.relevantIds) ? parsed.relevantIds : [];
      console.log('[refinementService] LLM relevance matches:', relevantIds);

      // Filter products based on LLM output
      const filtered = products.filter((p) => relevantIds.includes(p._id.toString()));
      return filtered;

    } catch (err) {
      lastErr = err;
      console.warn(`[refinementService] attempt ${attempt} error: ${err.message}`);
      if (attempt < maxAttempts) {
        await sleep(1500);
      }
    }
  }

  console.error('[refinementService] LLM refinement failed after all retries. Returning all products.');
  return products;
};

module.exports = { refineProducts };
