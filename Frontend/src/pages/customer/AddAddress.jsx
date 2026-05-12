import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../constants/theme";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Home, ArrowRight, Plus, Check, Trash2, ChevronLeft } from "lucide-react";

export default function AddAddress() {
  const { user, addAddress, selectAddress, removeAddress } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [newAddress, setNewAddress] = useState("");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const addresses = user?.addresses || [];
  const from = location.state?.from?.pathname || "/home";

  // If user has no addresses, show form by default
  const formVisible = showForm || addresses.length === 0;

  const handleAddNew = (e) => {
    e.preventDefault();
    if (!newAddress.trim()) {
      setError("Please enter your delivery address.");
      return;
    }
    if (addresses.includes(newAddress.trim())) {
      setError("This address already exists.");
      return;
    }
    addAddress(newAddress.trim());
    setNewAddress("");
    setShowForm(false);
    setError("");
    // If this was the first address, navigate forward
    if (addresses.length === 0) {
      navigate(from, { replace: true });
    }
  };

  const handleSelect = (addr) => {
    selectAddress(addr);
    navigate(from, { replace: true });
  };

  const handleRemove = (e, addr) => {
    e.stopPropagation();
    removeAddress(addr);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: `linear-gradient(160deg, ${COLORS.cream} 0%, #F0E4C8 100%)`,
      padding: "24px",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -100, right: -100, width: 350, height: 350, borderRadius: "50%", background: COLORS.teal, opacity: 0.05 }} />
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 280, height: 280, borderRadius: "50%", background: COLORS.orange, opacity: 0.08 }} />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: "100%",
          maxWidth: 500,
          background: COLORS.white,
          borderRadius: 32,
          padding: "44px 40px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.09)",
          position: "relative",
          zIndex: 1,
        }}
        className="auth-card"
      >
        <Link to={from} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: COLORS.textLight, fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 20 }}>
          <ChevronLeft size={18} /> Back
        </Link>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            style={{
              width: 70, height: 70, borderRadius: "50%",
              background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealLight})`,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              marginBottom: 14, boxShadow: `0 10px 24px ${COLORS.teal}44`,
            }}
          >
            <MapPin color="white" size={30} />
          </motion.div>
          <h2 style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: "clamp(20px, 5vw, 26px)", color: COLORS.text, margin: 0 }}>
            {addresses.length > 0 ? "Your Addresses 📍" : "Where should we deliver? 📍"}
          </h2>
          <p style={{ color: COLORS.textLight, fontFamily: "'Nunito',sans-serif", marginTop: 6, fontSize: 14 }}>
            {addresses.length > 0 ? "Select an address or add a new one" : "Add your first delivery address"}
          </p>
        </div>

        {/* Saved Addresses */}
        {addresses.length > 0 && (
          <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
            {addresses.map((addr, i) => {
              const isPrimary = user?.address === addr;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleSelect(addr)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "14px 16px",
                    borderRadius: 16,
                    border: `2px solid ${isPrimary ? COLORS.teal : COLORS.grayLight}`,
                    background: isPrimary ? COLORS.tealPale : COLORS.white,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: isPrimary ? COLORS.teal + "18" : COLORS.grayLight,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, color: isPrimary ? COLORS.teal : COLORS.textLight,
                  }}>
                    {isPrimary ? <Check size={16} /> : <Home size={16} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: "'Nunito',sans-serif", fontWeight: 700,
                      fontSize: 14, color: COLORS.text,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {addr}
                    </div>
                    {isPrimary && (
                      <span style={{
                        fontSize: 11, color: COLORS.teal, fontWeight: 800,
                        fontFamily: "'Nunito',sans-serif",
                      }}>
                        ✓ Selected
                      </span>
                    )}
                  </div>
                  {addresses.length > 1 && (
                    <button
                      onClick={(e) => handleRemove(e, addr)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: COLORS.textLight, padding: 4, flexShrink: 0,
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Add New Button / Form */}
        <AnimatePresence mode="wait">
          {!formVisible ? (
            <motion.button
              key="add-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(true)}
              style={{
                width: "100%", padding: 14,
                background: COLORS.grayLight,
                border: `2px dashed ${COLORS.gray}`,
                borderRadius: 16,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                fontFamily: "'Fredoka One',sans-serif", fontSize: 15,
                color: COLORS.teal, cursor: "pointer",
              }}
            >
              <Plus size={18} /> Add New Address
            </motion.button>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddNew}
              style={{ display: "grid", gap: 14 }}
            >
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 800, marginBottom: 6, color: COLORS.text }}>
                  New Address
                </label>
                <div style={{ position: "relative" }}>
                  <Home style={{ position: "absolute", left: 14, top: 16, color: COLORS.textLight }} size={16} />
                  <textarea
                    rows={2}
                    required
                    autoFocus
                    placeholder="e.g. 123 Cartoon St, Elmore, USA"
                    value={newAddress}
                    onChange={(e) => { setNewAddress(e.target.value); setError(""); }}
                    style={{
                      width: "100%",
                      padding: "12px 12px 12px 40px",
                      borderRadius: 14,
                      border: `2px solid ${error ? COLORS.coral : COLORS.grayLight}`,
                      background: COLORS.grayLight,
                      outline: "none",
                      fontFamily: "'Nunito',sans-serif",
                      fontSize: 14,
                      resize: "none",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) => e.target.style.border = `2px solid ${COLORS.teal}`}
                    onBlur={(e) => e.target.style.border = `2px solid ${error ? COLORS.coral : COLORS.grayLight}`}
                  />
                </div>
                {error && (
                  <p style={{ color: COLORS.coral, fontSize: 12, fontFamily: "'Nunito',sans-serif", marginTop: 4 }}>
                    {error}
                  </p>
                )}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                {addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setError(""); setNewAddress(""); }}
                    style={{
                      padding: "12px 18px", background: COLORS.grayLight,
                      border: "none", borderRadius: 14,
                      fontFamily: "'Fredoka One',sans-serif", fontSize: 14,
                      color: COLORS.text, cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  style={{
                    flex: 1, padding: 12,
                    background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealLight})`,
                    color: "white", border: "none", borderRadius: 14,
                    fontSize: 15, fontFamily: "'Fredoka One',sans-serif",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  Save Address <ArrowRight size={16} />
                </motion.button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
