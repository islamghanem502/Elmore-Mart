const detect = async (message, chatHistory = []) => {
  const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('Neither GROQ_API_KEY nor GEMINI_API_KEY is defined in the environment variables.');
    return getSafeFallback('أهلاً بك! كيف يمكنني مساعدتك اليوم؟');
  }

  const useGroq = !!process.env.GROQ_API_KEY;

  const systemPrompt = `
أنت مساعد ذكي لتصنيف رسائل مستخدمي تطبيق Elmore Mart (سوبر ماركت أونلاين).

مهمتك: فهم رسالة المستخدم وإرجاع JSON صارم ومحدد بالشكل التالي:

{
  "intent": "direct_search" | "recipe_mode" | "suggestions" | "fallback",
  "entities": [],
  "servings": 1,
  "categoryHint": null,
  "descriptors": [],
  "fallbackReply": null
}

تعريف الـ intents:
- direct_search: المستخدم بيطلب منتج/منتجات محددة بالاسم (مثال: "عايز لبن كامل الدسم المراعي"، "شيبسي تايجر"، "حليب بالشوكولاتة"). entities = أسماء المنتجات المطلوبة.
- recipe_mode: المستخدم عايز يطبخ وصفة أو أكلة معينة ومحتاج مكوناتها (مثال: "عايز أعمل حواوشي"، "مكونات الكشري لـ 3 أشخاص"). entities = اسم الأكلة أو المكونات المطلوبة. servings = عدد الأشخاص.
- suggestions: بيطلب اقتراحات عامة، أكلات خفيفة، سناكس، أو منتجات بناءً على حالة/رغبة معينة (مثال: "اقتراحات سناكس"، "عاوز حاجة مسكرة مع قهوة"، "عاوز حاجة صحية"، "عايز حاجة خفيفة"، "سناكس للتسلية"). categoryHint = الكاتيجوري لو ذكر (مثل سناكس، فواكه). descriptors = الأوصاف (صحي، مسكر، دايت، إلخ).
- fallback: سؤال عام، تحية، أو حاجة مش متعلقة بالمنتجات. fallbackReply = رد قصير مناسب.

قواعد:
- entities دايما بالعربي ومفردة قدر الإمكان.
- لو مفيش entities واضحة والرسالة غير محددة منتج أو تصنيف → fallback.
- رجّع JSON فقط بدون أي نص زيادة.
`.trim();

  // Format chat history for Gemini vs Groq
  let contents, messagesList;
  if (useGroq) {
    messagesList = [
      { role: 'system', content: systemPrompt }
    ];
    chatHistory.slice(-6).forEach((m) => {
      if (m.content && m.role) {
        messagesList.push({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        });
      }
    });
    messagesList.push({
      role: 'user',
      content: message,
    });
  } else {
    contents = [];
    chatHistory.slice(-6).forEach((m) => {
      if (m.content && m.role) {
        contents.push({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        });
      }
    });
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const maxAttempts = 2;
  let lastErr;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      let response;
      if (useGroq) {
        const url = 'https://api.groq.com/openai/v1/chat/completions';
        response = await fetch(url, {
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
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: contents,
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            generationConfig: {
              temperature: 0,
              responseMimeType: 'application/json',
            },
          }),
        });
      }

      if (response.status === 503 || response.status === 429) {
        const errText = await response.text();
        lastErr = new Error(`API ${response.status}: ${errText.substring(0, 100)}`);
        if (attempt < maxAttempts) {
          console.warn(`[intentService] attempt ${attempt} failed (${response.status}), retrying in 1.5s…`);
          await sleep(1500);
          continue;
        }
        throw lastErr;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API returned status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      let raw;
      if (useGroq) {
        raw = data.choices?.[0]?.message?.content;
      } else {
        raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
      }

      if (!raw) {
        throw new Error('Empty response from API');
      }

      const parsed = JSON.parse(raw.trim());

      return {
        intent:        parsed.intent        || 'fallback',
        entities:      Array.isArray(parsed.entities)    ? parsed.entities    : [],
        servings:      parsed.servings      || 1,
        categoryHint:  parsed.categoryHint  || null,
        descriptors:   Array.isArray(parsed.descriptors) ? parsed.descriptors : [],
        fallbackReply: parsed.fallbackReply || null,
      };
    } catch (err) {
      lastErr = err;
      if (attempt < maxAttempts) {
        console.warn(`[intentService] attempt ${attempt} error: ${err.message}, retrying in 1.5s…`);
        await sleep(1500);
      }
    }
  }

  console.error('intentService failed after all retries:', lastErr.message);
  return getSafeFallback('أهلاً بك! أنا مساعد إلمور مارت، كيف أقدر أساعدك؟');
};

const getSafeFallback = (reply) => {
  return {
    intent: 'fallback',
    entities: [],
    servings: 1,
    categoryHint: null,
    descriptors: [],
    fallbackReply: reply,
  };
};

module.exports = { detect };
