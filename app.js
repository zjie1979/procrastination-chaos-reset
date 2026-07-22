const STORAGE_KEY = "procrastinationChaosReset.v1";
const SESSION_SECONDS = 10 * 60;

const modes = [
  { id: "chaos", title: "脑子乱", short: "先清出来" },
  { id: "start", title: "启动困难", short: "先做 3 分钟" },
  { id: "many", title: "事情太多", short: "先减到 3 件" },
  { id: "perfect", title: "怕做不好", short: "先做丑版本" },
  { id: "phone", title: "刷手机停不下", short: "先记时间" },
  { id: "low", title: "没能量", short: "先保底一小步" }
];

const protocols = {
  chaos: {
    title: "混乱清空 10 分钟",
    desc: "适合工作乱、房间乱、任务乱。先把脑内压力外置，不急着马上解决全部。",
    sourceIds: ["brain-reset", "time-audit"],
    steps: [
      ["清空桌面一小块", "只清 1 个抽屉、桌面 1 角或电脑桌面 5 个文件。"],
      ["写下 4 个维度", "健康、工作、家庭、社交，各写一句现状。"],
      ["每项打分", "0-10 分按第一反应打，不解释。"],
      ["只选一个修复动作", "选最低分里最容易做的一件，做到 10 分钟就停。"]
    ]
  },
  start: {
    title: "3 分钟启动法",
    desc: "适合知道要做什么，但迟迟开始不了。目标不是完成，是让任务进入手里。",
    sourceIds: ["todo-evolution", "micro-commit"],
    steps: [
      ["把任务改小", "改到不费力：打开文件、写标题、复制资料、改第一行。"],
      ["写丑版本", "允许粗糙、空白、乱，先有一个可修改的东西。"],
      ["计时 3 分钟", "只要求手在任务上，不要求状态好。"],
      ["记录 done", "做了什么就写什么，不写下一堆新计划。"]
    ]
  },
  many: {
    title: "任务减压法",
    desc: "适合一堆事挤在一起。先削峰，不把今天当成所有问题的终点。",
    sourceIds: ["can-method", "todo-evolution"],
    steps: [
      ["倒出全部任务", "先全部写进收集箱，不排序。"],
      ["今天只留 3 件", "保命一件、推进一件、收尾一件。"],
      ["加一件减一件", "任何新增任务，必须从今天挪走另一件。"],
      ["留机动时间", "把未完成放进候选区，不许在今天清单里堆满。"]
    ]
  },
  perfect: {
    title: "反完美保底法",
    desc: "适合越想做好越拖延。把标准降到能动起来，先恢复自我效能感。",
    sourceIds: ["tiny-wins", "todo-evolution"],
    steps: [
      ["写保底版本", "只写一件小到不会怕的动作。"],
      ["允许只做 20%", "只要去做，不要求做完。"],
      ["完成小事也算", "吃早饭、收衣服、打开文档，都可以记录成完成。"],
      ["不要重开计划", "今天不做复杂模板，只保留下一小步。"]
    ]
  },
  phone: {
    title: "时间记账法",
    desc: "适合刷手机后愧疚，或不知道时间去哪了。先看清时间流向。",
    sourceIds: ["time-audit"],
    steps: [
      ["记下现在时间", "不用补以前，从这一刻开始。"],
      ["记录接下来 10 分钟", "工作、发呆、聊天、刷手机，都如实记。"],
      ["标出黑洞", "哪个行为最吞时间，只标一个。"],
      ["给黑洞设边界", "下一轮只限制 10 分钟，不做永久戒断。"]
    ]
  },
  low: {
    title: "低能量保底法",
    desc: "适合累、低落、什么都不想做。先让身体和环境给一点正反馈。",
    sourceIds: ["brain-reset", "tiny-wins"],
    steps: [
      ["喝水或站起来", "给身体一个明确切换信号。"],
      ["清理 5 件东西", "垃圾、杯子、衣服、文件都可以。"],
      ["做一个不需思考的动作", "比如打开待办、找资料、发一句确认消息。"],
      ["写一句完成", "让大脑看到：我今天没有完全停住。"]
    ]
  }
};

const methods = [
  {
    id: "brain-reset",
    title: "训脑三件事",
    tag: "混乱恢复",
    signal: "搜索卡片约 13.8 万互动，详情页 255 条评论",
    sourceTitle: "3个“训脑”方法，恢复状态、摆脱混乱",
    sourceUrl: "https://www.xiaohongshu.com/explore/6857f0cd000000001203c170",
    summary: "先清物理空间，再看健康、工作、家庭、社交四个维度，最后用一个很小的承诺恢复自我信任。",
    steps: ["清理一个小区域", "四维度各写一句现状", "按直觉打分", "今天只兑现一个小承诺"]
  },
  {
    id: "time-audit",
    title: "时间记账",
    tag: "拖延定位",
    signal: "搜索卡片约 3.1 万互动；评论里有人反馈持续记录三年",
    sourceTitle: "世界公认有效的时间管理方法，3天摆脱拖延",
    sourceUrl: "https://www.xiaohongshu.com/explore/69cdf228000000001b020ea7",
    summary: "像记账一样记录时间，不先批评自己。先看到时间黑洞，再给不同任务设置时间边界。",
    steps: ["记录每段时间去了哪里", "找出时间黑洞", "把任务分成创作、例行、杂务", "给杂务限时"]
  },
  {
    id: "can-method",
    title: "罐头法",
    tag: "P 人友好",
    signal: "搜索卡片约 3.5 万互动；评论高赞反馈 P 人更适合 done list",
    sourceTitle: "罐头学习法：更适合 P 人和拖延症",
    sourceUrl: "https://www.xiaohongshu.com/explore/68d27f200000000013006025",
    summary: "不写每天必须完成什么，改成周目标 + 每日 done list。每天做了什么写什么，一周内凑够进度。",
    steps: ["只定本周总量", "今天不排满", "做完再写 done", "没完成的自动滚到后面"]
  },
  {
    id: "todo-evolution",
    title: "任务极小化",
    tag: "启动困难",
    signal: "评论里反复出现任务太多、拖到打不开的共鸣",
    sourceTitle: "我的 todo list 进化论：如何用它消除拖延",
    sourceUrl: "https://www.xiaohongshu.com/explore/69ad730f000000001a01f117",
    summary: "把模糊任务拆到马上能做，未完成要复盘原因；今天任务不要超过承受上限。",
    steps: ["大任务改成下一动作", "每天最多三件主任务", "未完成写原因", "加一件就减一件"]
  },
  {
    id: "tiny-wins",
    title: "低标准小胜利",
    tag: "完美主义",
    signal: "搜索卡片约 3.7 万互动；评论里大量共鸣“列太多反而不想干”",
    sourceTitle: "最能解决习得性无助、完美主义拖延症的小 tip",
    sourceUrl: "https://www.xiaohongshu.com/explore/69526c6a000000001e02247e",
    summary: "把要求降到能启动，收衣服、吃早饭、打开文件这种小事也记录，先恢复“我能做”的感觉。",
    steps: ["只写保底动作", "不要求做完", "完成小事也算", "今天不重做复杂计划"]
  },
  {
    id: "positive-loop",
    title: "正反馈习惯",
    tag: "持续靠近目标",
    signal: "搜索卡片约 3.7 万互动；评论反馈生活学习工作更有序",
    sourceTitle: "从拖延到轻松靠近目标，无痛养成习惯",
    sourceUrl: "https://www.xiaohongshu.com/explore/69eca45e000000003701c049",
    summary: "不要只盯最终目标，每天记录一个靠近目标的动作，让正反馈把下一次启动变容易。",
    steps: ["选一个目标", "写今天能靠近它的一小步", "完成后立刻记录", "明天沿用同一入口"]
  }
];

const state = loadState();
let timerId = null;

const nodes = {
  todayDate: document.querySelector("#todayDate"),
  modeGrid: document.querySelector("#modeGrid"),
  modeHint: document.querySelector("#modeHint"),
  protocolTitle: document.querySelector("#protocolTitle"),
  protocolDesc: document.querySelector("#protocolDesc"),
  timerText: document.querySelector("#timerText"),
  timerBtn: document.querySelector("#timerBtn"),
  skipTimerBtn: document.querySelector("#skipTimerBtn"),
  stepList: document.querySelector("#stepList"),
  progressText: document.querySelector("#progressText"),
  winInput: document.querySelector("#winInput"),
  finishBtn: document.querySelector("#finishBtn"),
  finishNote: document.querySelector("#finishNote"),
  resetTodayBtn: document.querySelector("#resetTodayBtn"),
  methodList: document.querySelector("#methodList"),
  statsGrid: document.querySelector("#statsGrid"),
  historyList: document.querySelector("#historyList"),
  historyCount: document.querySelector("#historyCount")
};

function defaultState() {
  return {
    tab: "today",
    mode: "chaos",
    checked: {},
    timer: {
      running: false,
      endsAt: 0,
      remaining: SESSION_SECONDS
    },
    history: []
  };
}

function loadState() {
  const base = defaultState();
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      tab: ["today", "methods", "records"].includes(stored.tab) ? stored.tab : base.tab,
      mode: protocols[stored.mode] ? stored.mode : base.mode,
      checked: normalizeChecked(stored.checked),
      timer: normalizeTimer(stored.timer),
      history: normalizeHistory(stored.history)
    };
  } catch {
    return base;
  }
}

function normalizeChecked(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const result = {};
  Object.entries(raw).forEach(([date, byMode]) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !byMode || typeof byMode !== "object") return;
    result[date] = {};
    Object.keys(protocols).forEach((mode) => {
      const values = Array.isArray(byMode[mode]) ? byMode[mode] : [];
      result[date][mode] = values.filter((index) => Number.isInteger(index) && index >= 0 && index < protocols[mode].steps.length);
    });
  });
  return result;
}

function normalizeTimer(raw) {
  if (!raw || typeof raw !== "object") return defaultState().timer;
  const remaining = Number.isFinite(Number(raw.remaining)) ? Number(raw.remaining) : SESSION_SECONDS;
  return {
    running: Boolean(raw.running),
    endsAt: Number(raw.endsAt || 0),
    remaining: Math.max(0, Math.min(SESSION_SECONDS, remaining))
  };
}

function normalizeHistory(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const mode = protocols[item?.mode] ? item.mode : "chaos";
    return {
      id: String(item.id || Date.now()),
      date: String(item.date || todayKey()),
      time: String(item.time || timeLabel(new Date())),
      mode,
      protocolTitle: String(item.protocolTitle || protocols[mode].title),
      steps: Number(item.steps || 0),
      win: String(item.win || "").slice(0, 120)
    };
  }).slice(0, 150);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function todayKey() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function todayLabel() {
  const date = new Date();
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function timeLabel(date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function getCheckedSet() {
  const date = todayKey();
  state.checked[date] ||= {};
  state.checked[date][state.mode] ||= [];
  return new Set(state.checked[date][state.mode]);
}

function setCheckedSet(set) {
  const date = todayKey();
  state.checked[date] ||= {};
  state.checked[date][state.mode] = Array.from(set).sort((a, b) => a - b);
  saveState();
}

function renderAll() {
  syncTimer();
  renderShell();
  renderToday();
  renderMethods();
  renderRecords();
}

function renderShell() {
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("is-active", view.id === `view${capitalize(state.tab)}`);
  });
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === state.tab);
  });
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function renderToday() {
  const protocol = protocols[state.mode];
  const checked = getCheckedSet();
  nodes.todayDate.textContent = todayLabel();
  nodes.modeHint.textContent = modes.find((mode) => mode.id === state.mode)?.short || "";
  nodes.modeGrid.innerHTML = modes.map((mode) => `
    <button class="mode-button ${mode.id === state.mode ? "is-active" : ""}" type="button" data-mode="${mode.id}">
      <strong>${mode.title}</strong>
      <span>${mode.short}</span>
    </button>
  `).join("");
  nodes.protocolTitle.textContent = protocol.title;
  nodes.protocolDesc.textContent = protocol.desc;
  nodes.stepList.innerHTML = protocol.steps.map(([name, help], index) => `
    <button class="check-row ${checked.has(index) ? "done" : ""}" type="button" data-step="${index}">
      <span class="box"></span>
      <span>
        <span class="step-name">${name}</span>
        <span class="step-help">${help}</span>
      </span>
    </button>
  `).join("");
  nodes.progressText.textContent = `${checked.size}/${protocol.steps.length}`;
  nodes.timerText.textContent = formatTimer(timerRemaining());
  nodes.timerBtn.textContent = state.timer.running ? "暂停" : (timerRemaining() < SESSION_SECONDS ? "继续" : "开始 10 分钟");
  nodes.skipTimerBtn.textContent = timerRemaining() < SESSION_SECONDS ? "重置计时" : "不用计时";
  nodes.finishBtn.disabled = checked.size === 0 && !nodes.winInput.value.trim();
  nodes.finishNote.textContent = checked.size === protocol.steps.length ? "这一轮步骤已经完成，可以保存记录。" : "做到一步也可以保存，重点是开始。";
}

function renderMethods() {
  nodes.methodList.innerHTML = methods.map((method) => `
    <article class="method-card">
      <div class="method-head">
        <div>
          <h3>${method.title}</h3>
          <p>${method.summary}</p>
        </div>
        <span class="tag-pill">${method.tag}</span>
      </div>
      <div class="method-meta">
        <span class="count-pill">${method.signal}</span>
      </div>
      <ol class="method-steps">
        ${method.steps.map((step) => `<li>${step}</li>`).join("")}
      </ol>
      <div class="method-actions">
        <button class="plain-button" type="button" data-use-method="${method.id}">用这个方法</button>
        <a class="source-link" href="${method.sourceUrl}" target="_blank" rel="noopener">来源笔记</a>
      </div>
    </article>
  `).join("");
}

function renderRecords() {
  const total = state.history.length;
  const todayCount = state.history.filter((item) => item.date === todayKey()).length;
  const mostUsed = mostUsedProtocol();
  const totalSteps = state.history.reduce((sum, item) => sum + Number(item.steps || 0), 0);
  nodes.statsGrid.innerHTML = [
    statCard("自救次数", `${total} 次`),
    statCard("今天完成", `${todayCount} 次`),
    statCard("累计步骤", `${totalSteps} 步`),
    statCard("最常用", mostUsed || "--")
  ].join("");
  nodes.historyCount.textContent = `${total} 条`;
  nodes.historyList.innerHTML = total ? state.history.slice(0, 30).map(renderHistoryItem).join("") : `<p class="empty-text">完成一轮后，这里会出现记录。</p>`;
}

function statCard(label, value) {
  return `
    <article class="stat-card">
      <span>${label}</span>
      <strong>${value}</strong>
    </article>
  `;
}

function renderHistoryItem(item) {
  const mode = modes.find((entry) => entry.id === item.mode);
  return `
    <article class="history-item">
      <div class="history-main">
        <strong>${item.date} ${item.time} · ${item.protocolTitle}</strong>
        <p class="history-meta">${mode?.title || "自救"} · 完成 ${item.steps} 步${item.win ? ` · ${escapeHtml(item.win)}` : ""}</p>
      </div>
      <span class="result-pill done">完成</span>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function mostUsedProtocol() {
  const counts = new Map();
  state.history.forEach((item) => {
    counts.set(item.protocolTitle, (counts.get(item.protocolTitle) || 0) + 1);
  });
  let best = "";
  let bestCount = 0;
  counts.forEach((count, title) => {
    if (count > bestCount) {
      best = title;
      bestCount = count;
    }
  });
  return best;
}

function switchTab(tab) {
  if (!["today", "methods", "records"].includes(tab)) return;
  state.tab = tab;
  saveState();
  renderAll();
}

function switchMode(mode) {
  if (!protocols[mode]) return;
  state.mode = mode;
  resetTimer(false);
  saveState();
  renderAll();
}

function methodToMode(methodId) {
  const pairs = {
    "brain-reset": "chaos",
    "time-audit": "phone",
    "can-method": "many",
    "todo-evolution": "start",
    "tiny-wins": "perfect",
    "positive-loop": "low"
  };
  return pairs[methodId] || "chaos";
}

function toggleStep(index) {
  const checked = getCheckedSet();
  if (checked.has(index)) checked.delete(index);
  else checked.add(index);
  setCheckedSet(checked);
  renderAll();
}

function startOrPauseTimer() {
  syncTimer();
  if (state.timer.running) {
    state.timer.running = false;
    state.timer.remaining = timerRemaining();
    state.timer.endsAt = 0;
  } else {
    const remaining = timerRemaining() || SESSION_SECONDS;
    state.timer.running = true;
    state.timer.remaining = remaining;
    state.timer.endsAt = Date.now() + remaining * 1000;
  }
  saveState();
  renderAll();
  runTimerLoop();
}

function resetTimer(render = true) {
  state.timer = { running: false, endsAt: 0, remaining: SESSION_SECONDS };
  if (timerId) window.clearInterval(timerId);
  timerId = null;
  if (render) {
    saveState();
    renderAll();
  }
}

function syncTimer() {
  if (!state.timer.running) return;
  const remain = timerRemaining();
  if (remain <= 0) {
    state.timer.running = false;
    state.timer.remaining = 0;
    state.timer.endsAt = 0;
    saveState();
  }
}

function timerRemaining() {
  if (state.timer.running) {
    return Math.max(0, Math.ceil((state.timer.endsAt - Date.now()) / 1000));
  }
  return Math.max(0, Number(state.timer.remaining || SESSION_SECONDS));
}

function formatTimer(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function runTimerLoop() {
  if (timerId) window.clearInterval(timerId);
  if (!state.timer.running) return;
  timerId = window.setInterval(() => {
    syncTimer();
    nodes.timerText.textContent = formatTimer(timerRemaining());
    if (!state.timer.running) {
      window.clearInterval(timerId);
      timerId = null;
      renderAll();
    }
  }, 500);
}

function finishSession() {
  const checked = getCheckedSet();
  const protocol = protocols[state.mode];
  const win = nodes.winInput.value.trim();
  if (!checked.size && !win) return;
  state.history.unshift({
    id: String(Date.now()),
    date: todayKey(),
    time: timeLabel(new Date()),
    mode: state.mode,
    protocolTitle: protocol.title,
    steps: checked.size,
    win
  });
  state.history = state.history.slice(0, 150);
  state.checked[todayKey()][state.mode] = [];
  nodes.winInput.value = "";
  resetTimer(false);
  saveState();
  state.tab = "records";
  renderAll();
}

function resetToday() {
  const date = todayKey();
  const hasChecked = Object.values(state.checked[date] || {}).some((items) => Array.isArray(items) && items.length);
  if (!hasChecked && timerRemaining() === SESSION_SECONDS && !nodes.winInput.value.trim()) return;
  if (!window.confirm("确定重置今天正在做的这一轮吗？")) return;
  state.checked[date] = {};
  nodes.winInput.value = "";
  resetTimer(false);
  saveState();
  renderAll();
}

document.body.addEventListener("click", (event) => {
  const tabButton = event.target.closest("[data-tab]");
  if (tabButton) {
    switchTab(tabButton.dataset.tab);
    return;
  }

  const modeButton = event.target.closest("[data-mode]");
  if (modeButton) {
    switchMode(modeButton.dataset.mode);
    return;
  }

  const stepButton = event.target.closest("[data-step]");
  if (stepButton) {
    toggleStep(Number(stepButton.dataset.step));
    return;
  }

  const methodButton = event.target.closest("[data-use-method]");
  if (methodButton) {
    switchMode(methodToMode(methodButton.dataset.useMethod));
    switchTab("today");
  }
});

nodes.timerBtn.addEventListener("click", startOrPauseTimer);
nodes.skipTimerBtn.addEventListener("click", () => resetTimer(true));
nodes.finishBtn.addEventListener("click", finishSession);
nodes.resetTodayBtn.addEventListener("click", resetToday);
nodes.winInput.addEventListener("input", renderToday);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js?v=20260722t1").catch(() => {});
  });
}

renderAll();
runTimerLoop();
