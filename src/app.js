import { games, resolvePage } from './games.js';
import { showVisitorCounter } from './visits.js';
import { siteTitle } from './site-config.js';

const base = new URL('../', import.meta.url);
const app = document.querySelector('#app');
const url = path => new URL(path, base).href;
const pageUrl = game => url(`games/${game.id}/`);
const escape = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
let currentGame;
let galleryIndex = 0;

function imageTag(image, className = '', extra = '') {
  return `<img class="${className}" style="${frameStyle(image)}" src="${url(`assets/images/${image.src}`)}" alt="${escape(image.alt)}" decoding="async" ${extra}>`;
}

function frameStyle(image) {
  const [width, height] = image.size;
  const [left, top, right, bottom] = image.frame || [0, 0, width, height];
  const frameWidth = right - left;
  const frameHeight = bottom - top;
  return `--shot-ratio:${frameWidth}/${frameHeight};--shot-aspect:${frameWidth / frameHeight};--shot-width:${width / frameWidth * 100}%;--shot-height:${height / frameHeight * 100}%;--shot-left:${-left / frameWidth * 100}%;--shot-top:${-top / frameHeight * 100}%`;
}

function inputTag(key) {
  return /^[A-Za-z]$|^(Tab|Backspace|Space|Enter|Shift|Ctrl|Esc)$/.test(key)
    ? `<kbd>${escape(key)}</kbd>` : `<span class="pointer-input">${escape(key)}</span>`;
}

function illustratedGuide(game) {
  const guide = game.guide;
  return `<div class="rhythm-guide">
    <p class="guide-start">${escape(guide.start)} ${inputTag('Enter')}</p>
    <div class="guide-basic"><img src="${url(guide.basic.src)}" alt="${escape(guide.basic.alt)}" width="608" height="376"><div><h3>기본 조작</h3>${guide.basic.text.map(text => `<p>${escape(text)}</p>`).join('')}</div></div>
    <section class="note-inputs" aria-labelledby="notes-title"><h3 id="notes-title">노트 입력</h3><dl>${guide.notes.map(note => `<div><dt><span class="note-symbol note-${note.kind}" aria-hidden="true"><i></i></span><span class="note-label">${escape(note.label)}</span></dt><dd>${note.keys ? note.keys.map(inputTag).join('<span class="input-join">'+(note.kind === 'chord' ? '+' : '/')+'</span>') : escape(note.action)}</dd></div>`).join('')}</dl><p class="guide-hint">${escape(guide.noteTip)}</p></section>
    <div class="guide-lessons">${guide.lessons.map(lesson => `<section><h3>${escape(lesson.title)}</h3><img src="${url(lesson.src)}" alt="${escape(lesson.alt)}" width="608" height="332" loading="lazy">${lesson.text.map(text => `<p>${escape(text)}</p>`).join('')}</section>`).join('')}</div>
    <div class="guide-footer"><dl class="guide-shortcuts">${guide.controls.map(control => `<div><dt>${control.keys.map(inputTag).join('')}</dt><dd>${escape(control.action)}</dd></div>`).join('')}</dl><p>${escape(guide.settings)}</p><p>${escape(guide.footer)}</p><p>${escape(game.tip)}</p></div>
  </div>`;
}

function renderHome() {
  currentGame = null;
  app.innerHTML = `<main id="content" class="home page-enter">
    <h1 class="home-title" lang="ja" tabindex="-1">${escape(siteTitle)}</h1>
      <ul class="game-list" aria-label="게임 목록">${games.map((game, i) => `<li class="game-row" style="--game-color:${game.color}">
        <a class="game-link" data-route href="${pageUrl(game)}" aria-labelledby="title-${game.id}" aria-describedby="genre-${game.id}"><span class="game-image" style="${frameStyle(game.images[0])}">${imageTag(game.images[0], '', i === 0 ? 'fetchpriority="high"' : '')}</span><span class="game-label"><span class="game-name" id="title-${game.id}">${escape(game.title)}</span><span class="game-genre" id="genre-${game.id}">${escape(game.genre)}</span></span><span class="row-arrow" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 12h16m-6-6 6 6-6 6"/></svg></span></a>
        ${game.play ? `<a class="quick-play" href="${game.play}" target="_blank" rel="noopener noreferrer" aria-label="${escape(game.title)} itch.io에서 플레이 (새 탭)">플레이 <span aria-hidden="true">↗</span></a>` : ''}
      </li>`).join('')}<li class="upcoming-row"><span class="upcoming-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></span><span>Coming Soon</span></li></ul>
  </main>`;
}

function renderGame(game) {
  currentGame = game;
  galleryIndex = 0;
  app.innerHTML = `<nav class="game-navigation" aria-label="게임 선택"><a class="back-home" href="${base.href}" data-route><span aria-hidden="true">←</span> 전체 게임</a><div class="game-tabs">${games.map(item => `<a href="${pageUrl(item)}" data-route ${item.id === game.id ? 'aria-current="page"' : ''}>${escape(item.title)}</a>`).join('')}</div></nav>
    <main id="content" class="detail page-enter" style="--game-color:${game.color}">
      <div class="game-copy">
        <h1 tabindex="-1">${escape(game.title)}</h1>
        <p class="detail-genre">${escape(game.genre)}</p>
        <p class="description">${escape(game.description)}</p>
        ${game.play ? `<div class="play-area"><a class="play-button" href="${game.play}" target="_blank" rel="noopener noreferrer" aria-label="${escape(game.title)} itch.io에서 플레이 (새 탭)">플레이 ${arrow}</a><span class="play-context">${escape(game.environment)}</span></div>` : '<p class="play-status">웹 데모 미공개</p>'}
      </div>
      <div class="gallery" role="group" aria-label="게임 화면">
        <button class="gallery-stage" id="gallery-stage" style="${frameStyle(game.images[0])}" type="button" aria-label="${escape(game.images[0].alt)} 크게 보기">${imageTag(game.images[0], 'gallery-picture', 'fetchpriority="high"')}<span class="expand-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 9V4h5m6 0h5v5M4 15v5h5m6 0h5v-5"/></svg></span></button>
        <div class="thumbnails" role="group" aria-label="화면 선택">${game.images.map((image, i) => `<button type="button" style="${frameStyle(image)}" data-shot="${i}" aria-controls="gallery-stage" aria-pressed="${i === 0}" aria-label="화면 ${i + 1}: ${escape(image.alt)}">${imageTag(image)}</button>`).join('')}</div>
      </div>
      <section class="manual" aria-labelledby="manual-title"><div class="manual-heading"><h2 id="manual-title">플레이 방법</h2></div>${game.guide ? illustratedGuide(game) : `<div class="manual-body ${game.controls.length ? '' : 'flow-only'}"><div class="manual-flow"><ol>${game.steps.map(step => `<li>${escape(step)}</li>`).join('')}</ol><p class="tip">${escape(game.tip)}</p></div>${game.controls.length ? `<dl class="controls">${game.controls.map(control => `<div><dt>${control.keys.map(inputTag).join('')}</dt><dd>${escape(control.action)}</dd></div>`).join('')}</dl>` : ''}</div>`}</section>
    </main>
    <dialog class="lightbox" aria-label="게임 화면 확대"><div class="lightbox-toolbar"><button class="icon-button" data-lightbox-step="-1" aria-label="확대 화면 이전">←</button><button class="icon-button" data-lightbox-step="1" aria-label="확대 화면 다음">→</button><button class="lightbox-close" aria-label="확대 화면 닫기">닫기 <span aria-hidden="true">×</span></button></div><div class="lightbox-image" style="${frameStyle(game.images[0])}">${imageTag(game.images[0])}</div></dialog>`;

  app.querySelectorAll('[data-lightbox-step]').forEach(button => button.addEventListener('click', () => changeShot(galleryIndex + Number(button.dataset.lightboxStep))));
  const dialog = app.querySelector('dialog');
  const stage = app.querySelector('.gallery-stage');
  app.querySelectorAll('[data-shot]').forEach(button => button.addEventListener('click', () => changeShot(Number(button.dataset.shot))));
  stage.addEventListener('click', () => {
    dialog.showModal();
    document.body.classList.add('modal-open');
  });
  app.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); stage.focus({ preventScroll: true }); });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); changeShot(galleryIndex + (event.key === 'ArrowRight' ? 1 : -1)); }
  });
  requestAnimationFrame(centerActiveTab);
}

function centerActiveTab() {
  const activeTab = app.querySelector('.game-tabs [aria-current="page"]');
  if (!activeTab) return;
  const strip = activeTab.parentElement;
  const activeRect = activeTab.getBoundingClientRect();
  const stripRect = strip.getBoundingClientRect();
  // Keep the active game visible after rotating a phone, without moving the page.
  strip.scrollLeft += activeRect.left - stripRect.left + activeRect.width / 2 - stripRect.width / 2;
}

function changeShot(index) {
  if (!currentGame) return;
  galleryIndex = (index + currentGame.images.length) % currentGame.images.length;
  const image = currentGame.images[galleryIndex];
  app.querySelectorAll('.gallery-picture, .lightbox-image img').forEach(element => {
    element.src = url(`assets/images/${image.src}`);
    element.alt = image.alt;
    element.style.cssText = frameStyle(image);
  });
  app.querySelectorAll('.gallery-stage, .lightbox-image').forEach(element => { element.style.cssText = frameStyle(image); });
  app.querySelector('.gallery-stage').setAttribute('aria-label', `${image.alt} 크게 보기`);
  app.querySelectorAll('[data-shot]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.shot) === galleryIndex)));
}

function render(focus = false) {
  document.body.classList.remove('modal-open');
  const page = resolvePage(location.pathname, base.pathname);
  document.title = page.type === 'game' ? `${page.game.title} | ${siteTitle}` : siteTitle;
  if (page.type === 'game') renderGame(page.game);
  else if (page.type === 'home') renderHome();
  else app.innerHTML = `<main id="content" class="missing"><h1 tabindex="-1">페이지를 찾을 수 없어요.</h1><a href="${base.href}" data-route>전체 게임으로 돌아가기 ↗</a></main>`;
  showVisitorCounter(app);
  if (focus) { window.scrollTo({ top: 0, behavior: 'instant' }); app.querySelector('h1')?.focus({ preventScroll: true }); }
}

document.addEventListener('click', event => {
  const link = event.target.closest('a[data-route]');
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const destination = new URL(link.href);
  if (destination.origin !== location.origin) return;
  event.preventDefault();
  if (destination.pathname === location.pathname) return;
  history.pushState(null, '', destination.href);
  render(true);
});
window.addEventListener('popstate', () => render(true));
window.addEventListener('resize', () => requestAnimationFrame(centerActiveTab));
document.fonts?.ready.then(centerActiveTab);
render();
