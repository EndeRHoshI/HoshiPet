// ============================================================
// HoshiPet — game.js  (全部游戏逻辑)
// ============================================================

// ---------- 常量数据 ----------
const SAVE_KEY = 'hoshiPet_v1';

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
  { id:'snack',    cat:'food',    icon:'🫙', name:'小零食',        desc:'饱食 +20 清洁 -5',          price:4,   effect:{ satiety:20, cleanliness:-5 } },
  { id:'fish',     cat:'food',    icon:'🐟', name:'鱼罐头',        desc:'饱食 +35',                  price:10,  effect:{ satiety:35 } },
  { id:'chicken',  cat:'food',    icon:'🍗', name:'烤鸡腿',        desc:'饱食 +60 健康 -5',          price:20,  effect:{ satiety:60, health:-5 } },
  { id:'steak',    cat:'food',    icon:'🥩', name:'生牛肉大餐',    desc:'饱食 +90 健康 +10 清洁 -10',price:40,  effect:{ satiety:90, health:10, cleanliness:-10 } },
  { id:'catgrass', cat:'food',    icon:'🪴', name:'猫草',          desc:'饱食 +15 健康 +10',         price:8,   effect:{ satiety:15, health:10 } },
  // 饮料类
  { id:'water',    cat:'drink',   icon:'💧', name:'矿泉水',        desc:'水分 +40',                  price:5,   effect:{ thirst:40 } },
  { id:'milk',     cat:'drink',   icon:'🥛', name:'纯牛奶',        desc:'水分 +50 健康 +5',          price:12,  effect:{ thirst:50, health:5 } },
  { id:'juice',    cat:'drink',   icon:'🧃', name:'营养果汁',      desc:'水分 +70 心情 +10',         price:18,  effect:{ thirst:70, mood:10 } },
  { id:'tea',      cat:'drink',   icon:'🍵', name:'猫薄荷草茶',    desc:'水分 +55 心情 +20',         price:25,  effect:{ thirst:55, mood:20 } },
  { id:'coffee',   cat:'drink',   icon:'☕', name:'猫薄荷咖啡',    desc:'水分 +40 心情 +30 健康 -5', price:22,  effect:{ thirst:40, mood:30, health:-5 } },
  // 洗澡清洁
  { id:'soap',     cat:'hygiene', icon:'🧴', name:'香皂',          desc:'清洁 +25',                  price:5,   effect:{ cleanliness:25 } },
  { id:'brush',    cat:'hygiene', icon:'🪷', name:'牙刷套装',      desc:'清洁 +35',                  price:8,   effect:{ cleanliness:35 } },
  { id:'shampoo',  cat:'hygiene', icon:'🧴', name:'香波沐浴露',    desc:'清洁 +55',                  price:15,  effect:{ cleanliness:55 } },
  { id:'spa',      cat:'hygiene', icon:'🛁', name:'豪华 SPA 套装', desc:'清洁 +100',                 price:35,  effect:{ cleanliness:100 } },
  // 健康医疗
  { id:'bandage',  cat:'health',  icon:'🩹', name:'创可贴',        desc:'健康 +15',                  price:8,   effect:{ health:15 } },
  { id:'medicine', cat:'health',  icon:'💊', name:'猫咪保健品',    desc:'健康 +30',                  price:20,  effect:{ health:30 } },
  { id:'vaccine',  cat:'health',  icon:'💉', name:'猫咪疫苗',      desc:'健康 +60 心情 -10',         price:45,  effect:{ health:60, mood:-10 } },
  // 娱乐玩具
  { id:'plush',    cat:'fun',     icon:'🧸', name:'毛绒玩具',      desc:'心情 +25',                  price:8,   effect:{ mood:25 } },
  { id:'toy',      cat:'fun',     icon:'🎀', name:'逗猫棒',        desc:'心情 +40',                  price:12,  effect:{ mood:40 } },
  { id:'toyset',   cat:'fun',     icon:'🎈', name:'猫咪玩具套装',  desc:'心情 +70',                  price:28,  effect:{ mood:70 } },
  { id:'laser',    cat:'fun',     icon:'🔦', name:'激光笔',        desc:'心情 +100 饱食 -15 水分 -15',price:40, effect:{ mood:100, satiety:-15, thirst:-15 } },
  // 特殊道具
  { id:'rename',   cat:'special', icon:'📛', name:'改名卡',        desc:'可以重新命名猫咪',          price:30,  effect:{ rename:true } },
  { id:'revive',   cat:'special', icon:'💌', name:'复活卡',        desc:'复活失去的好朋友',          price:100, effect:{ revive:true } },
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

const PROFESSIONS = [
  // Tier 1 — 无前置要求
  { id:'guardian',   icon:'🛡️', name:'看门保安', desc:'守卫家园，防止小偷入侵',       learnTicks:240,  wage:4,  req:[], tier:1 },
  { id:'barista',    icon:'☕',  name:'咖啡师',   desc:'猫咪咖啡店，为客人端茶送水',   learnTicks:360,  wage:7,  req:[], tier:1 },
  { id:'hunter',     icon:'🐭', name:'捕鼠猎手', desc:'专业捕猎,守护粮仓不让鼠辈猖狂', learnTicks:540,  wage:11, req:[], tier:1 },
  // Tier 2 — 需前置
  { id:'fisher',     icon:'🎣', name:'渔夫猫',   desc:'湖边垂钓，以渔为生',           learnTicks:840,  wage:16, req:['hunter'],           tier:2 },
  { id:'detective',  icon:'🔍', name:'侦探猫',   desc:'调查神秘案件，追踪可疑线索',   learnTicks:1350, wage:24, req:['barista'],          tier:2 },
  { id:'chef',       icon:'🍳', name:'星级厨师', desc:'猫咪星级餐厅掌厨料理大师',     learnTicks:1140, wage:20, req:['barista','hunter'], tier:2 },
  // Tier 3 — 高级
  { id:'accountant', icon:'📊', name:'理财顾问', desc:'帮猫咪们规划财富，稳健投资',   learnTicks:2250, wage:38, req:['detective','fisher'], tier:3 },
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
  try { localStorage.setItem(SAVE_KEY, JSON.stringify({ gs, logs, tickMs })); } catch(e) {}
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    gs = data.gs;
    logs = data.logs || [];
    if (data.tickMs) tickMs = data.tickMs;
    return true;
  } catch(e) { return false; }
}

function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}

// ---------- 离线计算 ----------
function applyOfflineTicks() {
  const elapsed = Date.now() - gs.lastSaveTime;
  const total = Math.min(Math.floor(elapsed / tickMs), Math.floor(8*3600000 / tickMs));
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

  // 新版现有时统：1 tick 默认为 30 秒。现实一天 = 2880 ticks
  // 目标需求：3天（约 8640 ticks）消耗约 90 点。因此基础消耗系数控制在 0.01 上下。
  const baseSatiety = 0.010 + (v-1)*0.001; 
  const baseThirst  = 0.012 + (v-1)*0.001;
  const baseClean   = 0.008 + (v-1)*0.001;

  gs.satiety     = clamp(gs.satiety     - baseSatiety * ms);
  gs.thirst      = clamp(gs.thirst      - baseThirst * mt);
  gs.cleanliness = clamp(gs.cleanliness - baseClean * mc);

  const rf = 1 - (r-1) * 0.05; // 抵抗力减免每级 5%
  let hd = 0;
  if (gs.satiety < 30)     hd -= 0.015 * rf;
  if (gs.thirst  < 20)     hd -= 0.020 * rf;
  if (gs.cleanliness < 20) hd -= 0.005 * rf;
  if (gs.satiety > 70 && gs.thirst > 70 && gs.cleanliness > 70) hd += 0.005;
  if (gs.state === 'trip') hd += 0.010;
  gs.health = clamp(gs.health + hd, 100);

  const moodDecay = Math.max(0.001, 0.003 - (iq-1)*0.0005);
  let md = -moodDecay;
  if (gs.health > 70)  md += 0.005;
  if (gs.satiety > 60) md += 0.002;
  if (gs.thirst  > 60) md += 0.002;
  if (gs.health < 30)  md -= 0.010;
  if (gs.satiety < 20) md -= 0.015;
  if (gs.state === 'trip') md += 0.020;
  gs.mood = clamp(gs.mood + md, 100);

  // Work earnings — every 240 ticks, based on current job
  if (gs.state === 'work' && gs.ticks > 0 && gs.ticks % 240 === 0) {
    const job = PROFESSIONS.find(p => p.id === gs.currentJobId);
    const earned = job ? job.wage : 3;
    gs.gold += earned;
    if (withEvents) addLog(`${job ? job.icon : '🛠️'} ${gs.name} 完成了一轮【${job ? job.name : '零工'}】，赚到 ${earned} 金币！`);
  }
  // Study: increment study progress for chosen profession
  if (gs.state === 'study' && gs.studyingProfessionId) {
    if (typeof gs.studyProgress !== 'object') gs.studyProgress = {}; // Migration safety
    const pid = gs.studyingProfessionId;
    gs.studyProgress[pid] = (gs.studyProgress[pid] || 0) + 1;
    const prof = PROFESSIONS.find(p => p.id === pid);
    if (prof && gs.studyProgress[pid] >= prof.learnTicks) {
      gs.learnedProfessions[prof.id] = true;
      gs.studyingProfessionId = null;
      gs.state = 'idle'; // 学习完自动切换回空闲
      if (withEvents) addLog(`🎓 ${gs.name} 学成了「${prof.icon}${prof.name}」！现在可以去打工了！`);
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
  addLog(isPaused ? '⏸ 时间已暂停（调试模式）' : '▶ 时间已恢复');
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
    ticks: 0, gold: 50, tripTicks: 0,
    satiety: 100, thirst: 100, cleanliness: 100, health: 100, mood: 100,
    state: 'idle', inventory: {}, isDead: false,
    learnedProfessions: {}, studyingProfessionId: null, studyProgress: {}, currentJobId: null,
  };
  logs = [];
  addLog(`🎉 ${name} 来到了新家，它看起来很开心！`);
  saveGame();
  launchGame();
}

// ---------- 启动 ----------
function launchGame() {
  document.getElementById('adoptScreen').style.display = 'none';
  document.getElementById('appContainer').style.display = 'block';
  document.getElementById('navBar').style.display = 'flex';
  // goldDisplay no longer exists in template; skip
  const gd = document.getElementById('goldDisplay');
  if (gd) gd.style.display = 'block';
  // Show floating backpack button
  const fab = document.getElementById('fabBag');
  if (fab) fab.style.display = 'flex';

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
  const months = 2 + Math.floor(gs.ticks / 200);
  const ageStr = months < 12 ? `${months} 个月` : `${(months/12).toFixed(1)} 岁`;
  setEl('ageDisplay', el => el.textContent = `年龄：${ageStr}`);
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

function openBackpackModal() {
  if (!gs) return;
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
  const inner = html || '<div class="inv-empty">背包空空如也，去商城买些东西吧~</div>';
  showModal('🎒','随身背包', `<div style="text-align:left;max-height:300px;overflow-y:auto;margin:-4px -2px">${inner}</div>`,
    [
      {label:'前往商城 🛒', cls:'btn-primary', fn:() => { switchScene('shop'); closeModalDirect(); }},
      {label:'关闭', fn:closeModalDirect}
    ]);
}

function useItemFromModal(id) {
  useItem(id);
  closeModalDirect();
  setTimeout(openBackpackModal, 80);
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
  ['idle','work','study','trip'].forEach(s => {
    document.getElementById('stateBtn-' + s)?.classList.toggle('active', gs.state === s);
  });
}

// ---------- 场景切换 ----------
function switchScene(name) {
  ['home','shop','system','trip'].forEach(s => {
    document.getElementById('scene' + s.charAt(0).toUpperCase() + s.slice(1))?.classList.toggle('active', s === name);
    document.getElementById('nav' + s.charAt(0).toUpperCase() + s.slice(1))?.classList.toggle('active', s === name);
  });
  document.body.className = `bg-${name}`;
  renderInventory('inventoryList');
  renderInventory('inventoryListHome');
}

// ---------- 状态机 ----------
function setState(newState) {
  if (!gs) return;
  if (gs.isDead) { addLog('⚠️ 宠物已离世，无法切换状态'); return; }
  if (gs.state === newState) return;
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
    return `<div class="shop-cat-title">${label}</div>
            <div class="shop-grid">${grid}</div>`;
  }).join('');
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
  const eff = item.effect;
  if(!gs.isDead) {
    if (eff.satiety)    gs.satiety    = clamp(gs.satiety    + eff.satiety, 100);
    if (eff.thirst)     gs.thirst     = clamp(gs.thirst     + eff.thirst, 100);
    if (eff.cleanliness)gs.cleanliness= clamp(gs.cleanliness+ eff.cleanliness, 100);
    if (eff.health)     gs.health     = clamp(gs.health     + eff.health, 100);
    if (eff.mood)       gs.mood       = clamp(gs.mood       + eff.mood, 100);
    addLog(`${item.icon} 使用了${item.name}，${gs.name}变舒服了~`);
  } else {
    addLog(`😿 宠物已去世，先用复活卡吧~`);
    return;
  }
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
function showSkillInfo() {
  showModal('📚','职业系统说明',
    `<div style="text-align:left;line-height:1.9;font-size:13px">
      🎓 <b>学习阶段</b><br>
      选择一门职业开始学习。挂机满对应的时间即可出师。<br>
      <br>
      💼 <b>打工阶段</b><br>
      出师后，可以在打工时选择该职业上岗。<br>
      保持打工状态，每隔一段时间就会自动结算一次工资，高阶职业赚得更多！<br>
      <br>
      📈 <b>晋级之路</b><br>
      某些高级职业（如星级厨师、理财顾问）需要先学会基础职业才能解锁。
    </div>`,
    [{label:'明白了！', cls:'btn-primary', fn:closeModalDirect}]
  );
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
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modalOverlay')) return;
  document.getElementById('modalOverlay').classList.remove('show');
}

function closeModalDirect() {
  document.getElementById('modalOverlay').classList.remove('show');
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
  const panel = document.getElementById('professionPanel');
  if (!panel) return;

  if (gs.state === 'study') {
    // Show all professions: locked / studying / unlocked
    const studying = gs.studyingProfessionId ? PROFESSIONS.find(p => p.id === gs.studyingProfessionId) : null;
    panel.innerHTML = `
      <div class="prof-panel-title">📚 选择要学习的职业</div>
      ${studying ? (() => {
        const prog = gs.studyProgress?.[studying.id] || 0;
        return `<div class="study-progress-bar-wrap">
          <div class="study-prog-label">${studying.icon} 正在学习「${studying.name}」…&nbsp;
            <span>已学 ${formatTime(prog)} / 共需 ${formatTime(studying.learnTicks)}</span></div>
          <div class="study-prog-bg"><div class="study-prog-fill" style="width:${Math.min(100,(prog/studying.learnTicks)*100).toFixed(1)}%"></div></div>
        </div>`;
      })() : ''}
      <div class="prof-grid">${PROFESSIONS.map(p => {
        const learned  = gs.learnedProfessions[p.id];
        const isStudying = gs.studyingProfessionId === p.id;
        const reqMet   = p.req.every(r => gs.learnedProfessions[r]);
        const canStudy = !learned && !isStudying && reqMet;
        const reqNames = p.req.map(r => PROFESSIONS.find(pp => pp.id === r)?.name || r).join('、');
        return `<div class="prof-card ${learned?' prof-learned':''} ${isStudying?' prof-studying':''} ${!reqMet&&!learned?' prof-locked':''}"
          onclick="${canStudy ? `selectStudyProfession('${p.id}')` : ''}">
          <div class="prof-icon">${p.icon}</div>
          <div class="prof-name">${p.name}</div>
          <div class="prof-desc">${learned?'✅ 已掌握': isStudying?'📖 学习中': !reqMet?`🔒 需先学：${reqNames}`: `⏱ 需 ${formatTime(p.learnTicks)}`}</div>
          <div class="prof-wage">打工收益：${p.wage}金 / ${formatTime(240)}</div>
        </div>`;
      }).join('')}</div>`;
  } else if (gs.state === 'work') {
    const learnedCount = Object.keys(gs.learnedProfessions).filter(k => gs.learnedProfessions[k]).length;
    panel.innerHTML = `
      <div class="prof-panel-title">🛠️ 选择打工职业</div>
      ${learnedCount === 0
        ? `<div class="prof-empty">还没有掌握任何职业，先去「学习」状态学习吧！目前只能做<b>零工（3金 / ${formatTime(240)}）</b>。</div>`
        : `<div class="prof-grid">${PROFESSIONS.map(p => {
            if (!gs.learnedProfessions[p.id]) return '';
            const active = gs.currentJobId === p.id;
            return `<div class="prof-card ${active?' prof-active':''}" onclick="selectJob('${p.id}')">
              <div class="prof-icon">${p.icon}</div>
              <div class="prof-name">${p.name}</div>
              <div class="prof-desc">${p.desc}</div>
              <div class="prof-wage">${active?'✅ 当前职业<br>':''}收益：${p.wage}金 / ${formatTime(240)}</div>
            </div>`;
          }).join('')}</div>`}`;
  } else {
    panel.innerHTML = '';
  }
}

function selectStudyProfession(id) {
  const prof = PROFESSIONS.find(p => p.id === id);
  if (!prof || gs.learnedProfessions[id]) return;
  const reqMet = prof.req.every(r => gs.learnedProfessions[r]);
  if (!reqMet) { addLog(`🔒 需要先学会：${prof.req.map(r=>PROFESSIONS.find(p=>p.id===r)?.name).join('、')}`); return; }
  gs.studyingProfessionId = id;
  if (typeof gs.studyProgress !== 'object') gs.studyProgress = {};
  if (!gs.studyProgress[id]) gs.studyProgress[id] = 0;
  const remaining = prof.learnTicks - gs.studyProgress[id];
  addLog(`📖 ${gs.name} 开始学习「${prof.icon}${prof.name}」，还需要 ${formatTime(remaining)}！`);
  updateProfessionUI();
  saveGame();
}

function selectJob(id) {
  if (!gs.learnedProfessions[id]) return;
  const prof = PROFESSIONS.find(p => p.id === id);
  gs.currentJobId = id;
  addLog(`💼 ${gs.name} 上岗了「${prof.icon}${prof.name}」，工资 ${prof.wage}金 / ${formatTime(240)}！`);
  updateProfessionUI();
  saveGame();
}

// ---------- 入口 ----------
window.addEventListener('DOMContentLoaded', () => {
  if (loadGame()) {
    try {
      // Migrate old saves that don't have profession fields
      if (!gs.learnedProfessions) gs.learnedProfessions = {};
      if (gs.studyingProfessionId === undefined) gs.studyingProfessionId = null;
      if (gs.studyProgress === undefined || typeof gs.studyProgress !== 'object') gs.studyProgress = {};
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
});

