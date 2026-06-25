import { useState, useRef, useEffect } from "react";

// ── DESIGN TOKENS ──────────────────────────────────────────────────────────
const C = {
  navy: "#0B1F3A",
  navyLight: "#122848",
  teal: "#00B5A3",
  tealDark: "#008F80",
  tealGlow: "rgba(0,181,163,0.18)",
  sky: "#5BB8D4",
  white: "#F4F9FC",
  offwhite: "#E8F2F7",
  muted: "#8AAFC4",
  danger: "#E05C5C",
  warn: "#F5A623",
  success: "#27C480",
  card: "rgba(255,255,255,0.05)",
  cardBorder: "rgba(255,255,255,0.10)",
};

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');`;

// ── GLOBAL STYLES ──────────────────────────────────────────────────────────
const GlobalStyle = () => (
  <style>{`
    ${fonts}
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; width: 100%; }
    body {
      font-family: 'DM Sans', sans-serif;
      background: ${C.navy};
      color: ${C.white};
      -webkit-font-smoothing: antialiased;
      overflow: hidden;
    }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${C.teal}44; border-radius: 2px; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; } to { opacity: 1; }
    }
    @keyframes pulse {
      0%,100% { box-shadow: 0 0 0 0 ${C.teal}55; }
      50%      { box-shadow: 0 0 0 14px ${C.teal}00; }
    }
    @keyframes spin {
      from { transform: rotate(0deg); } to { transform: rotate(360deg); }
    }
    @keyframes breathe {
      0%,100% { transform: scale(1); opacity: 0.7; }
      50%      { transform: scale(1.12); opacity: 1; }
    }
    @keyframes scoreGrow {
      from { stroke-dashoffset: 283; }
    }
    .fadeUp { animation: fadeUp 0.5s ease forwards; }
    .fadeIn { animation: fadeIn 0.4s ease forwards; }

    button { cursor: pointer; border: none; outline: none; font-family: inherit; }
    input  { font-family: inherit; outline: none; border: none; }
  `}</style>
);

// ── SHARED COMPONENTS ──────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant = "primary", style = {}, disabled }) => {
  const base = {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "14px 28px", borderRadius: 14, fontSize: 15, fontWeight: 600,
    fontFamily: "'Syne', sans-serif", letterSpacing: 0.3,
    transition: "all 0.2s", cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
  };
  const variants = {
    primary: { background: `linear-gradient(135deg, ${C.teal}, ${C.tealDark})`, color: C.navy, boxShadow: `0 4px 20px ${C.teal}40` },
    outline: { background: "transparent", color: C.teal, border: `1.5px solid ${C.teal}`, boxShadow: "none" },
    ghost:   { background: C.card, color: C.white, border: `1px solid ${C.cardBorder}`, boxShadow: "none" },
    danger:  { background: C.danger, color: C.white, boxShadow: `0 4px 16px ${C.danger}40` },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
};

const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{
    background: C.card, border: `1px solid ${C.cardBorder}`,
    borderRadius: 20, padding: 20, backdropFilter: "blur(12px)",
    cursor: onClick ? "pointer" : "default",
    transition: "all 0.2s", ...style,
  }}>
    {children}
  </div>
);

const Tag = ({ children, color = C.teal }) => (
  <span style={{
    background: `${color}22`, color, border: `1px solid ${color}44`,
    borderRadius: 8, padding: "3px 10px", fontSize: 11, fontWeight: 600,
    fontFamily: "'Syne', sans-serif", letterSpacing: 0.5, textTransform: "uppercase",
  }}>{children}</span>
);

const ScoreRing = ({ score, size = 120, stroke = 10 }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 90 ? C.success : score >= 70 ? C.warn : C.danger;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={`${color}22`} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1.2s ease" }}
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        style={{ fill: color, fontSize: size * 0.22, fontWeight: 700, fontFamily: "'Syne',sans-serif",
          transform: "rotate(90deg)", transformOrigin: "center" }}>
        {score}%
      </text>
    </svg>
  );
};

const BottomNav = ({ active, onNav, role }) => {
  const patientItems = [
    { id: "home",      icon: "⌂",  label: "Início" },
    { id: "tutorial",  icon: "◎",  label: "Técnica" },
    { id: "records",   icon: "📋", label: "Registros" },
    { id: "report",    icon: "📊", label: "Relatório" },
    { id: "profile",   icon: "◉",  label: "Perfil" },
  ];
  const doctorItems = [
    { id: "doc-home",     icon: "⌂",  label: "Início" },
    { id: "doc-patients", icon: "👥", label: "Pacientes" },
    { id: "doc-reports",  icon: "📊", label: "Relatórios" },
    { id: "profile",      icon: "◉",  label: "Perfil" },
  ];
  const items = role === "doctor" ? doctorItems : patientItems;
  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430,
      background: `${C.navyLight}ee`, backdropFilter: "blur(20px)",
      borderTop: `1px solid ${C.cardBorder}`,
      display: "flex", justifyContent: "space-around", alignItems: "center",
      padding: "10px 0 20px", zIndex: 100,
    }}>
      {items.map(it => (
        <button key={it.id} onClick={() => onNav(it.id)} style={{
          background: "none", display: "flex", flexDirection: "column",
          alignItems: "center", gap: 4, padding: "4px 12px",
          color: active === it.id ? C.teal : C.muted,
          transition: "color 0.2s",
        }}>
          <span style={{ fontSize: 20 }}>{it.icon}</span>
          <span style={{ fontSize: 10, fontWeight: 600, fontFamily: "'Syne',sans-serif", letterSpacing: 0.4 }}>{it.label}</span>
        </button>
      ))}
    </div>
  );
};

const Screen = ({ children, style = {} }) => (
  <div style={{ height: "100%", overflowY: "auto", overflowX: "hidden", paddingBottom: 90, ...style }}>
    {children}
  </div>
);

const Header = ({ title, subtitle, back, onBack }) => (
  <div style={{ padding: "56px 24px 20px", position: "relative" }}>
    {back && (
      <button onClick={onBack} style={{
        background: C.card, border: `1px solid ${C.cardBorder}`,
        borderRadius: 12, padding: "8px 14px", color: C.white,
        fontSize: 13, fontWeight: 500, marginBottom: 16,
        display: "flex", alignItems: "center", gap: 6,
      }}>← {back}</button>
    )}
    {subtitle && <div style={{ color: C.teal, fontSize: 11, fontWeight: 700, fontFamily: "'Syne',sans-serif", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>{subtitle}</div>}
    <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 26, fontWeight: 800, lineHeight: 1.2 }}>{title}</h1>
  </div>
);

// ── DATA ───────────────────────────────────────────────────────────────────
const MOCK_SESSIONS = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000),
  morning: Math.random() > 0.15 ? Math.floor(60 + Math.random() * 40) : null,
  evening: Math.random() > 0.20 ? Math.floor(55 + Math.random() * 45) : null,
  rescue: Math.random() > 0.8 ? ["Broncodilatador de resgate", "Corticoide oral", "Outro"][Math.floor(Math.random() * 3)] : null,
}));

const AVG_SCORE = Math.round(
  MOCK_SESSIONS.reduce((a, s) => {
    const scores = [s.morning, s.evening].filter(Boolean);
    return a + (scores.length ? scores.reduce((x, y) => x + y, 0) / scores.length : 0);
  }, 0) / 30
);

const ADHERENCE = Math.round(MOCK_SESSIONS.filter(s => s.morning || s.evening).length / 30 * 100);

// Generic inhaler tutorial steps — device-agnostic
const TUTORIAL_STEPS = [
  {
    title: "Prepare o dispositivo",
    desc: "Verifique se o dispositivo está pronto para uso conforme indicado na bula. Mantenha-o na posição correta indicada pelo fabricante.",
    icon: "💊",
    action: "Posicione o dispositivo em frente à câmera",
  },
  {
    title: "Expire completamente",
    desc: "Afaste o bocal da boca. Expire lentamente todo o ar dos pulmões. Nunca expire dentro do dispositivo.",
    icon: "💨",
    action: "Faça uma expiração lenta e profunda",
  },
  {
    title: "Posicione o bocal",
    desc: "Coloque o bocal entre os lábios, vedando completamente com a boca. Não bloqueie a abertura com a língua.",
    icon: "👄",
    action: "Aproxime o bocal da boca e vede os lábios",
  },
  {
    title: "Inspire profundamente",
    desc: "Active o dispositivo conforme indicado e inspire de forma forte e profunda pela boca ao mesmo tempo.",
    icon: "🫁",
    action: "Inspire de forma firme e profunda",
  },
  {
    title: "Segure o ar",
    desc: "Retire o bocal e segure o ar por 10 segundos se possível, ou pelo tempo que conseguir. Depois expire lentamente.",
    icon: "⏱",
    action: "Segure o ar — conte até 10",
  },
];

const MOCK_PATIENTS = [
  { id: 1, name: "Maria Aparecida S.", age: 67, score: 78, adherence: 83, lastUse: "Hoje, 08:14", device: "Inalador A" },
  { id: 2, name: "José Carlos M.",     age: 72, score: 91, adherence: 97, lastUse: "Hoje, 07:52", device: "Inalador B" },
  { id: 3, name: "Ana Lucia F.",       age: 58, score: 54, adherence: 61, lastUse: "Ontem, 21:30", device: "Inalador A" },
  { id: 4, name: "Roberto P.",         age: 64, score: 88, adherence: 90, lastUse: "Hoje, 09:01", device: "Inalador C" },
];

// ── SCREENS ────────────────────────────────────────────────────────────────

// SPLASH
const SplashScreen = ({ onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: `radial-gradient(ellipse at 50% 30%, ${C.teal}22 0%, ${C.navy} 70%)`,
    }}>
      <div style={{ animation: "breathe 2s ease infinite" }}>
        <div style={{
          width: 100, height: 100, borderRadius: 28,
          background: `linear-gradient(135deg, ${C.teal}, ${C.sky})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 48, boxShadow: `0 0 60px ${C.teal}55`,
        }}>🫁</div>
      </div>
      <div style={{ marginTop: 28, textAlign: "center" }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800, letterSpacing: -0.5 }}>
          Inhaler<span style={{ color: C.teal }}>Guide</span>
        </div>
        <div style={{ color: C.muted, fontSize: 14, marginTop: 6, fontWeight: 300 }}>
          Técnica correta. Tratamento eficaz.
        </div>
      </div>
      <div style={{ marginTop: 48, display: "flex", gap: 6 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: i === 1 ? 24 : 8, height: 8, borderRadius: 4,
            background: i === 1 ? C.teal : `${C.teal}44`,
          }} />
        ))}
      </div>
    </div>
  );
};

// AUTH
const AuthScreen = ({ onLogin }) => {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [name, setName] = useState("");
  const [device, setDevice] = useState("");

  const inputStyle = {
    width: "100%", background: C.card, border: `1px solid ${C.cardBorder}`,
    borderRadius: 14, padding: "14px 18px", color: C.white, fontSize: 15,
  };
  const labelStyle = {
    fontSize: 12, color: C.muted, fontWeight: 600, fontFamily: "'Syne',sans-serif",
    letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 6, display: "block",
  };

  return (
    <div style={{
      height: "100%", display: "flex", flexDirection: "column",
      background: `radial-gradient(ellipse at 50% 0%, ${C.teal}18 0%, ${C.navy} 60%)`,
      padding: "0 24px", overflowY: "auto",
    }}>
      <div style={{ paddingTop: 60, textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🫁</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800 }}>
          Inhaler<span style={{ color: C.teal }}>Guide</span>
        </div>
        <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>
          Técnica correta. Tratamento eficaz.
        </div>
      </div>

      {/* Role toggle */}
      <div style={{ display: "flex", background: C.card, borderRadius: 14, padding: 4, marginBottom: 28, border: `1px solid ${C.cardBorder}` }}>
        {[["patient", "Paciente"], ["doctor", "Profissional de saúde"]].map(([r, label]) => (
          <button key={r} onClick={() => setRole(r)} style={{
            flex: 1, padding: "10px 0", borderRadius: 11, fontSize: 13, fontWeight: 600,
            fontFamily: "'Syne',sans-serif", transition: "all 0.2s",
            background: role === r ? `linear-gradient(135deg, ${C.teal}, ${C.tealDark})` : "transparent",
            color: role === r ? C.navy : C.muted,
          }}>{label}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {mode === "register" && (
          <div className="fadeUp">
            <label style={labelStyle}>Nome completo</label>
            <input style={inputStyle} placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} />
          </div>
        )}
        <div>
          <label style={labelStyle}>E-mail</label>
          <input style={inputStyle} placeholder="seu@email.com" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Senha</label>
          <input style={inputStyle} placeholder="••••••••" type="password" value={pass} onChange={e => setPass(e.target.value)} />
        </div>
        {mode === "register" && role === "patient" && (
          <div className="fadeUp">
            <label style={labelStyle}>Dispositivo inalatório prescrito</label>
            <input style={inputStyle} placeholder="Ex: inalador de pó seco, aerossol..." value={device} onChange={e => setDevice(e.target.value)} />
          </div>
        )}
        {mode === "register" && role === "doctor" && (
          <div className="fadeUp">
            <label style={labelStyle}>Registro profissional (CRM / CRF / outro)</label>
            <input style={inputStyle} placeholder="CRM/SP 000000" />
          </div>
        )}
      </div>

      <Btn onClick={() => onLogin(role)} style={{ marginTop: 28, width: "100%" }}>
        {mode === "login" ? "Entrar" : "Criar conta"}
      </Btn>
      <button onClick={() => setMode(m => m === "login" ? "register" : "login")} style={{
        background: "none", color: C.muted, fontSize: 13, marginTop: 16, textAlign: "center", paddingBottom: 32,
      }}>
        {mode === "login" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
      </button>
    </div>
  );
};

// HOME
const HomeScreen = ({ onNav }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
  const nextDose = hour < 8 ? "08:00" : hour < 20 ? "20:00" : "08:00 amanhã";
  const todaySession = MOCK_SESSIONS[MOCK_SESSIONS.length - 1];

  return (
    <Screen>
      <div style={{
        background: `linear-gradient(180deg, ${C.teal}22 0%, transparent 100%)`,
        padding: "56px 24px 24px",
      }}>
        <div style={{ color: C.muted, fontSize: 13, fontWeight: 300 }}>{greeting},</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Maria</div>
        <Tag color={C.sky}>Inalador de pó seco · 2×/dia</Tag>
      </div>

      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Next dose */}
        <Card style={{ background: `linear-gradient(135deg, ${C.teal}22, ${C.sky}11)`, border: `1px solid ${C.teal}33` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'Syne',sans-serif" }}>Próxima dose</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: C.teal, marginTop: 4 }}>{nextDose}</div>
              <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>2 inalações · Inalador de pó seco</div>
            </div>
            <div style={{ animation: "pulse 2s infinite", borderRadius: "50%" }}>
              <Btn onClick={() => onNav("tutorial")} style={{ borderRadius: 50, width: 56, height: 56, padding: 0 }}>▶</Btn>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Card style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Syne',sans-serif", color: AVG_SCORE >= 90 ? C.success : AVG_SCORE >= 70 ? C.warn : C.danger }}>{AVG_SCORE}%</div>
            <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Técnica média</div>
          </Card>
          <Card style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Syne',sans-serif", color: ADHERENCE >= 85 ? C.success : C.warn }}>{ADHERENCE}%</div>
            <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Adesão 30 dias</div>
          </Card>
        </div>

        {/* Today */}
        <Card>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Hoje</div>
          <div style={{ display: "flex", gap: 12 }}>
            {[["Manhã", todaySession.morning], ["Noite", todaySession.evening]].map(([label, score]) => (
              <div key={label} style={{ flex: 1, background: C.navyLight, borderRadius: 14, padding: 14, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, marginBottom: 8 }}>{label}</div>
                {score ? (
                  <>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, color: score >= 90 ? C.success : score >= 70 ? C.warn : C.danger }}>{score}%</div>
                    <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{score >= 90 ? "✓ Perfeito" : score >= 70 ? "⚠ Aceitável" : "✗ Repetir"}</div>
                  </>
                ) : (
                  <div style={{ color: C.muted, fontSize: 12 }}>Pendente</div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Quick actions */}
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: -4 }}>Acesso rápido</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { icon: "📋", label: "Registrar\nresgate", id: "records" },
            { icon: "📊", label: "Ver\nrelatório", id: "report" },
            { icon: "📚", label: "Sobre\ninaladores", id: "info" },
            { icon: "⚙️", label: "Lembretes", id: "profile" },
          ].map(item => (
            <Card key={item.id} onClick={() => onNav(item.id)} style={{ textAlign: "center", padding: 16 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 12, color: C.muted, whiteSpace: "pre-line", lineHeight: 1.4 }}>{item.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </Screen>
  );
};

// TUTORIAL + CAMERA
const TutorialScreen = () => {
  const [phase, setPhase] = useState("intro");
  const [step, setStep] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [score, setScore] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      setCameraOn(true);
    } catch { setCameraOn(false); }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    setCameraOn(false);
  };

  useEffect(() => { return () => stopCamera(); }, []);

  const runAnalysis = () => {
    setAnalyzing(true);
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(interval);
          setTimeout(() => {
            const s = Math.floor(65 + Math.random() * 35);
            setScore(s);
            setAnalyzing(false);
            setPhase("result");
          }, 800);
          return null;
        }
        return c - 1;
      });
    }, 1000);
  };

  if (phase === "intro") return (
    <Screen>
      <Header title="Técnica Inalatória" subtitle="Tutorial guiado" />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <Card style={{ background: `linear-gradient(135deg, ${C.teal}18, ${C.sky}0a)`, border: `1px solid ${C.teal}33` }}>
          <div style={{ fontSize: 48, textAlign: "center", marginBottom: 16 }}>🫁</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Avaliação com câmera</div>
            <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.6 }}>
              O sistema analisa sua técnica inalatória em tempo real e gera uma pontuação de 0 a 100. Tenha o dispositivo em mãos e esteja em ambiente iluminado.
            </div>
          </div>
        </Card>

        {TUTORIAL_STEPS.map((s, i) => (
          <div key={i} className="fadeUp" style={{ display: "flex", alignItems: "center", gap: 14, animationDelay: `${i * 0.08}s` }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${C.teal}22`, border: `1px solid ${C.teal}33`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{s.title}</div>
              <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{s.desc.substring(0, 60)}…</div>
            </div>
          </div>
        ))}

        <Btn onClick={() => setPhase("steps")} style={{ width: "100%", marginTop: 8 }}>Iniciar tutorial</Btn>
        <Btn variant="ghost" onClick={() => { setPhase("camera"); startCamera(); }} style={{ width: "100%" }}>Já sei a técnica — só avaliar</Btn>
      </div>
    </Screen>
  );

  if (phase === "steps") {
    const s = TUTORIAL_STEPS[step];
    return (
      <Screen>
        <Header title={s.title} subtitle={`Passo ${step + 1} de ${TUTORIAL_STEPS.length}`} back="Voltar" onBack={() => step === 0 ? setPhase("intro") : setStep(n => n - 1)} />
        <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{
            background: `radial-gradient(ellipse at 50% 50%, ${C.teal}18 0%, ${C.navyLight} 70%)`,
            borderRadius: 24, height: 220,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            border: `1px solid ${C.teal}22`,
          }}>
            <div style={{ fontSize: 72, animation: "breathe 2.5s ease infinite" }}>{s.icon}</div>
            <div style={{ color: C.teal, fontSize: 13, fontWeight: 600, marginTop: 16, fontFamily: "'Syne',sans-serif" }}>{s.action}</div>
          </div>

          <Card>
            <div style={{ color: C.muted, fontSize: 14, lineHeight: 1.7 }}>{s.desc}</div>
          </Card>

          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            {TUTORIAL_STEPS.map((_, i) => (
              <div key={i} style={{ width: i === step ? 20 : 8, height: 8, borderRadius: 4, background: i <= step ? C.teal : `${C.teal}33`, transition: "all 0.3s" }} />
            ))}
          </div>

          {step < TUTORIAL_STEPS.length - 1 ? (
            <Btn onClick={() => setStep(n => n + 1)} style={{ width: "100%" }}>Próximo passo →</Btn>
          ) : (
            <Btn onClick={() => { setPhase("camera"); startCamera(); }} style={{ width: "100%" }}>Iniciar avaliação com câmera 📷</Btn>
          )}
        </div>
      </Screen>
    );
  }

  if (phase === "camera") return (
    <Screen>
      <Header title="Avaliação ao vivo" subtitle="Câmera ativa" back="Voltar" onBack={() => { stopCamera(); setPhase("intro"); }} />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: C.navyLight, aspectRatio: "3/4", border: `2px solid ${analyzing ? C.warn : C.teal}44` }}>
          <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} />

          {!cameraOn && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: C.navyLight }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📷</div>
              <div style={{ color: C.muted, fontSize: 13, textAlign: "center", padding: "0 24px" }}>
                Câmera não disponível neste navegador.<br />No dispositivo real, será ativada aqui.
              </div>
            </div>
          )}

          {cameraOn && !analyzing && !countdown && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 160, height: 200, border: `2px dashed ${C.teal}88`, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: `${C.teal}88`, fontSize: 12, fontFamily: "'Syne',sans-serif", textAlign: "center" }}>Posicione<br />seu rosto aqui</span>
              </div>
            </div>
          )}

          {countdown && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 96, fontWeight: 800, color: C.teal }}>{countdown}</div>
            </div>
          )}

          {analyzing && !countdown && (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)" }}>
              <div style={{ width: 48, height: 48, border: `3px solid ${C.teal}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginBottom: 16 }} />
              <div style={{ color: C.white, fontFamily: "'Syne',sans-serif", fontSize: 14 }}>Analisando técnica…</div>
            </div>
          )}

          {cameraOn && (
            <div style={{ position: "absolute", top: 14, left: 14, background: C.danger, borderRadius: 8, padding: "4px 10px", display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.white, animation: "pulse 1s infinite" }} />
              <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'Syne',sans-serif", color: C.white }}>AO VIVO</span>
            </div>
          )}
        </div>

        <Card style={{ border: `1px solid ${C.teal}33` }}>
          <div style={{ color: C.muted, fontSize: 13, textAlign: "center" }}>
            Posicione o dispositivo inalatório à frente da câmera e execute a técnica completa. Quando estiver pronto, pressione o botão abaixo.
          </div>
        </Card>

        <Btn onClick={runAnalysis} disabled={analyzing} style={{ width: "100%" }}>
          {analyzing ? "Analisando…" : "▶  Iniciar gravação e análise"}
        </Btn>
      </div>
    </Screen>
  );

  if (phase === "result") {
    const label = score >= 90
      ? { text: "Técnica excelente!", color: C.success, emoji: "🏆" }
      : score >= 70
      ? { text: "Aceitável com ressalvas", color: C.warn, emoji: "⚠️" }
      : { text: "Técnica incorreta — repita", color: C.danger, emoji: "❌" };

    const tips = score < 90 ? [
      "Verifique a vedação completa dos lábios no bocal",
      "A inspiração deve ser mais rápida e profunda",
      "Segure o ar por pelo menos 5 segundos após a inalação",
    ] : ["Excelente! Técnica executada de forma correta e completa."];

    return (
      <Screen>
        <Header title="Resultado" subtitle="Análise concluída" />
        <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <Card style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", padding: 32, border: `1px solid ${label.color}33` }}>
            <ScoreRing score={score} size={140} />
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 22, fontWeight: 800, marginTop: 20, color: label.color }}>
              {label.emoji} {label.text}
            </div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 8, textAlign: "center" }}>
              {score >= 90 ? "Dose registrada com sucesso" : score >= 70 ? "Dose registrada com alerta" : "Dose não registrada — repita a técnica"}
            </div>
          </Card>

          <Card style={{ width: "100%" }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Pontos de atenção</div>
            {tips.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: 13, color: C.white, alignItems: "flex-start" }}>
                <span style={{ color: C.warn, flexShrink: 0 }}>›</span>{t}
              </div>
            ))}
          </Card>

          <div style={{ display: "flex", gap: 12, width: "100%" }}>
            {score < 70 && <Btn onClick={() => { setScore(null); setPhase("camera"); startCamera(); }} style={{ flex: 1 }}>Repetir</Btn>}
            <Btn variant={score < 70 ? "outline" : "primary"} onClick={() => { stopCamera(); setPhase("intro"); setScore(null); setStep(0); }} style={{ flex: 1 }}>Concluir</Btn>
          </div>
        </div>
      </Screen>
    );
  }
};

// RECORDS
const RecordsScreen = () => {
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("Broncodilatador de resgate");
  const [saved, setSaved] = useState(false);

  return (
    <Screen>
      <Header title="Registros" subtitle="Medicação de resgate" />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: "Bronco. resgate", count: MOCK_SESSIONS.filter(s => s.rescue === "Broncodilatador de resgate").length, color: C.warn },
            { label: "Corticoide oral", count: MOCK_SESSIONS.filter(s => s.rescue === "Corticoide oral").length, color: C.danger },
            { label: "Outro", count: MOCK_SESSIONS.filter(s => s.rescue === "Outro").length, color: C.sky },
          ].map(({ label, count, color }) => (
            <Card key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color }}>{count}</div>
              <div style={{ color: C.muted, fontSize: 10, marginTop: 4 }}>{label}</div>
            </Card>
          ))}
        </div>

        <Btn onClick={() => { setShowForm(true); setSaved(false); }} style={{ width: "100%" }}>+ Registrar medicação de resgate</Btn>

        {showForm && !saved && (
          <Card className="fadeUp" style={{ border: `1px solid ${C.teal}33` }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Novo registro</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {["Broncodilatador de resgate", "Corticoide oral", "Antibiótico", "Outro"].map(t => (
                <button key={t} onClick={() => setType(t)} style={{
                  padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                  fontFamily: "'Syne',sans-serif",
                  background: type === t ? C.teal : C.card,
                  color: type === t ? C.navy : C.muted,
                  border: `1px solid ${type === t ? C.teal : C.cardBorder}`,
                }}>{t}</button>
              ))}
            </div>
            <Btn onClick={() => setSaved(true)} style={{ width: "100%" }}>Salvar registro</Btn>
          </Card>
        )}

        {saved && (
          <Card className="fadeUp" style={{ textAlign: "center", border: `1px solid ${C.success}33` }}>
            <div style={{ color: C.success, fontSize: 28, marginBottom: 8 }}>✓</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>Registro salvo</div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{type} · agora</div>
          </Card>
        )}

        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1 }}>Histórico (30 dias)</div>
        {MOCK_SESSIONS.filter(s => s.rescue).slice(-8).reverse().map((s, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: C.card, borderRadius: 14, border: `1px solid ${C.cardBorder}` }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{s.rescue}</div>
              <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>
                {s.date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
              </div>
            </div>
            <Tag color={s.rescue === "Broncodilatador de resgate" ? C.warn : s.rescue === "Corticoide oral" ? C.danger : C.sky}>{s.rescue.split(" ")[0]}</Tag>
          </div>
        ))}
      </div>
    </Screen>
  );
};

// REPORT
const ReportScreen = () => {
  const weeks = [0, 1, 2, 3].map(w => {
    const sessions = MOCK_SESSIONS.slice(w * 7, w * 7 + 7);
    const scores = sessions.flatMap(s => [s.morning, s.evening].filter(Boolean));
    return { avg: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0, doses: scores.length };
  });

  return (
    <Screen>
      <Header title="Seu relatório" subtitle="Últimos 30 dias" />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Card style={{ textAlign: "center", border: `1px solid ${C.teal}33` }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800, color: AVG_SCORE >= 90 ? C.success : AVG_SCORE >= 70 ? C.warn : C.danger }}>{AVG_SCORE}%</div>
            <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Técnica média</div>
          </Card>
          <Card style={{ textAlign: "center", border: `1px solid ${C.sky}33` }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 32, fontWeight: 800, color: ADHERENCE >= 85 ? C.success : C.warn }}>{ADHERENCE}%</div>
            <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Adesão</div>
          </Card>
        </div>

        <Card>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Score por semana</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 100 }}>
            {weeks.map((w, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: 11, color: C.teal, fontWeight: 600 }}>{w.avg}%</div>
                <div style={{ width: "100%", borderRadius: "6px 6px 0 0", height: `${(w.avg / 100) * 70}px`, background: `linear-gradient(180deg, ${C.teal}, ${C.tealDark})` }} />
                <div style={{ fontSize: 10, color: C.muted }}>S{i + 1}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Calendário de uso</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
            {MOCK_SESSIONS.map((s, i) => {
              const hasAny = s.morning || s.evening;
              const avg = hasAny ? Math.round(([s.morning, s.evening].filter(Boolean).reduce((a, b) => a + b, 0)) / [s.morning, s.evening].filter(Boolean).length) : 0;
              const color = !hasAny ? `${C.muted}33` : avg >= 90 ? C.success : avg >= 70 ? C.warn : C.danger;
              return <div key={i} style={{ width: "100%", aspectRatio: "1", borderRadius: 6, background: color, opacity: hasAny ? 1 : 0.4 }} />;
            })}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 14, justifyContent: "center" }}>
            {[[C.success, "≥90%"], [C.warn, "70-89%"], [C.danger, "<70%"], [`${C.muted}44`, "Sem uso"]].map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: c }} />
                <span style={{ fontSize: 10, color: C.muted }}>{l}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ border: `1px solid ${C.teal}33` }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Compartilhar com profissional de saúde</div>
          <div style={{ color: C.muted, fontSize: 12, marginBottom: 14 }}>Autorize seu médico ou farmacêutico a acessar este relatório completo.</div>
          <Btn style={{ width: "100%" }}>📤 Autorizar acesso</Btn>
        </Card>
      </div>
    </Screen>
  );
};

// INFO
const InfoScreen = () => (
  <Screen>
    <Header title="Sobre inaladores" subtitle="Informações gerais" />
    <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 14 }}>
      {[
        { title: "Por que a técnica importa?", icon: "🎯", text: "Estudos mostram que grande parte dos pacientes utiliza o dispositivo inalatório de forma incorreta, o que reduz significativamente a quantidade de medicamento que chega aos pulmões e compromete a eficácia do tratamento." },
        { title: "Tipos de dispositivos inalatórios", icon: "💊", text: "Existem vários tipos: inaladores de dose medida com aerossol (MDI), inaladores de pó seco (DPI), nebulizadores e inaladores de névoa suave. Cada um tem uma técnica específica. Siga sempre a orientação do seu médico ou farmacêutico." },
        { title: "Erros mais comuns", icon: "⚠️", text: "Os erros mais frequentes incluem não expirar antes de inalar, não vedar os lábios corretamente no bocal, inspirar de forma lenta ou rápida demais, e não segurar o ar após a inalação." },
        { title: "Medicação de resgate", icon: "🚑", text: "Medicações de resgate são usadas em situações de crise ou piora dos sintomas. O uso frequente pode ser sinal de que o controle da doença não está adequado — informe sempre ao seu médico." },
        { title: "Higiene do dispositivo", icon: "🧼", text: "Mantenha o dispositivo limpo conforme orientação do fabricante. A limpeza inadequada pode comprometer a dose liberada e favorecer contaminações." },
      ].map((item, i) => (
        <Card key={i} className="fadeUp" style={{ animationDelay: `${i * 0.1}s` }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ fontSize: 28, flexShrink: 0 }}>{item.icon}</div>
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{item.title}</div>
              <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.7 }}>{item.text}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </Screen>
);

// PROFILE
const ProfileScreen = ({ onLogout }) => {
  const [morningTime, setMorningTime] = useState("08:00");
  const [eveningTime, setEveningTime] = useState("20:00");
  const [saved, setSaved] = useState(false);

  return (
    <Screen>
      <Header title="Perfil" subtitle="Configurações" />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <Card style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: `linear-gradient(135deg, ${C.teal}, ${C.sky})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, fontFamily: "'Syne',sans-serif", color: C.navy }}>M</div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>Maria</div>
            <div style={{ color: C.muted, fontSize: 12 }}>Paciente · Inalador de pó seco</div>
          </div>
        </Card>

        <Card>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 16 }}>Lembretes de dose</div>
          {[["⏰ Manhã", morningTime, setMorningTime], ["🌙 Noite", eveningTime, setEveningTime]].map(([label, val, setter]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 13 }}>{label}</span>
              <input type="time" value={val} onChange={e => { setter(e.target.value); setSaved(false); }}
                style={{ background: C.navyLight, border: `1px solid ${C.cardBorder}`, borderRadius: 10, padding: "8px 12px", color: C.white, fontSize: 14, fontFamily: "'Syne',sans-serif", fontWeight: 600 }} />
            </div>
          ))}
          <Btn onClick={() => setSaved(true)} variant={saved ? "ghost" : "primary"} style={{ width: "100%" }}>
            {saved ? "✓ Salvo" : "Salvar horários"}
          </Btn>
        </Card>

        <Card>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Meu dispositivo</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
            <span style={{ color: C.muted }}>Tipo</span>
            <span>Inalador de pó seco</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
            <span style={{ color: C.muted }}>Frequência prescrita</span>
            <span>2× ao dia</span>
          </div>
        </Card>

        <Card>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Privacidade e dados</div>
          <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.7 }}>
            Seus dados de saúde são armazenados de forma segura e criptografada. Você controla quem tem acesso às suas informações. Você pode revogar o acesso de qualquer profissional a qualquer momento.
          </div>
        </Card>

        <Btn variant="danger" onClick={onLogout} style={{ width: "100%" }}>Sair da conta</Btn>
      </div>
    </Screen>
  );
};

// DOCTOR HOME
const DoctorHomeScreen = ({ onNav }) => (
  <Screen>
    <div style={{ background: `linear-gradient(180deg, ${C.sky}22 0%, transparent 100%)`, padding: "56px 24px 24px" }}>
      <div style={{ color: C.muted, fontSize: 13 }}>Bem-vindo,</div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800 }}>Dr. Roberto Silva</div>
      <div style={{ marginTop: 6 }}><Tag color={C.sky}>Pneumologista · CRM/SP 87654</Tag></div>
    </div>
    <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Card style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: C.teal }}>{MOCK_PATIENTS.length}</div>
          <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Pacientes ativos</div>
        </Card>
        <Card style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 28, fontWeight: 800, color: C.warn }}>1</div>
          <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Requerem atenção</div>
        </Card>
      </div>

      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1 }}>Alertas</div>
      <Card style={{ border: `1px solid ${C.danger}33` }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ fontSize: 24 }}>🚨</div>
          <div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14 }}>Ana Lucia F.</div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>Técnica média 54% — abaixo do mínimo. Adesão: 61%. 3 usos de medicação de resgate nos últimos 7 dias.</div>
            <button onClick={() => onNav("doc-patients")} style={{ background: "none", color: C.teal, fontSize: 12, marginTop: 8, fontWeight: 600, padding: 0 }}>Ver relatório completo →</button>
          </div>
        </div>
      </Card>

      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1 }}>Pacientes recentes</div>
      {MOCK_PATIENTS.slice(0, 3).map(p => (
        <Card key={p.id} onClick={() => onNav("doc-reports")} style={{ cursor: "pointer" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</div>
              <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{p.age} anos · {p.device} · {p.lastUse}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: p.score >= 90 ? C.success : p.score >= 70 ? C.warn : C.danger }}>{p.score}%</div>
              <div style={{ fontSize: 10, color: C.muted }}>técnica</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </Screen>
);

// DOCTOR PATIENTS
const DoctorPatientsScreen = ({ onNav }) => (
  <Screen>
    <Header title="Meus pacientes" subtitle="Painel clínico" />
    <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 12 }}>
      {MOCK_PATIENTS.map(p => (
        <Card key={p.id} onClick={() => onNav("doc-reports")} style={{ cursor: "pointer", border: p.score < 70 ? `1px solid ${C.danger}44` : `1px solid ${C.cardBorder}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14 }}>{p.name}</div>
              <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{p.age} anos · {p.device}</div>
              <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>Último uso: {p.lastUse}</div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: p.score >= 90 ? C.success : p.score >= 70 ? C.warn : C.danger }}>{p.score}%</div>
                <div style={{ fontSize: 9, color: C.muted }}>técnica</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 20, color: p.adherence >= 85 ? C.success : C.warn }}>{p.adherence}%</div>
                <div style={{ fontSize: 9, color: C.muted }}>adesão</div>
              </div>
            </div>
          </div>
          {p.score < 70 && <div style={{ marginTop: 10, background: `${C.danger}18`, borderRadius: 8, padding: "6px 10px", fontSize: 11, color: C.danger }}>⚠ Técnica abaixo do mínimo aceitável</div>}
        </Card>
      ))}
    </div>
  </Screen>
);

// DOCTOR REPORT
const DoctorReportScreen = () => {
  const p = MOCK_PATIENTS[2];
  return (
    <Screen>
      <Header title={p.name} subtitle="Relatório clínico · 30 dias" />
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "Técnica média", value: `${p.score}%`, color: p.score >= 90 ? C.success : p.score >= 70 ? C.warn : C.danger },
            { label: "Adesão", value: `${p.adherence}%`, color: p.adherence >= 85 ? C.success : C.warn },
            { label: "Doses realizadas", value: "37/60", color: C.white },
            { label: "Usos de resgate", value: "5", color: C.danger },
          ].map(({ label, value, color }) => (
            <Card key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color }}>{value}</div>
              <div style={{ color: C.muted, fontSize: 10, marginTop: 4 }}>{label}</div>
            </Card>
          ))}
        </div>

        <Card style={{ border: `1px solid ${C.danger}33` }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 12 }}>📋 Análise clínica</div>
          {[
            "Técnica inalatória consistentemente abaixo de 70% — provável erro de vedação labial ou fluxo inspiratório insuficiente.",
            "Adesão de 61% indica esquecimento frequente. Revisar rotina e estratégias de suporte.",
            "5 usos de medicação de resgate em 30 dias — controle clínico inadequado.",
            "Considerar consulta de revisão e retreinamento presencial da técnica inalatória.",
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 10, fontSize: 12, color: C.muted, lineHeight: 1.5, marginBottom: 8 }}>
              <span style={{ color: C.warn, flexShrink: 0 }}>›</span>{t}
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Histórico de técnica (30 dias)</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 80 }}>
            {MOCK_SESSIONS.map((s, i) => {
              const scores = [s.morning, s.evening].filter(Boolean);
              const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
              return <div key={i} style={{ flex: 1, height: `${avg}%`, borderRadius: "2px 2px 0 0", background: avg >= 90 ? C.success : avg >= 70 ? C.warn : avg > 0 ? C.danger : `${C.muted}22`, minHeight: avg > 0 ? 4 : 2 }} />;
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 10, color: C.muted }}>Dia 1</span>
            <span style={{ fontSize: 10, color: C.muted }}>Hoje</span>
          </div>
        </Card>

        <Btn style={{ width: "100%" }}>📄 Exportar PDF do relatório</Btn>
      </div>
    </Screen>
  );
};

// ── MAIN ───────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("splash");
  const [role, setRole] = useState(null);
  const [activeTab, setActiveTab] = useState("home");

  const handleLogin = (r) => {
    setRole(r);
    setActiveTab(r === "doctor" ? "doc-home" : "home");
    setScreen("app");
  };
  const handleLogout = () => { setRole(null); setScreen("auth"); };
  const handleNav = (tab) => setActiveTab(tab);

  const renderTab = () => {
    if (role === "doctor") {
      switch (activeTab) {
        case "doc-home":     return <DoctorHomeScreen onNav={handleNav} />;
        case "doc-patients": return <DoctorPatientsScreen onNav={handleNav} />;
        case "doc-reports":  return <DoctorReportScreen />;
        case "profile":      return <ProfileScreen onLogout={handleLogout} />;
        default:             return <DoctorHomeScreen onNav={handleNav} />;
      }
    }
    switch (activeTab) {
      case "home":     return <HomeScreen onNav={handleNav} />;
      case "tutorial": return <TutorialScreen />;
      case "records":  return <RecordsScreen />;
      case "report":   return <ReportScreen />;
      case "info":     return <InfoScreen />;
      case "profile":  return <ProfileScreen onLogout={handleLogout} />;
      default:         return <HomeScreen onNav={handleNav} />;
    }
  };

  return (
    <>
      <GlobalStyle />
      <div style={{
        height: "100vh", width: "100vw",
        display: "flex", justifyContent: "center", alignItems: "center",
        background: "#060E1A",
      }}>
        <div style={{
          width: "100%", maxWidth: 430, height: "100%", maxHeight: 860,
          background: C.navy, borderRadius: window.innerWidth > 480 ? 48 : 0,
          overflow: "hidden", position: "relative",
          boxShadow: window.innerWidth > 480 ? "0 40px 120px rgba(0,0,0,0.8)" : "none",
        }}>
          {screen === "splash" && <SplashScreen onDone={() => setScreen("auth")} />}
          {screen === "auth"   && <AuthScreen onLogin={handleLogin} />}
          {screen === "app"    && (
            <>
              {renderTab()}
              <BottomNav active={activeTab} onNav={handleNav} role={role} />
            </>
          )}
        </div>
      </div>
    </>
  );
}
