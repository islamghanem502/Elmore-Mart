import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../constants/theme";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, ChevronLeft } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Where to go after login (defaults to /checkout if coming from cart flow)
  const from = location.state?.from?.pathname || "/home";

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      login(data); // Save user + token to context & localStorage
      // Post-auth check: does user have an address?
      if (!data.address) {
        navigate("/add-address", { state: { from: location.state?.from || { pathname: "/home" } }, replace: true });
      } else {
        navigate(from, { replace: true });
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ email, password });
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
      <div style={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, borderRadius: "50%", background: COLORS.teal, opacity: 0.05 }} />
      <div style={{ position: "absolute", bottom: -50, left: -50, width: 250, height: 250, borderRadius: "50%", background: COLORS.orange, opacity: 0.08 }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: "100%",
          maxWidth: 450,
          background: COLORS.white,
          borderRadius: 32,
          padding: "40px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          position: "relative",
          zIndex: 1,
        }}
        className="auth-card"
      >
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: COLORS.textLight, fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 20 }}>
          <ChevronLeft size={18} /> Back
        </Link>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'Fredoka One',sans-serif", fontSize: "clamp(24px, 6vw, 32px)", color: COLORS.teal, margin: 0 }}>Welcome Back!</h2>
          <p style={{ color: COLORS.textLight, fontFamily: "'Nunito',sans-serif", marginTop: 8 }}>Ready for more Elmore treats? 🍭</p>
        </div>

        {/* Error Banner */}
        {mutation.isError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "#FFF0F0",
              border: `2px solid ${COLORS.coral}`,
              borderRadius: 14,
              padding: "12px 16px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "'Nunito',sans-serif",
              fontSize: 14,
              color: COLORS.coral,
              fontWeight: 700,
            }}
          >
            <AlertCircle size={18} />
            {mutation.error?.response?.data?.message || "Login failed. Please try again."}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 14, fontWeight: 800, marginBottom: 8, color: COLORS.text }}>Email Address</label>
            <div style={{ position: "relative" }}>
              <Mail style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: COLORS.textLight }} size={18} />
              <input
                type="email"
                required
                placeholder="gumball@elmore.usa"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 14px 14px 44px",
                  borderRadius: 16,
                  border: `2px solid ${COLORS.grayLight}`,
                  background: COLORS.grayLight,
                  outline: "none",
                  fontFamily: "'Nunito',sans-serif",
                  fontSize: 15,
                  boxSizing: "border-box",
                }}
                onFocus={(e) => e.target.style.border = `2px solid ${COLORS.teal}`}
                onBlur={(e) => e.target.style.border = `2px solid ${COLORS.grayLight}`}
              />
            </div>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 800, color: COLORS.text }}>Password</label>
              <Link to="/" style={{ fontSize: 13, fontWeight: 700, color: COLORS.teal }}>Forgot?</Link>
            </div>
            <div style={{ position: "relative" }}>
              <Lock style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: COLORS.textLight }} size={18} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 44px 14px 44px",
                  borderRadius: 16,
                  border: `2px solid ${COLORS.grayLight}`,
                  background: COLORS.grayLight,
                  outline: "none",
                  fontFamily: "'Nunito',sans-serif",
                  fontSize: 15,
                  boxSizing: "border-box",
                }}
                onFocus={(e) => e.target.style.border = `2px solid ${COLORS.teal}`}
                onBlur={(e) => e.target.style.border = `2px solid ${COLORS.grayLight}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: COLORS.textLight, background: "none", border: "none", cursor: "pointer" }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={mutation.isPending}
            style={{
              marginTop: 10,
              padding: 16,
              background: mutation.isPending
                ? COLORS.textLight
                : `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealLight})`,
              color: "white",
              border: "none",
              borderRadius: 16,
              fontSize: 18,
              fontWeight: 800,
              fontFamily: "'Fredoka One',sans-serif",
              cursor: mutation.isPending ? "not-allowed" : "pointer",
              boxShadow: `0 8px 20px ${COLORS.teal}33`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            {mutation.isPending ? "Logging in..." : <> Login to Elmore <ArrowRight size={20} /> </>}
          </motion.button>
        </form>

        <p style={{ textAlign: "center", marginTop: 32, fontSize: 14, color: COLORS.textLight, fontFamily: "'Nunito',sans-serif" }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            state={location.state}
            style={{ color: COLORS.teal, fontWeight: 800 }}
          >
            Sign up here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
