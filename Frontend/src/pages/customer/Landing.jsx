import { Link } from "react-router-dom";
import { COLORS } from "../../constants/theme";
import { motion } from "framer-motion";

export default function Landing() {
  const features = [
    { icon: "🎁", title: "Best Quality", sub: "Handpicked just for you" },
    { icon: "🚚", title: "Fast Delivery", sub: "Larry delivers to you" },
    { icon: "💰", title: "Great Prices", sub: "Deals that make you happy" },
    { icon: "🏪", title: "From Elmore", sub: "Local store, big heart" }
  ];

  return (
    <div style={{
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      background: `linear-gradient(160deg,${COLORS.cream} 0%,#F0E4C8 100%)`,
      position: "relative", 
      overflow: "hidden", 
      padding: "40px 24px",
    }}>
      {/* Background blobs */}
      <div style={{ position: "absolute", top: -120, right: -120, width: 400, height: 400, borderRadius: "50%", background: COLORS.teal, opacity: .06 }} />
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: COLORS.orange, opacity: .1 }} />
      <div style={{ position: "absolute", top: "35%", left: "3%", width: 100, height: 100, borderRadius: "50%", background: COLORS.coral, opacity: .07 }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          gap: "clamp(12px, 4vh, 20px)", 
          maxWidth: 700, 
          textAlign: "center", 
          position: "relative", 
          zIndex: 1 
        }}
      >

        <div>
          <h1 style={{ 
            fontFamily: "'Fredoka One',sans-serif", 
            fontSize: "clamp(52px,10vw,96px)", 
            color: COLORS.teal, 
            lineHeight: 1, 
            textShadow: `4px 4px 0 ${COLORS.navy}18` 
          }}>ELMORE</h1>
          <h1 style={{ 
            fontFamily: "'Fredoka One',sans-serif", 
            fontSize: "clamp(40px,8vw,76px)", 
            color: COLORS.orange, 
            lineHeight: 1, 
            marginTop: -6, 
            textShadow: `4px 4px 0 ${COLORS.navy}18` 
          }}>MART</h1>
          <p style={{ 
            margin: "10px 0 0",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: `linear-gradient(135deg, ${COLORS.orange}22, ${COLORS.teal}22)`,
            border: `1.5px solid ${COLORS.teal}44`,
            borderRadius: 30,
            padding: "8px 20px",
            fontFamily: "'Fredoka One',sans-serif",
            fontSize: 16,
            color: COLORS.teal,
            letterSpacing: 0.5
          }}>
            🚀 Fresh from Elmore &nbsp;·&nbsp; Delivered to You!
          </p>
        </div>

        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 16px 24px rgba(0,0,0,.15))", marginTop: 8 }}
        >
          <img 
            src="/landing.png" 
            alt="Elmore Mart" 
            className="hero-img"
            style={{ width: "100%", maxWidth: 240, height: "auto", objectFit: "contain" }} 
          />
        </motion.div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", width: "100%", maxWidth: 500 }}>
          <Link to="/home" style={{ flex: "1 1 140px" }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: "100%",
                background: `linear-gradient(135deg,${COLORS.teal},${COLORS.tealLight})`, 
                color: "white",
                border: "none", 
                borderRadius: 18, 
                padding: "16px 20px", 
                fontSize: 18,
                fontFamily: "'Fredoka One',sans-serif", 
                cursor: "pointer",
                boxShadow: `0 8px 24px ${COLORS.teal}44`,
              }}
            >
              Shop Now 🛍️
            </motion.button>
          </Link>
          <Link to="/register" style={{ flex: "1 1 140px" }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: "100%",
                background: "white", 
                color: COLORS.teal,
                border: `3.5px solid ${COLORS.teal}`, 
                borderRadius: 18, 
                padding: "13px 20px", 
                fontSize: 18,
                fontFamily: "'Fredoka One',sans-serif", 
                cursor: "pointer",
                boxShadow: "0 8px 16px rgba(0,0,0,0.05)"
              }}
            >
              Join Us 👋
            </motion.button>
          </Link>
        </div>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(4,1fr)", 
          gap: 12, 
          width: "100%", 
          maxWidth: 600,
          marginTop: 10
        }} className="landing-features">
          {features.map((f, i) => (
            <motion.div 
              key={f.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              style={{ 
                background: "rgba(255,255,255,.75)", 
                backdropFilter: "blur(8px)", 
                borderRadius: 14, 
                padding: "12px 8px", 
                textAlign: "center" 
              }}
            >
              <div style={{ fontSize: 24 }}>{f.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 12, fontFamily: "'Nunito',sans-serif", color: COLORS.text, marginTop: 4 }}>{f.title}</div>
              <div style={{ fontSize: 11, color: COLORS.textLight, fontFamily: "'Nunito',sans-serif" }}>{f.sub}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
