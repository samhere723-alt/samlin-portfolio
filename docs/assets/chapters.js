/* 章節卡（作品集版）：兩集節目的章節清單＋每章四欄（他的主張／憑什麼／他在反駁／哪裡要再查證）。
   資料在 chapters_data.js，只有整理過的四欄；原話一律連回原節目。 */
(function () {
  'use strict';
  var root = document.getElementById('chap');
  var EPS = window.CHAPTERS;
  if (!root || !EPS || !EPS.length) return;

  var SHORT = { qlj33: '清流君｜退休提領', drn52: '大仁來開槓｜財富傳承' };
  var TITLE = { qlj33: '退休提領最重要的觀念：不對稱風險！固定 vs 動態策略', drn52: '財富要怎麼傳承，才能富過三代？' };
  var START = { qlj33: '03', drn52: '02' };
  var FIELDS = [['claim', '他的主張'], ['why', '憑什麼'], ['rebut', '他在反駁'], ['check', '哪裡要再查證']];

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function link(ep, ch) {
    if (ep.kind === 'yt') return { href: 'https://www.youtube.com/watch?v=' + ep.src + '&t=' + ch.t + 's', text: '原節目 · ' + ch.ts };
    return { href: ep.src, text: '原節目 · ' + ch.ts };
  }

  root.innerHTML =
    '<div class="ch-tabs" role="tablist" aria-label="選一集"></div>' +
    '<div class="ch-wrap"><ol class="ch-toc" aria-label="章節清單"></ol>' +
    '<article class="ch-body" aria-live="polite"></article></div>' +
    '<p class="ch-src"></p>';
  var tabs = root.querySelector('.ch-tabs'), toc = root.querySelector('.ch-toc'),
      body = root.querySelector('.ch-body'), src = root.querySelector('.ch-src');
  var epi = 0, chi = 0;

  tabs.innerHTML = EPS.map(function (ep, i) {
    return '<button type="button" role="tab" data-i="' + i + '">' + esc(SHORT[ep.key] || ep.show) + '</button>';
  }).join('');

  function showEp(i) {
    epi = i;
    var ep = EPS[i];
    [].forEach.call(tabs.children, function (b, k) { b.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
    toc.innerHTML = ep.chapters.map(function (c, k) {
      return '<li><button type="button" data-k="' + k + '"><span class="ch-n">' + c.n + '</span><span class="ch-tt">' + esc(c.title) +
        '</span><span class="ch-ts">' + c.ts + '</span></button></li>';
    }).join('');
    var start = 0;
    ep.chapters.forEach(function (c, k) { if (c.n === START[ep.key]) start = k; });
    var a = ep.kind === 'yt' ? 'https://www.youtube.com/watch?v=' + ep.src : ep.src;
    src.innerHTML = '出處：' + esc(ep.show) + ' ' + esc(ep.ep) + '〈<a href="' + a + '" target="_blank" rel="noopener">' + esc(TITLE[ep.key] || ep.title) +
      '</a>〉';
    showCh(start, false);
  }

  function showCh(k, focusToc) {
    chi = k;
    var ep = EPS[epi], c = ep.chapters[k], L = link(ep, c);
    [].forEach.call(toc.querySelectorAll('button'), function (b, j) {
      if (j === k) { b.setAttribute('aria-current', 'true'); } else { b.removeAttribute('aria-current'); }
    });
    var cur = toc.querySelector('[aria-current]');
    if (cur) {
      var tt = toc.scrollTop, tb = tt + toc.clientHeight, ct = cur.offsetTop - toc.offsetTop, cb = ct + cur.offsetHeight;
      if (ct < tt || cb > tb) toc.scrollTop = ct - 8;
    }
    var html = '<header class="ch-h"><span class="ch-big">' + c.n + '</span><div><h4>' + esc(c.title) + '</h4>' +
      '<a class="ch-play" href="' + L.href + '" target="_blank" rel="noopener">' + esc(L.text) + ' ↗</a></div></header>' +
      (c.q ? '<p class="ch-q">' + esc(c.q) + '</p>' : '');
    FIELDS.forEach(function (f) {
      var v = c[f[0]];
      if (!v) return;
      html += '<section class="ch-f ch-' + f[0] + '"><span class="ch-lab">' + f[1] + '</span>' +
        (Array.isArray(v) ? '<ul>' + v.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' : '<p>' + esc(v) + '</p>') + '</section>';
    });
    var miss = FIELDS.filter(function (f) { return !c[f[0]]; }).map(function (f) { return f[1]; });

    html += '<nav class="ch-nav"><button type="button" class="ch-prev"' + (k === 0 ? ' disabled' : '') + '>← 上一章</button>' +
      '<span>' + (k + 1) + ' / ' + ep.chapters.length + '</span>' +
      '<button type="button" class="ch-next"' + (k === ep.chapters.length - 1 ? ' disabled' : '') + '>下一章 →</button></nav>';
    body.innerHTML = html;
    body.scrollTop = 0;
    if (focusToc && cur) cur.focus({ preventScroll: true });
  }

  tabs.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) showEp(+b.dataset.i); });
  toc.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) showCh(+b.dataset.k, false); });
  body.addEventListener('click', function (e) {
    if (e.target.closest('.ch-prev') && chi > 0) showCh(chi - 1, false);
    if (e.target.closest('.ch-next') && chi < EPS[epi].chapters.length - 1) showCh(chi + 1, false);
  });
  toc.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    var k = Math.max(0, Math.min(EPS[epi].chapters.length - 1, chi + (e.key === 'ArrowDown' ? 1 : -1)));
    showCh(k, true);
  });

  showEp(0);
  root.classList.add('ready');
})();
