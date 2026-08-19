import { portfolio } from '../data/portfolio.js';

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let soundEnabled = false;

const playSound = (kind = 'click') => {
  if (!soundEnabled || reducedMotion) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = new AudioContext();
  const now = context.currentTime;
  const patterns = {
    click: [[430, .05, 'sine', 0], [620, .035, 'sine', .03]],
    menu: [[145, .09, 'triangle', 0], [270, .075, 'triangle', .06], [430, .09, 'sine', .12]],
    lock: [[740, .06, 'square', 0], [980, .11, 'sine', .07]],
    send: [[440, .08, 'sine', 0], [660, .09, 'sine', .08], [880, .15, 'sine', .16]],
    boot: [[175, .1, 'sine', 0], [230, .08, 'sine', .08]],
    swing: [[110, .12, 'sawtooth', 0], [190, .12, 'triangle', .08], [380, .2, 'sine', .16]]
  };
  const sequence = patterns[kind] || patterns.click;
  sequence.forEach(([frequency, duration, type, delay]) => {
    const oscillator = context.createOscillator(); const gain = context.createGain(); const at = now + delay;
    oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, at); oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.42, at + duration);
    gain.gain.setValueAtTime(.028, at); gain.gain.exponentialRampToValueAtTime(.0001, at + duration);
    oscillator.connect(gain).connect(context.destination); oscillator.start(at); oscillator.stop(at + duration + .02);
  });
  setTimeout(() => context.close(), 700);
};

function shootWeb(fromX, fromY, toX = window.innerWidth * .67, toY = window.innerHeight * .35) {
  if (reducedMotion) return;
  const namespace = 'http://www.w3.org/2000/svg';
  const shot = document.createElementNS(namespace, 'svg'); shot.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`); shot.setAttribute('class', 'web-shot');
  const bendX = (fromX + toX) / 2 + (Math.random() - .5) * 160; const bendY = Math.min(fromY, toY) - 80 - Math.random() * 160;
  const path = `M ${fromX} ${fromY} C ${bendX} ${bendY}, ${bendX} ${bendY + 80}, ${toX} ${toY}`;
  [3.4, 1.7, .7].forEach((width, index) => { const strand = document.createElementNS(namespace, 'path'); strand.setAttribute('d', path); strand.setAttribute('stroke-width', width); strand.style.animationDelay = `${index * .055}s`; shot.append(strand); });
  $('#web-fluid-layer').append(shot); setTimeout(() => shot.remove(), 980);
}

function makeMission(project) {
  return `<button class="mission" data-project="${project.id}" aria-label="Open dossier for ${project.title}">
    <span class="mission__top"><span>MISSION ${project.id}</span><b>${project.status}</b></span>
    <span class="mission__domain">${project.code}</span><h3>${project.title}</h3><p class="mission__short">${project.short}</p>
    <span class="mission__bottom"><span>${project.year} / ${project.domain}</span><span class="mission__open">ACCESS DOSSIER <i>↗</i></span></span>
  </button>`;
}

function renderContent() {
  $('#mission-grid').innerHTML = portfolio.projects.map(makeMission).join('');
  $('#tool-belts').innerHTML = portfolio.toolGroups.map(([title, detail]) => `<article class="tool-belt"><b>${title}</b><p>${detail}</p></article>`).join('');
  $('#achievement-grid').innerHTML = portfolio.achievements.map(([title, detail, tag], index) => `<article class="achievement"><span class="achievement__number">0${index + 1}</span><h3>${title}</h3><p>${detail}</p><p class="achievement__tag">${tag}</p></article>`).join('');
  $('#certification-list').innerHTML = portfolio.certifications.map(([title, provider, date]) => `<article class="certification"><b>${title}</b><span>${provider}</span><small>${date}</small></article>`).join('');
  $('#timeline').innerHTML = portfolio.timeline.map(([date, title, text]) => `<li><time>${date}</time><h3>${title}</h3><p>${text}</p></li>`).join('');
}

function startup() {
  const startupLayer = $('#startup');
  const shell = $('#site-shell');
  const launch = () => {
    playSound('boot');
    shootWeb(-30, window.innerHeight * .7, window.innerWidth * .66, window.innerHeight * .36);
    startupLayer.classList.add('is-leaving');
    shell.classList.add('is-ready');
    shell.removeAttribute('aria-hidden');
    setTimeout(() => startupLayer.remove(), 1000);
  };
  $('#enter-system').addEventListener('click', launch);
  $('#skip-intro').addEventListener('click', launch);
}

function navigation() {
  const navigationLayer = $('#navigation');
  const opener = $('#menu-toggle');
  const close = () => {
    navigationLayer.classList.remove('is-open'); navigationLayer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open'); opener.setAttribute('aria-expanded', 'false'); opener.focus();
  };
  const open = () => {
    navigationLayer.classList.add('is-open'); navigationLayer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open'); opener.setAttribute('aria-expanded', 'true');
    playSound('menu'); $('a', navigationLayer).focus();
  };
  opener.addEventListener('click', open); $('#menu-close').addEventListener('click', close);
  $$('a', navigationLayer).forEach(link => link.addEventListener('click', event => { playSound('menu'); shootWeb(event.clientX, event.clientY, window.innerWidth * .68, window.innerHeight * .32); close(); }));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && navigationLayer.classList.contains('is-open')) close(); });
}

function controls() {
  const sound = $('#sound-toggle');
  const sense = $('#sense-toggle');
  sound.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    sound.setAttribute('aria-pressed', soundEnabled); $('b', sound).textContent = soundEnabled ? 'ON' : 'OFF';
    if (soundEnabled) playSound('boot');
  });
  sense.addEventListener('click', () => {
    const enabled = document.body.classList.toggle('sense-mode');
    sense.setAttribute('aria-pressed', enabled); $('b', sense).textContent = enabled ? 'ON' : 'OFF'; playSound(enabled ? 'lock' : 'click');
  });
}

function cursorAndRipple() {
  if (window.matchMedia('(pointer: coarse)').matches || reducedMotion) return;
  const cursor = $('#cursor');
  document.addEventListener('pointermove', event => { cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`; });
  $$('a,button,input,textarea').forEach(item => {
    item.addEventListener('pointerenter', () => cursor.classList.add('is-hover'));
    item.addEventListener('pointerleave', () => cursor.classList.remove('is-hover'));
  });
  document.addEventListener('pointerdown', event => {
    const ripple = document.createElement('span'); ripple.className = 'web-ripple';
    ripple.style.left = `${event.clientX}px`; ripple.style.top = `${event.clientY}px`;
    document.body.append(ripple); ripple.addEventListener('animationend', () => ripple.remove());
  });
  document.addEventListener('click', event => {
    if (event.target.closest('a, button') && !event.target.closest('#hanging-spider')) shootWeb(event.clientX, event.clientY);
  });
}

function parallax() {
  if (reducedMotion || window.matchMedia('(pointer: coarse)').matches) return;
  const viewport = $('#hero-viewport');
  window.addEventListener('pointermove', event => {
    const x = event.clientX / window.innerWidth - .5; const y = event.clientY / window.innerHeight - .5;
    viewport.style.transform = `rotateX(${-y * 2.5}deg) rotateY(${x * 3.5 - 5}deg)`;
  }, { passive: true });
}

function dossier() {
  const dialog = $('#dossier');
  const content = $('#dossier-content');
  const close = () => { dialog.close(); $('#dossier-close').focus(); };
  $('#mission-grid').addEventListener('click', event => {
    const card = event.target.closest('[data-project]'); if (!card) return;
    const project = portfolio.projects.find(item => item.id === card.dataset.project); if (!project) return;
    content.innerHTML = `<p class="dossier__eyebrow"><span>MISSION ${project.id}</span><span>${project.code}</span><span>TARGET LOCKED</span></p>
      <h2>${project.title.split(' ').slice(0, -1).join(' ')} <span>${project.title.split(' ').slice(-1)}</span></h2>
      <div class="dossier__meta"><span>${project.year}</span><span>${project.domain}</span><span>${project.status}</span></div>
      <div class="dossier__sections"><article class="dossier__section"><h3>OVERVIEW</h3><p>${project.overview}</p></article><article class="dossier__section"><h3>PROBLEM</h3><p>${project.problem}</p></article><article class="dossier__section"><h3>APPROACH</h3><p>${project.approach}</p></article><article class="dossier__section"><h3>RESULT / CONTEXT</h3><p>${project.result}</p></article><article class="dossier__section"><h3>TECH STACK</h3><ul class="dossier__stack">${project.tech.map(item => `<li>${item}</li>`).join('')}</ul></article><article class="dossier__section"><h3>WHAT I LEARNED</h3><p>${project.learning}</p></article></div>
      <div class="dossier__actions"><button disabled>GITHUB · LINK COMING SOON</button><button disabled>DEMO · LINK COMING SOON</button></div>`;
    dialog.showModal(); playSound('lock'); $('#dossier-close').focus();
  });
  $('#dossier-close').addEventListener('click', close);
  dialog.addEventListener('click', event => { if (event.target === dialog) close(); });
}

function skills() {
  const skillPanel = $('#skill-panel');
  $('#skill-network').addEventListener('click', event => {
    const node = event.target.closest('[data-skill]'); if (!node) return;
    const selected = portfolio.skills[node.dataset.skill]; if (!selected) return;
    $$('.skill-network button').forEach(button => button.classList.toggle('is-selected', button === node));
    skillPanel.innerHTML = `<p class="hud-label"><i></i> CAPABILITY DETECTED</p><h2>${node.dataset.skill.toUpperCase().replace(' / ', '<br /><span>/</span> ')}</h2><p>${selected.description}</p><div class="skill-panel__level">${selected.level}</div><div class="skill-panel__tools"><span>TOOLS / RELATED FOCUS</span><ul>${selected.tools.map(tool => `<li>${tool}</li>`).join('')}</ul></div>${selected.missions.length ? `<div class="skill-panel__tools"><span>CONNECTED MISSIONS</span><ul>${selected.missions.map(mission => `<li>${mission}</li>`).join('')}</ul></div>` : ''}`;
    playSound('lock');
  });
}

function assistantResponse(question) {
  const q = question.toLowerCase();
  if (/project|mission|built/.test(q)) return 'Yash has two featured missions: a Government Aadhaar Data Prediction Model selected at UIDAI Hackathon 2026, and a controlled Mobile Privacy & Security Analysis proof-of-concept.';
  if (/tech|skill|use|python|tool/.test(q)) return 'His current toolkit includes Python, C++, SQL, HTML, NumPy, Pandas, Scikit-Learn, VS Code, Google Colab and Git. His broader focus includes cybersecurity, AI/ML, web development, Linux and UI design.';
  if (/cert|course|learn/.test(q)) return 'The portfolio lists Foundations of Cybersecurity (Google / Coursera, 2026—Present), an AI & ML certification from Vishlesan i-Hub, IIT Patna (2024—2025), and the Google Cybersecurity Professional Certificate on Coursera.';
  if (/hackathon|uidai|final/.test(q)) return 'Yash cleared the selection round at UIDAI Hackathon 2026 with an Aadhaar data prediction model. He could not participate in the final round because of the 18+ age requirement, not technical performance.';
  if (/contact|email|reach/.test(q)) return 'You can reach Yash at akhisiweety01@gmail.com or call +91 9060170251. The Secure Channel section can open a mail draft for you.';
  if (/education|school|class/.test(q)) return 'Yash is in Class 12, studying PCM + Computer Science (CBSE) from 2025—2027. He completed secondary school in 2025 with 89%.';
  return 'I can answer about Yash’s projects, skills, education, certifications, UIDAI hackathon result or contact details.';
}

function webAI() {
  const panel = $('#web-ai-panel'); const toggle = $('#web-ai-toggle'); const messages = $('#web-ai-messages');
  const open = () => { panel.hidden = false; toggle.setAttribute('aria-expanded', 'true'); $('#web-ai-input').focus(); playSound('menu'); };
  const close = () => { panel.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); };
  const ask = question => {
    const text = question.trim(); if (!text) return;
    messages.insertAdjacentHTML('beforeend', `<p class="user"><b>YOU</b>${text}</p><p><b>WEB AI</b>${assistantResponse(text)}</p>`);
    messages.scrollTop = messages.scrollHeight; $('#web-ai-input').value = ''; playSound('click');
  };
  toggle.addEventListener('click', () => panel.hidden ? open() : close()); $('#web-ai-close').addEventListener('click', close);
  $('#web-ai-form').addEventListener('submit', event => { event.preventDefault(); ask($('#web-ai-input').value); });
  $$('.web-ai__suggestions button').forEach(button => button.addEventListener('click', () => ask(button.dataset.question)));
}

function terminal() {
  const terminal = $('#terminal'); const output = $('#terminal-output'); const input = $('#terminal-input');
  const print = text => { output.insertAdjacentHTML('beforeend', `<p>${text}</p>`); output.scrollTop = output.scrollHeight; };
  const execute = raw => {
    const command = raw.trim().toLowerCase(); print(`<span style="color:#e73a45">› ${raw}</span>`);
    const actions = { about: () => '#identity', projects: () => '#missions', missions: () => '#missions', skills: () => '#arsenal', achievements: () => '#achievements', contact: () => '#channel' };
    if (command === 'help') print('Commands: <b>about, projects, skills, missions, achievements, contact, spider-sense, clear</b>');
    else if (command === 'clear') output.innerHTML = '';
    else if (command === 'spider-sense') { $('#sense-toggle').click(); print('Spider-Sense mode toggled.'); }
    else if (actions[command]) { terminal.hidden = true; document.querySelector(actions[command]()).scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' }); print(`Navigating to ${command}...`); }
    else if (command) print('Unknown command. Type <b>help</b> for available commands.');
  };
  document.addEventListener('keydown', event => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); terminal.hidden = false; input.focus(); playSound('menu'); } });
  $('#terminal-close').addEventListener('click', () => { terminal.hidden = true; });
  $('#terminal-form').addEventListener('submit', event => { event.preventDefault(); execute(input.value); input.value = ''; });
}

function contactForm() {
  $('#contact-form').addEventListener('submit', event => {
    event.preventDefault(); const data = new FormData(event.currentTarget); const subject = encodeURIComponent(`Portfolio transmission from ${data.get('name')}`); const body = encodeURIComponent(`From: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`);
    $('#form-note').textContent = 'TRANSMISSION DRAFT OPENING IN YOUR MAIL APP.'; playSound('send'); window.location.href = `mailto:akhisweety01@gmail.com?subject=${subject}&body=${body}`;
  });
}

function scrolling() {
  const progress = $('#scroll-progress');
  window.addEventListener('scroll', () => { const max = document.documentElement.scrollHeight - window.innerHeight; progress.style.width = `${max ? window.scrollY / max * 100 : 0}%`; }, { passive: true });
  $('#swing-away').addEventListener('click', () => { playSound('menu'); window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }); });
}

function hangingSpider() {
  const spider = $('#hanging-spider'); let start = null; let moved = false;
  const triggerSwing = () => { spider.classList.remove('is-swinging'); void spider.offsetWidth; spider.classList.add('is-swinging'); playSound('swing'); shootWeb(spider.getBoundingClientRect().left + spider.offsetWidth / 2, 0, window.innerWidth * .55, window.innerHeight * .38); };
  spider.addEventListener('pointerdown', event => { start = { x: event.clientX, y: event.clientY }; moved = false; spider.setPointerCapture(event.pointerId); });
  spider.addEventListener('pointermove', event => {
    if (!start) return; const distance = Math.hypot(event.clientX - start.x, event.clientY - start.y); if (distance < 6 && !moved) return;
    moved = true; spider.classList.add('is-dragging'); const width = spider.offsetWidth;
    spider.style.left = `${Math.max(8, Math.min(window.innerWidth - width - 8, event.clientX - width / 2))}px`; spider.style.right = 'auto';
    spider.style.setProperty('--drop', `${Math.max(155, Math.min(Math.min(window.innerHeight * .62, 500), event.clientY + 34))}px`);
  });
  spider.addEventListener('pointerup', event => { if (start && !moved) triggerSwing(); spider.classList.remove('is-dragging'); start = null; if (spider.hasPointerCapture(event.pointerId)) spider.releasePointerCapture(event.pointerId); });
  spider.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); triggerSwing(); } });
  setInterval(() => { if (!start && !reducedMotion && Math.random() > .52) triggerSwing(); }, 15000);
  const storyObserver = new IntersectionObserver(entries => {
    spider.classList.toggle('is-hidden', !entries.some(entry => entry.isIntersecting));
  }, { threshold: .08 });
  storyObserver.observe($('#system')); storyObserver.observe($('#finale'));
}

function finalSwing() {
  const finale = $('#finale'); const button = $('#final-swing'); let launched = false;
  button.addEventListener('click', () => {
    if (launched) { shootWeb(window.innerWidth * .76, window.innerHeight * .22, window.innerWidth * .35, -20); window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }); return; }
    launched = true; finale.classList.remove('is-swinging'); void finale.offsetWidth; finale.classList.add('is-swinging'); playSound('swing'); shootWeb(window.innerWidth * .18, window.innerHeight * .8, window.innerWidth * .92, window.innerHeight * .08);
    button.innerHTML = 'RETURN TO ROOFTOP <i aria-hidden="true">↑</i>';
  });
}

renderContent(); startup(); navigation(); controls(); cursorAndRipple(); parallax(); dossier(); skills(); webAI(); terminal(); contactForm(); scrolling(); hangingSpider(); finalSwing();
