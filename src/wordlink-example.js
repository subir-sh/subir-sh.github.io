function card(icon, word) {
  return `<span class="word-card-icon" aria-hidden="true">${icon}</span><span class="word-card-name">${word}</span>`;
}

const choices = {
  river: { icon: '🏞️', word: '강', reasons: ['강에 사는 물고기', '강을 건너는 다리'] },
  book: { icon: '📖', word: '책', reasons: [] },
};

export const wordLinkExample = `
  <div class="word-example">
    <div class="word-example-copy">
      <p>카드를 놓고 제출하면, 바로 옆에 놓인 두 단어씩 판정해요.\n두 단어 사이의 관계가 게임에 등록돼 있어야 통과합니다.</p>
      <p>손패의 카드 한 장을 물고기와 다리 사이로 끌어다 놓고 제출해 보세요.</p>
    </div>
    <div class="word-example-board">
      <div class="word-path" aria-label="예시 카드 배열">
        <div class="word-card">${card('🐟', '물고기')}</div>
        <span class="word-edge" aria-hidden="true"></span>
        <div class="word-card word-slot" data-word-slot>빈칸</div>
        <span class="word-edge" aria-hidden="true"></span>
        <div class="word-card">${card('🌉', '다리')}</div>
      </div>
      <p class="word-feedback" role="status" aria-live="polite"></p>
      <div class="word-hand" role="group" aria-label="예시 손패">
        ${Object.entries(choices).map(([key,{icon,word}]) => `<button type="button" class="word-card" data-word-choice="${key}" aria-label="${word}" aria-pressed="false">${card(icon, word)}</button>`).join('')}
        <button type="button" class="word-submit" disabled>제출</button>
      </div>
    </div>
  </div>`;

export function setupWordLinkExample(example) {
  const options = [...example.querySelectorAll('[data-word-choice]')];
  const board = example.querySelector('.word-example-board');
  const slot = example.querySelector('[data-word-slot]');
  const hand = example.querySelector('.word-hand');
  const submit = example.querySelector('.word-submit');
  const feedback = example.querySelector('.word-feedback');
  let selected;

  function place(key) {
    selected = key;
    const choice = choices[key];
    for (const option of options) option.setAttribute('aria-pressed', String(option.dataset.wordChoice === key));
    slot.innerHTML = choice ? card(choice.icon, choice.word) : '빈칸';
    delete board.dataset.result;
    feedback.textContent = choice ? `${choice.word} 카드를 놓았어요.` : '카드를 손패로 돌려놓았어요.';
    submit.disabled = !choice;
  }

  function makeDraggable(source, target, getKey, drop) {
    let drag;
    function overTarget(event) {
      const box = target.getBoundingClientRect();
      return event.clientX >= box.left && event.clientX <= box.right &&
        event.clientY >= box.top && event.clientY <= box.bottom;
    }

    source.addEventListener('pointerdown', event => {
      const key = getKey();
      if (!key || drag || event.button !== 0) return;
      const box = source.getBoundingClientRect();
      drag = { id: event.pointerId, key, x: event.clientX, y: event.clientY, box };
      source.setPointerCapture(event.pointerId);
    });
    source.addEventListener('pointermove', event => {
      if (drag?.id !== event.pointerId) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.ghost && Math.hypot(dx, dy) < 5) return;
      if (!drag.ghost) {
        drag.ghost = document.createElement('div');
        drag.ghost.className = 'word-card word-drag-card';
        drag.ghost.setAttribute('aria-hidden', 'true');
        const { icon, word } = choices[drag.key];
        drag.ghost.innerHTML = card(icon, word);
        const { left, top, width, height } = drag.box;
        Object.assign(drag.ghost.style, { left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px` });
        example.closest('main').parentElement.append(drag.ghost);
      }
      drag.ghost.style.transform = `translate(${dx}px, ${dy}px)`;
      target.classList.toggle('is-drop-target', overTarget(event));
    });

    function finish(event) {
      if (drag?.id !== event.pointerId) return;
      if (event.type === 'pointerup' && drag.ghost && overTarget(event)) drop(drag.key);
      drag.ghost?.remove();
      target.classList.remove('is-drop-target');
      drag = undefined;
    }
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) source.addEventListener(type, finish);
  }

  for (const button of options) {
    const key = button.dataset.wordChoice;
    makeDraggable(button, slot, () => selected === key ? undefined : key, place);
    button.addEventListener('click', event => {
      if (event.detail === 0) place(selected === key ? undefined : key);
    });
  }
  makeDraggable(slot, hand, () => selected, () => place(undefined));

  function submitChoice() {
    if (!selected || board.dataset.result) return;
    const { reasons } = choices[selected];
    const connected = reasons.length > 0;
    board.dataset.result = connected ? 'connected' : 'broken';
    feedback.textContent = connected
      ? `두 쌍 모두 연결돼요.\n${reasons.join(' / ')}`
      : '물고기와 책, 책과 다리 사이에 등록된 연결이 없어요.';
  }

  submit.addEventListener('click', submitChoice);
  submit.addEventListener('pointerup', event => {
    if (event.pointerType === 'touch' && submit.contains(document.elementFromPoint(event.clientX, event.clientY))) {
      submitChoice();
    }
  });
}
