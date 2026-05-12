import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../constants/theme";
import { Search, ShoppingCart, Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount, cartBump, setCartOpen } = useCart();
  const { user } = useAuth();
  const location = useLocation();

  const links = [
    { path: "/home", label: "Home" },
    { path: "/categories", label: "Categories" },
    { path: "/orders", label: "My Orders" },
    { path: "/profile", label: "Profile" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{ 
      background: COLORS.white, 
      borderBottom: `2px solid ${COLORS.creamDark}`, 
      position: "sticky", 
      top: 0, 
      zIndex: 100, 
      boxShadow: "0 2px 12px rgba(0,0,0,.06)" 
    }}>
      <div style={{ 
        maxWidth: 1200, 
        margin: "0 auto", 
        padding: "0 24px", 
        display: "flex", 
        alignItems: "center", 
        height: 68, 
        gap: 24 
      }}>
        {/* Logo */}
        <Link to="/home" style={{ cursor: "pointer", lineHeight: 1, flexShrink: 0 }}>
          <div style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 21, color: COLORS.teal }}>ELMORE</div>
          <div style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 16, color: COLORS.orange, marginTop: -4 }}>MART 🛍️</div>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 4, flex: 1 }} className="d-nav">
          {links.map(l => (
            <Link key={l.path} to={l.path} style={{
              background: isActive(l.path) ? COLORS.tealPale : "none", 
              border: "none", 
              padding: "8px 16px", 
              borderRadius: 10, 
              fontFamily: "'Nunito',sans-serif",
              fontWeight: 700, 
              fontSize: 14, 
              color: isActive(l.path) ? COLORS.teal : COLORS.textLight,
              transition: "all 0.2s"
            }}>{l.label}</Link>
          ))}
        </div>

        {/* Search */}
        <div style={{ 
          flex: 1, 
          maxWidth: 260, 
          background: COLORS.grayLight, 
          borderRadius: 12, 
          padding: "9px 14px", 
          display: "flex", 
          alignItems: "center", 
          gap: 8 
        }} className="d-search">
          <Search size={18} color={COLORS.textLight} />
          <input 
            type="text" 
            placeholder="Search products..." 
            style={{ 
              background: "none", 
              border: "none", 
              outline: "none", 
              fontSize: 13, 
              fontFamily: "'Nunito',sans-serif", 
              color: COLORS.text,
              width: "100%"
            }} 
          />
        </div>

        {/* Cart button */}
        <button onClick={() => setCartOpen(true)} style={{
          position: "relative", 
          background: COLORS.grayLight, 
          borderRadius: 12, 
          padding: "8px 14px", 
          display: "flex", 
          alignItems: "center", 
          gap: 8, 
          flexShrink: 0,
          transition: "transform .2s",
          transform: cartBump ? "scale(1.18)" : "scale(1)",
        }}>
          <ShoppingCart size={20} color={COLORS.text} />
          {cartCount > 0 && (
            <span style={{ 
              background: COLORS.coral, 
              color: "white", 
              borderRadius: 10, 
              padding: "1px 8px", 
              fontSize: 12, 
              fontWeight: 800, 
              fontFamily: "'Nunito',sans-serif" 
            }}>{cartCount}</span>
          )}
        </button>

        {/* User Avatar or Login */}
        {user ? (
          <Link to="/profile" style={{ flexShrink: 0 }}>
            <div style={{
              width: 38, height: 38,
              borderRadius: "50%",
              border: `2.5px solid ${COLORS.teal}`,
              overflow: "hidden",
              cursor: "pointer",
              boxShadow: `0 4px 12px ${COLORS.teal}33`,
              background: COLORS.tealPale,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {user.gender ? (
                <img
                  src={`/${user.gender}.png`}
                  alt={user.gender}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 14, color: COLORS.teal, fontWeight: 900 }}>
                  {user.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                </span>
              )}
            </div>
          </Link>
        ) : (
          <Link to="/login" style={{ flexShrink: 0 }}>
            <button style={{
              background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealLight})`,
              color: "white", border: "none", borderRadius: 12,
              padding: "8px 18px", fontFamily: "'Fredoka One',sans-serif",
              fontSize: 14, cursor: "pointer",
              boxShadow: `0 4px 12px ${COLORS.teal}33`,
            }}>Login</button>
          </Link>
        )}
        <button 
          onClick={() => setMenuOpen(!menuOpen)} 
          className="ham" 
          style={{ display: "none", background: "none", border: "none", cursor: "pointer" }}
        >
          {menuOpen ? <X size={26} color={COLORS.text} /> : <Menu size={26} color={COLORS.text} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fade-in" style={{ 
          background: COLORS.white, 
          padding: "8px 24px 16px", 
          borderTop: `1px solid ${COLORS.creamDark}`,
          position: "absolute",
          width: "100%",
          left: 0,
          boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
          zIndex: 10
        }}>
          {links.map(l => (
            <Link 
              key={l.path} 
              to={l.path} 
              onClick={() => setMenuOpen(false)} 
              style={{ 
                display: "block",
                padding: "14px 0", 
                fontFamily: "'Nunito',sans-serif", 
                fontWeight: 700, 
                fontSize: 15, 
                color: isActive(l.path) ? COLORS.teal : COLORS.text, 
                borderBottom: `1px solid ${COLORS.grayLight}` 
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media(max-width:768px){
          .d-nav, .d-search { display:none!important; }
          .ham { display:flex!important; }
        }
      `}</style>
    </nav>
  );
}
