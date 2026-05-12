import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../constants/theme";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, ChevronLeft } from "lucide-react";

export default function Register() {
  const [step, setStep] = useState(1); // 1 = gender, 2 = form
  const [gender, setGender] = useState(null); // "male" | "female"
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [validationError, setValidationError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      login({ ...data, gender });
      navigate("/add-address", {
        state: { from: location.state?.from || { pathname: "/checkout" } },
        replace: true,
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");
    if (formData.password !== formData.confirmPassword) {
      setValidationError("Passwords do not match!");
      return;
    }
    if (formData.password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }
    mutation.mutate({ name: formData.name, email: formData.email, password: formData.password, gender });
  };

  const errorMessage =
    validationError ||
    (mutation.isError && (mutation.error?.response?.data?.message || "Registration failed. Please try again."));

  const title = gender === "male" ? "Mr." : gender === "female" ? "Ms." : "";

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
      {/* Background blobs */}
      <div style={{ position: "absolute", top: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: COLORS.orange, opacity: 0.06 }} />
      <div style={{ position: "absolute", bottom: -100, right: -100, width: 350, height: 350, borderRadius: "50%", background: COLORS.teal, opacity: 0.05 }} />

      <AnimatePresence mode="wait">

        {/* ── STEP 1: Gender Selection ── */}
        {step === 1 && (
          <motion.div
            key="gender-step"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -60 }}
            style={{
              width: "100%", maxWidth: 520,
              background: COLORS.white, borderRadius: 32,
              padding: "44px 40px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
              position: "relative", zIndex: 1,
            }}
            className="auth-card"
          >
            <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: COLORS.textLight, fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 20 }}>
              <ChevronLeft size={18} /> Back
            </Link>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <h2 style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: "clamp(24px, 6vw, 32px)", color: COLORS.teal, margin: 0 }}>
                Welcome to Elmore Mart! 🛍️
              </h2>
              <p style={{ color: COLORS.textLight, fontFamily: "'Nunito',sans-serif", marginTop: 10, fontSize: 16 }}>
                Let's start by getting to know you better.<br />How should we address you?
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
              {/* Mr. Card */}
              <motion.button
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setGender("male")}
                style={{
                  border: `3px solid ${gender === "male" ? COLORS.teal : COLORS.grayLight}`,
                  borderRadius: 24,
                  background: gender === "male" ? COLORS.tealPale : COLORS.white,
                  padding: "24px 16px",
                  cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                  transition: "all 0.2s",
                  boxShadow: gender === "male" ? `0 8px 24px ${COLORS.teal}22` : "0 2px 8px rgba(0,0,0,0.05)",
                  position: "relative", overflow: "hidden",
                }}
              >
                {gender === "male" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      position: "absolute", top: 12, right: 12,
                      width: 22, height: 22, borderRadius: "50%",
                      background: COLORS.teal, display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: 12, color: "white", fontWeight: 900,
                    }}
                  >✓</motion.div>
                )}
                <img
                  src="/male.png"
                  alt="Male"
                  style={{ width: "clamp(60px, 20vw, 100px)", height: "clamp(60px, 20vw, 100px)", objectFit: "contain", borderRadius: 16 }}
                />
                <div style={{
                  fontFamily: "'Fredoka One',sans-serif",
                  fontSize: 26, color: gender === "male" ? COLORS.teal : COLORS.text,
                }}>
                  Mr.
                </div>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: COLORS.textLight, fontWeight: 700 }}>
                  Gentleman
                </div>
              </motion.button>

              {/* Ms. Card */}
              <motion.button
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setGender("female")}
                style={{
                  border: `3px solid ${gender === "female" ? COLORS.orange : COLORS.grayLight}`,
                  borderRadius: 24,
                  background: gender === "female" ? "#FFF7EE" : COLORS.white,
                  padding: "24px 16px",
                  cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                  transition: "all 0.2s",
                  boxShadow: gender === "female" ? `0 8px 24px ${COLORS.orange}22` : "0 2px 8px rgba(0,0,0,0.05)",
                  position: "relative", overflow: "hidden",
                }}
              >
                {gender === "female" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      position: "absolute", top: 12, right: 12,
                      width: 22, height: 22, borderRadius: "50%",
                      background: COLORS.orange, display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: 12, color: "white", fontWeight: 900,
                    }}
                  >✓</motion.div>
                )}
                <img
                  src="/female.png"
                  alt="Female"
                  style={{ width: "clamp(60px, 20vw, 100px)", height: "clamp(60px, 20vw, 100px)", objectFit: "contain", borderRadius: 16 }}
                />
                <div style={{
                  fontFamily: "'Fredoka One',sans-serif",
                  fontSize: 26, color: gender === "female" ? COLORS.orange : COLORS.text,
                }}>
                  Ms.
                </div>
                <div style={{ fontFamily: "'Nunito',sans-serif", fontSize: 13, color: COLORS.textLight, fontWeight: 700 }}>
                  Lady
                </div>
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: gender ? 1.02 : 1, y: gender ? -2 : 0 }}
              whileTap={{ scale: gender ? 0.98 : 1 }}
              onClick={() => gender && setStep(2)}
              style={{
                width: "100%", padding: 16,
                background: gender
                  ? (gender === "male"
                    ? `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealLight})`
                    : `linear-gradient(135deg, ${COLORS.orange}, #F5C842)`)
                  : COLORS.grayLight,
                color: gender ? (gender === "male" ? "white" : COLORS.navy) : COLORS.textLight,
                border: "none", borderRadius: 16, fontSize: 18, fontWeight: 800,
                fontFamily: "'Fredoka One',sans-serif",
                cursor: gender ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                transition: "all 0.3s",
                boxShadow: gender ? `0 8px 20px rgba(0,0,0,0.15)` : "none",
              }}
            >
              {gender ? `Continue as ${gender === "male" ? "Mr." : "Ms."} ` : "Select one to continue"}
              {gender && <ArrowRight size={20} />}
            </motion.button>

            <p style={{ textAlign: "center", marginTop: 28, fontSize: 14, color: COLORS.textLight, fontFamily: "'Nunito',sans-serif" }}>
              Already have an account?{" "}
              <Link to="/login" state={location.state} style={{ color: COLORS.teal, fontWeight: 800 }}>
                Login here
              </Link>
            </p>
          </motion.div>
        )}

        {/* ── STEP 2: Account Details ── */}
        {step === 2 && (
          <motion.div
            key="form-step"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            style={{
              width: "100%", maxWidth: 500,
              background: COLORS.white, borderRadius: 32,
              padding: "40px", boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
              position: "relative", zIndex: 1,
            }}
            className="auth-card"
          >
            {/* Header with avatar preview */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                style={{ marginBottom: 12, display: "inline-block", position: "relative" }}
              >
                <img
                  src={`/${gender}.png`}
                  alt={gender}
                  style={{ width: "clamp(60px, 18vw, 90px)", height: "clamp(60px, 18vw, 90px)", objectFit: "contain", borderRadius: "50%", border: `4px solid ${gender === "male" ? COLORS.teal : COLORS.orange}`, background: gender === "male" ? COLORS.tealPale : "#FFF7EE" }}
                />
                <div style={{
                  position: "absolute", bottom: 0, right: 0,
                  background: gender === "male" ? COLORS.teal : COLORS.orange,
                  color: "white", borderRadius: 10, padding: "2px 8px",
                  fontFamily: "'Fredoka One',sans-serif", fontSize: 12,
                  border: "2px solid white",
                }}>
                  {gender === "male" ? "Mr." : "Ms."}
                </div>
              </motion.div>
              <h2 style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: 28, color: COLORS.teal, margin: 0 }}>
                Join Elmore Mart!
              </h2>
              <p style={{ color: COLORS.textLight, fontFamily: "'Nunito',sans-serif", marginTop: 6, fontSize: 14 }}>
                Welcome {title} — fill in your details below ✨
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: "#FFF0F0", border: `2px solid ${COLORS.coral}`, borderRadius: 14, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10, fontFamily: "'Nunito',sans-serif", fontSize: 14, color: COLORS.coral, fontWeight: 700 }}
              >
                <AlertCircle size={18} />{errorMessage}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
              {/* Full Name */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 800, marginBottom: 6, color: COLORS.text }}>Full Name</label>
                <div style={{ position: "relative" }}>
                  <User style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: COLORS.textLight }} size={16} />
                  <input
                    type="text" required placeholder={gender === "male" ? "e.g. Gumball Watterson" : "e.g. Anais Watterson"}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: "100%", padding: "12px 12px 12px 40px", borderRadius: 14, border: `2px solid ${COLORS.grayLight}`, background: COLORS.grayLight, outline: "none", fontFamily: "'Nunito',sans-serif", fontSize: 14, boxSizing: "border-box" }}
                    onFocus={(e) => e.target.style.border = `2px solid ${COLORS.teal}`}
                    onBlur={(e) => e.target.style.border = `2px solid ${COLORS.grayLight}`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 800, marginBottom: 6, color: COLORS.text }}>Email Address</label>
                <div style={{ position: "relative" }}>
                  <Mail style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: COLORS.textLight }} size={16} />
                  <input
                    type="email" required placeholder="gumball@elmore.usa"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: "100%", padding: "12px 12px 12px 40px", borderRadius: 14, border: `2px solid ${COLORS.grayLight}`, background: COLORS.grayLight, outline: "none", fontFamily: "'Nunito',sans-serif", fontSize: 14, boxSizing: "border-box" }}
                    onFocus={(e) => e.target.style.border = `2px solid ${COLORS.teal}`}
                    onBlur={(e) => e.target.style.border = `2px solid ${COLORS.grayLight}`}
                  />
                </div>
              </div>

              {/* Passwords */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} className="pw-grid">
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 800, marginBottom: 6, color: COLORS.text }}>Password</label>
                  <div style={{ position: "relative" }}>
                    <Lock style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: COLORS.textLight }} size={16} />
                    <input
                      type="password" required placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      style={{ width: "100%", padding: "12px 12px 12px 40px", borderRadius: 14, border: `2px solid ${COLORS.grayLight}`, background: COLORS.grayLight, outline: "none", fontFamily: "'Nunito',sans-serif", fontSize: 14, boxSizing: "border-box" }}
                      onFocus={(e) => e.target.style.border = `2px solid ${COLORS.teal}`}
                      onBlur={(e) => e.target.style.border = `2px solid ${COLORS.grayLight}`}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 800, marginBottom: 6, color: COLORS.text }}>Confirm</label>
                  <div style={{ position: "relative" }}>
                    <ShieldCheck style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: COLORS.textLight }} size={16} />
                    <input
                      type="password" required placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      style={{ width: "100%", padding: "12px 12px 12px 40px", borderRadius: 14, border: `2px solid ${COLORS.grayLight}`, background: COLORS.grayLight, outline: "none", fontFamily: "'Nunito',sans-serif", fontSize: 14, boxSizing: "border-box" }}
                      onFocus={(e) => e.target.style.border = `2px solid ${COLORS.teal}`}
                      onBlur={(e) => e.target.style.border = `2px solid ${COLORS.grayLight}`}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <input type="checkbox" required id="terms" />
                <label htmlFor="terms" style={{ fontSize: 12, color: COLORS.textLight, fontWeight: 600 }}>
                  I agree to the <span style={{ color: COLORS.teal }}>Terms & Conditions</span>
                </label>
              </div>

              {/* Buttons row */}
              <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                {/* Back button */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(1)}
                  style={{
                    padding: "14px 20px", background: COLORS.grayLight,
                    color: COLORS.text, border: "none", borderRadius: 16,
                    fontSize: 15, fontWeight: 800, fontFamily: "'Fredoka One',sans-serif",
                    cursor: "pointer", flexShrink: 0,
                  }}
                >
                  ← Back
                </motion.button>

                {/* Submit */}
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={mutation.isPending}
                  style={{
                    flex: 1, padding: 14,
                    background: mutation.isPending
                      ? COLORS.textLight
                      : gender === "male"
                        ? `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealLight})`
                        : `linear-gradient(135deg, ${COLORS.orange}, #F5C842)`,
                    color: gender === "female" ? COLORS.navy : "white",
                    border: "none", borderRadius: 16, fontSize: 17, fontWeight: 800,
                    fontFamily: "'Fredoka One',sans-serif",
                    cursor: mutation.isPending ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  {mutation.isPending ? "Creating account..." : <> Create Account <ArrowRight size={18} /> </>}
                </motion.button>
              </div>
            </form>

            <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: COLORS.textLight, fontFamily: "'Nunito',sans-serif" }}>
              Already have an account?{" "}
              <Link to="/login" state={location.state} style={{ color: COLORS.teal, fontWeight: 800 }}>Login here</Link>
            </p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
