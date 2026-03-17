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

const ITEMS = [
  { id:'fish',     icon:'🐟', name:'鱼罐头',    desc:'饱食 +35',       price:10,  effect:{ satiety:35 } },
  { id:'water',    icon:'💦', name:'矿泉水',    desc:'水分 +40',       price:5,   effect:{ thirst:40 } },
  { id:'soap',     icon:'🧴', name:'香波沐浴露', desc:'清洁 +50',       price:15,  effect:{ cleanliness:50 } },
  { id:'medicine', icon:'💊', name:'猫咪保健品', desc:'健康 +30',       price:20,  effect:{ health:30 } },
  { id:'toy',      icon:'🎀', name:'逗猫棒',    desc:'心情 +40',       price:12,  effect:{ mood:40 } },
  { id:'rename',   icon:'📛', name:'改名卡',    desc:'可以重新命名猫咪', price:30,  effect:{ rename:true } },
  { id:'revive',   icon:'💌', name:'复活卡',    desc:'复活失去的好朋友', price:100, effect:{ revive:true } },
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

// ---------- 全局状态 ----------
let gs = null;
let tickTimer = null;
let tickMs = 3000;
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
  if (total <= 0) return;
  for (let i = 0; i < total; i++) { applyDecay(false); gs.ticks++; }
  const mins = Math.round(total * tickMs / 60000);
  const el = document.getElementById('offlineNotice');
  el.style.display = 'block';
  el.innerHTML = `⏰ <strong>${gs.name}</strong> 离线了约 ${mins} 分钟，状态发生了变化~`;
  addLog(`⏰ 离线了 ${mins} 分钟，${gs.name} 在家等你回来~`);
  setTimeout(() => el.style.display = 'none', 5000);
}

// ---------- 衰减 ----------
function getMultiplier() {
  return { idle: [1,1,1], work: [1.8,1.8,1.5], study: [1.5,1.5,1.2], trip: [2,2.5,2] }[gs.state] || [1,1,1];
}

function applyDecay(withEvents = true) {
  if (!gs || gs.isDead) return;
  const v = gs.cat.vitality, r = gs.cat.resistance, iq = gs.cat.intelligence;
  const [ms, mt, mc] = getMultiplier();

  gs.satiety     = clamp(gs.satiety     - (0.5 + (v-1)*0.1) * ms);
  gs.thirst      = clamp(gs.thirst      - (0.6 + (v-1)*0.1) * mt);
  gs.cleanliness = clamp(gs.cleanliness - 0.2 * mc);

  const rf = 1 - (r-1) * 0.08;
  let hd = 0;
  if (gs.satiety < 30)     hd -= 0.3 * rf;
  if (gs.thirst  < 20)     hd -= 0.4 * rf;
  if (gs.cleanliness < 20) hd -= 0.15 * rf;
  if (gs.satiety > 70 && gs.thirst > 70 && gs.cleanliness > 70) hd += 0.05;
  if (gs.state === 'trip') hd += 0.2;
  gs.health = clamp(gs.health + hd, 100);

  const moodDecay = Math.max(0.05, 0.15 - (iq-1)*0.02);
  let md = -moodDecay;
  if (gs.health > 70)  md += 0.1;
  if (gs.satiety > 60) md += 0.05;
  if (gs.thirst  > 60) md += 0.05;
  if (gs.health < 30)  md -= 0.2;
  if (gs.satiety < 20) md -= 0.15;
  if (gs.state === 'trip') md += 0.3;
  gs.mood = clamp(gs.mood + md, 100);

  // Work earnings — every 8 ticks (24s default), base 3 + skill bonus
  if (gs.state === 'work' && gs.ticks > 0 && gs.ticks % 8 === 0) {
    const earned = 3 + Math.floor(gs.skillPoints / 5);
    gs.gold += earned;
    if (withEvents) addLog(`🛠️ ${gs.name} 打完一份工，赚到 ${earned} 金币！`);
  }
  // Study skill points — every 15 ticks
  if (gs.state === 'study' && gs.ticks > 0 && gs.ticks % 15 === 0) {
    gs.skillPoints++;
    if (withEvents) addLog(`📚 ${gs.name} 学习进步！技能点 +1（共 ${gs.skillPoints} 点，每5点增加1金/轮）`);
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
    ticks: 0, gold: 50, skillPoints: 0, tripTicks: 0,
    satiety: 100, thirst: 100, cleanliness: 100, health: 100, mood: 100,
    state: 'idle', inventory: {}, isDead: false,
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
  document.getElementById('goldDisplay').style.display = 'block';

  renderShopGrid();
  updateUI();
  switchScene('home');
  startTicker();
}

// ---------- UI 更新 ----------
function updateUI() {
  if (!gs) return;
  // Gold
  document.getElementById('goldVal').textContent = gs.gold;
  document.getElementById('shopGoldVal').textContent = gs.gold;

  // Stat bars
  setBar('satiety',    gs.satiety);
  setBar('thirst',     gs.thirst);
  setBar('clean',      gs.cleanliness);
  setBar('health',     gs.health);
  setBar('mood',       gs.mood);

  // Avatar
  document.getElementById('gameAvatar').textContent = gs.cat.emoji;
  document.getElementById('gameNameDisplay').textContent = gs.name;
  document.getElementById('breedTag').textContent = gs.cat.breed;

  const genderEl = document.getElementById('genderTag');
  genderEl.textContent = gs.cat.gender === '公' ? '♂ 公' : '♀ 母';
  genderEl.className = 'tag ' + (gs.cat.gender === '公' ? 'tag-gender-m' : 'tag-gender-f');

  document.getElementById('rarityTag').style.display = gs.cat.rarity === 'rare' ? '' : 'none';

  // Age
  const months = 2 + Math.floor(gs.ticks / 200);
  const ageStr = months < 12 ? `${months} 个月` : `${(months/12).toFixed(1)} 岁`;
  document.getElementById('ageDisplay').textContent = `年龄：${ageStr}`;

  // Mood text
  document.getElementById('moodLine').textContent = getMoodText();

  // State badge
  const badges = { idle:'😴', work:'🛠️', study:'📚', trip:'🌳' };
  document.getElementById('stateBadge').textContent = gs.isDead ? '💀' : (badges[gs.state] || '😴');

  // Skill info
  const lv = 1 + Math.floor(gs.skillPoints / 5);
  const gpm = 3 + Math.floor(gs.skillPoints / 5);
  document.getElementById('skillInfo').textContent =
    `技能 Lv.${lv} ｜ 打工 ${gpm}金/轮（每8tick）｜ 技能点 ${gs.skillPoints}`;

  updateStateButtons();
  renderInventory('inventoryList');
  renderInventory('inventoryListHome');
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
  ['home','shop','system'].forEach(s => {
    document.getElementById('scene' + s.charAt(0).toUpperCase() + s.slice(1))?.classList.toggle('active', s === name);
    document.getElementById('nav' + s.charAt(0).toUpperCase() + s.slice(1))?.classList.toggle('active', s === name);
  });
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
  const grid = document.getElementById('shopGrid');
  grid.innerHTML = ITEMS.map(item => `
    <div class="shop-item" onclick="buyItem('${item.id}')">
      <span class="item-icon">${item.icon}</span>
      <div class="item-name">${item.name}</div>
      <div class="item-desc">${item.desc}</div>
      <div class="item-price">🪙 ${item.price}</div>
    </div>`).join('');
}

function buyItem(id) {
  const item = ITEMS.find(i => i.id === id);
  if (!item) return;
  if (gs.gold < item.price) {
    showModal('💸','金币不足！',`购买 ${item.name} 需要 ${item.price} 金币，当前只有 ${gs.gold} 枚~`,[{label:'好吧',fn:closeModal}]);
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
  const consumables = ITEMS.filter(i => !i.effect.rename && !i.effect.revive);
  const functional  = ITEMS.filter(i =>  i.effect.rename ||  i.effect.revive);

  function renderGroup(title, items) {
    const entries = items.map(item => {
      const count = gs.inventory[item.id] || 0;
      if (!count) return '';
      return `<div class="inv-item">
        <span class="inv-icon">${item.icon}</span>
        <div class="inv-info"><div class="inv-name">${item.name}</div><div class="inv-count">×${count} 件 · ${item.desc}</div></div>
        <button class="btn btn-sm btn-ghost" onclick="useItem('${item.id}')">使用</button>
      </div>`;
    }).filter(Boolean);
    if (!entries.length) return '';
    return `<div class="inv-category">${title}</div>` + entries.join('');
  }

  const html = renderGroup('🍱 消耗品', consumables) + renderGroup('🔧 功能道具', functional);
  list.innerHTML = html || '<div class="inv-empty">背包空空如也，去商城买些东西吧~</div>';
}

function addGold(n) { gs.gold += n; }

// ---------- 设置 ----------
function updateTickRate(v) {
  tickMs = v * 1000;
  document.getElementById('tickRateLabel').textContent = `当前：${v}秒/tick`;
  startTicker();
  saveGame();
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
          updateUI(); saveGame(); closeModal();
        }}, {label:'取消',fn:closeModal}]
      : [{label:'好的',fn:closeModal}]
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
        closeModal();
      }},
     {label:'取消', fn:closeModal}
    ]);
}

// ---------- 复活宠物 ----------
function revivePet() {
  if (!gs.isDead) { showModal('🐱','宠物好好的！','不需要复活哦~',[{label:'好的',fn:closeModal}]); return; }
  const hasCard = gs.inventory['revive'] && gs.inventory['revive'] > 0;
  if (!hasCard) { showModal('💔','没有复活卡','去商城购买复活卡再来吧~',[{label:'好的',fn:closeModal}]); return; }
  useItem('revive');
}

// ---------- 技能说明 ----------
function showSkillInfo() {
  showModal('📚','技能系统说明',
    `<div style="text-align:left;line-height:1.9;font-size:13px">
      🎓 <b>技能点</b> 通过让猫咪「学习」来积累<br>
      ⚡ 每 <b>15 ticks</b> 学习可获得 1 技能点<br>
      🛠️ 打工收益 = <b>3 + ⌊技能点 ÷ 5⌋</b> 金币/轮<br>
      📈 每攒满 5 技能点，打工额外 +1 金币<br>
      🏆 技能等级 = 1 + ⌊技能点 ÷ 5⌋<br><br>
      💡 建议先「学习」积累技能点，再「打工」赚更多钱！
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

// ---------- 入口 ----------
window.addEventListener('DOMContentLoaded', () => {
  if (loadGame()) {
    applyOfflineTicks();
    launchGame();
  } else {
    initAdoptScreen();
  }
  // Close modal on overlay click
  document.getElementById('modalOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modalOverlay')) closeModalDirect();
  });
  // Tick slider init
  document.getElementById('tickSlider').value = tickMs / 1000;
  document.getElementById('tickRateLabel').textContent = `当前：${tickMs/1000}秒/tick`;
});
