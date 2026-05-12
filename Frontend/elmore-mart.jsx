import { useState, useEffect } from "react";

const C = {
  teal: "#1B7A5E", tealLight: "#2A9D73", tealPale: "#E8F5F0",
  orange: "#E8A838", orangePale: "#FFF4E0",
  coral: "#E8735A", green: "#7FB069",
  cream: "#F5EDD6", creamDark: "#EDE0C4",
  navy: "#1E2D40",
  gray: "#D1D5DB", grayLight: "#F3F4F6",
  white: "#FFFFFF",
  text: "#1E2D40", textLight: "#6B7280",
};

const PRODUCTS = [
  { id: 1, name: "Elmo's Puffs Cereal", price: 3.49, unit: "250g", cat: "Snacks", emoji: "🥣", bg: "#FFD16630", desc: "Crunchy & tasty cereal" },
  { id: 2, name: "Fresh Milk", price: 2.19, unit: "1L", cat: "Dairy & Eggs", emoji: "🥛", bg: "#E8F4FD", desc: "Farm fresh whole milk" },
  { id: 3, name: "Banana", price: 1.89, unit: "1kg", cat: "Fruits & Vegetables", emoji: "🍌", bg: "#FFF3CD", desc: "Sweet ripe bananas" },
  { id: 4, name: "Elmore Choc Bar", price: 1.49, unit: "100g", cat: "Snacks", emoji: "🍫", bg: "#C8855030", desc: "Rich chocolate treat" },
  { id: 5, name: "Orange Juice", price: 2.99, unit: "1L", cat: "Beverages", emoji: "🍊", bg: "#FFE5B4", desc: "100% fresh squeezed" },
  { id: 6, name: "Sliced Bread", price: 1.79, unit: "500g", cat: "Bakery", emoji: "🍞", bg: "#DEB88730", desc: "Soft white sliced bread" },
  { id: 7, name: "Canned Beans", price: 0.99, unit: "400g", cat: "Canned Goods", emoji: "🥫", bg: "#CD853F30", desc: "Ready to eat beans" },
  { id: 8, name: "Free Range Eggs", price: 3.29, unit: "12 pcs", cat: "Dairy & Eggs", emoji: "🥚", bg: "#FAEBD7", desc: "Farm fresh eggs" },
  { id: 9, name: "Sparkling Water", price: 1.29, unit: "500ml", cat: "Beverages", emoji: "💧", bg: "#DDEEFF", desc: "Refreshing sparkling water" },
  { id: 10, name: "Greek Yogurt", price: 2.49, unit: "200g", cat: "Dairy & Eggs", emoji: "🍦", bg: "#F0E6FF", desc: "Thick creamy yogurt" },
  { id: 11, name: "Apple", price: 0.79, unit: "500g", cat: "Fruits & Vegetables", emoji: "🍎", bg: "#FFE0E0", desc: "Crisp fresh apples" },
  { id: 12, name: "Dish Soap", price: 1.99, unit: "750ml", cat: "Household Essentials", emoji: "🧴", bg: "#E0F0FF", desc: "Lemon-scented dish soap" },
];

const CATS = [
  { name: "Snacks", emoji: "🍿", count: 120 },
  { name: "Beverages", emoji: "🥤", count: 85 },
  { name: "Dairy & Eggs", emoji: "🥛", count: 60 },
  { name: "Canned Goods", emoji: "🥫", count: 150 },
  { name: "Fruits & Vegetables", emoji: "🍎", count: 90 },
  { name: "Bakery", emoji: "🥖", count: 70 },
  { name: "Household Essentials", emoji: "🧹", count: 110 },
];

/* ─── SVG Characters ─── */
function Richard({ size = 160 }) {
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 200 230" fill="none">
      <ellipse cx="100" cy="165" rx="78" ry="68" fill="#F4A0A0" />
      <ellipse cx="100" cy="180" rx="66" ry="52" fill="#F5F0E8" />
      <rect x="88" y="160" width="10" height="52" fill="#444" rx="3" />
      <ellipse cx="100" cy="93" rx="62" ry="68" fill="#F4A0A0" />
      <ellipse cx="40" cy="88" rx="15" ry="20" fill="#F4A0A0" />
      <ellipse cx="160" cy="88" rx="15" ry="20" fill="#F4A0A0" />
      <circle cx="78" cy="80" r="15" fill="white" />
      <circle cx="122" cy="80" r="15" fill="white" />
      <circle cx="80" cy="81" r="9" fill="#1E2D40" />
      <circle cx="124" cy="81" r="9" fill="#1E2D40" />
      <circle cx="83" cy="78" r="3.5" fill="white" />
      <circle cx="127" cy="78" r="3.5" fill="white" />
      <ellipse cx="100" cy="102" rx="13" ry="9" fill="#E88A8A" />
      <circle cx="95" cy="102" r="3.5" fill="#C07070" />
      <circle cx="105" cy="102" r="3.5" fill="#C07070" />
      <path d="M 80 120 Q 100 134 120 120" stroke="#C07070" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M 52 50 Q 64 30 100 26 Q 136 30 148 50" stroke="#333" strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cx="38" cy="200" rx="32" ry="16" fill="#F4A0A0" />
      <ellipse cx="162" cy="200" rx="32" ry="16" fill="#F4A0A0" />
    </svg>
  );
}

function Larry({ size = 100 }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 140 154" fill="none">
      <ellipse cx="70" cy="28" rx="50" ry="8" fill="#5D8A3C" />
      <rect x="40" y="5" width="60" height="25" rx="8" fill="#6AAA48" />
      <rect x="38" y="22" width="64" height="8" fill="#4A7A30" rx="2" />
      <ellipse cx="70" cy="99" rx="52" ry="56" fill="#C4963A" />
      <ellipse cx="70" cy="97" rx="48" ry="52" fill="#D4A645" />
      <circle cx="50" cy="84" r="4" fill="#BA8A30" opacity="0.6" />
      <circle cx="90" cy="74" r="3" fill="#BA8A30" opacity="0.6" />
      <circle cx="60" cy="114" r="5" fill="#BA8A30" opacity="0.6" />
      <circle cx="85" cy="109" r="3" fill="#BA8A30" opacity="0.6" />
      <circle cx="57" cy="87" r="13" fill="white" />
      <circle cx="83" cy="87" r="13" fill="white" />
      <circle cx="59" cy="88" r="7" fill="#1E2D40" />
      <circle cx="85" cy="88" r="7" fill="#1E2D40" />
      <circle cx="61" cy="85" r="2.5" fill="white" />
      <circle cx="87" cy="85" r="2.5" fill="white" />
      <path d="M 52 107 Q 70 121 88 107" stroke="#8A5A10" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <ellipse cx="22" cy="107" rx="16" ry="10" fill="#C4963A" transform="rotate(-20 22 107)" />
      <ellipse cx="118" cy="107" rx="16" ry="10" fill="#C4963A" transform="rotate(20 118 107)" />
      <circle cx="115" cy="97" r="10" fill="#D4A645" />
    </svg>
  );
}

/* ─── Navbar ─── */
function Navbar({ page, setPage, cartCount, cartBump, openCart }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { id: "home", label: "Home" },
    { id: "categories", label: "Categories" },
    { id: "orders", label: "My Orders" },
    { id: "profile", label: "Profile" },
  ];
  return (
    <nav style={{ background: C.white, borderBottom: `2px solid ${C.creamDark}`, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", height: 68, gap: 24 }}>
        {/* Logo */}
        <div onClick={() => setPage("home")} style={{ cursor: "pointer", lineHeight: 1, flexShrink: 0 }}>
          <div style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 21, color: C.teal }}>ELMORE</div>
          <div style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 16, color: C.orange, marginTop: -4 }}>MART 🛍️</div>
        </div>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 4, flex: 1 }} className="d-nav">
          {links.map(l => (
            <button key={l.id} onClick={() => setPage(l.id)} style={{
              background: page === l.id ? C.tealPale : "none", border: "none", cursor: "pointer",
              padding: "8px 16px", borderRadius: 10, fontFamily: "'Nunito',sans-serif",
              fontWeight: 700, fontSize: 14, color: page === l.id ? C.teal : C.textLight,
            }}>{l.label}</button>
          ))}
        </div>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 260, background: C.grayLight, borderRadius: 12, padding: "9px 14px", display: "flex", alignItems: "center", gap: 8 }} className="d-search">
          <span>🔍</span>
          <span style={{ color: C.textLight, fontSize: 13, fontFamily: "'Nunito',sans-serif" }}>Search products...</span>
        </div>

        {/* Cart button */}
        <button onClick={openCart} style={{
          position: "relative", background: C.grayLight, border: `2px solid transparent`,
          borderRadius: 12, padding: "8px 14px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 8, flexShrink: 0,
          transition: "transform .2s",
          transform: cartBump ? "scale(1.18)" : "scale(1)",
        }}>
          <span style={{ fontSize: 20 }}>🛒</span>
          {cartCount > 0 && (
            <span style={{ background: C.coral, color: "white", borderRadius: 10, padding: "1px 8px", fontSize: 12, fontWeight: 800, fontFamily: "'Nunito',sans-serif" }}>{cartCount}</span>
          )}
        </button>

        {/* Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="ham" style={{ display: "none", background: "none", border: "none", fontSize: 26, cursor: "pointer" }}>☰</button>
      </div>

      {menuOpen && (
        <div style={{ background: C.white, padding: "8px 24px 16px", borderTop: `1px solid ${C.creamDark}` }}>
          {links.map(l => (
            <div key={l.id} onClick={() => { setPage(l.id); setMenuOpen(false); }} style={{ padding: "11px 0", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 15, color: page === l.id ? C.teal : C.text, cursor: "pointer", borderBottom: `1px solid ${C.grayLight}` }}>{l.label}</div>
          ))}
        </div>
      )}

      <style>{`
        @media(max-width:768px){.d-nav,.d-search{display:none!important}.ham{display:flex!important}}
      `}</style>
    </nav>
  );
}

/* ─── Cart Drawer (slides from right) ─── */
function CartDrawer({ cart, setCart, open, setOpen, setPage }) {
  const update = (id, d) => setCart(prev => {
    const it = prev.find(i => i.id === id);
    if (!it) return prev;
    if (it.qty + d <= 0) return prev.filter(i => i.id !== id);
    return prev.map(i => i.id === id ? { ...i, qty: i.qty + d } : i);
  });
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <>
      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.38)", zIndex: 200, backdropFilter: "blur(3px)" }} />}
      <div style={{
        position: "fixed", top: 0, right: 0, height: "100vh", width: 400, maxWidth: "100vw",
        background: C.white, zIndex: 201, boxShadow: "-8px 0 40px rgba(0,0,0,.18)",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform .3s cubic-bezier(.4,0,.2,1)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: `2px solid ${C.creamDark}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <h2 style={{ margin: 0, fontFamily: "'Fredoka One',sans-serif", fontSize: 22, color: C.text }}>My Cart 🛒</h2>
          <button onClick={() => setOpen(false)} style={{ background: C.grayLight, border: "none", width: 36, height: 36, borderRadius: "50%", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 60 }}>
              <div style={{ fontSize: 70 }}>🛒</div>
              <p style={{ color: C.textLight, fontFamily: "'Nunito',sans-serif", fontSize: 15, marginTop: 12 }}>Your cart is empty</p>
              <button onClick={() => setOpen(false)} style={{ background: C.teal, color: "white", border: "none", borderRadius: 12, padding: "10px 24px", cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14 }}>Continue Shopping</button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${C.grayLight}` }}>
                <div style={{ width: 60, height: 60, borderRadius: 14, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, flexShrink: 0 }}>{item.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, fontFamily: "'Nunito',sans-serif", color: C.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: C.textLight, fontFamily: "'Nunito',sans-serif" }}>{item.unit}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: C.teal, fontFamily: "'Fredoka One',sans-serif" }}>${item.price.toFixed(2)}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <button onClick={() => update(item.id, -1)} style={{ width: 30, height: 30, borderRadius: 8, border: `2px solid ${C.gray}`, background: "white", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                  <span style={{ fontWeight: 800, fontFamily: "'Nunito',sans-serif", minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => update(item.id, 1)} style={{ width: 30, height: 30, borderRadius: 8, border: `2px solid ${C.teal}`, background: C.tealPale, fontSize: 16, color: C.teal, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer totals */}
        {cart.length > 0 && (
          <div style={{ padding: "16px 24px 28px", borderTop: `2px solid ${C.creamDark}`, flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontFamily: "'Nunito',sans-serif" }}>
              <span style={{ color: C.textLight }}>Subtotal</span><span style={{ fontWeight: 700 }}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, fontFamily: "'Nunito',sans-serif" }}>
              <span style={{ color: C.textLight }}>Delivery</span><span style={{ fontWeight: 700 }}>$2.00</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12, borderTop: `2px solid ${C.creamDark}`, marginBottom: 18 }}>
              <span style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 18 }}>Total</span>
              <span style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 24, color: C.teal }}>${(subtotal + 2).toFixed(2)}</span>
            </div>
            <button onClick={() => { setOpen(false); setPage("checkout"); }} style={{
              width: "100%", padding: "15px", background: `linear-gradient(135deg,${C.teal},${C.tealLight})`,
              color: "white", border: "none", borderRadius: 14, fontSize: 16, fontWeight: 800,
              cursor: "pointer", fontFamily: "'Fredoka One',sans-serif",
            }}>Proceed to Checkout →</button>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Product Card ─── */
function ProductCard({ p, addToCart, setSelected, setPage }) {
  const [flash, setFlash] = useState(false);
  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(p);
    setFlash(true);
    setTimeout(() => setFlash(false), 900);
  };
  return (
    <div onClick={() => { setSelected(p); setPage("product"); }} style={{
      background: C.white, borderRadius: 18, overflow: "hidden", cursor: "pointer",
      boxShadow: "0 2px 12px rgba(0,0,0,.07)", transition: "transform .2s, box-shadow .2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,.12)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,.07)"; }}>
      <div style={{ background: p.bg, height: 120, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52 }}>{p.emoji}</div>
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ fontWeight: 700, fontSize: 13, fontFamily: "'Nunito',sans-serif", color: C.text, marginBottom: 2, lineHeight: 1.3, height: 36, overflow: "hidden" }}>{p.name}</div>
        <div style={{ fontSize: 11, color: C.textLight, fontFamily: "'Nunito',sans-serif", marginBottom: 10 }}>{p.unit}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 17, fontWeight: 900, color: C.teal, fontFamily: "'Fredoka One',sans-serif" }}>${p.price.toFixed(2)}</span>
          <button onClick={handleAdd} style={{
            background: flash ? C.green : `linear-gradient(135deg,${C.teal},${C.tealLight})`,
            border: "none", color: "white", borderRadius: 10, width: 34, height: 34, fontSize: 18,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, transition: "background .3s, transform .15s",
            transform: flash ? "scale(1.25)" : "scale(1)",
          }}>{flash ? "✓" : "+"}</button>
        </div>
      </div>
    </div>
  );
}

/* ─── SPLASH (full-screen hero, no scroll) ─── */
function SplashPage({ setPage }) {
  return (
    <div style={{
      height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      background: `linear-gradient(160deg,${C.cream} 0%,#F0E4C8 100%)`,
      position: "relative", overflow: "hidden", padding: "0 24px",
    }}>
      <div style={{ position: "absolute", top: -120, right: -120, width: 400, height: 400, borderRadius: "50%", background: C.teal, opacity: .06 }} />
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: C.orange, opacity: .1 }} />
      <div style={{ position: "absolute", top: "35%", left: "3%", width: 100, height: 100, borderRadius: "50%", background: C.coral, opacity: .07 }} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, maxWidth: 700, textAlign: "center", position: "relative", zIndex: 1 }}>
        <span style={{ background: C.teal + "1A", color: C.teal, padding: "6px 20px", borderRadius: 30, fontSize: 12, fontWeight: 700, fontFamily: "'Nunito',sans-serif", letterSpacing: 1 }}>🌈 THE AMAZING WORLD OF GUMBALL</span>

        <div>
          <div style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: "clamp(52px,10vw,96px)", color: C.teal, lineHeight: 1, textShadow: `4px 4px 0 ${C.navy}18` }}>ELMORE</div>
          <div style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: "clamp(40px,8vw,76px)", color: C.orange, lineHeight: 1, marginTop: -6, textShadow: `4px 4px 0 ${C.navy}18` }}>MART</div>
          <p style={{ color: C.textLight, fontFamily: "'Nunito',sans-serif", fontSize: 15, margin: "8px 0 0" }}>Fresh from Elmore, Delivered to You!</p>
        </div>

        <div style={{ filter: "drop-shadow(0 16px 24px rgba(0,0,0,.15))" }}>
          <Richard size={180} />
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <button onClick={() => setPage("home")} style={{
            background: `linear-gradient(135deg,${C.teal},${C.tealLight})`, color: "white",
            border: "none", borderRadius: 18, padding: "16px 40px", fontSize: 18,
            fontFamily: "'Fredoka One',sans-serif", cursor: "pointer",
            boxShadow: `0 8px 24px ${C.teal}44`, transition: "transform .15s",
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
            onMouseLeave={e => e.currentTarget.style.transform = ""}>
            Get Started 🚀
          </button>
          <button style={{
            background: "transparent", color: C.teal,
            border: `2.5px solid ${C.teal}`, borderRadius: 18, padding: "16px 32px", fontSize: 18,
            fontFamily: "'Fredoka One',sans-serif", cursor: "pointer", transition: "transform .15s",
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
            onMouseLeave={e => e.currentTarget.style.transform = ""}>
            Login
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, width: "100%", maxWidth: 560 }}>
          {[["🎁", "Best Quality", "Handpicked just for you"], ["🚚", "Fast Delivery", "Larry delivers to you"], ["💰", "Great Prices", "Deals that make you happy"], ["🏪", "From Elmore", "Local store, big heart"]].map(([icon, title, sub]) => (
            <div key={title} style={{ background: "rgba(255,255,255,.75)", backdropFilter: "blur(8px)", borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 24 }}>{icon}</div>
              <div style={{ fontWeight: 800, fontSize: 11, fontFamily: "'Nunito',sans-serif", color: C.text, marginTop: 4 }}>{title}</div>
              <div style={{ fontSize: 10, color: C.textLight, fontFamily: "'Nunito',sans-serif" }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── HOME ─── */
function HomePage({ setPage, addToCart, setSelected }) {
  return (
    <div style={{ background: C.grayLight, minHeight: "calc(100vh - 68px)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px 60px" }}>

        {/* Hero banner */}
        <div style={{ background: `linear-gradient(135deg,${C.orange},#F5C842)`, borderRadius: 24, padding: "28px 32px", marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: `0 6px 24px ${C.orange}44`, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h2 style={{ margin: 0, fontFamily: "'Fredoka One',sans-serif", fontSize: "clamp(20px,4vw,34px)", color: C.navy }}>Super deals from Elmore! 🎉</h2>
            <p style={{ margin: "8px 0 16px", color: C.navy + "aa", fontFamily: "'Nunito',sans-serif", fontSize: 14 }}>Fresh groceries delivered to your door in no time.</p>
            <button onClick={() => setPage("categories")} style={{ background: `linear-gradient(135deg,${C.teal},${C.tealLight})`, color: "white", border: "none", borderRadius: 12, padding: "10px 24px", cursor: "pointer", fontFamily: "'Fredoka One',sans-serif", fontSize: 15 }}>Shop Now</button>
          </div>
          <div style={{ fontSize: 56 }}>🛒 🥦 🍳</div>
        </div>

        {/* Categories */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontFamily: "'Fredoka One',sans-serif", fontSize: 22, color: C.text }}>Shop by Category</h3>
          <span onClick={() => setPage("categories")} style={{ color: C.teal, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontSize: 14 }}>See all →</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(100px,1fr))", gap: 10, marginBottom: 36 }}>
          {CATS.map(cat => (
            <div key={cat.name} onClick={() => setPage("categories")} style={{ background: C.white, borderRadius: 16, padding: "13px 6px", textAlign: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.05)", transition: "transform .15s,box-shadow .15s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,.05)"; }}>
              <div style={{ fontSize: 30, marginBottom: 5 }}>{cat.emoji}</div>
              <div style={{ fontSize: 11, fontWeight: 700, fontFamily: "'Nunito',sans-serif", color: C.text, lineHeight: 1.2 }}>{cat.name.split(" ")[0]}</div>
              <div style={{ fontSize: 10, color: C.textLight, fontFamily: "'Nunito',sans-serif" }}>{cat.count}+</div>
            </div>
          ))}
        </div>

        {/* Products */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h3 style={{ margin: 0, fontFamily: "'Fredoka One',sans-serif", fontSize: 22, color: C.text }}>Best Selling 🔥</h3>
          <span style={{ color: C.teal, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontSize: 14 }}>See all →</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(175px,1fr))", gap: 16 }}>
          {PRODUCTS.map(p => <ProductCard key={p.id} p={p} addToCart={addToCart} setSelected={setSelected} setPage={setPage} />)}
        </div>
      </div>
    </div>
  );
}

/* ─── CATEGORIES ─── */
function CategoriesPage() {
  return (
    <div style={{ background: C.grayLight, minHeight: "calc(100vh - 68px)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        <h2 style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 28, color: C.text, marginBottom: 24 }}>All Categories</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
          {CATS.map(cat => (
            <div key={cat.name} style={{ background: C.white, borderRadius: 20, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 2px 10px rgba(0,0,0,.06)", cursor: "pointer", transition: "transform .15s,box-shadow .15s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 22px rgba(0,0,0,.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,.06)"; }}>
              <div style={{ width: 58, height: 58, borderRadius: 14, background: C.cream, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>{cat.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 15, fontFamily: "'Nunito',sans-serif", color: C.text }}>{cat.name}</div>
                <div style={{ fontSize: 12, color: C.textLight, fontFamily: "'Nunito',sans-serif" }}>{cat.count}+ Items</div>
              </div>
              <span style={{ color: C.textLight, fontSize: 20 }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── PRODUCT DETAIL ─── */
function ProductPage({ product, setPage, addToCart }) {
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("250g");
  const [flash, setFlash] = useState(false);
  if (!product) return null;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setFlash(true);
    setTimeout(() => setFlash(false), 1100);
  };

  return (
    <div style={{ background: C.grayLight, minHeight: "calc(100vh - 68px)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px 60px" }}>
        <button onClick={() => setPage("home")} style={{ background: C.white, border: "none", borderRadius: 12, padding: "8px 18px", cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,.07)" }}>← Back</button>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "start" }} className="pg">
          <div style={{ background: product.bg, borderRadius: 28, height: 380, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 130 }}>{product.emoji}</div>
          <div>
            <span style={{ background: C.tealPale, color: C.teal, padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>{product.cat}</span>
            <h1 style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: "clamp(24px,4vw,36px)", color: C.text, margin: "10px 0 6px" }}>{product.name}</h1>
            <p style={{ color: C.textLight, fontFamily: "'Nunito',sans-serif", lineHeight: 1.7, marginBottom: 20, fontSize: 15 }}>{product.desc} — Made with love and quality ingredients, fresh from Elmore.</p>
            <div style={{ fontSize: 38, fontWeight: 900, color: C.teal, fontFamily: "'Fredoka One',sans-serif", marginBottom: 22 }}>${product.price.toFixed(2)}</div>

            <div style={{ marginBottom: 22 }}>
              <div style={{ fontWeight: 700, fontFamily: "'Nunito',sans-serif", marginBottom: 8 }}>Size</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["250g", "500g", "1kg"].map(s => (
                  <button key={s} onClick={() => setSize(s)} style={{ padding: "8px 18px", borderRadius: 10, border: `2px solid ${s === size ? C.teal : C.gray}`, background: s === size ? C.tealPale : "white", color: s === size ? C.teal : C.text, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif", transition: "all .15s" }}>{s}</button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 26 }}>
              <span style={{ fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>Quantity</span>
              <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.white, borderRadius: 14, padding: "8px 16px", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 32, height: 32, border: `2px solid ${C.gray}`, borderRadius: 8, background: "white", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                <span style={{ fontWeight: 800, fontSize: 18, fontFamily: "'Nunito',sans-serif", minWidth: 24, textAlign: "center" }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 32, height: 32, border: `2px solid ${C.teal}`, borderRadius: 8, background: C.tealPale, fontSize: 18, color: C.teal, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
              </div>
            </div>

            <button onClick={handleAdd} style={{
              background: flash ? `linear-gradient(135deg,${C.green},#5AAA45)` : `linear-gradient(135deg,${C.teal},${C.tealLight})`,
              color: "white", border: "none", borderRadius: 16, padding: "16px 36px",
              fontSize: 17, fontFamily: "'Fredoka One',sans-serif", cursor: "pointer",
              boxShadow: `0 6px 20px ${C.teal}44`, transition: "background .4s, transform .15s",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = ""}>
              {flash ? "✓ Added to Cart!" : "Add to Cart 🛒"}
            </button>
          </div>
        </div>

        {/* Related */}
        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 22, color: C.text, marginBottom: 16 }}>Related Products</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(175px,1fr))", gap: 16 }}>
            {PRODUCTS.filter(p => p.cat === product.cat && p.id !== product.id).slice(0, 4).map(p => <ProductCard key={p.id} p={p} addToCart={addToCart} setSelected={() => { }} setPage={setPage} />)}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:640px){.pg{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}

/* ─── CHECKOUT ─── */
function CheckoutPage({ cart, setPage, setCart }) {
  const [method, setMethod] = useState("cod");
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div style={{ background: C.grayLight, minHeight: "calc(100vh - 68px)" }}>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px 60px" }}>
        <button onClick={() => setPage("home")} style={{ background: C.white, border: "none", borderRadius: 12, padding: "8px 18px", cursor: "pointer", fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,.07)" }}>← Back</button>
        <h2 style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 28, color: C.text, marginBottom: 24 }}>Checkout</h2>

        {[
          {
            title: "📍 Delivery Address", content: (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontWeight: 700, fontFamily: "'Nunito',sans-serif" }}>Elmore House</div>
                  <div style={{ fontSize: 13, color: C.textLight, fontFamily: "'Nunito',sans-serif" }}>123 Cartoon St, Elmore, USA</div>
                </div>
                <span style={{ color: C.teal, fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>Change</span>
              </div>
            )
          },
        ].map(s => (
          <div key={s.title} style={{ background: C.white, borderRadius: 20, padding: 24, marginBottom: 18 }}>
            <div style={{ fontWeight: 700, fontFamily: "'Nunito',sans-serif", marginBottom: 12, fontSize: 15 }}>{s.title}</div>
            {s.content}
          </div>
        ))}

        <div style={{ background: C.white, borderRadius: 20, padding: 24, marginBottom: 18 }}>
          <div style={{ fontWeight: 700, fontFamily: "'Nunito',sans-serif", marginBottom: 14, fontSize: 15 }}>💳 Payment Method</div>
          {[{ id: "cod", label: "Cash on Delivery", icon: "💵" }, { id: "card", label: "Credit / Debit Card", icon: "💳" }, { id: "wallet", label: "Elmore Wallet", icon: "👝" }].map(m => (
            <div key={m.id} onClick={() => setMethod(m.id)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", borderRadius: 14, border: `2px solid ${method === m.id ? C.teal : C.gray}`, marginBottom: 10, cursor: "pointer", background: method === m.id ? C.tealPale : "white", transition: "all .15s" }}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${method === m.id ? C.teal : C.gray}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {method === m.id && <div style={{ width: 9, height: 9, borderRadius: "50%", background: C.teal }} />}
              </div>
              <span style={{ fontFamily: "'Nunito',sans-serif" }}>{m.icon} {m.label}</span>
            </div>
          ))}
        </div>

        <div style={{ background: C.white, borderRadius: 20, padding: 24, marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontFamily: "'Nunito',sans-serif", marginBottom: 14, fontSize: 15 }}>🧾 Order Summary</div>
          {cart.map(i => (
            <div key={i.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontFamily: "'Nunito',sans-serif", fontSize: 14 }}>
              <span>{i.emoji} {i.name} ×{i.qty}</span>
              <span style={{ fontWeight: 700 }}>${(i.price * i.qty).toFixed(2)}</span>
            </div>
          ))}
          <div style={{ borderTop: `2px solid ${C.creamDark}`, paddingTop: 12, marginTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontFamily: "'Nunito',sans-serif" }}><span style={{ color: C.textLight }}>Delivery</span><span style={{ fontWeight: 700 }}>$2.00</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 18 }}>Total</span>
              <span style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 24, color: C.teal }}>${(subtotal + 2).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button onClick={() => { setCart([]); setPage("track"); }} style={{
          width: "100%", padding: 18, background: `linear-gradient(135deg,${C.teal},${C.tealLight})`,
          color: "white", border: "none", borderRadius: 18, fontSize: 18,
          fontFamily: "'Fredoka One',sans-serif", cursor: "pointer",
          boxShadow: `0 8px 24px ${C.teal}44`,
        }}>Place Order ✓</button>
      </div>
    </div>
  );
}

/* ─── TRACK ─── */
function TrackPage({ setPage }) {
  const steps = [
    { label: "Order Confirmed", time: "10:30 AM", done: true },
    { label: "Preparing", time: "10:45 AM", done: true },
    { label: "Out for Delivery", time: "11:30 AM", done: true, active: true },
    { label: "Delivered", time: "2:30 PM", done: false },
  ];
  return (
    <div style={{ background: C.grayLight, minHeight: "calc(100vh - 68px)" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "32px 24px 60px" }}>
        <h2 style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 28, color: C.text, marginBottom: 24 }}>Track Order 📦</h2>
        <div style={{ background: C.white, borderRadius: 20, padding: 22, marginBottom: 18 }}>
          <div style={{ fontSize: 13, color: C.textLight, fontFamily: "'Nunito',sans-serif" }}>Order #EM12345 · Estimated Delivery</div>
          <div style={{ fontWeight: 800, fontSize: 18, fontFamily: "'Fredoka One',sans-serif", marginTop: 4 }}>Today, 2:30 PM – 3:00 PM</div>
        </div>
        <div style={{ background: `linear-gradient(135deg,${C.cream},${C.creamDark})`, borderRadius: 24, padding: "28px 24px", textAlign: "center", marginBottom: 18 }}>
          <Larry size={110} />
          <h3 style={{ margin: "10px 0 4px", fontFamily: "'Fredoka One',sans-serif", fontSize: 22, color: C.teal }}>Larry is on the way! 🥔</h3>
          <p style={{ margin: 0, color: C.textLight, fontFamily: "'Nunito',sans-serif" }}>Your order is being delivered with care.</p>
        </div>
        <div style={{ background: C.white, borderRadius: 20, padding: "24px 28px", marginBottom: 28 }}>
          {steps.map((s, i) => (
            <div key={s.label} style={{ display: "flex", gap: 18 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: s.active ? C.teal : s.done ? C.green : C.gray, border: s.active ? `4px solid ${C.teal}33` : "none", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box", flexShrink: 0 }}>
                  {s.done && !s.active && <span style={{ color: "white", fontSize: 10 }}>✓</span>}
                  {s.active && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "white" }} />}
                </div>
                {i < steps.length - 1 && <div style={{ width: 2, flex: 1, background: s.done ? C.green : C.gray, minHeight: 28, margin: "3px 0" }} />}
              </div>
              <div style={{ paddingBottom: i < steps.length - 1 ? 22 : 0, paddingTop: 2 }}>
                <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Nunito',sans-serif", color: s.active ? C.teal : s.done ? C.text : C.textLight }}>{s.label}</div>
                <div style={{ fontSize: 12, color: C.textLight, fontFamily: "'Nunito',sans-serif" }}>{s.time}</div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => setPage("home")} style={{ background: "transparent", color: C.teal, border: `2.5px solid ${C.teal}`, borderRadius: 14, padding: "12px 28px", cursor: "pointer", fontFamily: "'Fredoka One',sans-serif", fontSize: 15 }}>Back to Home</button>
      </div>
    </div>
  );
}

/* ─── ROOT ─── */
export default function ElmoreMart() {
  const [page, setPage] = useState("splash");
  const [cart, setCart] = useState([]);
  const [selected, setSelected] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartBump, setCartBump] = useState(false);

  const addToCart = (product) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      return ex ? prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...product, qty: 1 }];
    });
    setCartBump(true);
    setCartOpen(true);
    setTimeout(() => setCartBump(false), 400);
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <div style={{ minHeight: "100vh" }}>
        {page !== "splash" && (
          <Navbar page={page} setPage={setPage} cartCount={cartCount} cartBump={cartBump} openCart={() => setCartOpen(true)} />
        )}

        {page === "splash" && <SplashPage setPage={setPage} />}
        {page === "home" && <HomePage setPage={setPage} addToCart={addToCart} setSelected={setSelected} />}
        {page === "categories" && <CategoriesPage />}
        {page === "product" && <ProductPage product={selected} setPage={setPage} addToCart={addToCart} />}
        {page === "checkout" && <CheckoutPage cart={cart} setPage={setPage} setCart={setCart} />}
        {page === "track" && <TrackPage setPage={setPage} />}
        {page === "orders" && (
          <div style={{ background: C.grayLight, minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 80 }}>📋</div>
              <h3 style={{ fontFamily: "'Fredoka One',sans-serif", color: C.teal, fontSize: 26, margin: "12px 0 8px" }}>No Orders Yet</h3>
              <p style={{ color: C.textLight, fontFamily: "'Nunito',sans-serif", marginBottom: 24 }}>Start shopping to see orders here!</p>
              <button onClick={() => setPage("home")} style={{ background: C.teal, color: "white", border: "none", borderRadius: 14, padding: "12px 28px", cursor: "pointer", fontFamily: "'Fredoka One',sans-serif", fontSize: 16 }}>Shop Now 🛒</button>
            </div>
          </div>
        )}
        {page === "profile" && (
          <div style={{ background: C.grayLight, minHeight: "calc(100vh - 68px)" }}>
            <div style={{ background: `linear-gradient(135deg,${C.teal},${C.tealLight})`, padding: "48px 24px 36px", textAlign: "center" }}>
              <div style={{ fontSize: 72 }}>👤</div>
              <h2 style={{ margin: "8px 0 0", color: "white", fontFamily: "'Fredoka One',sans-serif", fontSize: 26 }}>Gumball Watterson</h2>
              <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,.75)", fontFamily: "'Nunito',sans-serif" }}>gumball@elmore.usa</p>
            </div>
            <div style={{ maxWidth: 600, margin: "0 auto", padding: "24px 24px 60px" }}>
              {["My Orders 📋", "Delivery Addresses 📍", "Payment Methods 💳", "Notifications 🔔", "Help & Support ❓", "Logout 🚪"].map(item => (
                <div key={item} style={{ background: C.white, borderRadius: 16, padding: "16px 20px", marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.05)", transition: "transform .15s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateX(4px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = ""}>
                  <span style={{ fontFamily: "'Nunito',sans-serif", fontWeight: 700, color: item.includes("Logout") ? C.coral : C.text }}>{item}</span>
                  <span style={{ color: C.textLight, fontSize: 18 }}>›</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <CartDrawer cart={cart} setCart={setCart} open={cartOpen} setOpen={setCartOpen} setPage={setPage} />
      </div>
    </>
  );
}
