const sleep = (ms) => new Promise((r) => setTimeout(r, ms));


const buildLocalReply = ({ intent, products = [], groups = [] }) => {
  const { intent: type, entities = [], servings = 1, categoryHint } = intent;

  // ── Fallback / greeter ──
  if (type === 'fallback') {
    return 'أهلاً! أنا مساعد إلمور مارت 🛒\nاسألني عن أي منتج أو قولي محتاج إيه وأنا هجيبهولك! 😊';
  }

  // ── No products found ──
  if (!products.length && !groups.length) {
    const searched = entities.join(' و') || 'ما ذكرته';
    return `بدورت على "${searched}" بس مش لاقيها دلوقتي 😔\nجرب تكتب بكلمة تانية أو اسألني عن حاجة تانية، أنا هنا! 😊`;
  }

  // ── Direct search ──
  if (type === 'direct_search') {
    if (products.length === 1) {
      const p = products[0];
      return `لقيتلك "${p.name}" بسعر ${p.price} جنيه ✅\nهل تضيفه للسلة؟`;
    }
    const list = products.slice(0, 5).map((p) => `• ${p.name} — ${p.price} جنيه`).join('\n');
    return `لقيتلك منتجات تناسب طلبك ✅\n\n${list}\n\nاختار اللي يعجبك وضيفه للسلة! 🛒`;
  }

  // ── Recipe mode ──
  if (type === 'recipe_mode') {
    const found = groups.filter((g) => g.found);
    const missing = groups.filter((g) => !g.found).map((g) => g.entity);
    let reply = `مكونات وصفتك لـ ${servings} شخص 👨‍🍳\n\n`;
    if (found.length) {
      reply += `✅ المتاح:\n` + found.map((g) => {
        const best = g.products?.[0];
        return best ? `• ${g.entity} — ${best.name} (${best.price} جنيه)` : `• ${g.entity}`;
      }).join('\n');
    }
    if (missing.length) {
      reply += `\n\n❌ مش متاح دلوقتي:\n` + missing.map((e) => `• ${e}`).join('\n');
    }
    return reply;
  }


  // ── Suggestions ──
  if (type === 'suggestions') {
    const catNote = categoryHint ? ` من ${categoryHint}` : '';
    const list = products.slice(0, 5).map((p) => `• ${p.name} — ${p.price} جنيه`).join('\n');
    return `اقتراحاتي ليك${catNote} 🌟\n\n${list}`;
  }

  // Generic
  const list = products.slice(0, 5).map((p) => `• ${p.name} — ${p.price} جنيه`).join('\n');
  return `إليك ما وجدناه لك ✅\n\n${list}`;
};


//   Call LLM (Groq or Gemini) with retry (up to maxAttempts)
const callLLM = async (useGroq, contents, messagesList, systemPrompt, apiKey, maxAttempts = 2) => {
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
            temperature: 0.5,
          }),
        });
      } else {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: { temperature: 0.5 },
          }),
        });
      }

      // Retryable statuses
      if (response.status === 503 || response.status === 429) {
        const errText = await response.text();
        lastErr = new Error(`LLM API ${response.status}: ${errText.substring(0, 100)}`);
        if (attempt < maxAttempts) {
          console.warn(`[replyService] attempt ${attempt} failed (${response.status}), retrying in 1.5s…`);
          await sleep(1500);
          continue;
        }
        throw lastErr;
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`LLM API error ${response.status}: ${errText.substring(0, 200)}`);
      }

      const data = await response.json();
      let text;
      if (useGroq) {
        text = data.choices?.[0]?.message?.content;
      } else {
        text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      }

      if (!text) throw new Error('Empty response from LLM');
      return text.trim();

    } catch (err) {
      lastErr = err;
      if (attempt < maxAttempts) {
        console.warn(`[replyService] attempt ${attempt} error: ${err.message}, retrying…`);
        await sleep(1500);
      }
    }
  }
  throw lastErr;
};


const generateResponse = async ({ message, chatHistory = [], intent, products = [], groups = [] }) => {
  const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;
  const useGroq = !!process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.error('[replyService] Neither GROQ_API_KEY nor GEMINI_API_KEY set — using local reply');
    return buildLocalReply({ intent, products, groups });
  }

 
  let productsContext = '';
  if (intent.intent === 'recipe_mode' && groups.length > 0) {
    productsContext = 'المكونات المبحوث عنها ونتائجها:\n' + groups.map(g => {
      const prodList = g.found
        ? g.products.map(p => `- ${p.name} (${p.price} جنيه، ${p.available ? 'متاح' : 'غير متاح'})`).join('\n')
        : 'غير متوفر في المتجر';
      return `"${g.entity}" → ${g.found ? 'متاح:\n' + prodList : 'غير متوفر'}`;
    }).join('\n\n');
  } else if (products.length > 0) {
    productsContext = products.map(p =>
      `- ${p.name} (${p.price} جنيه، ${p.categoryId?.name || 'عام'}، ${p.available ? 'متاح' : 'غير متاح'})`
    ).join('\n');
  } else {
    productsContext = 'لم يُعثر على منتجات مطابقة.';
  }

  const systemPrompt = `
أنت مساعد تسوق ذكي ومباشر لسوبرماركت إلمور مارت.
مهمتك: كتابة رد مصري قصير جداً ومباشر يركز فقط على المنتجات المتاحة وأسعارها بدون رغي أو كلام طويل غير مفيد.

قواعد صارمة:
1. الرد يجب أن يكون قصيراً جداً ومباشراً (بدون مقدمات طويلة أو رغي). ركز على سرد المنتجات المتاحة فوراً.
2. اذكر أسماء وأسعار المنتجات الحقيقية من القائمة المقدمة فقط.
3. لا ترسل كود أو JSON، فقط نص منسق بنقاط واضحة.
`.trim();

  const promptDetails = `
Intent: ${intent.intent}
Entities: ${intent.entities?.join(', ') || '—'}
Servings: ${intent.servings || 1}
CategoryHint: ${intent.categoryHint || '—'}

المنتجات المتاحة:
${productsContext}

رسالة المستخدم: ${message}
`.trim();

  // Format chat history for Gemini
  const contents = [
    ...chatHistory.slice(-6).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: promptDetails }] },
  ];

  // Format chat history for Groq
  const messagesList = [
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
    content: promptDetails,
  });

  try {
    return await callLLM(useGroq, contents, messagesList, systemPrompt, apiKey, 2);
  } catch (err) {
    console.error('[replyService] LLM failed after retries, using local reply:', err.message);
    return buildLocalReply({ intent, products, groups });
  }
};

module.exports = { generateResponse };
