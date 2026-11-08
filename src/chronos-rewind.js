const startCell = 8;
const plateCell = 0;
const doorCell = 11;
const floorCells = [plateCell, 4, startCell, 9, 10, doorCell];

function cellX(cell) {
  return 10 + (cell % 4) * 127;
}

function cellY(cell) {
  return 10 + Math.floor(cell / 4) * 63;
}

export const rewindExample = `
  <section class="rewind-example" aria-labelledby="rewind-title">
    <div class="rewind-copy">
      <h3 id="rewind-title">시간 되돌리기</h3>
      <p>시간을 돌리면 플레이어와 장치가 이전 상태로 돌아갑니다.\n그 뒤 한 턴이 지날 때마다 분신은 되돌리기 전 행동을 하나씩 반복합니다.</p>
      <ul class="rewind-legend" role="list">
        <li><svg viewBox="-16 -35 32 37" aria-hidden="true"><use class="rewind-player" href="#rewind-person"/></svg>현재 플레이어</li>
        <li><svg viewBox="-16 -35 32 37" aria-hidden="true"><use class="rewind-clone" href="#rewind-person"/></svg>분신</li>
      </ul>
    </div>
    <div class="rewind-demo">
      <svg class="rewind-board" viewBox="0 0 520 202" role="img" aria-labelledby="rewind-board-title">
        <title id="rewind-board-title"></title>
        <defs>
          <path id="rewind-person" d="M-6-32H6L9-29V-22L6-19H-6L-9-22V-29Z M-7-16H7L12-11V-5H8V0H2V-7H-2V0H-8V-5H-12V-11Z"/>
          <clipPath id="rewind-door-opening"><rect x="-24" y="10" width="48" height="40"/></clipPath>
        </defs>
        ${floorCells.map(cell => `<rect class="rewind-tile" x="${cellX(cell)}" y="${cellY(cell)}" width="119" height="56" rx="2"/>`).join('')}
        <path class="rewind-start" d="M55 185H84"/>
        <path class="rewind-wire" d="M98 59H444Q450.5 59 450.5 65.5V144"/>
        <g class="rewind-plate" transform="translate(69.5 49)">
          <rect class="rewind-plate-base" x="-29" y="7" width="58" height="6" rx="2"/>
          <path class="rewind-plate-spring" d="M-16 0V7M16 0V7"/>
          <rect class="rewind-plate-cap" x="-24" y="-2" width="48" height="5" rx="2"/>
        </g>
        <g class="rewind-door" transform="translate(450.5 136)">
          <g clip-path="url(#rewind-door-opening)">
            <path class="rewind-door-leaf rewind-door-left" d="M-24 10H0V50H-24Z M-15 17V43"/>
            <path class="rewind-door-leaf rewind-door-right" d="M0 10H24V50H0Z M15 17V43"/>
          </g>
          <path class="rewind-door-frame" d="M-27 50V8H27V50M-32 50H32"/>
        </g>
        <g class="rewind-token rewind-clone" hidden><use href="#rewind-person"/></g>
        <g class="rewind-token rewind-player"><use href="#rewind-person"/></g>
      </svg>
      <div class="rewind-log">
        <span id="rewind-log-label"></span>
        <span data-log-empty>아직 없음</span>
        <ol role="list" aria-labelledby="rewind-log-label" hidden></ol>
      </div>
    </div>
    <div class="rewind-controls">
      <p class="rewind-status" role="status" aria-atomic="true"></p>
      <div class="rewind-actions"><button type="button" data-rewind-next></button><button type="button" data-rewind-reset>처음으로</button></div>
    </div>
  </section>`;

const oldPath = [startCell, 4, plateCell, plateCell];
const recordedMoves = [
  ['↑', '위로 한 칸'],
  ['↑', '위로 한 칸'],
  ['Ⅱ', '제자리에서 대기'],
];
const rewindStep = oldPath.length;
const stages = [
  ['↑ 위로 한 칸', '밑의 버튼을 눌러서 출발점에서 발판 쪽으로 가 보세요.'],
  ['↑ 위로 한 칸', '한 칸 더 가면 발판을 밟아요.'],
  ['한 턴 대기', '문이 열렸어요.\n발판에서 한 턴 기다려 보세요.'],
  ['시간 되돌리기', '세 턴을 기록했어요.\n출발점으로 돌아가 보세요.'],
  ['→ 오른쪽으로 한 칸', '문이 다시 닫혔어요.\n분신과 같은 칸에서 출발해요.'],
  ['→ 오른쪽으로 한 칸', '나는 오른쪽으로, 분신은 위로 움직였어요.'],
  ['→ 오른쪽으로 한 칸', '분신이 발판을 밟아 문을 열었어요.'],
  ['다시 해보기', '분신이 발판에서 기다리는 동안 문을 통과했어요.'],
];

const locations = {
  [plateCell]: '발판 위',
  4: '발판 바로 아래',
  [startCell]: '출발점',
  9: '출발점 오른쪽 한 칸',
  10: '문 앞',
  [doorCell]: '문을 통과한 칸',
};

function moveToken(token, cell, offset = 0) {
  const x = cellX(cell) + 59.5 + offset;
  const y = cellY(cell) + (cell === plateCell ? 44 : 43);
  token.style.transform = `translate(${x}px, ${y}px)`;
}

export function setupRewindExample(example) {
  const board = example.querySelector('.rewind-board');
  const boardTitle = board.querySelector('title');
  const playerToken = board.querySelector('.rewind-player');
  const cloneToken = board.querySelector('.rewind-clone');
  const next = example.querySelector('[data-rewind-next]');
  const reset = example.querySelector('[data-rewind-reset]');
  const log = example.querySelector('.rewind-log ol');
  const logLabel = example.querySelector('#rewind-log-label');
  const logEmpty = example.querySelector('[data-log-empty]');
  const status = example.querySelector('.rewind-status');
  let step = 0;

  function render() {
    const replaying = step >= rewindStep;
    const turn = step - rewindStep;
    const player = replaying ? startCell + turn : oldPath[step];
    const clone = replaying ? oldPath[turn] : -1;
    const sharingStart = player === clone;
    const open = player === plateCell || clone === plateCell;
    const moves = recordedMoves.slice(0, step);

    board.classList.toggle('is-open', open);
    moveToken(playerToken, player, sharingStart ? 16 : 0);
    cloneToken.toggleAttribute('hidden', !replaying);
    if (replaying) moveToken(cloneToken, clone, sharingStart ? -16 : 0);
    boardTitle.textContent = [
      `현재 플레이어는 ${locations[player]}`,
      replaying ? `분신은 ${locations[clone]}` : '분신 없음',
      open ? '발판 눌림, 문 열림' : '발판 올라옴, 문 닫힘',
    ].join('. ');

    logLabel.textContent = replaying ? '분신의 기록' : '행동 기록';
    logEmpty.hidden = moves.length > 0;
    log.hidden = moves.length === 0;
    log.innerHTML = moves.map(([symbol, label], i) => {
      const played = i < turn;
      return `<li${played ? ' class="is-replayed"' : ''}>
        <span aria-hidden="true">${symbol}</span>
        <span class="visually-hidden">${label}${played ? ' (재생 완료)' : ''}</span>
      </li>`;
    }).join('');

    const [action, message] = stages[step];
    status.textContent = message;
    next.textContent = action;
    reset.hidden = step === 0 || step === stages.length - 1;
  }

  next.addEventListener('click', () => { step = (step + 1) % stages.length; render(); });
  reset.addEventListener('click', () => { step = 0; render(); next.focus(); });
  render();
}
