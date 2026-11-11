const groups = [
  ['메트로배니아 / 플랫포머', [
    ['Hollow Knight','hollow-knight'], ['Nine Sols','nine-sols'],
    ['Celeste','celeste'], ['Ori','ori'],
  ]],
  ['스토리 / 추리', [
    ['魔法少女ノ魔女裁判','manosaba'], ['うみねこのなく頃に','umineko'], ['ダンガンロンパ','danganronpa'], ['逆転裁判','ace-attorney'],
  ]],
  ['카드 / 퍼즐', [
    ['Slay the Spire','slay-the-spire'], ['Hearthstone','hearthstone'],
    ['Chants of Sennaar','chants-of-sennaar'], ['7 Days to End with You','7-days'],
  ]],
  ['리듬게임', [
    ['CHUNITHM','chunithm'], ['ポラリスコード','polaris-chord'],
    ['DJMAX','djmax'], ['リズム天国','rhythm-tengoku'],
  ]],
];

export function renderAbout(app, base, title) {
  const asset = name => new URL(`assets/about/${name}`,base).href;
  const dimensions = {'japan-keikenchi.png':[1548,1753],'ramen.webp':[773,1031]};
  const animeCaption = `애니메이션 <a class="anime-record-link" href="${new URL('anime/',base).href}">본 작품</a>`;
  const picture = (file,label,extra='',caption=label) => {
    const [width,height]=dimensions[file] || [773,581];
    return `<figure class="interest-picture ${extra}"><button type="button" data-enlarge="${asset(file)}" data-label="${label || 'STELLIVE'}" aria-label="${label || 'STELLIVE 사진'} 크게 보기"><img src="${asset(file)}" alt="${label || 'STELLIVE 콘서트 현장'}" width="${width}" height="${height}" loading="lazy" decoding="async"></button>${caption?`<figcaption>${caption}</figcaption>`:''}</figure>`;
  };
  app.innerHTML = `<header class="about-header"><a href="${base.href}" data-route lang="ja">${title}</a><a href="${new URL('about/',base).href}" data-route aria-current="page">소개</a></header>
    <main id="content" class="about page-enter">
      <div class="about-heading"><h1 tabindex="-1">소개</h1><nav aria-label="소개 페이지 목차"><a href="#favorite-games">좋아하는 게임</a><a href="#interests">좋아하는 것</a></nav></div>
      <section id="favorite-games" class="favorites" aria-labelledby="favorites-title"><h2 id="favorites-title">좋아하는 게임</h2>
        ${groups.map(([genre,items]) => `<section class="taste-row"><h3>${genre}</h3><div class="taste-grid">${items.map(([name,file]) => `<figure class="taste-item"><span class="taste-art${file==='ace-attorney'?' taste-art--kenji':''}"><img src="${asset(file+'.webp')}" alt="" loading="lazy" decoding="async">${file==='ace-attorney'?`<img class="taste-logo" src="${asset('ace-attorney-logo.webp')}" alt="逆転検事2" loading="lazy" decoding="async">`:''}</span><figcaption class="taste-name" ${/[\u3040-\u9fff]/.test(name)?'lang="ja"':''}>${name}</figcaption></figure>`).join('')}</div></section>`).join('')}
      </section>
      <section id="interests" class="interests" aria-labelledby="interests-title"><h2 id="interests-title">좋아하는 것</h2>
        <section class="interest-row"><h3>언어</h3><ul class="language-terms"><li>Phonology</li><li>Morphology</li><li>Optimality Theory</li></ul></section>
        <section class="interest-row"><h3>일본 문화</h3><div class="culture-layout">${picture('japan-keikenchi.png','일본 경현치','travel-map','')}<div class="culture-side">${picture('ramen.webp','음식','food-square')}${picture('anime.webp','애니메이션','',animeCaption)}${picture('live.webp','행사')}${picture('fuji-sunrise.webp','후지산 등정')}</div></div></section>
        <section class="interest-row"><h3>STELLIVE</h3><div class="stellive-grid">${picture('stellive.webp','')}${picture('stellive-live.webp','')}</div></section>
      </section>
    </main>
    <dialog class="about-viewer" aria-label="이미지 크게 보기"><div class="viewer-toolbar"><span class="viewer-title"></span><button type="button" class="viewer-zoom" aria-pressed="false">확대</button><button type="button" class="viewer-close" aria-label="확대 화면 닫기">닫기 ×</button></div><div class="viewer-canvas"><img alt="" draggable="false"></div></dialog>`;

  const dialog=app.querySelector('.about-viewer');
  const canvas=dialog.querySelector('.viewer-canvas');
  const zoom=dialog.querySelector('.viewer-zoom');
  let trigger, drag;
  app.querySelectorAll('[data-enlarge]').forEach(button=>{
    button.addEventListener('click',()=>{
      trigger=button;
      const label=button.dataset.label || 'STELLIVE';
      dialog.querySelector('img').src=button.dataset.enlarge;
      dialog.querySelector('img').alt=label;
      dialog.querySelector('.viewer-title').textContent=label;
      canvas.classList.remove('is-zoomed');zoom.setAttribute('aria-pressed','false');zoom.textContent='확대';
      dialog.showModal();document.body.classList.add('modal-open');
      canvas.scrollTo(0,0);
    });
  });
  zoom.addEventListener('click',()=>{
    const active=canvas.classList.toggle('is-zoomed');
    zoom.setAttribute('aria-pressed',String(active));zoom.textContent=active?'전체 보기':'확대';
    canvas.scrollTo(0,0);
  });
  dialog.querySelector('.viewer-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');trigger?.focus({preventScroll:true});});
  canvas.addEventListener('pointerdown',e=>{
    if(!canvas.classList.contains('is-zoomed') || e.pointerType!=='mouse')return;
    drag={x:e.clientX,y:e.clientY,left:canvas.scrollLeft,top:canvas.scrollTop};
    canvas.setPointerCapture(e.pointerId);canvas.classList.add('is-dragging');
  });
  canvas.addEventListener('pointermove',e=>{if(drag){canvas.scrollLeft=drag.left+drag.x-e.clientX;canvas.scrollTop=drag.top+drag.y-e.clientY;}});
  canvas.addEventListener('pointerup',()=>{drag=null;canvas.classList.remove('is-dragging');});
  canvas.addEventListener('lostpointercapture',()=>{drag=null;canvas.classList.remove('is-dragging');});
}
