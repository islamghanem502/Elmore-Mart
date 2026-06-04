import { useState, useRef, useEffect } from "react";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext";
import { COLORS } from "../../constants/theme";

const C = COLORS;
const LARRY_IMG = "/larry.png";

/* ── fonts ── */
const FONT_AR = "'Tajawal', 'Cairo', sans-serif";
const FONT_EN = "'Nunito', sans-serif";
const FONT_TITLE = "'Fredoka One', 'Cairo', sans-serif";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "أهلاً! أنا لاري، مساعدك في إلمور مارت 🛒\nجرب تكتب:\n• «عايز لبن وجبنة»\n• «كشري لـ 4 أشخاص»\n• «عاوز حلو بنجاب القهوة»",
      products: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [larryBounce, setLarryBounce] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const { addToCart, setCartOpen } = useCart();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  /* bounce Larry on new bot message */
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role === "assistant") {
      setLarryBounce(true);
      setTimeout(() => setLarryBounce(false), 800);
    }
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: "user", content: text, products: [] };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput("");
    setLoading(true);

    const chatHistory = updatedHistory.slice(-10).map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    }));

    try {
      const { data } = await api.post("/chat", {
        message: text,
        chatHistory: chatHistory.slice(0, -1),
      });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "لم أفهم طلبك، ممكن تجرب تاني؟",
          products: normalizeProducts(data),
          type: data.type,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "في مشكلة صغيرة، جرب تاني 😔", products: [] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const normalizeProducts = (data) => {
    if (data.type === "recipe_list" && data.groups?.length) {
      return data.groups.flatMap((g) => g.products || []);
    }
    return data.products || [];
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const toggleProduct = (product) => {
    setSelectedProducts((prev) => {
      const id = product._id;
      if (prev[id]) { const n = { ...prev }; delete n[id]; return n; }
      return { ...prev, [id]: { product, qty: 1 } };
    });
  };

  const changeQty = (id, delta) => {
    setSelectedProducts((prev) => {
      if (!prev[id]) return prev;
      const newQty = prev[id].qty + delta;
      if (newQty <= 0) { const n = { ...prev }; delete n[id]; return n; }
      return { ...prev, [id]: { ...prev[id], qty: newQty } };
    });
  };

  const addSelectedToCart = () => {
    const items = Object.values(selectedProducts);
    if (!items.length) return;
    items.forEach(({ product, qty }) => addToCart(product, qty));
    setSelectedProducts({});
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: `✅ تم إضافة ${items.length} منتج للسلة!\nتحب تكمل تسوق ولا تروح للسلة؟ 🛒`, products: [] },
    ]);
    setCartOpen(true);
  };

  const selectedCount = Object.keys(selectedProducts).length;

  return (
    <>
      {/* ── Floating Larry Bubble ── */}
      <button
        id="chatbot-toggle"
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1001,
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: open
            ? `linear-gradient(135deg, #E8735A, #e85a5a)`
            : `linear-gradient(135deg, ${C.teal}, ${C.tealLight})`,
          boxShadow: open
            ? `0 8px 32px rgba(232,115,90,0.5)`
            : `0 8px 32px rgba(27,122,94,0.45)`,
          border: "3px solid white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(.4,0,.2,1)",
          transform: larryBounce && !open ? "scale(1.18)" : "scale(1)",
        }}
        aria-label="Open Larry Chat Assistant"
      >
        {open ? (
          <span style={{ fontSize: 26, color: "white", fontWeight: 900 }}>✕</span>
        ) : (
          <img
            src={LARRY_IMG}
            alt="Larry"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
          />
        )}
      </button>

      {/* ── Notification Badge ── */}
      {!open && messages.length > 1 && (
        <div style={{
          position: "fixed",
          bottom: 86,
          right: 22,
          zIndex: 1002,
          background: C.coral,
          color: "white",
          borderRadius: 20,
          fontSize: 10,
          fontFamily: FONT_EN,
          fontWeight: 800,
          padding: "2px 7px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          pointerEvents: "none",
        }}>
          {messages.filter(m => m.role === "assistant").length}
        </div>
      )}

      {/* ── Chat Panel ── */}
      <div
        id="chatbot-panel"
        style={{
          position: "fixed",
          bottom: 112,
          right: 24,
          zIndex: 1000,
          width: 400,
          maxWidth: "calc(100vw - 32px)",
          height: 620,
          maxHeight: "calc(100vh - 140px)",
          background: "#FAFBFC",
          borderRadius: 28,
          boxShadow: "0 24px 80px rgba(0,0,0,0.18), 0 4px 20px rgba(27,122,94,0.12)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "all" : "none",
          transform: open ? "translateY(0) scale(1)" : "translateY(28px) scale(0.94)",
          transition: "opacity 0.3s ease, transform 0.3s cubic-bezier(.4,0,.2,1)",
        }}
      >
        {/* ── Header ── */}
        <div style={{
          background: `linear-gradient(135deg, ${C.teal} 0%, #1a9068 60%, #22a87a 100%)`,
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexShrink: 0,
          height: 80,
          position: "relative",
          overflow: "hidden",
        }}>
          {/* decorative circles */}
          <div style={{ position:"absolute", top:-20, left:-20, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
          <div style={{ position:"absolute", bottom:-30, right:60, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />

          {/* Larry avatar in header */}
          <div style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "white",
            flexShrink: 0,
            overflow: "hidden",
            boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
            border: "2px solid rgba(255,255,255,0.6)",
          }}>
            <img src={LARRY_IMG} alt="Larry" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ color: "white", fontFamily: FONT_TITLE, fontSize: 18, lineHeight: 1, letterSpacing: 0.3 }}>
              لاري — مساعد إلمور مارت
            </div>
            {loading && (
              <div style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: 12,
                fontFamily: FONT_AR,
                fontWeight: 500,
                marginTop: 4,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: "#FFD700",
                  display: "inline-block",
                  boxShadow: "0 0 6px #FFD700",
                  animation: "pulse 1s infinite",
                }} />
                لاري بيكتب…
              </div>
            )}
          </div>

          <button
            onClick={() => setOpen(false)}
            style={{
              background: "rgba(255,255,255,0.15)",
              border: "none",
              color: "white",
              width: 32, height: 32,
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: 15,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.28)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
          >
            ✕
          </button>
        </div>

        {/* ── Messages ── */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "18px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          background: "linear-gradient(180deg, #F0F4F8 0%, #FAFBFC 100%)",
        }}>
          {messages.map((msg, idx) => (
            <div key={idx}>
              {/* Bubble row */}
              <div style={{
                display: "flex",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                alignItems: "flex-end",
                gap: 10,
              }}>
                {/* Bot avatar */}
                {msg.role === "assistant" && (
                  <div style={{
                    width: 34, height: 34,
                    borderRadius: "50%",
                    background: "white",
                    flexShrink: 0,
                    overflow: "hidden",
                    boxShadow: "0 2px 8px rgba(27,122,94,0.2)",
                    border: `2px solid ${C.teal}`,
                  }}>
                    <img src={LARRY_IMG} alt="Larry" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }} />
                  </div>
                )}

                {/* Message bubble */}
                <div style={{
                  maxWidth: "75%",
                  padding: msg.role === "user" ? "10px 16px" : "12px 16px",
                  borderRadius: msg.role === "user"
                    ? "20px 20px 6px 20px"
                    : "20px 20px 20px 6px",
                  background: msg.role === "user"
                    ? `linear-gradient(135deg, ${C.teal}, #22a87a)`
                    : "white",
                  color: msg.role === "user" ? "white" : C.navy,
                  boxShadow: msg.role === "user"
                    ? `0 4px 16px rgba(27,122,94,0.3)`
                    : "0 2px 12px rgba(0,0,0,0.07)",
                  fontSize: 14,
                  fontFamily: FONT_AR,
                  fontWeight: msg.role === "user" ? 600 : 500,
                  lineHeight: 1.7,
                  whiteSpace: "pre-line",
                  direction: "rtl",
                  textAlign: "right",
                  letterSpacing: 0.2,
                }}>
                  {msg.content}
                </div>
              </div>

              {/* Product Cards */}
              {msg.products?.length > 0 && (
                <div style={{ marginTop: 12, marginRight: 44 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {msg.products.map((p) => {
                      const id = p._id;
                      const isSelected = !!selectedProducts[id];
                      const qty = selectedProducts[id]?.qty || 1;
                      return (
                        <div
                          key={id}
                          onClick={() => toggleProduct(p)}
                          style={{
                            background: isSelected
                              ? `linear-gradient(135deg, ${C.tealPale}, #d4ede5)`
                              : "white",
                            border: `2px solid ${isSelected ? C.teal : "#E5E9EF"}`,
                            borderRadius: 16,
                            padding: "10px 10px 8px",
                            cursor: "pointer",
                            transition: "all 0.22s cubic-bezier(.4,0,.2,1)",
                            position: "relative",
                            boxShadow: isSelected
                              ? `0 4px 16px rgba(27,122,94,0.18)`
                              : "0 2px 8px rgba(0,0,0,0.05)",
                            transform: isSelected ? "translateY(-1px)" : "none",
                          }}
                        >
                          {/* Check badge */}
                          {isSelected && (
                            <div style={{
                              position: "absolute", top: 6, left: 6,
                              width: 22, height: 22,
                              borderRadius: "50%",
                              background: `linear-gradient(135deg, ${C.teal}, #22a87a)`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 11, color: "white", fontWeight: 900,
                              boxShadow: "0 2px 6px rgba(27,122,94,0.4)",
                            }}>✓</div>
                          )}

                          {/* Emoji */}
                          <div style={{
                            fontSize: 30, textAlign: "center", marginBottom: 6,
                            height: 38, display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            {p.image || "🛍️"}
                          </div>

                          {/* Name */}
                          <div style={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            fontFamily: FONT_AR,
                            color: C.navy,
                            textAlign: "right",
                            direction: "rtl",
                            lineHeight: 1.35,
                            marginBottom: 5,
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}>
                            {p.name}
                          </div>

                          {/* Price */}
                          <div style={{
                            fontSize: 13,
                            fontWeight: 800,
                            color: C.teal,
                            fontFamily: FONT_TITLE,
                            textAlign: "right",
                            direction: "rtl",
                          }}>
                            {p.price} جنيه
                          </div>

                          {/* Qty controls */}
                          {isSelected && (
                            <div
                              style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginTop:7 }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button onClick={(e) => { e.stopPropagation(); changeQty(id, -1); }} style={{
                                width: 24, height: 24, borderRadius: 8,
                                border: `1.5px solid ${C.gray}`,
                                background: "white", fontSize: 15,
                                display:"flex", alignItems:"center", justifyContent:"center",
                                cursor:"pointer", fontWeight: 900, color: C.text,
                              }}>−</button>
                              <span style={{
                                fontSize: 13, fontWeight: 800,
                                fontFamily: FONT_EN, minWidth: 18, textAlign:"center", color: C.navy,
                              }}>{qty}</span>
                              <button onClick={(e) => { e.stopPropagation(); changeQty(id, 1); }} style={{
                                width: 24, height: 24, borderRadius: 8,
                                border: `1.5px solid ${C.teal}`,
                                background: C.tealPale, fontSize: 15,
                                display:"flex", alignItems:"center", justifyContent:"center",
                                cursor:"pointer", fontWeight: 900, color: C.teal,
                              }}>+</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Add to cart */}
                  {selectedCount > 0 && (
                    <button
                      onClick={addSelectedToCart}
                      style={{
                        marginTop: 10, width: "100%",
                        padding: "12px 16px",
                        background: `linear-gradient(135deg, ${C.orange}, #f5c842)`,
                        border: "none", borderRadius: 14,
                        color: C.navy,
                        fontFamily: FONT_TITLE,
                        fontSize: 14,
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        boxShadow: `0 4px 16px rgba(232,168,56,0.4)`,
                        transition: "transform 0.15s, box-shadow 0.15s",
                        letterSpacing: 0.3,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow=`0 8px 24px rgba(232,168,56,0.5)`; }}
                      onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=`0 4px 16px rgba(232,168,56,0.4)`; }}
                    >
                      🛒 أضف {selectedCount} منتج{selectedCount > 1 ? "ات" : ""} للسلة
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div style={{ display:"flex", alignItems:"flex-end", gap:10 }}>
              <div style={{
                width:34, height:34, borderRadius:"50%",
                background:"white", flexShrink:0,
                overflow:"hidden",
                boxShadow:"0 2px 8px rgba(27,122,94,0.2)",
                border:`2px solid ${C.teal}`,
              }}>
                <img src={LARRY_IMG} alt="Larry" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top center" }} />
              </div>
              <div style={{
                padding:"12px 18px",
                background:"white",
                borderRadius:"20px 20px 20px 6px",
                boxShadow:"0 2px 12px rgba(0,0,0,0.07)",
                display:"flex", gap:5, alignItems:"center",
              }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width:8, height:8, borderRadius:"50%",
                    background:`linear-gradient(135deg, ${C.teal}, #22a87a)`,
                    animation:`larryBounce 1.2s infinite ${i*0.2}s`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* ── Input Area ── */}
        <div style={{
          padding:"12px 16px 16px",
          borderTop:"1px solid #E8ECF0",
          background:"white",
          flexShrink:0,
        }}>
          {/* Selection bar */}
          {selectedCount > 0 && (
            <div style={{
              marginBottom:10,
              padding:"8px 14px",
              background: C.tealPale,
              borderRadius:12,
              fontSize:12,
              fontFamily:FONT_AR,
              color:C.teal,
              fontWeight:700,
              display:"flex",
              justifyContent:"space-between",
              alignItems:"center",
              direction:"rtl",
              border:`1px solid rgba(27,122,94,0.15)`,
            }}>
              <span>✓ {selectedCount} منتج محدد</span>
              <button
                onClick={() => setSelectedProducts({})}
                style={{ background:"none", border:"none", color:C.coral, cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:FONT_AR }}
              >إلغاء التحديد</button>
            </div>
          )}

          {/* Text input row */}
          <div style={{ display:"flex", gap:10, alignItems:"flex-end" }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="اكتب رسالتك هنا…"
              rows={1}
              disabled={loading}
              style={{
                flex:1,
                border:`2px solid ${input ? C.teal : "#E5E9EF"}`,
                borderRadius:16,
                padding:"11px 16px",
                fontFamily:FONT_AR,
                fontSize:14,
                fontWeight:500,
                color:C.navy,
                resize:"none",
                outline:"none",
                transition:"border-color 0.2s, box-shadow 0.2s",
                direction:"rtl",
                background:"#F7F9FC",
                lineHeight:1.5,
                maxHeight:90,
                overflowY:"auto",
                boxShadow: input ? `0 0 0 3px rgba(27,122,94,0.1)` : "none",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              style={{
                width:46, height:46,
                borderRadius:14,
                background: input.trim() && !loading
                  ? `linear-gradient(135deg, ${C.teal}, #22a87a)`
                  : "#E5E9EF",
                border:"none",
                color:"white",
                fontSize:18,
                display:"flex", alignItems:"center", justifyContent:"center",
                cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                transition:"all 0.2s",
                flexShrink:0,
                boxShadow: input.trim() && !loading ? `0 4px 14px rgba(27,122,94,0.35)` : "none",
              }}
              onMouseEnter={e => { if(input.trim() && !loading) e.currentTarget.style.transform="scale(1.08)"; }}
              onMouseLeave={e => e.currentTarget.style.transform=""}
            >
              ➤
            </button>
          </div>

          {/* Quick chips */}
          <div style={{ marginTop:10, display:"flex", gap:6, flexWrap:"wrap" }}>
            {["عايز لبن", "كشري لـ 4 أشخاص", "حاجة صحية"].map((q) => (
              <button
                key={q}
                onClick={() => { setInput(q); inputRef.current?.focus(); }}
                style={{
                  padding:"5px 12px",
                  borderRadius:20,
                  border:`1.5px solid ${C.teal}33`,
                  color:C.teal,
                  background: C.tealPale,
                  fontSize:11.5,
                  fontFamily:FONT_AR,
                  fontWeight:700,
                  cursor:"pointer",
                  transition:"all 0.15s",
                  direction:"rtl",
                  letterSpacing:0.2,
                }}
                onMouseEnter={e => { e.currentTarget.style.background=C.teal; e.currentTarget.style.color="white"; }}
                onMouseLeave={e => { e.currentTarget.style.background=C.tealPale; e.currentTarget.style.color=C.teal; }}
              >{q}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Keyframes + Mobile */}
      <style>{`
        @keyframes larryBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-7px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        #chatbot-panel *::-webkit-scrollbar { width: 4px; }
        #chatbot-panel *::-webkit-scrollbar-track { background: transparent; }
        #chatbot-panel *::-webkit-scrollbar-thumb { background: ${C.teal}55; border-radius: 4px; }
        #chatbot-panel textarea::placeholder { color: #9BA7B4; font-family: 'Tajawal', sans-serif; }

        @media (max-width: 480px) {
          #chatbot-panel {
            width: calc(100vw - 20px) !important;
            height: calc(100vh - 120px) !important;
            max-height: calc(100vh - 120px) !important;
            bottom: 100px !important;
            right: 10px !important;
            border-radius: 20px !important;
          }
          #chatbot-toggle {
            width: 58px !important;
            height: 58px !important;
            bottom: 16px !important;
            right: 16px !important;
          }
        }
      `}</style>
    </>
  );
}
