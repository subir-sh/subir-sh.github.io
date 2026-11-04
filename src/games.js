// Visitor copy lives here; research and source notes belong in docs/.
export const games = [
  {
    id: 'synthex',
    title: 'Synthex',
    genre: '로그라이크 덱빌딩',
    color: '#c9d7a3',
    description: '불, 물, 흙의 위력을 바꾸고 조합하는 로그라이크 카드 게임.\n손패의 원소와 장착한 마법을 엮어 적을 물리치고, 다음 전투를 위한 덱과 마법서를 만들어 갑니다.',
    play: 'https://subir-sh.itch.io/synthex',
    environment: 'PC / 마우스',
    images: [
      { src: 'synthex-queen-battle.webp', size: [1600, 900], frame: [71, 0, 1527, 900], alt: 'Synthex: 유리 여왕을 상대하며 원소 손패와 장착 마법을 사용하는 전투 화면' },
      { src: 'synthex-map.webp', size: [1280, 720], frame: [57, 0, 1222, 720], alt: 'Synthex: 전투와 휴식, 상점으로 이어지는 첫 번째 막의 지도' },
      { src: 'synthex-spellbook.webp', size: [1600, 900], frame: [71, 0, 1527, 900], alt: 'Synthex: 원소 조합과 효과를 살펴보고 장착하는 마법서' },
    ],
    steps: ['손패에서 재료로 쓸 원소와 사용할 마법을 클릭합니다.', '대상이 필요한 마법은 드래그해 조준합니다. 남은 원소로 계속 시전할 수 있습니다.', '행동을 마치면 화면의 턴 종료 버튼을 누릅니다. 전투 사이에 덱과 장착 마법을 정비하세요.'],
    controls: [],
    tip: '마법을 뽑는 대신, 마법의 재료가 되는 원소를 뽑습니다.',
  },
  {
    id: 'ligature',
    title: 'Ligature',
    genre: '리듬게임',
    color: '#8bded5',
    description: '고정된 레인 없이, 마우스로 하나의 캐처를 움직이는 리듬게임.\n노트의 가로 범위를 받고, 리본처럼 이어지는 롱노트의 경로를 따라 연주합니다.',
    play: 'https://subir-sh.itch.io/ligature',
    environment: 'PC / 키보드와 마우스',
    images: [
      { src: 'ligature-performance.webp', size: [1280, 720], alt: 'Ligature: 주황 롱노트의 곡선을 따라가며 흰 타건 노트를 받는 장면' },
      { src: 'ligature-sweep.webp', size: [1440, 810], alt: 'Ligature: 민트색 받기 노트를 따라 이동하며 GREAT 판정이 표시된 화면' },
      { src: 'ligature-selection.webp', size: [960, 600], alt: 'Ligature: Chronomia와 Wizdomiot를 고르고 채보를 선택하는 데모 화면' },
    ],
    steps: [],
    controls: [],
    tip: '브라우저에서는 상대 이동과 커서 잠금이 기본입니다. 절대 위치 방식은 게임 설정에서 선택할 수 있습니다.',
    guide: {
      start: '게임 화면 클릭 → 곡 선택 → 난이도 선택 →',
      basic: { src: 'assets/manuals/ligature-basic.svg', alt: '노트와 캐처의 가로 범위를 겹치고 판정선에서 입력하는 도해', text: ['마우스로 캐처를 움직여 노트의 가로 범위와 겹칩니다. 노트 중앙을 정확히 맞출 필요는 없습니다.', '노트가 판정선에 닿는 순간, 종류에 맞는 입력을 누릅니다.'] },
      notes: [
        { kind: 'key', label: '흰 노트', keys: ['Z', 'X'] },
        { kind: 'chord', label: '노란 노트', keys: ['Z', 'X'] },
        { kind: 'click', label: '주황 노트', keys: ['좌클릭', '우클릭'] },
        { kind: 'catch', label: '민트 노트', action: '입력 없이 받기' },
      ],
      noteTip: '흰 노트는 Z와 X를 번갈아 써도 됩니다. 노란 노트는 두 키를 모두 새로 눌러야 합니다.',
      lessons: [
        { title: '롱노트', src: 'assets/manuals/ligature-hold.svg', alt: '캐처가 주황 롱노트의 몸통과 겹친 상태를 유지하는 도해', text: ['입력을 유지하며 캐처와 롱노트 몸통의 가로 범위를 겹칩니다. 마름모는 틱 시점을 표시합니다.'] },
        { title: '스윕', src: 'assets/manuals/ligature-sweep.svg', alt: '분리된 민트 노트의 순서에 맞춰 캐처를 옮기는 도해', text: ['버튼을 누르지 않고, 노트 순서에 맞춰 캐처를 옮겨 받습니다.'] },
      ],
      controls: [{ keys: ['Space'], action: '일시정지' }, { keys: ['R'], action: '다시 시작' }, { keys: ['Esc'], action: '커서 해제' }],
      settings: '설정에서 낙하 속도, 볼륨, 연습을 조절할 수 있습니다.',
      footer: '낙하 속도와 음악 배속은 별도입니다. 빈 입력에는 감점이 없습니다.',
    },
  },
  {
    id: 'a-way-out-of-words',
    title: 'A Way Out of Words',
    genre: '언어 해독 퍼즐',
    color: '#9cbeca',
    description: '읽을 수 없는 언어로 가득한 연구실에서 깨어납니다.\n사물의 반응과 도식을 관찰하고, 글자를 골라 추측한 뜻을 사전에 기록하세요.\n해독한 단서를 엮어 방의 장치를 풀어가는 포인트 앤 클릭 퍼즐입니다.',
    images: [
      { src: 'words-room.webp', size: [1421, 729], frame: [63, 0, 1357, 729], alt: 'A Way Out of Words: 조사할 장치와 출입문이 있는 근미래 연구실' },
      { src: 'words-inscription.webp', size: [1421, 729], frame: [63, 0, 1357, 729], alt: 'A Way Out of Words: 낯선 글자가 새겨진 램프와 방 스위치 조사 화면' },
    ],
    steps: ['방 안의 조사 지점을 눌러 사물과 글자를 살펴봅니다.', '글자를 드래그해 고르고, 추측한 뜻을 사전에 기록합니다.', '장치의 반응을 비교하며 분류, 배치, 회로 퍼즐을 풀어 출구를 찾습니다.'],
    controls: [
      { keys: ['J', 'Tab'], action: '사전 열기' },
      { keys: ['M'], action: '메모 열기' },
      { keys: ['F'], action: '조사 지점 강조' },
      { keys: ['우클릭', 'Backspace'], action: '방으로 돌아가기' },
      { keys: ['Space', 'Enter'], action: '대화 진행' },
    ],
    tip: '사전에 적은 뜻은 정답으로 채점되지 않습니다. 장치가 어떻게 움직이는지 관찰하며 스스로 해석을 다듬어 보세요.',
  },
  {
    id: 'spells-under-review',
    title: 'Spells Under Review',
    genre: '전술 퍼즐',
    color: '#d6bb7f',
    description: '마도공학 길드의 검증사가 되어 자동 전투 마법의 결함을 찾는 전술 퍼즐.\n모의 전장의 조건을 바꿔, 명세와 다른 동작이 나오는 상황을 만들어 증명하세요.',
    images: [
      { src: 'spells-field.webp', size: [1440, 900], alt: 'Spells Under Review: 격자 전장에서 기사 체력을 편집하는 화면' },
      { src: 'spells-guild.webp', size: [1440, 900], alt: 'Spells Under Review: 검증 의뢰를 선택하는 길드 의뢰판' },
    ],
    steps: ['의뢰에 적힌 마법의 규칙을 읽습니다.', '클릭으로 유닛을 배치하고, 유닛 상세에서 체력이나 진영을 바꿉니다. 도구 선반에서는 이동, 삭제, 되돌리기를 할 수 있습니다.', '규칙상 대상은 즉시 갱신됩니다. 화면의 결과 비교를 눌러 실제 대상과 다른지 확인하면 결함을 증명할 수 있습니다.'],
    controls: [],
    tip: '현재 데모에서는 자동 치유 마법의 대상 선택을 검증합니다.',
  },
  {
    id: 'counterflight',
    title: 'CounterFlight',
    genre: '탄막 액션',
    color: '#b1c9c5',
    description: '큐브 하나로 방어와 공격을 이어가는 탄막 보스전.\n큐브를 들어 탄을 막고, 보스에게 던진 뒤 회수하거나 직접 그린 경로로 움직이세요.',
    images: [
      { src: 'counterflight-spiral.webp', size: [1280, 720], alt: 'CounterFlight: 큐브로 나선 탄막을 막는 보스전' },
      { src: 'counterflight-bloom.webp', size: [1280, 720], alt: 'CounterFlight: 보스와 여러 겹의 탄막이 펼쳐진 전장' },
    ],
    steps: ['탄막의 틈을 읽으며 이동하고, 가까운 큐브를 들어 전방을 막습니다.', '큐브를 던져 보스를 맞히면 큐브의 내구도가 회복됩니다.', '다가가서 회수하거나, 자유 큐브 근처에 경로를 그어 다시 움직입니다.'],
    controls: [
      { keys: ['W', 'A', 'S', 'D'], action: '이동 — 방향키도 가능' },
      { keys: ['마우스 이동'], action: '시점과 조준' },
      { keys: ['E'], action: '가까운 큐브 들기 / 놓기' },
      { keys: ['좌클릭'], action: '큐브 투척' },
      { keys: ['우클릭 드래그', '휠'], action: '큐브 경로 그리기 / 깊이 조절' },
      { keys: ['Space'], action: '무적 대시' },
      { keys: ['Shift', 'Ctrl'], action: '집중 이동 — 둘 중 하나' },
      { keys: ['Esc', 'R'], action: '일시정지 / 재시작' },
    ],
    tip: '든 큐브는 전방의 탄을 막습니다. 뒤쪽 공격과 큐브의 남은 내구도를 함께 살펴보세요.',
  },
];

export function getGame(id) { return games.find(game => game.id === id); }

export function resolvePage(pathname, basePath = '/') {
  if (!pathname.startsWith(basePath)) return { type: 'missing' };
  const path = pathname.slice(basePath.length).replace(/(?:^\/|\/+$)/g, '').replace(/(?:^|\/)index\.html$/, '');
  if (!path) return { type: 'home' };
  if (path === 'about') return { type: 'about' };
  const match = /^games\/([a-z0-9-]+)$/.exec(path);
  const game = match && getGame(match[1]);
  return game ? { type: 'game', game } : { type: 'missing' };
}
