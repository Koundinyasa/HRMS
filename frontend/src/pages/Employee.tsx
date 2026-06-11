import { useState, useCallback } from "react";

const CAPTCHA_LIST = ["5ZCPWR", "A3BK9X", "M7PQR2", "Z4WVT8", "F6DJNH", "R9YLCS"];

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const MobileIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

interface FormState {
  username: string;
  password: string;
  captchaInput: string;
  rememberMe: boolean;
}

export default function HRMSLogin() {
  const [captchaIdx, setCaptchaIdx] = useState(0);
  const [form, setForm] = useState<FormState>({
    username: "",
    password: "",
    captchaInput: "",
    rememberMe: false,
  });

  const refreshCaptcha = useCallback(() => {
    setCaptchaIdx((prev) => (prev + 1) % CAPTCHA_LIST.length);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSignIn = () => {
    if (form.captchaInput.toUpperCase() !== CAPTCHA_LIST[captchaIdx]) {
      alert("Invalid captcha. Please try again.");
      refreshCaptcha();
      setForm((prev) => ({ ...prev, captchaInput: "" }));
      return;
    }
    alert(`Signing in as: ${form.username}`);
  };

  const handleOtp = () => {
    alert("OTP sign-in flow triggered.");
  };

  return (
    <div style={styles.wrap}>
    <div style={styles.mainRow}>
      {/* LEFT PANEL */}
      <div style={styles.left}>
        <div style={styles.circle1} />
        <div style={styles.circle2} />

        {/* Brand */}
        <div style={styles.brandTop}>
          <div style={styles.brandIcon}>📦</div>
          <span style={styles.brandName}>HRMS</span>
        </div>

        {/* Dashboard card */}
        <div style={styles.dashCard}>
          <div style={styles.dots}>
            {(["#ef4444", "#f59e0b", "#22c55e"] as const).map((c) => (
              <div key={c} style={{ ...styles.dot, background: c }} />
            ))}
          </div>
          <div style={styles.stats}>
            {[
              { val: "248", lbl: "Employees", color: "#3b82f6" },
              { val: "94%", lbl: "Attendance", color: "#8b5cf6" },
              { val: "12", lbl: "On Leave", color: "#22c55e" },
            ].map(({ val, lbl, color }) => (
              <div key={lbl} style={styles.stat}>
                <div style={{ ...styles.statVal, color }}>{val}</div>
                <div style={styles.statLbl}>{lbl}</div>
                <div style={{ ...styles.statBar, background: color }} />
              </div>
            ))}
          </div>
          <div style={styles.bars}>
            {[60, 80, 50, 95, 70, 85, 65].map((h, i) => (
              <div key={i} style={{ ...styles.bar, height: `${h}%` }} />
            ))}
          </div>
        </div>

        {/* Tagline */}
        <div style={styles.tagline}>
          <h2 style={styles.taglineH2}>
            People-first HR,{" "}
            <span style={{ color: "#38bdf8" }}>Powered by KTS</span>
          </h2>
          <p style={styles.taglineP}>
            Manage your workforce, payroll, attendance, and performance — all from one unified platform.
          </p>
        </div>

        {/* Pills */}
        <div style={styles.pills}>
          {["Payroll", "Attendance", "Analytics"].map((label) => (
            <div key={label} style={styles.pill}>
              <div style={styles.pillDot} />
              {label}
            </div>
          ))}
        </div>

        {/* Koundinyasa logo */}
        <div style={styles.kyLogoWrap}>
          <div style={styles.kyPowered}>Powered by</div>
          <div style={styles.kyName}>
            <span style={styles.kyGradientText}>K</span>
            <span style={{ color: "#ffffff" }}>OUNDIN</span>
            <span style={styles.kyGradientText}>Y</span>
            <span style={{ color: "#ffffff" }}>ASA</span>
          </div>
          <div style={styles.kySub}>
            Technology Services{" "}
            <span style={{ color: "#38bdf8" }}>Pvt. Ltd.</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={styles.right}>
        <div style={styles.formBox}>
          <div style={styles.eyebrow}>Welcome Back</div>
          <h1 style={styles.h1}>Sign in to your workspace</h1>
          <p style={styles.sub}>Enter your credentials to access HRMS.</p>

          {/* Username */}
          <div style={styles.field}>
            <label style={styles.label}>Username</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}><UserIcon /></span>
              <input
                style={styles.inp}
                type="text"
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrap}>
              <span style={styles.inputIcon}><LockIcon /></span>
              <input
                style={styles.inp}
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Captcha */}
          <div style={styles.field}>
            <label style={styles.label}>Captcha</label>
            <div style={styles.captchaRow}>
              <div style={styles.captchaBox}>{CAPTCHA_LIST[captchaIdx]}</div>
              <button style={styles.refreshBtn} onClick={refreshCaptcha} type="button">↻</button>
            </div>
            <input
              style={{ ...styles.inp, paddingLeft: "12px" }}
              type="text"
              name="captchaInput"
              placeholder="Enter Captcha"
              value={form.captchaInput}
              onChange={handleChange}
            />
          </div>

          {/* Remember me / Forgot */}
          <div style={styles.rowCheck}>
            <label style={styles.checkLabel}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={form.rememberMe}
                onChange={handleChange}
                style={{ accentColor: "#3b82f6", width: 14, height: 14 }}
              />
              Remember me
            </label>
            <a href="#" style={styles.forgot}>Forgot password?</a>
          </div>

          <button style={styles.btnPrimary} onClick={handleSignIn} type="button">
            Sign In →
          </button>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or continue with</span>
            <div style={styles.dividerLine} />
          </div>

          <button style={styles.btnOtp} onClick={handleOtp} type="button">
            <MobileIcon />
            Sign in with Mobile OTP
          </button>

          <div style={styles.formFooter}>
            <span style={styles.footerBy}>Powered by</span>
            <span style={styles.footerKy}>KOUNDINYASA</span>
            <span style={styles.footerBy}>Technology Services</span>
          </div>
        </div>
      </div>
    </div>

      {/* Rights Bar */}
      <div style={styles.rightsBar}>
        <span>© {new Date().getFullYear()} Koundinyasa Technology Services Pvt. Ltd. All rights reserved.</span>
        <span style={styles.rightsDot}>•</span>
        <span>Unauthorized access is strictly prohibited.</span>
      </div>
    </div>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    boxSizing: "border-box",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  mainRow: {
    display: "flex",
    flex: 1,
  },

  // LEFT
  left: {
    flex: "0 0 52%",
    background: "linear-gradient(145deg, #0f1f3d 0%, #0d2550 40%, #0a1e4a 70%, #061530 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 32px",
    position: "relative",
    overflow: "hidden",
  },
  circle1: {
    position: "absolute",
    width: 460,
    height: 460,
    borderRadius: "50%",
    border: "1px solid rgba(56,189,248,.08)",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  },
  circle2: {
    position: "absolute",
    width: 640,
    height: 640,
    borderRadius: "50%",
    border: "1px solid rgba(56,189,248,.05)",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
  },
  brandTop: {
    position: "absolute",
    top: 28,
    left: 32,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  brandIcon: {
    width: 36,
    height: 36,
    background: "linear-gradient(135deg,#3b82f6,#06b6d4)",
    borderRadius: 9,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
  },
  brandName: {
    color: "#fff",
    fontWeight: 700,
    fontSize: 17,
    letterSpacing: 1,
  },

  // Dashboard card
  dashCard: {
    background: "rgba(255,255,255,.06)",
    border: "1px solid rgba(255,255,255,.1)",
    borderRadius: 14,
    padding: 18,
    width: 300,
    marginBottom: 32,
    backdropFilter: "blur(8px)",
  },
  dots: { display: "flex", gap: 5, marginBottom: 12 },
  dot: { width: 9, height: 9, borderRadius: "50%" },
  stats: { display: "flex", gap: 8, marginBottom: 12 },
  stat: {
    flex: 1,
    background: "rgba(255,255,255,.07)",
    borderRadius: 7,
    padding: "9px 6px",
    textAlign: "center",
  },
  statVal: { fontWeight: 700, fontSize: 14 },
  statLbl: { color: "#94a3b8", fontSize: 8, marginTop: 2 },
  statBar: { height: 2, borderRadius: 1, marginTop: 5, opacity: 0.8 },
  bars: { display: "flex", gap: 5, alignItems: "flex-end", height: 38 },
  bar: {
    flex: 1,
    background: "linear-gradient(to top,#3b82f6,#06b6d4)",
    borderRadius: "3px 3px 0 0",
    opacity: 0.7,
  },

  tagline: { textAlign: "center", marginBottom: 28 },
  taglineH2: { fontSize: 19, fontWeight: 700, color: "#fff", marginBottom: 7 },
  taglineP: {
    color: "#94a3b8",
    fontSize: 12,
    maxWidth: 260,
    lineHeight: 1.6,
    margin: "0 auto",
  },

  pills: { display: "flex", gap: 8 },
  pill: {
    background: "rgba(255,255,255,.08)",
    border: "1px solid rgba(255,255,255,.12)",
    borderRadius: 20,
    padding: "5px 12px",
    color: "#e2e8f0",
    fontSize: 11,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  pillDot: { width: 5, height: 5, borderRadius: "50%", background: "#38bdf8" },

  // Koundinyasa logo
  kyLogoWrap: {
    position: "absolute",
    bottom: 24,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
  },
  kyPowered: { color: "#475569", fontSize: 9, letterSpacing: 1, textTransform: "uppercase" },
  kyName: {
    fontFamily: "'Arial Black', 'Impact', sans-serif",
    fontWeight: 900,
    fontStyle: "italic",
    fontSize: 20,
    lineHeight: 1,
    letterSpacing: -0.5,
  },
  kyGradientText: {
    background: "linear-gradient(135deg,#38bdf8,#2563eb)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  } as React.CSSProperties,
  kySub: {
    fontSize: 8,
    letterSpacing: 2.5,
    color: "#94a3b8",
    fontWeight: 600,
    textTransform: "uppercase",
  },

  // RIGHT
  right: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 32px",
    background: "#fff",
  },
  formBox: { width: "100%", maxWidth: 380 },
  eyebrow: {
    fontSize: 10,
    fontWeight: 600,
    color: "#3b82f6",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 7,
  },
  h1: { fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "0 0 6px", lineHeight: 1.2 },
  sub: { color: "#64748b", fontSize: 13, margin: "0 0 28px" },

  field: { marginBottom: 16 },
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 5 },
  inputWrap: { position: "relative" },
  inputIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    display: "flex",
  },
  inp: {
    width: "100%",
    padding: "10px 12px 10px 38px",
    border: "1.5px solid #e2e8f0",
    borderRadius: 9,
    fontSize: 13,
    color: "#0f172a",
    outline: "none",
    background: "#f8fafc",
    boxSizing: "border-box",
  },

  captchaRow: { display: "flex", gap: 8, alignItems: "center", marginBottom: 8 },
  captchaBox: {
    padding: "9px 16px",
    background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)",
    border: "1.5px solid #bae6fd",
    borderRadius: 9,
    fontFamily: "'Courier New', monospace",
    fontWeight: 800,
    fontSize: 17,
    letterSpacing: 5,
    color: "#0369a1",
    userSelect: "none",
    minWidth: 120,
    textAlign: "center",
  },
  refreshBtn: {
    width: 38,
    height: 38,
    borderRadius: 9,
    border: "1.5px solid #e2e8f0",
    background: "#f8fafc",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    fontSize: 14,
  },

  rowCheck: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  checkLabel: { display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#374151", cursor: "pointer" },
  forgot: { color: "#3b82f6", fontSize: 12, fontWeight: 500, textDecoration: "none" },

  btnPrimary: {
    width: "100%",
    padding: 12,
    background: "linear-gradient(135deg,#3b82f6,#2563eb)",
    color: "#fff",
    border: "none",
    borderRadius: 9,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: 0.5,
    marginBottom: 18,
    boxShadow: "0 4px 14px rgba(59,130,246,.35)",
  },

  divider: { display: "flex", alignItems: "center", gap: 10, marginBottom: 14 },
  dividerLine: { flex: 1, height: 1, background: "#e2e8f0" },
  dividerText: { color: "#94a3b8", fontSize: 11 },

  btnOtp: {
    width: "100%",
    padding: 11,
    background: "#fff",
    color: "#374151",
    border: "1.5px solid #e2e8f0",
    borderRadius: 9,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  formFooter: {
    marginTop: 32,
    paddingTop: 16,
    borderTop: "1px solid #f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  footerBy: { fontSize: 10, color: "#94a3b8" },
  footerKy: {
    fontFamily: "'Arial Black', sans-serif",
    fontWeight: 900,
    fontStyle: "italic",
    fontSize: 12,
    background: "linear-gradient(135deg,#38bdf8,#2563eb)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  } as React.CSSProperties,

  rightsBar: {
    width: "100%",
    background: "#0f1f3d",
    color: "#64748b",
    fontSize: 11,
    textAlign: "center",
    padding: "10px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    letterSpacing: 0.3,
    flexShrink: 0,
  },
  rightsDot: {
    color: "#38bdf8",
    fontSize: 14,
    lineHeight: 1,
  },
};
