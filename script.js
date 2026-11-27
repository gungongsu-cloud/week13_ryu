// 유틸: 쉼표 또는 줄바꿈으로 이름 목록 파싱 및 배열 셔플
function parseNames(raw) {
  return raw
    .split(/[\n,]+/)
    .map((name) => name.trim())
    .filter(Boolean);
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// 01. 글자 수 계산기
const charInput = document.getElementById('char-input');
const charNoSpace = document.getElementById('char-no-space');
const charBtn = document.getElementById('char-btn');
const charResult = document.getElementById('char-result');

function calculateChars() {
  const text = charInput.value;
  const count = charNoSpace.checked ? text.replace(/\s/g, '').length : text.length;
  charResult.textContent = `총 글자 수: ${count.toLocaleString()} 자`;
}

charBtn.addEventListener('click', calculateChars);
charInput.addEventListener('input', calculateChars);
charNoSpace.addEventListener('change', calculateChars);

// 02. D-day 계산기
const ddayTitle = document.getElementById('dday-title');
const ddayDate = document.getElementById('dday-date');
const ddayBtn = document.getElementById('dday-btn');
const ddayResult = document.getElementById('dday-result');

ddayBtn.addEventListener('click', () => {
  if (!ddayDate.value) {
    ddayResult.textContent = '목표 날짜를 선택해주세요.';
    return;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(ddayDate.value + 'T00:00:00');
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));
  const title = ddayTitle.value.trim() ? `[${ddayTitle.value.trim()}] ` : '';

  if (diffDays === 0) {
    ddayResult.textContent = `${title}D-Day (오늘입니다!)`;
  } else if (diffDays > 0) {
    ddayResult.textContent = `${title}남은 기간: D-${diffDays} (${diffDays}일 남음)`;
  } else {
    ddayResult.textContent = `${title}경과 기간: D+${Math.abs(diffDays)} (${Math.abs(diffDays)}일 지남)`;
  }
});

// 03. 랜덤 순서 정하기
const orderInput = document.getElementById('order-input');
const orderBtn = document.getElementById('order-btn');
const orderResult = document.getElementById('order-result');

orderBtn.addEventListener('click', () => {
  const names = parseNames(orderInput.value);
  if (names.length === 0) {
    orderResult.textContent = '참여자 이름을 입력해주세요.';
    return;
  }
  const shuffled = shuffleArray(names);
  orderResult.textContent = shuffled.map((name, idx) => `${idx + 1}번: ${name}`).join('\n');
});

// 04. 팀 구성하기
const teamInput = document.getElementById('team-input');
const teamMode = document.getElementById('team-mode');
const teamNum = document.getElementById('team-num');
const teamBtn = document.getElementById('team-btn');
const teamResult = document.getElementById('team-result');

teamBtn.addEventListener('click', () => {
  const names = parseNames(teamInput.value);
  const num = parseInt(teamNum.value, 10);

  if (names.length === 0 || !num || num < 1) {
    teamResult.textContent = '참여자 이름과 올바른 숫자를 입력해주세요.';
    return;
  }

  const shuffled = shuffleArray(names);
  const teams = [];

  if (teamMode.value === 'count') {
    const teamCount = Math.min(num, shuffled.length);
    for (let i = 0; i < teamCount; i++) teams.push([]);
    shuffled.forEach((person, idx) => {
      teams[idx % teamCount].push(person);
    });
  } else {
    for (let i = 0; i < shuffled.length; i += num) {
      teams.push(shuffled.slice(i, i + num));
    }
  }

  teamResult.textContent = teams
    .map((members, idx) => `${idx + 1}팀: ${members.join(', ')}`)
    .join('\n');
});

// 05. 발표 시간 계산기
const speechInput = document.getElementById('speech-input');
const speechSpeed = document.getElementById('speech-speed');
const speechBtn = document.getElementById('speech-btn');
const speechResult = document.getElementById('speech-result');

speechBtn.addEventListener('click', () => {
  const text = speechInput.value.replace(/\s/g, '');
  if (!text.length) {
    speechResult.textContent = '발표 대본을 입력해주세요.';
    return;
  }
  const cpm = parseInt(speechSpeed.value, 10);
  const totalSeconds = Math.round((text.length / cpm) * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  speechResult.textContent = `예상 발표 시간: ${minutes}분 ${seconds}초 (공백 제외 ${text.length}자)`;
});

// 06. 스톱워치
const swDisplay = document.getElementById('sw-display');
const swStatus = document.getElementById('sw-status');
const swStart = document.getElementById('sw-start');
const swStop = document.getElementById('sw-stop');
const swReset = document.getElementById('sw-reset');

let swSeconds = 0;
let swInterval = null;

function formatTime(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, '0');
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

swStart.addEventListener('click', () => {
  if (swInterval) return;
  swStatus.textContent = '측정 중...';
  swInterval = setInterval(() => {
    swSeconds++;
    swDisplay.textContent = formatTime(swSeconds);
  }, 1000);
});

swStop.addEventListener('click', () => {
  if (!swInterval) return;
  clearInterval(swInterval);
  swInterval = null;
  swStatus.textContent = '일시 정지됨';
});

swReset.addEventListener('click', () => {
  clearInterval(swInterval);
  swInterval = null;
  swSeconds = 0;
  swDisplay.textContent = '00:00:00';
  swStatus.textContent = '측정 대기 중';
});

// 07. BMI 계산기
const bmiHeight = document.getElementById('bmi-height');
const bmiWeight = document.getElementById('bmi-weight');
const bmiBtn = document.getElementById('bmi-btn');
const bmiResult = document.getElementById('bmi-result');

bmiBtn.addEventListener('click', () => {
  const h = parseFloat(bmiHeight.value);
  const w = parseFloat(bmiWeight.value);

  if (!h || !w || h <= 0 || w <= 0) {
    bmiResult.textContent = '올바른 신장과 체중을 입력해주세요.';
    return;
  }

  const bmi = w / ((h / 100) ** 2);
  let status = '';
  if (bmi < 18.5) status = '저체중';
  else if (bmi < 23) status = '정상';
  else if (bmi < 25) status = '과체중';
  else status = '비만';

  bmiResult.textContent = `나의 BMI: ${bmi.toFixed(1)} (${status})`;
});

// 08. 준비물 체크리스트
const todoInput = document.getElementById('todo-input');
const todoAdd = document.getElementById('todo-add');
const todoList = document.getElementById('todo-list');
const todoCount = document.getElementById('todo-count');
const todoReset = document.getElementById('todo-reset');

const DEFAULT_ITEMS = [
  { text: '노트북', done: false },
  { text: '충전기', done: false },
  { text: '필기구', done: false }
];

let items = JSON.parse(JSON.stringify(DEFAULT_ITEMS));

function renderChecklist() {
  todoList.innerHTML = '';
  items.forEach((item, index) => {
    const li = document.createElement('li');
    if (item.done) li.classList.add('done');

    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.done;
    checkbox.addEventListener('change', () => {
      items[index].done = checkbox.checked;
      renderChecklist();
    });

    const span = document.createElement('span');
    span.textContent = item.text;

    label.appendChild(checkbox);
    label.appendChild(span);

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '×';
    delBtn.title = '삭제';
    delBtn.addEventListener('click', () => {
      items.splice(index, 1);
      renderChecklist();
    });

    li.appendChild(label);
    li.appendChild(delBtn);
    todoList.appendChild(li);
  });

  const doneCount = items.filter((i) => i.done).length;
  todoCount.textContent = `완료: ${doneCount} / ${items.length}개`;
}

function addChecklistItem() {
  const text = todoInput.value.trim();
  if (!text) return;
  items.push({ text, done: false });
  todoInput.value = '';
  renderChecklist();
}

todoAdd.addEventListener('click', addChecklistItem);
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addChecklistItem();
});

todoReset.addEventListener('click', () => {
  items = JSON.parse(JSON.stringify(DEFAULT_ITEMS));
  renderChecklist();
});

renderChecklist();