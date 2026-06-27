import { useState, useEffect, useRef } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:      "#0A0A0F",
  card:    "#12121A",
  card2:   "#1A1A26",
  border:  "#2A2A3A",
  gold:    "#D4AF37",
  goldL:   "#F0C93A",
  green:   "#22C55E",
  red:     "#EF4444",
  muted:   "#6B7280",
  text:    "#F1F1F5",
  textSub: "#9CA3AF",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Oswald:wght@500;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:${C.bg};color:${C.text};font-family:'Inter',sans-serif;min-height:100vh}
  input,select,textarea{background:${C.card2};color:${C.text};border:1px solid ${C.border};border-radius:10px;padding:12px 14px;width:100%;font-size:14px;outline:none;transition:.2s}
  input:focus{border-color:${C.gold};box-shadow:0 0 0 3px ${C.gold}22}
  button{cursor:pointer;border:none;outline:none;font-family:'Inter',sans-serif;transition:.2s}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-track{background:${C.bg}}
  ::-webkit-scrollbar-thumb{background:${C.border};border-radius:4px}

  .gold-btn{background:linear-gradient(135deg,${C.gold},${C.goldL});color:#000;font-weight:700;border-radius:12px;padding:14px;font-size:15px;letter-spacing:.3px}
  .gold-btn:hover{filter:brightness(1.1);transform:translateY(-1px)}
  .ghost-btn{background:transparent;color:${C.gold};border:1.5px solid ${C.gold};border-radius:12px;padding:13px;font-size:15px;font-weight:600}
  .ghost-btn:hover{background:${C.gold}18}
  .red-btn{background:#EF44441A;color:${C.red};border:1.5px solid ${C.red};border-radius:12px;padding:13px;font-size:14px;font-weight:600}
  .red-btn:hover{background:#EF444430}

  .screen{min-height:100vh;display:flex;flex-direction:column;max-width:430px;margin:0 auto;position:relative;overflow:hidden}
  .topbar{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;background:${C.card};border-bottom:1px solid ${C.border};position:sticky;top:0;z-index:10}
  .dots-btn{background:none;border:none;font-size:24px;color:${C.gold};cursor:pointer;padding:4px 8px;border-radius:8px}
  .dots-btn:hover{background:${C.gold}18}

  .sidebar-overlay{position:fixed;inset:0;background:#00000088;z-index:50;opacity:0;pointer-events:none;transition:.3s}
  .sidebar-overlay.open{opacity:1;pointer-events:all}
  .sidebar{position:fixed;left:-280px;top:0;bottom:0;width:260px;background:${C.card};border-right:1px solid ${C.border};z-index:51;transition:.3s;padding:0}
  .sidebar.open{left:0}
  .sidebar-header{background:linear-gradient(135deg,${C.gold}22,${C.gold}08);padding:28px 20px 24px;border-bottom:1px solid ${C.border}}
  .sidebar-logo{font-family:'Oswald',sans-serif;font-size:28px;font-weight:700;color:${C.gold};letter-spacing:2px}
  .sidebar-item{display:flex;align-items:center;gap:14px;padding:15px 20px;color:${C.text};cursor:pointer;font-size:15px;font-weight:500;transition:.15s;border-left:3px solid transparent}
  .sidebar-item:hover{background:${C.gold}12;border-left-color:${C.gold};color:${C.gold}}
  .sidebar-item.logout{color:${C.red};margin-top:auto}
  .sidebar-item.logout:hover{background:#EF444418;border-left-color:${C.red}}

  .bottomnav{display:flex;background:${C.card};border-top:1px solid ${C.border};position:sticky;bottom:0}
  .nav-btn{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;padding:10px 0;background:none;color:${C.muted};font-size:10px;font-weight:500;transition:.2s;border-top:2px solid transparent}
  .nav-btn.active{color:${C.gold};border-top-color:${C.gold}}
  .nav-btn:hover{color:${C.goldL}}
  .nav-icon{font-size:20px}

  .content{flex:1;padding:20px 18px;overflow-y:auto}
  .card{background:${C.card};border:1px solid ${C.border};border-radius:16px;padding:18px}
  .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600}
  .badge-green{background:#22C55E22;color:${C.green}}
  .badge-red{background:#EF444422;color:${C.red}}
  .badge-gold{background:${C.gold}22;color:${C.gold}}
  .badge-gray{background:${C.border};color:${C.muted}}

  .game-card{background:${C.card};border:1px solid ${C.border};border-radius:16px;padding:16px;margin-bottom:14px}
  .odd-btn{flex:1;background:${C.card2};border:1.5px solid ${C.border};border-radius:10px;padding:10px 6px;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;transition:.2s}
  .odd-btn:hover{border-color:${C.gold};background:${C.gold}12}
  .odd-btn.selected{border-color:${C.gold};background:${C.gold}22;color:${C.gold}}
  .odd-label{font-size:10px;color:${C.muted};font-weight:500}
  .odd-value{font-size:15px;font-weight:700;color:${C.gold}}
  .odd-btn.selected .odd-label{color:${C.gold}99}

  .tab-bar{display:flex;gap:6px;margin-bottom:18px;overflow-x:auto;padding-bottom:2px}
  .tab{padding:8px 14px;border-radius:20px;font-size:12px;font-weight:600;cursor:pointer;border:1.5px solid ${C.border};color:${C.muted};background:none;white-space:nowrap}
  .tab.active{background:${C.gold}22;border-color:${C.gold};color:${C.gold}}

  .ticket-card{background:${C.card};border:1px solid ${C.border};border-radius:14px;padding:16px;margin-bottom:12px;border-left:4px solid ${C.gold}}
  .ticket-card.win{border-left-color:${C.green}}
  .ticket-card.loss{border-left-color:${C.red}}
  .ticket-card.pending{border-left-color:${C.gold}}

  .amount-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:18px}
  .amount-chip{background:${C.card2};border:1.5px solid ${C.border};border-radius:12px;padding:14px 8px;text-align:center;cursor:pointer;font-size:14px;font-weight:600;transition:.2s}
  .amount-chip:hover{border-color:${C.gold}}
  .amount-chip.selected{border-color:${C.gold};background:${C.gold}22;color:${C.gold}}

  .logo-text{font-family:'Oswald',sans-serif;font-weight:700;letter-spacing:3px;color:${C.gold};font-size:42px}
  .logo-7{color:${C.green}}
  .section-title{font-family:'Oswald',sans-serif;font-size:18px;letter-spacing:1px;color:${C.gold};margin-bottom:14px}

  .highlight-card{background:linear-gradient(135deg,${C.card},${C.card2});border:1px solid ${C.gold}44;border-radius:16px;padding:16px;margin-bottom:14px;position:relative;overflow:hidden}
  .highlight-card::before{content:'';position:absolute;top:0;right:0;width:80px;height:80px;background:${C.gold}08;border-radius:50%;transform:translate(20px,-20px)}

  .pix-box{background:${C.card2};border:2px dashed ${C.gold}66;border-radius:16px;padding:24px;text-align:center;margin:16px 0}
  .qr-mock{width:140px;height:140px;background:#fff;margin:0 auto 12px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:60px}

  .profile-avatar{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,${C.gold},${C.goldL});display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:700;color:#000;margin:0 auto 6px;cursor:pointer;position:relative;overflow:hidden;border:3px solid ${C.gold}}
  .coin-badge{display:flex;align-items:center;gap:5px;background:${C.gold}22;border:1px solid ${C.gold}55;border-radius:20px;padding:5px 10px;font-size:13px;font-weight:600;color:${C.gold}}

  .alert{padding:14px 16px;border-radius:12px;font-size:14px;margin-bottom:16px}
  .alert-green{background:#22C55E18;border:1px solid #22C55E44;color:${C.green}}
  .alert-red{background:#EF444418;border:1px solid #EF444444;color:${C.red}}
  .alert-gold{background:${C.gold}18;border:1px solid ${C.gold}44;color:${C.gold}}

  .live-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:${C.green};margin-right:6px;animation:pulse 1.5s infinite}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.3)}}

  .modal-overlay{position:fixed;inset:0;background:#00000099;z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
  .modal{background:${C.card};border:1px solid ${C.border};border-radius:20px;padding:24px;width:100%;max-width:380px}
`;

// ─── Fake data ────────────────────────────────────────────────────────────────
const GAMES = [
  { id:1, teamA:"Flamengo",    teamB:"Palmeiras",   sport:"⚽", oddA:2.10, oddD:3.20, oddB:3.40, league:"Brasileirão" },
  { id:2, teamA:"Real Madrid", teamB:"Barcelona",   sport:"⚽", oddA:1.85, oddD:3.50, oddB:4.00, league:"La Liga"     },
  { id:3, teamA:"Lakers",      teamB:"Warriors",    sport:"🏀", oddA:1.95, oddD:0,    oddB:1.90, league:"NBA"         },
  { id:4, teamA:"Brasil",      teamB:"Argentina",   sport:"⚽", oddA:2.50, oddD:3.10, oddB:2.80, league:"Amistoso"    },
  { id:5, teamA:"Corinthians", teamB:"São Paulo",   sport:"⚽", oddA:2.30, oddD:3.00, oddB:3.10, league:"Brasileirão" },
  { id:6, teamA:"Manchester U",teamB:"Man City",    sport:"⚽", oddA:3.20, oddD:3.40, oddB:2.10, league:"Premier Lg" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = n => Number(n).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});
const genId = () => Math.random().toString(36).slice(2,8).toUpperCase();

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [user, setUser]   = useState(null);
  const [coins, setCoins] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [sideOpen, setSideOpen] = useState(false);

  const go = s => { setScreen(s); setSideOpen(false); };
  const logout = () => { setUser(null); setCoins(0); setTickets([]); go("welcome"); };

  const nav = (
    <>
      <div className={`sidebar-overlay ${sideOpen?"open":""}`} onClick={()=>setSideOpen(false)}/>
      <div className={`sidebar ${sideOpen?"open":""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">BET<span style={{color:C.green}}>7</span></div>
          {user && <div style={{color:C.textSub,fontSize:13,marginTop:6}}>Olá, {user.name.split(" ")[0]} 👋</div>}
        </div>
        <div style={{display:"flex",flexDirection:"column",flex:1}}>
          {[
            {icon:"🏠",label:"Início",       sc:"home"},
            {icon:"⚽",label:"Apostar",      sc:"bet"},
            {icon:"🎟️",label:"Meus Bilhetes",sc:"tickets"},
            {icon:"💰",label:"Depósito",     sc:"deposit"},
            {icon:"💸",label:"Saque",        sc:"withdraw"},
            {icon:"👤",label:"Conta",        sc:"profile"},
          ].map(({icon,label,sc})=>(
            <div key={sc} className="sidebar-item" onClick={()=>go(sc)}>{icon} {label}</div>
          ))}
          <div style={{flex:1}}/>
          <div className="sidebar-item logout" onClick={logout}>🚪 Sair da Conta</div>
        </div>
      </div>
    </>
  );

  const TopBar = ({title, right}) => (
    <div className="topbar">
      <button className="dots-btn" onClick={()=>setSideOpen(true)}>⋮</button>
      <span style={{fontFamily:"'Oswald',sans-serif",letterSpacing:1,fontSize:16,color:C.gold}}>{title}</span>
      {right||<div style={{width:40}}/>}
    </div>
  );

  const screens = {
    welcome:  <WelcomeScreen  go={go}/>,
    register: <RegisterScreen go={go} setUser={setUser} setCoins={setCoins}/>,
    login:    <LoginScreen    go={go} setUser={setUser} setCoins={setCoins} setTickets={setTickets}/>,
    home:     <HomeScreen     go={go} user={user} coins={coins} nav={nav} TopBar={TopBar} setSideOpen={setSideOpen}/>,
    bet:      <BetScreen      go={go} nav={nav} TopBar={TopBar} coins={coins} setCoins={setCoins} tickets={tickets} setTickets={setTickets}/>,
    tickets:  <TicketsScreen  go={go} nav={nav} TopBar={TopBar} tickets={tickets}/>,
    deposit:  <DepositScreen  go={go} nav={nav} TopBar={TopBar} coins={coins} setCoins={setCoins}/>,
    withdraw: <WithdrawScreen go={go} nav={nav} TopBar={TopBar} user={user} coins={coins} setCoins={setCoins}/>,
    profile:  <ProfileScreen  go={go} nav={nav} TopBar={TopBar} user={user} setUser={setUser} logout={logout}/>,
  };

  return (
    <>
      <style>{css}</style>
      {screens[screen]||screens.welcome}
    </>
  );
}

// ─── 1. Welcome ───────────────────────────────────────────────────────────────
function WelcomeScreen({go}) {
  return (
    <div className="screen" style={{justifyContent:"center",alignItems:"center",padding:"40px 28px",background:`radial-gradient(ellipse at 50% 20%, ${C.gold}12, ${C.bg} 70%)`}}>
      <div style={{textAlign:"center",marginBottom:48}}>
        <div style={{fontSize:80,marginBottom:16}}>🎰</div>
        <div className="logo-text">BET<span className="logo-7">7</span></div>
        <div style={{color:C.textSub,fontSize:14,marginTop:8,letterSpacing:1}}>APOSTAS ESPORTIVAS</div>
      </div>
      <div style={{width:"100%",display:"flex",flexDirection:"column",gap:14}}>
        <button className="gold-btn" style={{width:"100%"}} onClick={()=>go("login")}>Fazer Login</button>
        <button className="ghost-btn" style={{width:"100%"}} onClick={()=>go("register")}>Cadastrar-se</button>
      </div>
      <div style={{marginTop:32,textAlign:"center",color:C.muted,fontSize:12}}>
        🔒 Jogo responsável • +18 anos
      </div>
    </div>
  );
}

// ─── 2. Register ──────────────────────────────────────────────────────────────
function RegisterScreen({go, setUser, setCoins}) {
  const [f,setF] = useState({name:"",email:"",pass:"",pass2:"",age:"",cpf:""});
  const [err,setErr] = useState("");
  const [ok,setOk] = useState(false);

  const handleCPF = v => {
    const d = v.replace(/\D/g,"").slice(0,11);
    let m = d;
    if(d.length>9) m=d.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/,"$1.$2.$3-$4");
    else if(d.length>6) m=d.replace(/(\d{3})(\d{3})(\d{3})/,"$1.$2.$3");
    else if(d.length>3) m=d.replace(/(\d{3})(\d{3})/,"$1.$2");
    setF({...f,cpf:m});
  };

  const submit = () => {
    if(!f.name||!f.email||!f.pass||!f.cpf) return setErr("Preencha todos os campos.");
    if(f.pass!==f.pass2) return setErr("As senhas não coincidem.");
    if(parseInt(f.age)<18) return setErr("Você deve ter mais de 18 anos.");
    const cpfNum = f.cpf.replace(/\D/g,"");
    if(cpfNum.length!==11) return setErr("CPF inválido.");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return setErr("E-mail inválido.");
    setUser({name:f.name,email:f.email,avatar:f.name[0].toUpperCase(),cpf:f.cpf});
    setCoins(50);
    setOk(true);
    setTimeout(()=>go("home"),1400);
  };

  return (
    <div className="screen" style={{overflowY:"auto"}}>
      <div style={{padding:"32px 24px 28px",background:C.card,borderBottom:`1px solid ${C.border}`}}>
        <div className="logo-text" style={{fontSize:28}}>BET<span className="logo-7">7</span></div>
        <div style={{color:C.textSub,fontSize:13,marginTop:4}}>Criar nova conta</div>
      </div>
      <div className="content">
        {ok && <div className="alert alert-green">✅ Conta criada! Entrando…</div>}
        {err && <div className="alert alert-red">⚠️ {err}</div>}
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[
            {label:"Nome completo",key:"name",type:"text",placeholder:"João Silva"},
            {label:"E-mail",key:"email",type:"email",placeholder:"joao@email.com"},
            {label:"Senha",key:"pass",type:"password",placeholder:"Mínimo 6 caracteres"},
            {label:"Confirmar senha",key:"pass2",type:"password",placeholder:"Repita a senha"},
            {label:"Idade",key:"age",type:"number",placeholder:"18"},
          ].map(({label,key,type,placeholder})=>(
            <div key={key}>
              <div style={{fontSize:12,color:C.textSub,marginBottom:5,fontWeight:500}}>{label}</div>
              <input type={type} placeholder={placeholder} value={f[key]} onChange={e=>setF({...f,[key]:e.target.value})}/>
            </div>
          ))}
          <div>
            <div style={{fontSize:12,color:C.textSub,marginBottom:5,fontWeight:500}}>CPF</div>
            <input type="text" placeholder="000.000.000-00" value={f.cpf} onChange={e=>handleCPF(e.target.value)}/>
          </div>
        </div>
        <button className="gold-btn" style={{width:"100%",marginTop:22}} onClick={submit}>Cadastrar</button>
        <div style={{textAlign:"center",marginTop:18,fontSize:14,color:C.textSub}}>
          Já tem conta? <span style={{color:C.gold,cursor:"pointer",fontWeight:600}} onClick={()=>go("login")}>Fazer login</span>
        </div>
        <div style={{textAlign:"center",marginTop:28,color:C.muted,fontSize:11}}>🎁 Ganhe 50 moedas de boas-vindas!</div>
      </div>
    </div>
  );
}

// ─── 3. Login ─────────────────────────────────────────────────────────────────
function LoginScreen({go, setUser, setCoins, setTickets}) {
  const [id,setId] = useState("");
  const [pass,setPass] = useState("");
  const [err,setErr] = useState("");

  const submit = () => {
    if(!id||!pass) return setErr("Preencha todos os campos.");
    // Demo: any credentials work
    const name = id.includes("@") ? id.split("@")[0] : id;
    const capName = name.charAt(0).toUpperCase()+name.slice(1);
    setUser({name:capName+" Silva",email:id,avatar:capName[0].toUpperCase(),cpf:"000.000.000-00"});
    setCoins(250);
    setTickets([
      {id:"BT001",gameId:1,teamA:"Flamengo",teamB:"Palmeiras",pick:"A",pickLabel:"Flamengo",odd:2.10,amount:20,status:"win",gain:42,ts:Date.now()-86400000},
      {id:"BT002",gameId:2,teamA:"Real Madrid",teamB:"Barcelona",pick:"B",pickLabel:"Barcelona",odd:4.00,amount:10,status:"loss",gain:-10,ts:Date.now()-3600000},
      {id:"BT003",gameId:3,teamA:"Lakers",teamB:"Warriors",pick:"A",pickLabel:"Lakers",odd:1.95,amount:30,status:"pending",gain:0,ts:Date.now()-600000},
    ]);
    go("home");
  };

  return (
    <div className="screen" style={{justifyContent:"center",padding:"40px 24px",background:`radial-gradient(ellipse at 50% 0%, ${C.gold}10, ${C.bg} 60%)`}}>
      <div style={{textAlign:"center",marginBottom:36}}>
        <div className="logo-text" style={{fontSize:36}}>BET<span className="logo-7">7</span></div>
        <div style={{color:C.textSub,fontSize:13,marginTop:4}}>Entre na sua conta</div>
      </div>
      {err && <div className="alert alert-red">⚠️ {err}</div>}
      <div style={{display:"flex",flexDirection:"column",gap:14,width:"100%"}}>
        <div>
          <div style={{fontSize:12,color:C.textSub,marginBottom:5,fontWeight:500}}>Nome ou E-mail</div>
          <input placeholder="seu@email.com" value={id} onChange={e=>setId(e.target.value)}/>
        </div>
        <div>
          <div style={{fontSize:12,color:C.textSub,marginBottom:5,fontWeight:500}}>Senha</div>
          <input type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/>
        </div>
        <button className="gold-btn" style={{width:"100%",marginTop:6}} onClick={submit}>Entrar</button>
        <button className="ghost-btn" style={{width:"100%"}} onClick={()=>go("register")}>Criar conta</button>
      </div>
      <div style={{textAlign:"center",marginTop:24,fontSize:12,color:C.muted}}>🔒 Acesso seguro e criptografado</div>
    </div>
  );
}

// ─── 4. Home ──────────────────────────────────────────────────────────────────
function HomeScreen({go, user, coins, nav, TopBar, setSideOpen}) {
  if(!user) return null;
  const firstName = user.name.split(" ")[0];
  return (
    <div className="screen">
      {nav}
      <div className="topbar">
        <button className="dots-btn" onClick={()=>setSideOpen(true)}>⋮</button>
        <div className="logo-text" style={{fontSize:22}}>BET<span className="logo-7">7</span></div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div className="coin-badge">🪙 {fmt(coins)}</div>
          <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${C.gold},${C.goldL})`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"#000",fontSize:14,cursor:"pointer",border:`2px solid ${C.gold}`}} onClick={()=>go("profile")}>{user.avatar}</div>
        </div>
      </div>

      <div className="content">
        {/* Hero */}
        <div style={{background:`linear-gradient(135deg,${C.gold}22,${C.green}18)`,border:`1px solid ${C.gold}44`,borderRadius:18,padding:"20px 18px",marginBottom:20}}>
          <div style={{fontSize:13,color:C.textSub,marginBottom:4}}>Bem-vindo de volta,</div>
          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:22,color:C.text}}>{firstName} 🏆</div>
          <div style={{marginTop:10,display:"flex",gap:16}}>
            <div><div style={{fontSize:11,color:C.textSub}}>Saldo</div><div style={{fontFamily:"'Oswald',sans-serif",fontSize:20,color:C.gold}}>🪙 {fmt(coins)}</div></div>
          </div>
        </div>

        {/* Quick actions */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:22}}>
          {[
            {icon:"⚽",label:"Apostar",  sc:"bet",    color:C.green},
            {icon:"💰",label:"Depósito", sc:"deposit", color:C.gold},
            {icon:"🎟️",label:"Bilhetes", sc:"tickets", color:"#A855F7"},
            {icon:"💸",label:"Saque",    sc:"withdraw",color:"#3B82F6"},
          ].map(({icon,label,sc,color})=>(
            <div key={sc} onClick={()=>go(sc)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:".2s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=color}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
              <span style={{fontSize:24}}>{icon}</span>
              <span style={{fontWeight:600,fontSize:14,color:C.text}}>{label}</span>
            </div>
          ))}
        </div>

        {/* Live games */}
        <div className="section-title">🔴 Jogos ao Vivo</div>
        {GAMES.slice(0,3).map(g=>(
          <div key={g.id} className="highlight-card" onClick={()=>go("bet")} style={{cursor:"pointer"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{fontSize:11,color:C.gold,fontWeight:600}}>{g.league}</span>
              <span style={{fontSize:11}}><span className="live-dot"/>AO VIVO</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{textAlign:"center",flex:1}}>
                <div style={{fontSize:20}}>{g.sport}</div>
                <div style={{fontSize:13,fontWeight:600,marginTop:4}}>{g.teamA}</div>
                <div style={{fontSize:12,color:C.gold,fontWeight:700,marginTop:4}}>{g.oddA.toFixed(2)}</div>
              </div>
              <div style={{textAlign:"center",padding:"0 10px"}}>
                <div style={{background:C.border,borderRadius:20,padding:"4px 12px",fontSize:11,color:C.textSub}}>VS</div>
                {g.oddD>0&&<div style={{fontSize:11,color:C.textSub,marginTop:4}}>{g.oddD.toFixed(2)}</div>}
              </div>
              <div style={{textAlign:"center",flex:1}}>
                <div style={{fontSize:20}}>{g.sport}</div>
                <div style={{fontSize:13,fontWeight:600,marginTop:4}}>{g.teamB}</div>
                <div style={{fontSize:12,color:C.gold,fontWeight:700,marginTop:4}}>{g.oddB.toFixed(2)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav go={go} active="home"/>
    </div>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNav({go, active}) {
  const items=[
    {icon:"🎟️",label:"Bilhetes",sc:"tickets"},
    {icon:"⚽",label:"Apostar", sc:"bet"},
    {icon:"💰",label:"Depósito",sc:"deposit"},
    {icon:"💸",label:"Saque",   sc:"withdraw"},
    {icon:"👤",label:"Conta",   sc:"profile"},
  ];
  return (
    <nav className="bottomnav">
      {items.map(({icon,label,sc})=>(
        <button key={sc} className={`nav-btn ${active===sc?"active":""}`} onClick={()=>go(sc)}>
          <span className="nav-icon">{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

// ─── 7. Bet ───────────────────────────────────────────────────────────────────
function BetScreen({go, nav, TopBar, coins, setCoins, tickets, setTickets}) {
  const [sel,setSel]    = useState({});   // {gameId: "A"|"D"|"B"}
  const [amounts,setAmounts] = useState({});
  const [msgs,setMsgs]  = useState({});
  const [confirming,setConfirming] = useState(null);

  const placeBet = (game) => {
    const pick = sel[game.id];
    const amt  = parseFloat(amounts[game.id]||0);
    if(!pick) return setMsgs({...msgs,[game.id]:{type:"red",text:"Selecione um resultado."}});
    if(amt<1||isNaN(amt)) return setMsgs({...msgs,[game.id]:{type:"red",text:"Mínimo de 1 moeda."}});
    if(amt>coins) return setMsgs({...msgs,[game.id]:{type:"red",text:"Saldo insuficiente."}});
    setCoins(c=>c-amt);
    const pickLabel = pick==="A"?game.teamA:pick==="B"?game.teamB:"Empate";
    const odd = pick==="A"?game.oddA:pick==="B"?game.oddB:game.oddD;
    const ticket = {id:genId(),gameId:game.id,teamA:game.teamA,teamB:game.teamB,pick,pickLabel,odd,amount:amt,status:"pending",gain:0,ts:Date.now()};
    setTickets(t=>[...t,ticket]);
    setMsgs({...msgs,[game.id]:{type:"green",text:"✅ Aposta realizada!"}});
    setSel({...sel,[game.id]:null});
    setAmounts({...amounts,[game.id]:""});
    // Resolve after 8s
    setTimeout(()=>{
      const win = Math.random()>0.5;
      setTickets(prev=>prev.map(tk=>tk.id===ticket.id
        ? {...tk,status:win?"win":"loss",gain:win?parseFloat((amt*odd).toFixed(2)):-amt}
        : tk
      ));
      if(win) setCoins(c=>c+parseFloat((amt*odd).toFixed(2)));
    },8000);
  };

  return (
    <div className="screen">
      {nav}
      <TopBar title="APOSTAR" right={<div className="coin-badge">🪙 {fmt(coins)}</div>}/>
      <div className="content">
        <div className="section-title">⚽ Jogos Disponíveis</div>
        {GAMES.map(g=>{
          const msg = msgs[g.id];
          const picked = sel[g.id];
          const odd = picked==="A"?g.oddA:picked==="B"?g.oddB:picked==="D"?g.oddD:null;
          const amt = parseFloat(amounts[g.id]||0);
          const gain = odd&&amt>=1 ? (amt*odd).toFixed(2) : null;
          return (
            <div key={g.id} className="game-card">
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <span style={{fontSize:11,color:C.gold,fontWeight:600}}>{g.league}</span>
                <span style={{fontSize:11}}><span className="live-dot"/>AO VIVO</span>
              </div>
              <div style={{textAlign:"center",fontFamily:"'Oswald',sans-serif",fontSize:16,marginBottom:12,color:C.text}}>
                {g.teamA} <span style={{color:C.muted,fontWeight:300}}>vs</span> {g.teamB}
              </div>
              <div style={{display:"flex",gap:8,marginBottom:14}}>
                {[
                  {key:"A",label:g.teamA,val:g.oddA},
                  ...(g.oddD>0?[{key:"D",label:"Empate",val:g.oddD}]:[]),
                  {key:"B",label:g.teamB,val:g.oddB},
                ].map(({key,label,val})=>(
                  <button key={key} className={`odd-btn ${picked===key?"selected":""}`} onClick={()=>setSel({...sel,[g.id]:key})}>
                    <span className="odd-label">{label}</span>
                    <span className="odd-value">{val.toFixed(2)}</span>
                  </button>
                ))}
              </div>
              {picked && (
                <>
                  <div style={{fontSize:12,color:C.textSub,marginBottom:5}}>Quantidade de moedas (mín. 1)</div>
                  <input type="number" min="1" step="0.5" placeholder="Ex: 10" value={amounts[g.id]||""} onChange={e=>setAmounts({...amounts,[g.id]:e.target.value})} style={{marginBottom:8}}/>
                  {gain && <div style={{fontSize:12,color:C.green,marginBottom:8}}>💰 Possível ganho: 🪙 {fmt(gain)}</div>}
                  <button className="gold-btn" style={{width:"100%"}} onClick={()=>placeBet(g)}>Confirmar Aposta</button>
                </>
              )}
              {msg && <div className={`alert alert-${msg.type}`} style={{marginTop:10,marginBottom:0}}>{msg.text}</div>}
            </div>
          );
        })}
      </div>
      <BottomNav go={go} active="bet"/>
    </div>
  );
}

// ─── 8. Tickets ───────────────────────────────────────────────────────────────
function TicketsScreen({go, nav, TopBar, tickets}) {
  const [tab,setTab] = useState("all");
  const tabs=[{k:"pending",l:"🔄 Em andamento"},{k:"win",l:"✅ Ganhos"},{k:"loss",l:"❌ Perdidos"},{k:"all",l:"📋 Todos"}];
  const filtered = tab==="all" ? tickets : tickets.filter(t=>t.status===tab);
  const sorted = [...filtered].sort((a,b)=>b.ts-a.ts);

  return (
    <div className="screen">
      {nav}
      <TopBar title="MEUS BILHETES"/>
      <div className="content">
        <div className="tab-bar">
          {tabs.map(({k,l})=>(
            <button key={k} className={`tab ${tab===k?"active":""}`} onClick={()=>setTab(k)}>{l}</button>
          ))}
        </div>
        {sorted.length===0
          ? <div style={{textAlign:"center",color:C.muted,padding:"40px 0",fontSize:14}}>Nenhum bilhete aqui ainda.</div>
          : sorted.map(t=>(
              <div key={t.id} className={`ticket-card ${t.status}`}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{fontSize:12,color:C.muted,fontFamily:"monospace"}}>#{t.id}</span>
                  <span className={`badge badge-${t.status==="win"?"green":t.status==="loss"?"red":t.status==="pending"?"gold":"gray"}`}>
                    {t.status==="win"?"GANHOU":t.status==="loss"?"PERDEU":t.status==="pending"?"EM JOGO":"—"}
                  </span>
                </div>
                <div style={{fontWeight:600,marginBottom:4}}>{t.teamA} vs {t.teamB}</div>
                <div style={{fontSize:13,color:C.textSub}}>Aposta: <span style={{color:C.text}}>{t.pickLabel}</span> @ <span style={{color:C.gold}}>{t.odd.toFixed(2)}</span></div>
                <div style={{fontSize:13,color:C.textSub,marginTop:2}}>Valor: <span style={{color:C.text}}>🪙 {fmt(t.amount)}</span></div>
                {t.status!=="pending" && (
                  <div style={{fontSize:13,marginTop:4,color:t.status==="win"?C.green:C.red}}>
                    {t.status==="win"?`+🪙 ${fmt(t.gain)}`:`-🪙 ${fmt(t.amount)}`}
                  </div>
                )}
                <div style={{fontSize:10,color:C.muted,marginTop:6}}>{new Date(t.ts).toLocaleString("pt-BR")}</div>
              </div>
            ))
        }
      </div>
      <BottomNav go={go} active="tickets"/>
    </div>
  );
}

// ─── 6. Deposit ───────────────────────────────────────────────────────────────
function DepositScreen({go, nav, TopBar, coins, setCoins}) {
  const [sel,setSel]   = useState(null);
  const [step,setStep] = useState("choose"); // choose | qr | done
  const amounts = [20,50,100,200,400,500,1000];

  const confirm = () => {
    if(!sel) return;
    setStep("qr");
    // Simulate payment after 4s
    setTimeout(()=>{
      setCoins(c=>c+sel);
      setStep("done");
    },4000);
  };

  return (
    <div className="screen">
      {nav}
      <TopBar title="DEPÓSITO" right={<div className="coin-badge">🪙 {fmt(coins)}</div>}/>
      <div className="content">
        {step==="choose" && (
          <>
            <div className="section-title">💰 Selecione o Valor</div>
            <div className="amount-grid">
              {amounts.map(a=>(
                <div key={a} className={`amount-chip ${sel===a?"selected":""}`} onClick={()=>setSel(a)}>
                  R$ {a.toLocaleString("pt-BR")}
                </div>
              ))}
            </div>
            <div className="alert alert-gold">⚡ 1 Real = 1 Moeda · Mínimo R$ 20</div>
            <button className="gold-btn" style={{width:"100%",marginTop:8}} onClick={confirm} disabled={!sel} style={{width:"100%",opacity:sel?1:.5}}>Confirmar Depósito</button>
          </>
        )}
        {step==="qr" && (
          <>
            <div className="section-title">📱 Pague com PIX</div>
            <div className="pix-box">
              <div className="qr-mock">
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,8px)",gap:2}}>
                  {Array.from({length:49},(_,i)=>(
                    <div key={i} style={{width:8,height:8,background:Math.random()>.5?"#000":"#fff",borderRadius:1}}/>
                  ))}
                </div>
              </div>
              <div style={{color:C.gold,fontSize:16,fontWeight:700}}>R$ {sel?.toLocaleString("pt-BR")},00</div>
              <div style={{color:C.textSub,fontSize:13,marginTop:6}}>Escaneie o QR Code acima</div>
              <div style={{marginTop:12,fontSize:12,color:C.muted,display:"flex",alignItems:"center",gap:6}}>
                <div className="live-dot"/>Aguardando pagamento…
              </div>
            </div>
          </>
        )}
        {step==="done" && (
          <>
            <div style={{textAlign:"center",padding:"40px 0"}}>
              <div style={{fontSize:72,marginBottom:16}}>✅</div>
              <div style={{fontFamily:"'Oswald',sans-serif",fontSize:24,color:C.green,marginBottom:8}}>Pagamento confirmado!</div>
              <div style={{color:C.textSub}}>Seu saldo foi atualizado.</div>
              <div style={{margin:"20px 0",background:`${C.green}18`,border:`1px solid ${C.green}44`,borderRadius:14,padding:"16px",fontSize:18,fontWeight:700,color:C.green}}>
                +🪙 {fmt(sel)}
              </div>
              <button className="gold-btn" style={{width:"100%"}} onClick={()=>setStep("choose")}>Fazer outro depósito</button>
            </div>
          </>
        )}
      </div>
      <BottomNav go={go} active="deposit"/>
    </div>
  );
}

// ─── 9. Withdraw ──────────────────────────────────────────────────────────────
function WithdrawScreen({go, nav, TopBar, user, coins, setCoins}) {
  const [cpf,setCpf]   = useState(user?.cpf||"");
  const [name,setName] = useState(user?.name||"");
  const [amt,setAmt]   = useState("");
  const [err,setErr]   = useState("");
  const [done,setDone] = useState(false);

  const submit = () => {
    const a = parseFloat(amt);
    if(!cpf||!name||!amt) return setErr("Preencha todos os campos.");
    if(a<1||isNaN(a)) return setErr("Mínimo 1 moeda.");
    if(a>coins) return setErr("Saldo insuficiente.");
    setCoins(c=>c-a);
    setDone(true);
  };

  return (
    <div className="screen">
      {nav}
      <TopBar title="SAQUE" right={<div className="coin-badge">🪙 {fmt(coins)}</div>}/>
      <div className="content">
        {done ? (
          <div style={{textAlign:"center",padding:"40px 0"}}>
            <div style={{fontSize:60,marginBottom:16}}>⏳</div>
            <div style={{fontFamily:"'Oswald',sans-serif",fontSize:20,color:C.gold,marginBottom:16}}>Solicitação enviada!</div>
            <div className="card" style={{textAlign:"left"}}>
              <p style={{color:C.textSub,fontSize:14,lineHeight:1.7}}>
                Suas informações estão em análise para verificação de identidade. Em até <strong style={{color:C.gold}}>24 horas</strong> você receberá uma resposta.
              </p>
            </div>
            <button className="ghost-btn" style={{width:"100%",marginTop:20}} onClick={()=>setDone(false)}>Nova solicitação</button>
          </div>
        ) : (
          <>
            <div className="section-title">💸 Solicitar Saque</div>
            {err && <div className="alert alert-red">⚠️ {err}</div>}
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div>
                <div style={{fontSize:12,color:C.textSub,marginBottom:5}}>CPF</div>
                <input value={cpf} onChange={e=>setCpf(e.target.value)} placeholder="000.000.000-00"/>
              </div>
              <div>
                <div style={{fontSize:12,color:C.textSub,marginBottom:5}}>Nome completo</div>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="Seu nome"/>
              </div>
              <div>
                <div style={{fontSize:12,color:C.textSub,marginBottom:5}}>Moedas a sacar</div>
                <input type="number" min="1" value={amt} onChange={e=>setAmt(e.target.value)} placeholder="Mínimo 1 moeda"/>
              </div>
            </div>
            <div className="alert alert-gold" style={{marginTop:16}}>🪙 Saldo disponível: {fmt(coins)}</div>
            <button className="gold-btn" style={{width:"100%",marginTop:8}} onClick={submit}>Confirmar Saque</button>
          </>
        )}
      </div>
      <BottomNav go={go} active="withdraw"/>
    </div>
  );
}

// ─── 5. Profile ───────────────────────────────────────────────────────────────
function ProfileScreen({go, nav, TopBar, user, setUser, logout}) {
  const [name,setName]   = useState(user?.name||"");
  const [pass,setPass]   = useState("");
  const [saved,setSaved] = useState(false);
  const [delModal,setDelModal] = useState(false);
  const [delPass,setDelPass]   = useState("");
  const [delErr,setDelErr]     = useState("");
  const fileRef = useRef();

  const save = () => {
    setUser(u=>({...u,name,avatar:name[0]?.toUpperCase()||u.avatar}));
    setSaved(true);
    setTimeout(()=>setSaved(false),2000);
  };

  const deleteAccount = () => {
    if(delPass.length<1) return setDelErr("Digite sua senha atual.");
    logout();
  };

  return (
    <div className="screen">
      {nav}
      <TopBar title="CONTA"/>
      <div className="content">
        {/* Avatar */}
        <div style={{textAlign:"center",marginBottom:24}}>
          <div className="profile-avatar" onClick={()=>fileRef.current.click()}>
            {user?.avatar}
            <div style={{position:"absolute",bottom:0,right:0,background:C.gold,borderRadius:"50%",width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>✏️</div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}}/>
          <div style={{fontFamily:"'Oswald',sans-serif",fontSize:18,marginTop:8}}>{user?.name}</div>
          <div style={{fontSize:12,color:C.muted}}>{user?.email}</div>
        </div>

        <div className="card" style={{marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:600,color:C.gold,marginBottom:14}}>✏️ Editar Perfil</div>
          {saved && <div className="alert alert-green">✅ Alterações salvas!</div>}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <div>
              <div style={{fontSize:12,color:C.textSub,marginBottom:5}}>Nome</div>
              <input value={name} onChange={e=>setName(e.target.value)}/>
            </div>
            <div>
              <div style={{fontSize:12,color:C.textSub,marginBottom:5}}>Nova senha</div>
              <input type="password" placeholder="Deixe em branco para não alterar" value={pass} onChange={e=>setPass(e.target.value)}/>
            </div>
          </div>
          <button className="gold-btn" style={{width:"100%",marginTop:16}} onClick={save}>Salvar alterações</button>
        </div>

        <div className="card" style={{borderColor:"#EF444444"}}>
          <div style={{fontSize:13,fontWeight:600,color:C.red,marginBottom:10}}>⚠️ Zona de perigo</div>
          <div style={{fontSize:13,color:C.textSub,marginBottom:14}}>A exclusão de conta é permanente e não pode ser desfeita.</div>
          <button className="red-btn" style={{width:"100%"}} onClick={()=>setDelModal(true)}>Excluir Conta</button>
        </div>
      </div>

      {delModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div style={{fontSize:18,fontWeight:700,marginBottom:6,color:C.red}}>⚠️ Confirmar exclusão</div>
            <div style={{fontSize:13,color:C.textSub,marginBottom:16}}>Digite sua senha atual para confirmar.</div>
            {delErr && <div className="alert alert-red">{delErr}</div>}
            <input type="password" placeholder="Sua senha" value={delPass} onChange={e=>setDelPass(e.target.value)} style={{marginBottom:16}}/>
            <div style={{display:"flex",gap:10}}>
              <button className="ghost-btn" style={{flex:1}} onClick={()=>{setDelModal(false);setDelPass("");setDelErr("")}}>Cancelar</button>
              <button className="red-btn" style={{flex:1}} onClick={deleteAccount}>Excluir</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav go={go} active="profile"/>
    </div>
  );
}
