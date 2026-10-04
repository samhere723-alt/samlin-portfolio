(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* 開場字:逐字進場(沒有 JS 時字照樣在) */
  const h1 = document.getElementById('h1');
  if (h1 && !reduce) {
    h1.querySelectorAll('.l1, .l2').forEach((line) => {
      const chars = [...line.textContent];
      line.textContent = '';
      chars.forEach((c, i) => {
        const s = document.createElement('span');
        s.className = 'ch';
        s.textContent = c;
        s.style.setProperty('--i', i);
        s.style.setProperty('--r', (i % 2 ? 7 : -9) + 'deg');
        line.appendChild(s);
      });
    });
    requestAnimationFrame(() => h1.classList.add('go'));
    document.querySelector('.hero-mark')?.classList.add('go');
  }

  /* 頁首捲動後加細線 */
  const top = document.getElementById('top');
  const onScroll = () => top && top.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* 色帶:進畫面時歸位 */
  const io = 'IntersectionObserver' in window;
  if (io) {
    const so = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.remove('pre'); so.unobserve(e.target); } }), { threshold: .4 });
    document.querySelectorAll('.stripes.pre').forEach((el) => so.observe(el));
  } else {
    document.querySelectorAll('.stripes.pre').forEach((el) => el.classList.remove('pre'));
  }

  /* 開場 reel:減少動態時不自動播 */
  const reel = document.getElementById('reelLoop');
  if (reel && reduce) { reel.removeAttribute('autoplay'); reel.pause(); }

  /* 預覽片段 */
  function ensureVideo(host, src) {
    let v = host.querySelector('video');
    if (!v) {
      v = document.createElement('video');
      v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', '');
      v.preload = 'auto'; v.src = src; v.setAttribute('aria-hidden', 'true');
      host.insertBefore(v, host.querySelector('.cap'));
    }
    return v;
  }
  function play(host, src) {
    const v = ensureVideo(host, src);
    const p = v.play();
    if (p && p.then) p.then(() => host.classList.add('playing')).catch(() => {});
    else host.classList.add('playing');
  }
  function stop(host) {
    const v = host.querySelector('video');
    if (v) v.pause();
    host.classList.remove('playing');
  }

  const hosts = [...document.querySelectorAll('.clip[data-pv]'), ...document.querySelectorAll('[data-autopv]')];
  hosts.forEach((host) => {
    const src = host.dataset.pv || host.dataset.autopv;
    const inCase = !!host.closest('.case') || host.hasAttribute('data-inview');   // data-inview:捲到就播,不等滑過
    if (reduce) {
      if (canHover) { host.addEventListener('mouseenter', () => play(host, src)); host.addEventListener('mouseleave', () => stop(host)); }
      return;
    }
    if (canHover && !inCase) {
      host.addEventListener('mouseenter', () => play(host, src));
      host.addEventListener('mouseleave', () => stop(host));
      host.addEventListener('focus', () => play(host, src));
      host.addEventListener('blur', () => stop(host));
    } else if (io) {
      const o = new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? play(host, src) : stop(host))), { threshold: .6 });
      o.observe(host);
    }
  });

  /* 燈箱 */
  const lb = document.getElementById('lb');
  const lbV = document.getElementById('lbVideo');
  const lbT = document.getElementById('lbTitle');
  const lbN = document.getElementById('lbNote');
  const lbC = document.getElementById('lbClose');
  let opener = null;
  function open(el, ev) {
    opener = el;
    const r = el.getBoundingClientRect();
    const x = ev && ev.clientX ? ev.clientX : r.left + r.width / 2;
    const y = ev && ev.clientY ? ev.clientY : r.top + r.height / 2;
    lb.style.setProperty('--ox', (x / innerWidth * 100).toFixed(1) + '%');
    lb.style.setProperty('--oy', (y / innerHeight * 100).toFixed(1) + '%');
    lbT.textContent = el.dataset.title || '';
    lbN.textContent = el.dataset.note || '';
    lbV.src = el.dataset.full;
    const img = el.querySelector('img');
    const poster = el.dataset.poster || (img && (img.currentSrc || img.src));   // data-poster：卡片圖跟影片比例不同時另外指定
    if (poster) lbV.poster = poster; else lbV.removeAttribute('poster');
    lb.hidden = false;
    lb.classList.remove('closing');
    lb.classList.add('opening');
    document.body.style.overflow = 'hidden';
    if (reel) reel.pause();
    const p = lbV.play(); if (p && p.catch) p.catch(() => {});
    lbC.focus({ preventScroll: true });
  }
  function close() {
    if (lb.hidden) return;
    lbV.pause();
    lb.classList.remove('opening');
    lb.classList.add('closing');
    const done = () => {
      lb.hidden = true; lb.classList.remove('closing');
      lbV.removeAttribute('src'); lbV.load();
      document.body.style.overflow = '';
      if (reel && !reduce) { const p = reel.play(); if (p && p.catch) p.catch(() => {}); }
      if (opener) opener.focus({ preventScroll: true });
    };
    reduce ? done() : setTimeout(done, 250);
  }
  document.querySelectorAll('[data-full]').forEach((el) => el.addEventListener('click', (ev) => { ev.preventDefault(); open(el, ev); }));
  lbC.addEventListener('click', close);
  lb.addEventListener('click', (ev) => { if (ev.target === lb || ev.target.classList.contains('lb-stage')) close(); });
  addEventListener('keydown', (ev) => { if (ev.key === 'Escape') close(); });

  /* 複製信箱 */
  const btn = document.getElementById('copyMail');
  const mail = document.getElementById('mail');
  if (btn && mail) {
    btn.addEventListener('click', () => {
      const text = mail.textContent.trim();
      const ok = () => { btn.textContent = '已複製'; setTimeout(() => (btn.textContent = '複製信箱'), 1600); };
      const fallback = () => {
        const range = document.createRange(); range.selectNodeContents(mail);
        const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
        btn.textContent = '已選取，按 Ctrl+C';
        setTimeout(() => (btn.textContent = '複製信箱'), 2400);
      };
      try {
        const p = navigator.clipboard && navigator.clipboard.writeText(text);
        if (p && p.then) p.then(ok, fallback); else fallback();
      } catch (e) { fallback(); }
    });
  }
})();
