const intentService = require('../services/intentService');
const replyService = require('../services/replyService');
const responseBuilder = require('../services/responseBuilder');

const handlers = {
  direct_search: require('../services/handlers/directSearch'),
  recipe_mode:   require('../services/handlers/recipeMode'),
  suggestions:   require('../services/handlers/suggestions'),
  fallback:      require('../services/handlers/fallback'),
};

// @desc    Handle chat message → intent → handler → LLM Reply → response
exports.chat = async (req, res) => {
  try {
    const { message, chatHistory = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        type: 'message',
        reply: 'ممكن تكتب رسالتك الأول؟',
        products: [],
      });
    }

    // Step 1: Classify intent + extract entities using Gemini
    const intent = await intentService.detect(message, chatHistory);
    console.log(`[chat] intent: ${intent.intent}`, intent);

    // Step 2: Route to the right handler to query the database
    const handler = handlers[intent.intent] || handlers.fallback;
    const dbResults = await handler.handle({ ...intent, message });

    // Step 3: Generate smart Arabic response, integrating search results and history
    let smartReply;
    if (intent.intent === 'fallback') {
      smartReply = "أهلاً بك في سوبرماركت إلمور مارت! 🛒\nأنا مساعدك الذكي لمساعدتك في العثور على المنتجات، واقتراح مكونات الوصفات، وعروض الميزانية.\n\nيمكنك كتابة طلبك مباشرة، مثل:\n• «عايز لبن وجبنة»\n• «عايز أطبخ كشري لـ 4 أشخاص»\n• «عروض بـ 50 جنيه»\n• «اقتراحات سناكس»\n\nكيف يمكنني مساعدتك اليوم؟ 😊";
    } else {
      smartReply = await replyService.generateResponse({
        message,
        chatHistory,
        intent,
        products: dbResults.products || [],
        groups: dbResults.groups || [],
      });
    }

    // Step 4: Construct the unified response format
    let finalResponse;
    if (intent.intent === 'recipe_mode') {
      finalResponse = responseBuilder.buildRecipeList(smartReply, dbResults.groups || []);
    } else if (intent.intent === 'fallback') {
      finalResponse = responseBuilder.buildMessage(smartReply);
    } else {
      finalResponse = responseBuilder.buildProductList(
        smartReply,
        dbResults.products || [],
        dbResults.matchedQuery || null
      );
    }

    res.json(finalResponse);
  } catch (error) {
    console.error('[chatController] error:', error);
    res.status(500).json({
      type: 'message',
      reply: 'في مشكلة من جهتنا، حاول تاني بعد شوية.',
      products: [],
    });
  }
};
