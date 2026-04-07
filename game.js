// ============================================================
// HoshiPet — game.js  (全部游戏逻辑)
// ============================================================

// ---------- 常量数据 ----------
const SAVE_KEY = 'hoshiPet_v1';
const APP_VER  = '1.2.0';

const CAT_POOL = [
  { emoji:'🐱', breed:'橘猫',    rarity:'common', traits:'热情活泼，超级贪吃' },
  { emoji:'🐈', breed:'英短蓝猫', rarity:'common', traits:'慵懒高冷，内心柔软' },
  { emoji:'🐈‍⬛',breed:'黑猫',   rarity:'common', traits:'神秘优雅，夜行精灵' },
  { emoji:'😺', breed:'狸花猫',  rarity:'common', traits:'机灵活泼，适应力强' },
  { emoji:'😸', breed:'暹罗猫',  rarity:'common', traits:'话多爱叫，忠诚护主' },
  { emoji:'😼', breed:'美短',    rarity:'common', traits:'性格温和，亲近人类' },
  { emoji:'😻', breed:'布偶猫',  rarity:'rare',   traits:'温顺粘人，天生萌货' },
  { emoji:'🙀', breed:'曼基康',  rarity:'rare',   traits:'短腿超萌，活力满满' },
  { emoji:'😹', breed:'金渐层',  rarity:'rare',   traits:'金光闪耀，高贵优雅' },
  { emoji:'😽', breed:'银渐层',  rarity:'rare',   traits:'冷艳迷人，气质非凡' },
  { emoji:'🐾', breed:'缅因猫',  rarity:'rare',   traits:'体型巨大，温柔巨人' },
];

const ITEM_CATEGORIES = {
  food:    { label: '🍱 食品类', functional: false },
  drink:   { label: '🐧 饮料类', functional: false },
  hygiene: { label: '🛁 洗澡清洁', functional: false },
  health:  { label: '💊 健康医疗', functional: false },
  fun:     { label: '🎮 娱乐玩具', functional: false },
  special: { label: '✨ 特殊道具', functional: true },
};

const ITEMS = [
  // 食品类
  { id:'snack',    cat:'food',    icon:'🫙', name:'小零食',        desc:'饱食+20 心情+5 健康-2 清洁-5',       price:5,   effect:{ satiety:20, mood:5, health:-2, cleanliness:-5 } },
  { id:'fish',     cat:'food',    icon:'🐟', name:'鱼罐头',        desc:'饱食+40 水分+5',                     price:12,  effect:{ satiety:40, thirst:5 } },
  { id:'chicken',  cat:'food',    icon:'🍗', name:'烤鸡腿',        desc:'饱食+60 心情+25 健康-15 清洁-15',    price:22,  effect:{ satiety:60, mood:25, health:-15, cleanliness:-15 } },
  { id:'steak',    cat:'food',    icon:'🥩', name:'生牛肉大餐',    desc:'饱食+100 健康+15 心情+30 清洁-10',   price:45,  effect:{ satiety:100, health:15, mood:30, cleanliness:-10 } },
  { id:'catgrass', cat:'food',    icon:'🪴', name:'猫草',          desc:'饱食+10 健康+20 心情+15',            price:18,  effect:{ satiety:10, health:20, mood:15 } },
  // 饮料类
  { id:'tapwater', cat:'drink',   icon:'🚰', name:'自来水',        desc:'水分+30 健康-5',                     price:3,   effect:{ thirst:30, health:-5 } },
  { id:'water',    cat:'drink',   icon:'💧', name:'矿泉水',        desc:'水分+45',                            price:10,  effect:{ thirst:45 } },
  { id:'milk',     cat:'drink',   icon:'🥛', name:'纯牛奶',        desc:'水分+50 心情+15 健康-10',            price:18,  effect:{ thirst:50, mood:15, health:-10 } }, 
  { id:'juice',    cat:'drink',   icon:'🧃', name:'营养果汁',      desc:'水分+70 健康+5 心情+5',              price:25,  effect:{ thirst:70, health:5, mood:5 } },
  { id:'tea',      cat:'drink',   icon:'🍵', name:'猫薄荷草茶',    desc:'水分+60 心情+40 饱食-5',             price:30,  effect:{ thirst:60, mood:40, satiety:-5 } },
  { id:'coffee',   cat:'drink',   icon:'☕', name:'猫薄荷咖啡',    desc:'水分+40 心情+50 健康-15',            price:35,  effect:{ thirst:40, mood:50, health:-15 } },
  { id:'nutri',    cat:'drink',   icon:'🧪', name:'特制营养液',    desc:'水分+80 健康+25 心情+20',            price:48,  effect:{ thirst:80, health:25, mood:20 } },
  // 洗澡清洁
  { id:'spray',    cat:'hygiene', icon:'💦', name:'除臭喷雾',      desc:'清洁+30 心情-10',                    price:6,   effect:{ cleanliness:30, mood:-10 } }, 
  { id:'soap',     cat:'hygiene', icon:'🧼', name:'香皂',          desc:'清洁+40 心情-15 健康+5',             price:10,  effect:{ cleanliness:40, mood:-15, health:5 } },
  { id:'dryshamp', cat:'hygiene', icon:'🧴', name:'免洗洗手液',    desc:'清洁+50 健康+5 心情-5',              price:15,  effect:{ cleanliness:50, health:5, mood:-5 } },
  { id:'brush',    cat:'hygiene', icon:'🪷', name:'牙刷套装',      desc:'清洁+60 健康+10 心情-15',            price:20,  effect:{ cleanliness:60, health:10, mood:-15 } },
  { id:'shampoo',  cat:'hygiene', icon:'🧴', name:'香波沐浴露',    desc:'清洁+70 健康+10 心情-20',            price:25,  effect:{ cleanliness:70, health:10, mood:-20 } },
  { id:'bath',     cat:'hygiene', icon:'🛁', name:'温水泡澡',      desc:'清洁+80 健康+15 心情-20',            price:28,  effect:{ cleanliness:80, health:15, mood:-20 } }, 
  { id:'spa',      cat:'hygiene', icon:'💆', name:'尊享猫咪SPA',   desc:'清洁+100 健康+30 心情+40',           price:65,  effect:{ cleanliness:100, health:30, mood:40 } },
  // 健康医疗
  { id:'bandage',  cat:'health',  icon:'🩹', name:'创可贴',        desc:'健康+15 心情-5',                     price:6,   effect:{ health:15, mood:-5 } },
  { id:'pill',     cat:'health',  icon:'💊', name:'苦味小药丸',    desc:'健康+30 心情-15',                    price:12,  effect:{ health:30, mood:-15 } },
  { id:'medicine', cat:'health',  icon:'💉', name:'猫咪疫苗',      desc:'健康+45 心情-20',                    price:25,  effect:{ health:45, mood:-20 } },
  { id:'probiotic',cat:'health',  icon:'🧫', name:'冻干益生菌',    desc:'健康+20 心情+5',                     price:35,  effect:{ health:20, mood:5 } },
  { id:'vaccine',  cat:'health',  icon:'🏥', name:'宠物医院体检',  desc:'健康+80 心情-30',                    price:70,  effect:{ health:80, mood:-30 } },
  // 娱乐玩具
  { id:'yarn',     cat:'fun',     icon:'🧶', name:'毛线球',        desc:'心情+25 饱食-5 水分-5',              price:8,   effect:{ mood:25, satiety:-5, thirst:-5 } },
  { id:'plush',    cat:'fun',     icon:'🧸', name:'毛绒玩具',      desc:'心情+35 饱食-5 水分-5 健康+2',       price:12,  effect:{ mood:35, satiety:-5, thirst:-5, health:2 } },
  { id:'toy',      cat:'fun',     icon:'🎀', name:'逗猫棒',        desc:'心情+45 健康+5 饱食-10 水分-10',     price:18,  effect:{ mood:45, health:5, satiety:-10, thirst:-10 } },
  { id:'toyset',   cat:'fun',     icon:'🎈', name:'猫咪玩具套装',  desc:'心情+60 健康+10 饱食-15 水分-15',    price:28,  effect:{ mood:60, health:10, satiety:-15, thirst:-15 } },
  { id:'mouse',    cat:'fun',     icon:'🐭', name:'电动老鼠',      desc:'心情+80 饱食-15 水分-15',            price:35,  effect:{ mood:80, satiety:-15, thirst:-15 } },
  { id:'laser',    cat:'fun',     icon:'🛸', name:'全息猫爬架',    desc:'心情+100 健康+20 饱食-20 水分-20',   price:75,  effect:{ mood:100, health:20, satiety:-20, thirst:-20 } },
  // 特殊道具
  { id:'rename',   cat:'special', icon:'📛', name:'改名卡',        desc:'可以重新命名猫咪',                   price:30,  effect:{ rename:true } },
  { id:'revive',   cat:'special', icon:'💌', name:'复活卡',        desc:'复活失去的好朋友',                   price:100, effect:{ revive:true } },
];

const TRIP_EVENTS = [
  { text:'发现了一块闪亮的小石头！', mood:5 },
  { text:'追到了一只蝴蝶，开心转圈！', mood:15 },
  { text:'突然下起雨，淋湿了...', cleanliness:-20 },
  { text:'捡到了一枚金币！', gold:5 },
  { text:'遇到友善的流浪猫，成为了朋友！', mood:20 },
  { text:'吃了一片奇怪的草，肚子不舒服...', health:-10 },
  { text:'找到阳光角落打了个盹，好惬意~', mood:10, health:5 },
  { text:'被一条大狗吓到了，撒腿就跑！', mood:-10 },
];

const COURSES = [
  { id:'phys_1',  cat:'phys',  name:'体育初级', level:1, learnTicks:360, req:[] },
  { id:'phys_2',  cat:'phys',  name:'体育中级', level:2, learnTicks:720, req:['phys_1'] },
  { id:'culi_1',  cat:'culi',  name:'厨艺初级', level:1, learnTicks:320, req:[] },
  { id:'culi_2',  cat:'culi',  name:'厨艺中级', level:2, learnTicks:640, req:['culi_1'] },
  { id:'culi_3',  cat:'culi',  name:'厨艺高级', level:3, learnTicks:1200,req:['culi_2'] },
  { id:'logic_1', cat:'logic', name:'逻辑初级', level:1, learnTicks:400, req:[] },
  { id:'logic_2', cat:'logic', name:'逻辑中级', level:2, learnTicks:900, req:['logic_1'] },
  { id:'art_1',   cat:'art',   name:'艺术初级', level:1, learnTicks:300, req:[] },
  { id:'art_2',   cat:'art',   name:'艺术中级', level:2, learnTicks:600, req:['art_1'] },
  { id:'math_1',  cat:'math',  name:'数学初级', level:1, learnTicks:400, req:[] },
  { id:'math_2',  cat:'math',  name:'数学中级', level:2, learnTicks:900, req:['math_1'] },
];

const COURSE_CATS = {
  phys:  { label: '体育 💪', icon: '⚽' },
  culi:  { label: '厨艺 🍳', icon: '🍲' },
  logic: { label: '逻辑 🧠', icon: '♟️' },
  math:  { label: '数学 🔢', icon: '📐' },
  art:   { label: '艺术 🎨', icon: '🖌️' },
};

const PROFESSIONS = [
  // Tier 1
  { id:'rider',      icon:'🛵', name:'外卖骑士', desc:'无门槛，风雨无阻地奔波',   workTicks:240, wage:9,  reqSkills:[], tier:1 },
  { id:'guardian',   icon:'🛡️', name:'看门保安', desc:'基础体能要求，守卫家园',     workTicks:480, wage:12, reqSkills:['phys_1'], tier:1 },
  { id:'barista',    icon:'☕',  name:'咖啡师',   desc:'掌握厨艺，调制醇香咖啡',     workTicks:240, wage:8,  reqSkills:['culi_1'], tier:1 },
  { id:'hunter',     icon:'🐭', name:'捕鼠猎手', desc:'身体矫健，保卫粮仓',         workTicks:240, wage:10, reqSkills:['phys_1'], tier:1 },
  { id:'mascot',     icon:'🎭', name:'猫咪吉祥物', desc:'体力与亲和力的双重挑战', workTicks:480, wage:15, reqSkills:['phys_1','art_1'], tier:1 },
  
  // Tier 2
  { id:'fisher',     icon:'🎣', name:'渔夫猫',   desc:'虽然也靠体力，但需要耐心',   workTicks:720, wage:28, reqSkills:['phys_1'], tier:2 },
  { id:'detective',  icon:'🔍', name:'侦探猫',   desc:'智慧与身手的结合体',         workTicks:480, wage:26, reqSkills:['logic_1','phys_1'], tier:2 },
  { id:'editor',     icon:'📝', name:'脚本编辑', desc:'逻辑与构思的创作职业',       workTicks:480, wage:22, reqSkills:['art_2'], tier:2 },
  
  // Tier 3
  { id:'chef',       icon:'🍳', name:'星级厨师', desc:'厨艺之巅，料理大师',         workTicks:720, wage:42, reqSkills:['culi_3'], tier:3 },
  { id:'accountant', icon:'📊', name:'理财顾问', desc:'玩转数字与逻辑的猫',         workTicks:960, wage:70, reqSkills:['logic_2','math_2'], tier:3 },
  { id:'manager',    icon:'🎩', name:'猫咖店长', desc:'全能精英，统筹经营',         workTicks:960, wage:80, reqSkills:['culi_2','art_2'], tier:3 },
];

// ---------- 全局状态 ----------
let gs = null;
let tickTimer = null;
let tickMs = 30000;
let isPaused = false;
let logs = [];
let selectedCatCard = null;
let selectedCatData = null;

// ---------- 存档 ----------
function saveGame() {
  if (!gs) return;
  gs.lastSaveTime = Date.now();
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({ gs, logs, tickMs, isPaused })); } catch(e) {}
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    gs = data.gs;
    logs = data.logs || [];
    if (data.tickMs) tickMs = data.tickMs;
    if (data.isPaused !== undefined) isPaused = data.isPaused;
    // 数据迁移与状态补全
    if (gs.workTargetTicks === undefined)  gs.workTargetTicks = 240;
    if (gs.workTicksElapsed === undefined) gs.workTicksElapsed = 0;
    if (gs.learnedSkills === undefined)    gs.learnedSkills = {};
    if (gs.skillProgress === undefined)    gs.skillProgress = {};
    if (gs.studyingCourseId === undefined) gs.studyingCourseId = null;

    // 职业证书补偿逻辑（如果老玩家学会了某职业，自动发放对应门槛的基础证书）
    if (Object.keys(gs.learnedProfessions || {}).length > 0 && Object.keys(gs.learnedSkills).length === 0) {
      PROFESSIONS.forEach(p => {
        if (gs.learnedProfessions[p.id]) {
          p.reqSkills.forEach(s => gs.learnedSkills[s] = true);
        }
      });
      addLog('🔧 系统：检测到旧版本存档，已为你自动转换职业资格证。');
    }

    return true;
  } catch(e) { return false; }
}

function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}

// ---------- 离线计算 ----------
function applyOfflineTicks() {
  if (isPaused) {
    gs.lastSaveTime = Date.now();
    saveGame();
    return;
  }
  const elapsed = Date.now() - gs.lastSaveTime;
  const total = Math.floor(elapsed / tickMs);
  if (total <= 0) {
    saveGame();
    return;
  }
  for (let i = 0; i < total; i++) { applyDecay(false); gs.ticks++; }
  const mins = Math.round(total * tickMs / 60000);
  if (mins >= 1) {
    const el = document.getElementById('offlineNotice');
    if (el) {
      el.style.display = 'block';
      el.innerHTML = `⏰ <strong>${gs.name}</strong> 离线了约 ${mins} 分钟，状态发生了变化~`;
      setTimeout(() => el.style.display = 'none', 5000);
    }
    addLog(`⏰ 离线了 ${mins} 分钟，${gs.name} 在家等你回来~`);
  }
  saveGame();
}

// ---------- 衰减 ----------
function getMultiplier() {
  return { idle: [1,1,1], work: [1.8,1.8,1.5], study: [1.5,1.5,1.2], trip: [2,2.5,2] }[gs.state] || [1,1,1];
}

function applyDecay(withEvents = true) {
  if (!gs || gs.isDead) return;
  const v = gs.cat.vitality, r = gs.cat.resistance, iq = gs.cat.intelligence;
  const [ms, mt, mc] = getMultiplier();

  // 平衡性重构：
  // ⚡ 活泼度 (v)：Level 3 为基准，范围 -25% 到 +25% (步长 12.5%)。仅影响生存消耗压力。
  // 🛡️ 抵抗力 (r)：Level 3 为基准，范围 -25% (脆弱) 到 +25% (强健) (步长 12.5%)。影响生存韧性。
  // 🧠 智力 (iq)：-10%, 0%, 10%, 20%, 30%。影响成长速度。

  const vFactor = 1 + (v - 3) * 0.125; 
  const baseSatiety = 0.010 * vFactor; 
  const baseThirst  = 0.012 * vFactor;
  const baseClean   = 0.008;

  gs.satiety     = clamp(gs.satiety     - baseSatiety * ms);
  gs.thirst      = clamp(gs.thirst      - baseThirst * mt);
  gs.cleanliness = clamp(gs.cleanliness - baseClean * mc);

  const rf = 1 - (r - 3) * 0.125; // 抵抗力每级增减 12.5% 健康损失
  let hd = 0;
  if (gs.satiety < 30)     hd -= 0.015 * rf;
  if (gs.thirst  < 20)     hd -= 0.020 * rf;
  if (gs.cleanliness < 20) hd -= 0.005 * rf;
  if (gs.satiety > 70 && gs.thirst > 70 && gs.cleanliness > 70) hd += 0.005;
  if (gs.state === 'trip') hd += 0.010;
  
  // 新增：学习和打工带来健康负担（疲劳）
  if (gs.state === 'study') hd -= 0.025 * rf;
  if (gs.state === 'work')  hd -= 0.045 * rf;
  
  gs.health = clamp(gs.health + hd, 100);

  const moodDecay = Math.max(0.001, 0.003 - (iq-1)*0.0005);
  let md = -moodDecay;
  if (gs.health > 70)  md += 0.005;
  if (gs.satiety > 60) md += 0.002;
  if (gs.thirst  > 60) md += 0.002;
  if (gs.health < 30)  md -= 0.010;
  if (gs.satiety < 20) md -= 0.015;
  if (gs.state === 'trip') md += 0.020;

  // 新增：学习与打工会导致心情额外烦躁
  if (gs.state === 'study') md -= 0.035;
  if (gs.state === 'work')  md -= 0.055;

  gs.mood = clamp(gs.mood + md, 100);

  // --- 打工与学习结算 ---
  if (gs.state === 'work') {
    gs.workTicksElapsed++;
    if (gs.workTicksElapsed >= gs.workTargetTicks) {
      const job = PROFESSIONS.find(p => p.id === gs.currentJobId);
      const totalEarned = job ? job.wage : 3;
      gs.gold += totalEarned;
      gs.workTicksElapsed = 0;
      gs.state = 'idle';
      addLog(`💰 ${gs.name} 完成了一班「${job ? job.name : '打零工'}」，获得 ${totalEarned} 金币，已回到休息状态！`);
    }
  }
  // Study: increment skill progress
  if (gs.state === 'study' && gs.studyingCourseId) {
    const cid = gs.studyingCourseId;
    const iqBoost = 1 + (iq - 2) * 0.1; // 智力每级加速 10% 学习进度，Level 1 为 0.9x
    gs.skillProgress[cid] = (gs.skillProgress[cid] || 0) + iqBoost;
    const course = COURSES.find(c => c.id === cid);
    if (course && gs.skillProgress[cid] >= course.learnTicks) {
      gs.learnedSkills[course.id] = true;
      gs.studyingCourseId = null;
      gs.state = 'idle';
      addLog(`🎓 ${gs.name} 成功修完「${course.name}」，获得技能证书！已回到休息状态。`);
    }
  }
  // Trip events
  if (gs.state === 'trip') {
    gs.tripTicks = (gs.tripTicks || 0) + 1;
    if (withEvents && gs.tripTicks % 25 === 0 && Math.random() < 0.6) {
      const ev = TRIP_EVENTS[Math.floor(Math.random() * TRIP_EVENTS.length)];
      applyEvent(ev, withEvents);
    }
    if (gs.satiety < 20 || gs.thirst < 15 || gs.cleanliness < 10) {
      gs.state = 'idle'; gs.tripTicks = 0;
      if (withEvents) addLog(`🏠 ${gs.name} 不舒服了，自己跑回家~`);
    }
  }
  // Death
  if (gs.health <= 0 && !gs.isDead) {
    gs.isDead = true; gs.state = 'idle';
    if (withEvents) addLog(`💔 ${gs.name} 的健康归零，去了彩虹桥… 可在异次元复活`);
  }
}

function applyEvent(ev, log = true) {
  if (ev.mood)        gs.mood        = clamp(gs.mood  + ev.mood, 100);
  if (ev.health)      gs.health      = clamp(gs.health + ev.health, 100);
  if (ev.cleanliness) gs.cleanliness = clamp(gs.cleanliness + ev.cleanliness, 100);
  if (ev.gold)        gs.gold       += ev.gold;
  if (log) addLog(`🌳 出游：${gs.name}${ev.text}`);
}

function clamp(v, max = 100) { return Math.max(0, Math.min(max, v)); }

// ---------- 时间换算 ----------
function formatTime(ticks) {
  const secs = Math.round(ticks * tickMs / 1000);
  if (secs < 60) return `${secs} 秒`;
  const mins = Math.floor(secs / 60);
  const remSecs = secs % 60;
  if (mins < 60) {
    return remSecs > 0 ? `${mins}分${remSecs}秒` : `${mins}分钟`;
  }
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return remMins > 0 ? `${hours}小时${remMins}分钟` : `${hours}小时`;
}

// ---------- Tick ----------
function tick() {
  if (isPaused) return;
  applyDecay(true);
  gs.ticks++;
  updateUI();
  if (gs.ticks % 10 === 0) saveGame();
}

function startTicker() {
  if (tickTimer) clearInterval(tickTimer);
  tickTimer = setInterval(tick, tickMs);
}

function togglePause() {
  isPaused = !isPaused;
  const btn = document.getElementById('pauseBtn');
  if (btn) {
    btn.textContent = isPaused ? '▶ 恢复时间' : '⏸ 暂停时间';
    btn.className = isPaused ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-ghost';
  }
  addLog(isPaused ? '⏸ 时间已暂停' : '▶ 时间已恢复');
  saveGame();
}

// ---------- 领养 ----------
function initAdoptScreen() {
  const grid = document.getElementById('catGrid');
  grid.innerHTML = '';
  const commons = CAT_POOL.filter(c => c.rarity === 'common').sort(() => Math.random() - 0.5).slice(0, 4);
  const rares   = CAT_POOL.filter(c => c.rarity === 'rare').sort(() => Math.random() - 0.5).slice(0, 2);
  const pool    = [...commons, ...rares].sort(() => Math.random() - 0.5);

  pool.forEach(tmpl => {
    const gender   = Math.random() < 0.5 ? '公' : '母';
    const vitality   = Math.ceil(Math.random() * 5);
    const resistance = Math.ceil(Math.random() * 5);
    const intelligence = Math.ceil(Math.random() * 5);
    const cat = { ...tmpl, gender, vitality, resistance, intelligence };

    const card = document.createElement('div');
    card.className = 'cat-card';
    card.innerHTML = `
      ${tmpl.rarity === 'rare' ? '<span class="rarity-badge rare-badge">✨ 稀有</span>' : ''}
      <span class="cat-emoji-lg">${tmpl.emoji}</span>
      <div class="cat-breed-name">${tmpl.breed}</div>
      <div class="cat-gender-txt">${gender === '公' ? '♂️ 公' : '♀️ 母'}</div>
      <div class="cat-traits-txt">${tmpl.traits}</div>
      <div class="attr-row">
        <span class="attr-chip" title="活泼度">⚡×${vitality}</span>
        <span class="attr-chip" title="抵抗力">🛡×${resistance}</span>
        <span class="attr-chip" title="智力">🧠×${intelligence}</span>
      </div>`;
    card.onclick = () => {
      document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedCatData = cat;
    };
    grid.appendChild(card);
  });
}

function adoptCat() {
  const name = document.getElementById('catNameInput').value.trim();
  if (!selectedCatData) { showModal('❤️','请先选猫！','点击一张卡片来选择你的猫咪~',[{label:'好的',fn:closeModal}]); return; }
  if (!name)             { showModal('📝','请起个名字！','给猫咪起个名字再领养吧~',[{label:'好的',fn:closeModal}]); return; }
  gs = {
    cat: selectedCatData, name,
    adoptTime: Date.now(), lastSaveTime: Date.now(),
    ticks: 0, gold: 100, tripTicks: 0,
    satiety: 100, thirst: 100, cleanliness: 100, health: 100, mood: 100,
    state: 'idle', inventory: {}, isDead: false,
    learnedSkills: {}, skillProgress: {}, studyingCourseId: null, currentJobId: null,
    workTargetTicks: 240, workTicksElapsed: 0,
  };
  logs = [];
  addLog(`🎉 ${name} 来到了新家，它看起来很开心！`);
  saveGame();
  launchGame();
}

// ---------- 启动 ----------
function launchGame() {
  document.getElementById('adoptScreen').style.display = 'none';
  renderLog();
  document.getElementById('appContainer').style.display = 'block';
  document.getElementById('navBar').style.display = 'flex';
  // goldDisplay no longer exists in template; skip
  const gd = document.getElementById('goldDisplay');
  if (gd) gd.style.display = 'block';
  // Show floating backpack button
  const fab = document.getElementById('fabBag');
  if (fab) fab.style.display = 'flex';
  
  if (gs && gs.devUnlocked) {
    const dc = document.getElementById('debugCard');
    const uc = document.getElementById('unlockDebugCard');
    if (dc) dc.style.display = 'block';
    if (uc) uc.style.display = 'none';
  }
  
  const btn = document.getElementById('pauseBtn');
  if (btn) {
    btn.textContent = isPaused ? '▶ 恢复时间' : '⏸ 暂停时间';
    btn.className = isPaused ? 'btn btn-sm btn-primary' : 'btn btn-sm btn-ghost';
  }

  renderShopGrid();
  updateUI();
  switchScene('home');
  startTicker();
}

// ---------- UI 更新 ----------
function updateUI() {
  if (!gs) return;
  const setEl = (id, fn) => { const el = document.getElementById(id); if (el) fn(el); };

  // Gold (shopGoldVal in shop scene; goldVal may or may not exist)
  setEl('goldVal', el => el.textContent = gs.gold);
  setEl('shopGoldVal', el => el.textContent = gs.gold);

  // Stat bars (safe via setBar which already guards)
  setBar('satiety', gs.satiety);
  setBar('thirst',  gs.thirst);
  setBar('clean',   gs.cleanliness);
  setBar('health',  gs.health);
  setBar('mood',    gs.mood);

  // Avatar / name / breed / gender / rarity
  setEl('gameAvatar', el => el.textContent = gs.cat.emoji);
  setEl('gameNameDisplay', el => el.textContent = gs.name);
  setEl('breedTag', el => el.textContent = gs.cat.breed);
  setEl('genderTag', el => {
    el.textContent = gs.cat.gender === '公' ? '♂ 公' : '♀ 母';
    el.className = 'tag ' + (gs.cat.gender === '公' ? 'tag-gender-m' : 'tag-gender-f');
  });
  setEl('rarityTag', el => el.style.display = gs.cat.rarity === 'rare' ? '' : 'none');

  // Age & mood text
  const hours = Math.floor((Date.now() - gs.adoptTime) / 3600000);
  setEl('ageDisplay', el => el.textContent = `到家：${hours} 小时`);
  setEl('moodLine', el => el.textContent = getMoodText());

  // Gold in home scene (multiple elements via class)
  document.querySelectorAll('.home-gold-val').forEach(el => el.textContent = gs.gold);

  // Cat state image
  const catImgs = { idle:'assets/cat_idle.png', work:'assets/cat_work.png', study:'assets/cat_study.png', trip:'assets/cat_trip.png' };
  setEl('catStateImg', el => {
    el.src = catImgs[gs.state] || catImgs.idle;
    el.className = 'cat-img cat-anim-' + (gs.state || 'idle');
  });

  // State badge
  const badges = { idle:'😴', work:'🛠️', study:'📚', trip:'🌳' };
  setEl('stateBadge', el => el.textContent = gs.isDead ? '💀' : (badges[gs.state] || '😴'));

  updateProfessionUI();
  updateStateButtons();
  renderInventory('inventoryList');
}

function getBagModalHTML() {
  if (!gs) return '';
  const catOrder = ['food','drink','hygiene','health','fun','special'];
  let html = '';
  catOrder.forEach(catKey => {
    const catItems = ITEMS.filter(i => i.cat === catKey);
    const entries = catItems.map(item => {
      const count = gs.inventory[item.id] || 0;
      if (!count) return '';
      return `<div class="inv-item" style="cursor:default">
        <span class="inv-icon">${item.icon}</span>
        <div class="inv-info"><div class="inv-name">${item.name}</div><div class="inv-count">×${count} · ${item.desc}</div></div>
        <button class="btn btn-sm btn-primary" onclick="useItemFromModal('${item.id}')">使用</button>
      </div>`;
    }).filter(Boolean);
    if (!entries.length) return;
    html += `<div class="inv-category">${ITEM_CATEGORIES[catKey].label}</div>` + entries.join('');
  });
  return html || '<div class="inv-empty">背包空空如也，去商城买些东西吧~</div>';
}

function openBackpackModal() {
  const inner = getBagModalHTML();
  showModal('🎒','随身背包', `<div id="bagModalContent" style="text-align:left;max-height:300px;overflow-y:auto;margin:-4px -2px">${inner}</div>`,
    [
      {label:'前往外出 🌟', cls:'btn-primary', fn:() => { switchScene('outing'); closeModalDirect(); }},
      {label:'关闭', fn:closeModalDirect}
    ]);
}

function useItemFromModal(id) {
  useItem(id);
  const content = document.getElementById('bagModalContent');
  if (content) content.innerHTML = getBagModalHTML();
}

function setBar(id, val) {
  const v = Math.round(val);
  const el = document.getElementById(id + 'Val');
  if (el) { el.textContent = v; el.className = 'val' + (v < 25 ? ' danger' : ''); }
  const bar = document.getElementById(id + 'Bar');
  if (bar) bar.style.width = v + '%';
}

function getMoodText() {
  if (gs.isDead)      return '💀 已经去了彩虹桥…';
  if (gs.health < 20) return '😿 生病了！需要看护~';
  if (gs.satiety < 20)return '😾 好饿好饿，快喂我！';
  if (gs.thirst < 20) return '😪 好渴，给水水！';
  const avg = (gs.satiety + gs.thirst + gs.cleanliness + gs.health + gs.mood) / 5;
  if (avg > 80) return '😸 超级幸福！';
  if (avg > 60) return '😊 心情不错~';
  if (avg > 40) return '😐 有点无聊…';
  return '😿 感觉不太好…';
}

function updateStateButtons() {
  // 弃用：不再为日程按钮提供持久性的焦距样式
}

// ---------- 场景切换 ----------
let _currentScene = 'home';
let _historyInitialized = false;

function initHistoryTrap() {
  if (_historyInitialized) return;
  _historyInitialized = true;
  // 推入一个底部垫背状态，再推入当前的真实状态
  history.replaceState({ entry: true }, '', location.pathname);
  history.pushState({ scene: _currentScene }, '', '#' + _currentScene);
}

// 绑定到首次交互，确保浏览器（特别是 Safari）认可 pushState
document.addEventListener('click', initHistoryTrap, { once: true, capture: true });
document.addEventListener('touchstart', initHistoryTrap, { once: true, capture: true });

function switchScene(name, pushHistory = true) {
  initHistoryTrap(); // 确保在真正切换场景前，保底状态已初始化
  
  // Nav tabs only for main scenes
  const mainScenes = ['home', 'outing', 'system'];
  // All scene ids (including sub-scenes like shop)
  const allScenes = ['home', 'outing', 'system', 'shop'];
  
  allScenes.forEach(s => {
    const sceneId = 'scene' + s.charAt(0).toUpperCase() + s.slice(1);
    document.getElementById(sceneId)?.classList.toggle('active', s === name);
  });
  // Update nav active state only for main scenes
  mainScenes.forEach(s => {
    const navId = 'nav' + s.charAt(0).toUpperCase() + s.slice(1);
    // Shop has active outing tab highlighted
    const isActive = s === name || (name === 'shop' && s === 'outing');
    document.getElementById(navId)?.classList.toggle('active', isActive);
  });

  // Background class
  const bgMap = { home:'bg-home', outing:'bg-outing', system:'bg-system', shop:'bg-shop' };
  document.body.className = bgMap[name] || 'bg-outing';

  // Push history state for back-gesture interception (only when not already navigating via popstate)
  if (pushHistory && name !== _currentScene) {
    history.pushState({ scene: name }, '', '#' + name);
  }
  _currentScene = name;

  renderInventory('inventoryList');
  renderInventory('inventoryListHome');
}

// ---------- 状态机 ----------
function calculateEarlyWorkPayout() {
  if (gs.state === 'work' && gs.workTicksElapsed > 0) {
    const job = PROFESSIONS.find(p => p.id === gs.currentJobId);
    const totalWage = job ? job.wage : 3;
    
    const progress = gs.workTicksElapsed / gs.workTargetTicks;
    const earned = Math.floor(progress * totalWage * 0.8);
    if (earned > 0) {
      gs.gold += earned;
      addLog(`💼 ${gs.name} 提前结束工作，结算获得 ${earned} 金币。`);
    }
    gs.workTicksElapsed = 0; 
  }
}

function setState(newState) {
  if (!gs) return;
  if (gs.isDead) { addLog('⚠️ 宠物已离世，无法切换状态'); return; }
  if (gs.state === newState) return;

  // --- 打工提前退出结算 ---
  calculateEarlyWorkPayout();

  const labels = { idle:'空闲', work:'打工', study:'学习', trip:'出游' };
  gs.state = newState;
  if (newState === 'trip') gs.tripTicks = 0;
  addLog(`🔄 ${gs.name} 开始${labels[newState]}！`);
  updateStateButtons();
  updateUI();
  saveGame();
}

// ---------- 商城 ----------
function renderShopGrid() {
  const container = document.getElementById('shopGrid');
  const catOrder = ['food','drink','hygiene','health','fun','special'];
  container.innerHTML = catOrder.map(catKey => {
    const catItems = ITEMS.filter(i => i.cat === catKey);
    if (!catItems.length) return '';
    const { label } = ITEM_CATEGORIES[catKey];
    const grid = catItems.map(item => `
      <div class="shop-item" onclick="buyItem('${item.id}')">
        <span class="item-icon">${item.icon}</span>
        <div class="item-name">${item.name}</div>
        <div class="item-desc">${item.desc}</div>
        <div class="item-price">🪙 ${item.price}</div>
      </div>`).join('');
    
    // 使用 style="display:flex..." 实现折叠标题，默认收起
    return `
      <div class="shop-cat-title" onclick="toggleShopCat('${catKey}')" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
        <span>${label}</span>
        <span id="shop-icon-${catKey}" style="font-size:10px; color:#aaa; transition:transform 0.2s; transform:rotate(-90deg);">▼</span>
      </div>
      <div class="shop-grid" id="shop-grid-${catKey}" style="transition:all 0.2s; display:none;">${grid}</div>
    `;
  }).join('');
}

function toggleShopCat(catKey) {
  const grid = document.getElementById(`shop-grid-${catKey}`);
  const icon = document.getElementById(`shop-icon-${catKey}`);
  if (grid.style.display === 'none') {
    grid.style.display = 'grid';
    icon.style.transform = 'rotate(0deg)';
  } else {
    grid.style.display = 'none';
    icon.style.transform = 'rotate(-90deg)';
  }
}

function buyItem(id) {
  const item = ITEMS.find(i => i.id === id);
  if (!item) return;
  if (gs.gold < item.price) {
    showModal('💸','金币不足！',`购买 ${item.name} 需要 ${item.price} 金币，当前只有 ${gs.gold} 枚~`,[{label:'好吧',fn:closeModalDirect}]);
    return;
  }
  gs.gold -= item.price;
  gs.inventory[id] = (gs.inventory[id] || 0) + 1;
  addLog(`🛒 购买了 ${item.icon}${item.name}，已存入背包`);
  updateUI();
  saveGame();
}


function useItem(id) {
  const item = ITEMS.find(i => i.id === id);
  if (!item || !gs.inventory[id]) return;
  if (item.effect.rename) {
    showRenameModal(); return;
  }
  if (item.effect.revive) {
    if (!gs.isDead) { addLog('🐱 宠物好好的，不需要复活卡~'); return; }
    gs.isDead = false; gs.health = 50; gs.mood = 50;
    addLog(`💌 ${gs.name} 被复活了！重新回到了你身边！`);
    gs.inventory[id]--;
    if (!gs.inventory[id]) delete gs.inventory[id];
    updateUI(); saveGame(); return;
  }
  // Stat items
  if (gs.isDead) {
    addLog(`😿 宠物已去世，先用复活卡吧~`);
    return;
  }

  const eff = item.effect;
  const oldSatiety = gs.satiety;
  const oldThirst = gs.thirst;
  
  let changed = [];
  if (eff.satiety)    { gs.satiety    = clamp(gs.satiety    + eff.satiety, 100); changed.push(`饱食${eff.satiety>0?'+':''}${eff.satiety}`); }
  if (eff.thirst)     { gs.thirst     = clamp(gs.thirst     + eff.thirst, 100); changed.push(`水分${eff.thirst>0?'+':''}${eff.thirst}`); }
  if (eff.cleanliness){ gs.cleanliness= clamp(gs.cleanliness+ eff.cleanliness, 100); changed.push(`清洁${eff.cleanliness>0?'+':''}${eff.cleanliness}`); }
  if (eff.health)     { gs.health     = clamp(gs.health     + eff.health, 100); changed.push(`健康${eff.health>0?'+':''}${eff.health}`); }
  if (eff.mood)       { gs.mood       = clamp(gs.mood       + eff.mood, 100); changed.push(`心情${eff.mood>0?'+':''}${eff.mood}`); }

  let flavor = '';
  if (item.cat === 'food') {
    flavor = oldSatiety < 40 ? '狼吞虎咽地吃光了粮食' : '吧唧吧唧吃得肚子圆滚滚';
  } else if (item.cat === 'drink') {
    flavor = oldThirst < 40 ? '咕噜咕噜一口气狂饮' : '喝完以后解渴又舒爽';
  } else if (item.cat === 'hygiene') {
    flavor = (eff.mood && eff.mood < 0) ? '为了变干净委屈巴巴地忍耐着' : '打理完香喷喷的像个高贵的毛球';
  } else if (item.cat === 'health') {
    flavor = (eff.mood && eff.mood < 0) ? '拼命挣扎，但身体确实变好了' : '接受治疗后感觉精神焕发';
  } else if (item.cat === 'fun') {
    flavor = '玩得不亦乐乎，彻底释放了压力';
  } else {
    flavor = '开心地蹭了蹭你的手';
  }

  // 动作气泡浮现
  showToast(`${flavor}！`);

  addLog(`🎁 给 ${gs.name} 使用「${item.icon}${item.name}」，${flavor}。(${changed.join(' ')})`);

  gs.inventory[id]--;
  if (!gs.inventory[id]) delete gs.inventory[id];
  updateUI(); saveGame();
}

function renderInventory(containerId) {
  const list = document.getElementById(containerId);
  if (!list || !gs) return;
  const catOrder = ['food','drink','hygiene','health','fun','special'];
  let html = '';
  catOrder.forEach(catKey => {
    const catItems = ITEMS.filter(i => i.cat === catKey);
    const entries = catItems.map(item => {
      const count = gs.inventory[item.id] || 0;
      if (!count) return '';
      return `<div class="inv-item">
        <span class="inv-icon">${item.icon}</span>
        <div class="inv-info"><div class="inv-name">${item.name}</div><div class="inv-count">×${count} 件 · ${item.desc}</div></div>
        <button class="btn btn-sm btn-ghost" onclick="useItem('${item.id}')">使用</button>
      </div>`;
    }).filter(Boolean);
    if (!entries.length) return;
    html += `<div class="inv-category">${ITEM_CATEGORIES[catKey].label}</div>` + entries.join('');
  });
  list.innerHTML = html || '<div class="inv-empty">背包空空如也，去商城买些东西吧~</div>';
}

function addGold(n) { gs.gold += n; }

// ---------- 设置 ----------
function updateTickRate(v) {
  tickMs = v * 1000;
  const decayPerDay = Math.round((86400 / v) * 0.010);
  const daysToStarve = (100 / Math.max(1, decayPerDay)).toFixed(1);
  
  document.getElementById('tickRateLabel').innerHTML = `
    当前刷新频率：每 <b>${v}</b> 秒<br>
    <span style="font-size:11px; color:#e17055; display:inline-block; margin-top:3px;">
      【测算】现实中约 ${daysToStarve} 天会达到极限饥饿
    </span>
  `;
  startTicker();
  saveGame();
  if (gs && gs.state === 'study') updateProfessionUI(); 
  if (gs && gs.state === 'work') updateProfessionUI();
}

// ---------- 改名 ----------
function showRenameModal() {
  const hasCard = gs.inventory['rename'] && gs.inventory['rename'] > 0;
  const free = hasCard; // 有改名卡才能改
  showModal('📛','给猫咪改名',
    hasCard ? '请在下方输入新名字（消耗1张改名卡）：<br><input type="text" id="renameInput" style="margin-top:10px;width:100%;padding:8px 12px;border:2px solid #fce4d6;border-radius:20px;font-size:15px;font-family:Nunito,sans-serif;outline:none;" maxlength="10" placeholder="新名字…">'
            : '你的背包里没有改名卡，去商城购买一张吧！',
    hasCard
      ? [{label:'确认改名', cls:'btn-primary', fn:() => {
          const v = document.getElementById('renameInput')?.value?.trim();
          if (!v) return;
          gs.name = v;
          gs.inventory['rename']--;
          if (!gs.inventory['rename']) delete gs.inventory['rename'];
          addLog(`📛 改名成功！新名字：${gs.name}`);
          updateUI(); saveGame(); closeModalDirect();
        }}, {label:'取消',fn:closeModalDirect}]
      : [{label:'好的',fn:closeModalDirect}]
  );
}

// ---------- 删除宠物 ----------
function confirmDeletePet() {
  showModal('⚠️','确定删除宠物？',`这将永久删除 ${gs.name} 和所有存档数据，操作不可撤销！`,
    [{label:'确定删除', cls:'btn-danger', fn:() => {
        if (tickTimer) clearInterval(tickTimer);
        clearSave(); gs = null; logs = [];
        document.getElementById('appContainer').style.display = 'none';
        document.getElementById('navBar').style.display = 'none';
        document.getElementById('goldDisplay').style.display = 'none';
        document.getElementById('adoptScreen').style.display = 'block';
        initAdoptScreen();
        document.getElementById('catNameInput').value = '';
        selectedCatData = null;
        closeModalDirect();
      }},
     {label:'取消', fn:closeModalDirect}
    ]);
}

// ---------- 复活宠物 ----------
function revivePet() {
  if (!gs.isDead) { showModal('🐱','宠物好好的！','不需要复活哦~',[{label:'好的',fn:closeModalDirect}]); return; }
  const hasCard = gs.inventory['revive'] && gs.inventory['revive'] > 0;
  if (!hasCard) { showModal('💔','没有复活卡','去商城购买复活卡再来吧~',[{label:'好的',fn:closeModalDirect}]); return; }
  useItem('revive');
}

// ---------- 职业说明 ----------
function showCatStats() {
  const { vitality: v, resistance: r, intelligence: iq } = gs.cat;
  
  const vStatus = ((v - 3) * 12.5).toFixed(1);
  const rStatus = ((r - 3) * 12.5).toFixed(1);
  const iqStatus = ((iq - 2) * 10).toFixed(0);

  const formatMod = (val) => {
    val = parseFloat(val);
    if (val > 0) return `<span style="color:#e74c3c;font-weight:700">+${val}%</span>`; // 消耗增加用红色警示
    if (val < 0) return `<span style="color:#2ecc71;font-weight:700">${val}%</span>`; // 消耗降低用绿色
    return `<span style="color:#95a5a6;font-weight:700">标准(100%)</span>`;
  };
  
  const formatModPositiveGood = (val) => {
    val = parseFloat(val);
    if (val > 0) return `<span style="color:#2ecc71;font-weight:700">+${val}%</span>`;
    if (val < 0) return `<span style="color:#e74c3c;font-weight:700">${val}%</span>`;
    return `<span style="color:#95a5a6;font-weight:700">标准(100%)</span>`;
  };

  const html = `
    <div class="stats-dashboard" style="text-align:left; padding:4px 0; width:100%; min-width:240px;">
      <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px dashed #eee;">
        <span style="font-size:13px;font-weight:700">⚡ 活泼度 (Lv.${v})</span>
        <span style="font-size:12px;">代谢速率 ${formatMod(vStatus)}</span>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px dashed #eee;">
        <span style="font-size:13px;font-weight:700">🛡️ 抵抗力 (Lv.${r})</span>
        <span style="font-size:12px;">健康韧性 ${formatModPositiveGood(rStatus)}</span>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0;">
        <span style="font-size:13px;font-weight:700">🧠 智力 (Lv.${iq})</span>
        <span style="font-size:12px;">学习效率 ${formatModPositiveGood(iqStatus)}</span>
      </div>
      <p style="font-size:11px; color:#636e72; margin-top:10px; line-height:1.6; background:#f9f9f9; padding:8px; border-radius:8px;">
        💡 <b>详细养成指南：</b><br>
        • <b>活泼</b>：决定饱食度、水分等生理属性的日常下降速度；<br>
        • <b>抵抗</b>：决定遭遇饥饿、干渴或疲劳时的健康损耗程度；<br>
        • <b>智力</b>：决定获取技能证书与领悟职业知识的挂机效率；<br>
        • <b>贴士</b>：3星为猫咪的基础水平线，高星级能带来巨大优势。
      </p>
    </div>
  `;

  showModal('🐾', `${gs.name} 的天赋面板`, html, [{label:'了解了', cls:'btn-primary', fn:closeModalDirect}]);
}

// ---------- Modal ----------
function showModal(icon, title, text, actions) {
  document.getElementById('modalIcon').textContent = icon;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalText').innerHTML = text;
  const actEl = document.getElementById('modalActions');
  actEl.innerHTML = actions.map((a, i) =>
    `<button class="btn ${a.cls || 'btn-ghost'}" id="modalBtn${i}">${a.label}</button>`).join('');
  // Wrap in lambda so MouseEvent is NOT passed to the fn (fixes cancel button bug)
  actions.forEach((a, i) => document.getElementById('modalBtn' + i).onclick = () => a.fn());
  document.getElementById('modalOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modalOverlay')) return;
  document.getElementById('modalOverlay').classList.remove('show');
  document.body.style.overflow = '';
}

function closeModalDirect() {
  document.getElementById('modalOverlay').classList.remove('show');
  document.body.style.overflow = '';
}

// ---------- Log ----------
function addLog(text) {
  const ts = new Date().toLocaleTimeString('zh', {hour:'2-digit',minute:'2-digit'});
  logs.unshift(`[${ts}] ${text}`);
  if (logs.length > 50) logs.pop();
  renderLog();
}

function renderLog() {
  const box = document.getElementById('logBox');
  if (box) box.innerHTML = logs.slice(0, 20)
    .map((t, i) => `<div class="log-entry" style="opacity:${Math.max(0.25, 1 - i*0.04)}">${t}</div>`).join('');
}

// ---------- 职业 UI ----------
function updateProfessionUI() {
  if (!gs) return;
  const content = document.getElementById('currentStateContent');
  if (!content) return;

  if (gs.state === 'idle') {
    content.innerHTML = `<div style="font-size:13px;color:var(--text-lt);padding:8px">🛋️ 正在舒适地休息，缓慢恢复体力中...</div>`;
  } else if (gs.state === 'work') {
    if (!gs.currentJobId) {
      content.innerHTML = `<div style="font-size:13px;color:#e17055;padding:8px">⚠ 尚未指定工作，正在摸鱼</div>`;
      return;
    }
    const prof = gs.currentJobId ? PROFESSIONS.find(p => p.id === gs.currentJobId) : { name:'零工', icon:'🛠️' };
    if (!prof) return;
    const pct = Math.min(100, (gs.workTicksElapsed / gs.workTargetTicks) * 100).toFixed(1);
    const remaining = gs.workTargetTicks - gs.workTicksElapsed;
    
    content.innerHTML = `
      <div class="study-progress-bar-wrap" style="margin:0; text-align:left;">
        <div class="study-prog-label" style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:6px;">
          <span style="font-weight:800;">${prof.icon} 正在「${prof.name}」打工…</span>
          <span style="font-size:11px; color:#636e72;">${pct}% · 剩 ${formatTime(remaining)}</span>
        </div>
        <div class="study-prog-bg"><div class="study-prog-fill" style="width:${pct}%; background:linear-gradient(90deg, #6c5ce7, #a29bfe)"></div></div>
      </div>
    `;
  } else if (gs.state === 'study') {
    if (!gs.studyingCourseId) {
      content.innerHTML = `<div style="font-size:13px;color:#e17055;padding:8px">⚠ 尚未安排系统课程</div>`;
      return;
    }
    const course = COURSES.find(c => c.id === gs.studyingCourseId);
    if (!course) return;
    const prog = gs.skillProgress[course.id] || 0;
    const pct = Math.min(100, (prog / course.learnTicks) * 100).toFixed(1);
    const cat = COURSE_CATS[course.cat];
    const iqBoost = 1 + (gs.cat.intelligence - 2) * 0.1;
    content.innerHTML = `
      <div class="study-progress-bar-wrap" style="margin:0; text-align:left;">
        <div class="study-prog-label" style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:6px;">
          <span style="font-weight:800;">${cat.icon} 正在研修「${course.name}」…</span>
          <span style="font-size:11px; color:#636e72;">${pct}% · 剩 ${formatTime(course.learnTicks - prog < 0 ? 0 : (course.learnTicks - prog) / iqBoost)}</span>
        </div>
        <div class="study-prog-bg"><div class="study-prog-fill" style="width:${pct}%"></div></div>
      </div>
    `;
  }
}

function requestState(target) {
  if (gs.state === target && target === 'idle') {
    showToast('已经在舒适地休息啦~');
    return;
  }
  
  // --- 打工中断拦截提示 ---
  if (gs.state === 'work' && gs.workTicksElapsed > 0 && target !== 'work') {
    const job = PROFESSIONS.find(p => p.id === gs.currentJobId);
    const jobName = job ? job.name : '零工';
    showModal('🏃', '确定要提前离岗吗？', 
      `<div style="text-align:center;padding:10px">如果你现在离开「${jobName}」，之前的工作只能按 <b>80%</b> 结算薪水哦。</div>`,
      [
        { label: '确认离开并结算', cls:'btn-danger', fn: () => { closeModalDirect(); setState(target); } },
        { label: '继续工作', fn: closeModalDirect }
      ]
    );
    return;
  }

  if (target === 'idle') { setState('idle'); return; }
  
  // --- 学习：如果有正在学的课程，点击直接续学 ---
  if (target === 'study') {
    if (gs.studyingCourseId && gs.state !== 'study') {
      setState('study');
    } else {
      openStudyModal();
    }
    return;
  }
  
  if (target === 'work') { openWorkModal(); return; }
  
  // --- 旅游：暂未开放 ---
  if (target === 'trip') {
    showModal('🌳', '出门旅游（即将开放）',
      `<div style="text-align:center;padding:10px;color:#636e72">全新的出游系统正在开发中~<br><span style="font-size:12px">敬请期待！</span></div>`,
      [{ label: '好哒', fn: closeModalDirect }]
    );
    return;
  }
}


function showToast(msg) {
  const el = document.getElementById('petActionText');
  if (el) {
    el.textContent = `${gs.name} ${msg}`;
    el.style.opacity = 1;
    el.style.transform = 'translateX(-50%) translateY(0)';
    setTimeout(() => {
      el.style.opacity = 0;
      el.style.transform = 'translateX(-50%) translateY(10px)';
    }, 2000);
  }
}

function openStudyModal() {
  let html = '';
  Object.keys(COURSE_CATS).forEach(catKey => {
    const cat = COURSE_CATS[catKey];
    const catCourses = COURSES.filter(c => c.cat === catKey);
    
    html += `<div class="bag-category" style="margin:16px 0 8px">${cat.icon} ${cat.label}</div>`;
    html += `<div class="prof-grid">`;
    catCourses.forEach(c => {
      const learned = gs.learnedSkills[c.id];
      const reqMet = c.req.every(r => gs.learnedSkills[r]);
      const canStudy = !learned && reqMet;
      const prog = gs.skillProgress[c.id] || 0;
      const pct = Math.min(100, (prog / c.learnTicks) * 100).toFixed(0);
      const progressLabel = pct > 0 ? `<span style="color:#6c5ce7;font-weight:700">（已学 ${pct}%）</span>` : '';

      html += `
        <div class="prof-card ${learned?' prof-learned':''} ${!reqMet&&!learned?' prof-locked':''}"
          onclick="${canStudy ? `selectCourse('${c.id}')` : ''}">
          <div class="prof-icon">${cat.icon}</div>
          <div class="prof-name">${c.name}${progressLabel}</div>
          <div class="prof-desc">${learned?'✅ 已掌握': !reqMet?`🔒 需先修：${c.req.map(r=>COURSES.find(cc=>cc.id===r)?.name).join('、')}`: `⏱ 需学 ${formatTime(c.learnTicks)}`}</div>
        </div>`;
    });
    html += `</div>`;
  });

  showModal('📚', '安排系统课程', `
    <style>.hide-scroll::-webkit-scrollbar { display: none; }</style>
    <div class="hide-scroll" style="text-align:left;max-height:400px;overflow-y:auto;padding-bottom:10px">${html}</div>`, 
    [{label:'稍后决定', fn:closeModalDirect}]);
}

function openWorkModal() {
  let html = `<div class="prof-grid">`;
  
  PROFESSIONS.forEach(p => {
    const skillsMet = p.reqSkills.every(s => gs.learnedSkills[s]);
    const isWorking = gs.state === 'work' && gs.currentJobId === p.id;
    if (skillsMet) {
      html += `
        <div class="prof-card${isWorking ? ' prof-learned' : ''}" onclick="selectJob('${p.id}')">
          <div class="prof-icon">${p.icon}</div>
          <div class="prof-name">${p.name}${isWorking ? ' <span style="font-size:10px;color:#00b894">进行中</span>' : ''}</div>
          <div class="prof-desc">${p.desc}</div>
          <div class="prof-wage">报酬：${p.wage}金 / ${p.workTicks / 120}h</div>
        </div>`;
    } else {
      // 显示未解锁职业，番灰并展示需求
      const reqNames = p.reqSkills.map(s => {
        const course = COURSES.find(c => c.id === s);
        return course ? course.name : s;
      }).join('、');
      html += `
        <div class="prof-card prof-locked">
          <div class="prof-icon">${p.icon}</div>
          <div class="prof-name">${p.name}</div>
          <div class="prof-desc">${p.desc}</div>
          <div class="prof-wage" style="color:#aaa">🔒 需：${reqNames || '无门槛'}</div>
        </div>`;
    }
  });

  html += `</div>`;

  showModal('🏢', '猫才市场', `
    <style>.hide-scroll::-webkit-scrollbar { display: none; }</style>
    <div class="hide-scroll" style="text-align:left;max-height:400px;overflow-y:auto;padding-bottom:10px">${html}</div>`, 
    [{label:'稍后决定', fn:closeModalDirect}]);
}



function selectCourse(id) {
  if (gs.state === 'study' && gs.studyingCourseId === id) {
    showToast('已经在钻研这门课程啦！');
    closeModalDirect();
    return;
  }
  const course = COURSES.find(c => c.id === id);
  if (!course || gs.learnedSkills[id]) return;
  
  const reqMet = course.req.every(r => gs.learnedSkills[r]);
  if (!reqMet) { addLog(`🔒 需要先修完：${course.req.map(r=>COURSES.find(c=>c.id===r)?.name).join('、')}`); return; }
  
  const isSwapping = (gs.state === 'study');
  gs.studyingCourseId = id;
  if (gs.skillProgress[id] === undefined) gs.skillProgress[id] = 0;
  
  if (isSwapping) {
    addLog(`🔄 ${gs.name} 转而钻研「${course.name}」啦！`);
    updateProfessionUI();
    updateUI();
    saveGame();
  } else {
    setState('study');
  }
  closeModalDirect();
}

function selectJob(id) {
  const prof = id ? PROFESSIONS.find(p => p.id === id) : { name:'零工', icon:'🛠️', workTicks: 240 };
  
  if (gs.state === 'work' && gs.currentJobId === id) {
    showToast('已经在进行这份工作啦！');
    closeModalDirect();
    return;
  }
  
  const isSwapping = (gs.state === 'work');
  if (isSwapping && gs.workTicksElapsed > 0) {
    const nextJob = id ? PROFESSIONS.find(p => p.id === id) : { name:'零工', icon:'🛠️' };
    showModal('🔄', '确定要更换工作吗？', 
      `<div style="text-align:center;padding:10px">当前工作尚未完成，更换到「${nextJob.name}」会导致之前的努力只能按 <b>80%</b> 结算薪水哦。</div>`,
      [
        { label: '确认换岗并结算', cls:'btn-danger', fn: () => { 
            closeModalDirect(); 
            calculateEarlyWorkPayout(); 
            performSelectJob(id, nextJob); 
          } 
        },
        { label: '继续当前工作', fn: closeModalDirect }
      ]
    );
    return;
  }
  
  if (isSwapping) calculateEarlyWorkPayout(); 
  performSelectJob(id, prof);
}

function performSelectJob(id, prof) {
  // 从配置读取固定工时
  gs.currentJobId = id;
  gs.workTargetTicks = prof.workTicks || 240;
  gs.workTicksElapsed = 0;
  
  const isSwapping = (gs.state === 'work');
  if (isSwapping) {
    addLog(`🔄 ${gs.name} 换到了「${prof.icon}${prof.name}」，此工作全勤需时 ${gs.workTargetTicks / 120}h！`);
    updateProfessionUI();
    updateUI();
    saveGame();
  } else {
    setState('work');
  }
  closeModalDirect();
}

// ---------- 开发者测试锁 ----------
function unlockDebug() {
  showModal('🔑', '开发者权限验证', 
    `<div style="margin-top:10px;text-align:center;">
       <input type="password" id="devPwdInput" placeholder="输入特征码" style="width:190px;text-align:center">
     </div>`, 
    [
      { label: '取消', fn: closeModalDirect },
      { label: '解绑', cls: 'btn-danger', fn: () => {
          const val = document.getElementById('devPwdInput').value;
          if (val === '19951215') {
            document.getElementById('debugCard').style.display = 'block';
            document.getElementById('unlockDebugCard').style.display = 'none';
            gs.devUnlocked = true;
            saveGame();
            closeModalDirect();
            addLog('🔓 底层权限解除，物理环境控制权限已获取！');
          } else {
            alert('验证失败，请核对特征码！');
            document.getElementById('devPwdInput').value = '';
          }
        } 
      }
    ]
  );
}

// ---------- 入口 ----------
window.addEventListener('DOMContentLoaded', () => {
  if (loadGame()) {
    try {
      // Migrate old saves that don't have profession fields
    if (gs.learnedSkills === undefined)    gs.learnedSkills = {};
    if (gs.skillProgress === undefined)    gs.skillProgress = {};
    if (gs.studyingCourseId === undefined) gs.studyingCourseId = null;
      if (gs.currentJobId === undefined) gs.currentJobId = null;
      
      applyOfflineTicks();
      launchGame();
    } catch (err) {
      console.error("Save corrupted or migration failed, wiping save:", err);
      clearSave();
      initAdoptScreen();
    }
  } else {
    document.getElementById('adoptScreen').style.display = 'block';
    initAdoptScreen();
  }
  // Close modal on overlay click
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModalDirect();
  });
  // Tick slider init
  document.getElementById('tickSlider').value = tickMs / 1000;
  document.getElementById('tickRateLabel').textContent = `当前：${tickMs/1000}秒/tick`;

  // Visibility change listener for background/foreground syncing
  document.addEventListener('visibilitychange', () => {
    if (!gs) return;
    if (document.visibilityState === 'hidden') {
      saveGame();
    } else if (document.visibilityState === 'visible') {
      applyOfflineTicks();
      updateUI();
    }
  });

  // 更新系统页面版本显示
  const verEl = document.getElementById('appVersion');
  if (verEl) verEl.textContent = '版本 ' + APP_VER;

  // 拦截浏览器返回手势/按钮，转化为应用内部场景返回
  let isExiting = false;
  // 注：初始的 history 垫背状态现在改由用户首次交互触发（见上方的 initHistoryTrap）

  window.addEventListener('popstate', (e) => {
    if (isExiting) return;

    // 1. 如果 modal 开着，先关闭 modal，并抵消掉这次“返回”
    const overlay = document.getElementById('modalOverlay');
    if (overlay && overlay.classList.contains('show')) {
      closeModalDirect();
      // 因为打开 modal 并没有产生新的 history 栈，返回时实际消耗掉了一个场景栈
      // 我们在此处强行推入当前场景的 state 来补偿，保持堆栈稳定
      history.pushState({ scene: _currentScene }, '', '#' + _currentScene);
      return;
    }

    // 2. 如果退到了边界（entry 垫背状态），拦截退出并提示
    if (e.state && e.state.entry) {
      showModal('👋', '要离开游戏吗？', '<div style="text-align:center;padding:10px">小主，你确定要退出 HoshiPet 吗？<br><span style="font-size:12px;color:#aaa">（您的游玩进度会自动保存）</span></div>', [
        { label: '退出', cls: 'btn-danger', fn: () => {
            closeModalDirect();
            isExiting = true;
            history.back(); // 真正退出页面
          }
        },
        { label: '留下来', fn: () => {
            closeModalDirect();
            // 用户取消退出，重新补回 home 状态防线
            history.pushState({ scene: 'home' }, '', '#home');
          }
        }
      ]);
      return;
    }

    // 3. 正常场景回退（根据 history 中的 state 恢复场景）
    const targetScene = e.state?.scene || 'home';
    switchScene(targetScene, false);
  });
});

