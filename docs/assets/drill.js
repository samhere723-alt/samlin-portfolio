/* 大跌演練（作品集版）：從「財務槓桿決策指引」第 1 階演練一抽出來的逐日重播，不靠 server、不存進度。
   算法照原版 ladder.js 的 mDca／replay：每月第一個交易日用收盤價買；四種選擇都在 4/9 收盤成交。
   原版買正2，作品集版改買 0050：帳面用含息（etf），「回到 4/2 的價位」用不含息價（etfp）。 */
(function () {
  'use strict';
  var root = document.getElementById('drill');
  var D = window.DRILL_D1;
  if (!root || !D) return;

  var rc = {
    amt: 1000, buyFrom: '2024-04', buyTo: '2025-04', decide: '2025-04-09', end: '2025-07-31',
    decideShort: '4/9', resumeRef: '2025-04-02', resumeName: ' 4/2 的價位',
    scale: { label: '每月扣', unit: '元', base: 1000, step: 100 },
    ask: '4/9 晚上。三天前你的 0050 還有 {v:2025-04-02} 元，現在剩 **{v:2025-04-09} 元**。下面選一個，再按「看發生了什麼」。',
    notes: {
      '2024-04-01': '第一筆：每個月第一個交易日，用收盤價買 {k:1000} 元的 0050。',
      '2024-08-05': '加權指數一天跌 8.35%，0050 跌 9.13%。',
      '2025-04-02': '清明連假前最後一個交易日。',
      '2025-04-07': '連假回來，台指期一開盤就鎖跌停。加權指數跌 9.70%，0050 跌 10.00%，收在跌停價。',
      '2025-04-08': '0050 再跌 3.25%。',
      '2025-04-09': '0050 再跌 4.60%。',
      '2025-04-10': '0050 漲了 9.99%。',
      '2025-05-12': '0050 回到 4/2 的價位。',
      '2025-06-18': '0050 一股拆成四股，前面 6/11～6/17 沒有交易，今天恢復；股價變成四分之一，帳上金額不變。'
    },
    after: '比較四種情境在 2025 年 7 月底的模擬結果。'
  };
  var feed = {
    A: '情境 A：4/9 收盤賣出，之後維持現金。',
    B: '情境 B：保留持股，回到 4/2 價位後於次月恢復扣款。',
    C: '情境 C：維持原定每月扣款。',
    D: '情境 D：4/9 加買一個月的金額，之後照常扣款。'
  };

  var CC = { A: '#8a7f73', B: '#0f7a86', C: '#b5642f', D: '#1f3a5f' };
  var WD = '日一二三四五六';
  var REDUCE = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function fmt(x) { return Math.round(x).toLocaleString('zh-TW'); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function sgn(p, dp) { var s = Math.abs(p * 100).toFixed(dp); return (p < 0 && +s ? '−' : p > 0 && +s ? '+' : '') + s + '%'; }
  function mk(s) { return String(s).replace(/\*\*(.+?)\*\*/g, '<mark class="dd-k">$1</mark>'); }
  function yuan(x) { return (x <= -0.5 ? '−' : '') + fmt(Math.abs(x)) + ' 元'; }
  function kfmt(x) { return Math.abs(x) >= 1000 ? fmt(x) : (Math.round(x * 10) / 10).toFixed(1).replace(/\.0$/, ''); }
  function niceStep(r) { var raw = r / 5, p = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), m = raw / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p; }

  /* ── 模型：每月扣 0050；A 全部賣掉、B 停扣到回到 4/2 價位、C 照扣、D 當天多買一個月的量 ── */
  var ds = D.dates, P = D.etf, PX = D.etfp, amt = rc.amt;
  var iDec = ds.indexOf(rc.decide), iEnd = ds.indexOf(rc.end), i0 = 1;
  if (iDec < 1 || iEnd < iDec) return;
  var first = ds.map(function (d, i) { return i > 0 && d.slice(0, 7) !== ds[i - 1].slice(0, 7); });
  var mend = ds.map(function (d, i) { return i >= 1 && (i === ds.length - 1 || ds[i + 1].slice(0, 7) !== d.slice(0, 7)); });
  var pre = [], u = 0, inv = 0;
  for (var i = 0; i <= iDec; i++) {
    var b = i > 0 && first[i] && ds[i].slice(0, 7) >= rc.buyFrom && ds[i].slice(0, 7) <= rc.buyTo;
    if (b) { u += amt / P[i]; inv += amt; }
    pre.push({ v: u * P[i], inv: inv, buy: b });
  }
  var resumeP = PX[ds.indexOf(rc.resumeRef)], back = -1, post = {};
  ['A', 'B', 'C', 'D'].forEach(function (c) {
    var uu = u, ii = inv, cash = 0, rd = -1, arr = [];
    if (c === 'A') { cash = uu * P[iDec]; uu = 0; }
    if (c === 'D') { uu += amt / P[iDec]; ii += amt; }
    for (var j = iDec; j <= iEnd; j++) {
      var bb = false;
      if (j > iDec) {
        if (c === 'B' && rd < 0 && PX[j] >= resumeP) rd = j;
        bb = first[j] && (c === 'C' || c === 'D' || (c === 'B' && rd >= 0 && j > rd));
        if (bb) { uu += amt / P[j]; ii += amt; }
      }
      arr.push({ v: uu * P[j] + cash, inv: ii, buy: bb || (c === 'D' && j === iDec) });
    }
    post[c] = arr; if (c === 'B') back = rd;
  });
  function pr(s) { return s.inv ? s.v / s.inv - 1 : 0; }
  function st(i, c) { return i <= iDec || !c ? pre[Math.min(i, iDec)] : post[c][i - iDec]; }
  function yOf(s) { return s.inv ? pr(s) * 100 : null; }

  /* ── 畫面 ── */
  var names = {};
  $$('.dd-opts label', root).forEach(function (lb) { var r = $('input', lb); if (r) names[r.value] = lb.textContent.trim(); });
  var sc = rc.scale, K = 1;
  var box = $('.dd-rp', root);
  box.innerHTML =
    '<div class="dd-head"><div class="dd-date"><b></b><span></span></div><div class="dd-nums"></div><div class="dd-day"></div></div>' +
    '<label class="dd-amt">' + esc(sc.label) + ' <input type="number" min="0" step="' + sc.step + '" inputmode="decimal"> ' + esc(sc.unit) +
    '<span>改了金額，下面的數字等比例跟著變，百分比不變</span></label>' +
    '<div class="dd-legend" hidden></div><div class="dd-plot"></div>' +
    '<div class="dd-note" aria-live="polite"></div>' +
    '<div class="dd-ctl"><button type="button" class="dd-btn main dd-play"></button>' +
    '<input type="range" class="dd-scrub" step="1" aria-label="拖時間軸">' +
    '<button type="button" class="dd-btn dd-skip">跳到' + esc(rc.decideShort) + ' 晚上</button></div>' +
    '<div class="dd-res" hidden></div>';
  var pick = $('.dd-pick', root), reveal = $('.dd-reveal', root), btn = $('.dd-go', root);
  var q = function (s) { return $(s, box); };
  var play = q('.dd-play'), scrub = q('.dd-scrub'), skip = q('.dd-skip'), plot = q('.dd-plot'), amtIn = q('.dd-amt input');
  scrub.min = i0;

  var cur = i0, choice = null, timer = null, started = false, lastM = -1, onDone = null;
  var all = ['A', 'B', 'C', 'D'];
  function stAt(i) { return st(i, choice); }

  function tpl(s) {
    return String(s).replace(/\{k:([\d.]+)\}/g, function (_, n) { return kfmt(+n * K); })
      .replace(/\{endC\}/g, function () { return sgn(pr(post.C[iEnd - iDec]), 1); })
      .replace(/\{(\w+):([\d-]+)\}/g, function (_, key, d) {
        var i = ds.indexOf(d); if (i < 0) return '';
        var s = stAt(i); return key === 'pct' ? sgn(pr(s), 1) : fmt((key === 'inv' ? s.inv : s.v) * K);
      });
  }
  function text(s) { return mk(esc(tpl(s))); }

  /* 縱軸範圍先算好，播的時候刻度不會跳 */
  var yl = [0];
  for (var k = i0; k <= iEnd; k++) {
    if (k <= iDec) { var v0 = yOf(st(k)); if (v0 != null) yl.push(v0); }
    all.forEach(function (c) { if (k >= iDec) { var v = yOf(st(k, c)); if (v != null) yl.push(v); } });
  }
  var ylo = Math.min.apply(null, yl), yhi = Math.max.apply(null, yl);

  function noteAt(i) {
    for (var j = i; j >= i0 && i - j <= 40; j--) {
      var t = rc.notes[ds[j]];
      if (t && (j <= iDec || choice)) return '<b class="dd-nd">' + (+ds[j].slice(5, 7)) + '/' + (+ds[j].slice(8)) + '</b> ' + text(t);
    }
    return '';
  }
  function draw() {
    var w = Math.max(280, Math.round(plot.clientWidth)), h = 230, L = 56, R = 14, T = 12, B = 26;
    var stp = niceStep((yhi - ylo) || 1), lo = Math.floor(ylo / stp) * stp, hi = Math.ceil(yhi / stp) * stp;
    if (hi === lo) hi = lo + stp;
    function x(i) { return L + (w - L - R) * (i - i0) / Math.max(1, iEnd - i0); }
    function y(v) { return T + (h - T - B) * (hi - v) / (hi - lo); }
    var s = '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="從 ' + esc(ds[i0]) + ' 到 ' + esc(ds[cur]) + ' 的帳上賺賠">';
    for (var v = lo; v <= hi + stp / 1e6; v += stp) {
      var vv = Math.round(v / stp) * stp, lab = vv === 0 ? '回本' : (vv > 0 ? '+' : '−') + Math.abs(Math.round(vv * 100) / 100) + '%';
      s += '<line class="dd-grid' + (vv === 0 ? ' base' : '') + '" x1="' + L + '" x2="' + (w - R) + '" y1="' + y(vv) + '" y2="' + y(vv) + '"/>' +
        '<text class="dd-tick" x="' + (L - 6) + '" y="' + (y(vv) + 4) + '" text-anchor="end">' + lab + '</text>';
    }
    var room = Math.max(3, Math.floor((w - L - R) / 60)), ms = [];
    for (var i = i0; i <= iEnd; i++) if (first[i] || i === i0) ms.push(i);
    var every = Math.max(1, Math.ceil(ms.length / room)), lastY = '';
    ms.forEach(function (i, n) {
      if (n % every) return;
      var yy = ds[i].slice(0, 4), lb = yy !== lastY ? yy + '/' + (+ds[i].slice(5, 7)) : (+ds[i].slice(5, 7)) + '月'; lastY = yy;
      s += '<text class="dd-tick" x="' + x(i) + '" y="' + (h - 8) + '" text-anchor="' + (n === 0 ? 'start' : 'middle') + '">' + lb + '</text>';
    });
    if (cur >= iDec) {
      var xd = x(iDec), rt = xd > w * 0.7;
      s += '<line class="dd-dec" x1="' + xd + '" x2="' + xd + '" y1="' + T + '" y2="' + (h - B) + '"/>' +
        '<text class="dd-tick dd-dec-t" x="' + (xd + (rt ? -4 : 4)) + '" y="' + (T + 10) + '" text-anchor="' + (rt ? 'end' : 'start') + '">' + esc(rc.decideShort) + ' 做決定</text>';
    }
    function poly(from, to, get, cls, color) {
      var pts = [];
      for (var j = from; j <= to; j++) { var v = get(j); if (v != null) pts.push(x(j).toFixed(1) + ',' + y(v).toFixed(1)); }
      return pts.length > 1 ? '<polyline class="' + cls + '" style="stroke:' + color + '" points="' + pts.join(' ') + '"/>' : '';
    }
    s += poly(i0, Math.min(cur, iDec), function (j) { return yOf(st(j)); }, 'dd-ln', '#5f2a0c');
    if (choice && cur > iDec) all.filter(function (c) { return c !== choice; }).concat([choice]).forEach(function (c) {
      s += poly(iDec, cur, function (j) { return yOf(st(j, c)); }, 'dd-ln' + (c === choice ? ' me' : ' alt'), CC[c]);
    });
    var yc = yOf(stAt(cur));
    if (yc != null) s += '<circle class="dd-dot" cx="' + x(cur) + '" cy="' + y(yc) + '" r="4.5" style="fill:' + (choice && cur > iDec ? CC[choice] : '#5f2a0c') + '"/>';
    plot.innerHTML = s + '</svg>';
  }
  function go(i) {
    cur = Math.max(i0, Math.min(choice ? iEnd : iDec, i));
    var s = stAt(cur);
    q('.dd-date b').textContent = ds[cur];
    q('.dd-date span').textContent = '週' + WD[new Date(ds[cur] + 'T00:00:00').getDay()];
    var cells = [['你的 0050', yuan(s.v * K), 1], ['投入', yuan(s.inv * K)], ['賺賠', s.inv ? sgn(pr(s), 1) : '—']];
    var n = 0, bad = 0;
    for (var j = i0; j <= cur; j++) if (mend[j]) { var sj = stAt(j); if (sj.inv > 0) { n++; if (sj.v < sj.inv) bad++; } }
    cells.push(['賠錢的月底', n ? bad + ' / ' + n : '—', 0, bad > lastM && lastM >= 0 && started]);
    lastM = bad;
    q('.dd-nums').innerHTML = cells.map(function (c) {
      return '<div' + (c[2] ? ' class="main"' : '') + '><span>' + esc(c[0]) + '</span><b' + (c[3] ? ' class="bump"' : '') + '>' + esc(c[1]) + '</b></div>';
    }).join('');
    var dl = P[cur] / P[cur - 1] - 1, di = D.idx[cur] / D.idx[cur - 1] - 1;
    q('.dd-day').textContent = '這天　0050 ' + sgn(dl, 2) + '　加權 ' + sgn(di, 2) + (s.buy ? '　·　這天扣款 ' + fmt(amt * K) + ' 元' : '');
    box.classList.toggle('hit', dl <= -0.045);
    q('.dd-note').innerHTML = cur === iDec && !choice ? text(rc.ask) : noteAt(cur);
    scrub.max = choice ? iEnd : iDec; scrub.value = cur;
    draw();
  }
  function label() {
    var lim = choice ? iEnd : iDec;
    play.textContent = timer ? '❚❚ 暫停' : !started ? '▶ 從 2024 年 4 月開始重播' : cur >= lim ? '↺ 從頭再看' : '▶ 繼續';
    skip.hidden = !!choice || cur >= iDec;
  }
  function stop() { clearTimeout(timer); timer = null; label(); }
  /* 選項冒出來時底部超出畫面，就往上推剛好那段，但圖的上緣不推出畫面 */
  function nudge() {
    var vh = window.innerHeight, pb = pick.getBoundingClientRect().bottom, pt = plot.getBoundingClientRect().top;
    if (pb <= vh) return;
    var d = Math.min(pb - vh + 12, Math.max(0, pt - 8));
    if (d > 0) window.scrollBy({ top: d, behavior: REDUCE ? 'auto' : 'smooth' });
  }
  function arrive() {
    if (cur >= iDec && !choice) { pick.hidden = false; pick.classList.add('now'); nudge(); }
    if (choice && cur >= iEnd) { result(); if (onDone) { var f = onDone; onDone = null; f(); } }
    label();
  }
  function tick() {
    var lim = choice ? iEnd : iDec;
    if (cur >= lim) { stop(); arrive(); return; }
    go(cur + 1);
    /* 做決定之前大約 9 秒、之後大約 7 秒，另外停在事件上 */
    var span = choice ? iEnd - iDec : iDec - i0;
    var wait = Math.max(8, Math.min(choice ? 26 : 42, (choice ? 7000 : 9000) / Math.max(1, span)));
    if (rc.notes[ds[cur]]) wait = choice ? 1400 : 1900;
    else if (!choice && cur >= iDec - 3) wait = 700;
    timer = setTimeout(tick, wait);
  }
  function run() {
    if (REDUCE) { go(choice ? iEnd : iDec); stop(); arrive(); return; }
    started = true; timer = setTimeout(tick, 60); label();
  }
  function result() {
    var rule = {
      A: rc.decideShort + ' 收盤全部賣掉，之後不再扣',
      B: '手上的不賣；等 0050 回到' + rc.resumeName + '才恢復扣款' + (back >= 0 ? '（' + ds[back] + ' 回到，下個月起恢復）' : '（到 ' + rc.end + ' 都沒回到）'),
      C: '每個月照扣',
      D: rc.decideShort + ' 收盤多買一個月的量（' + fmt(amt * K) + ' 元），之後照扣'
    };
    var rows = all.map(function (c) {
      var e = post[c][iEnd - iDec], me = c === choice;
      return '<tr' + (me ? ' class="me"' : '') + '><td><i style="background:' + CC[c] + '"></i>' + esc(names[c] || c) + (me ? '<em>你選的</em>' : '') +
        '<div class="dd-rule">' + esc(rule[c]) + '</div></td><td class="n">' + fmt(e.inv * K) + '</td><td class="n">' + fmt(e.v * K) + '</td><td class="n">' + sgn(pr(e), 1) + '</td></tr>';
    }).join('');
    var r = q('.dd-res'), wasOpen = !!(r.querySelector('details') || {}).open;
    r.innerHTML = '<details' + (wasOpen ? ' open' : '') + '><summary><span class="dd-rt">四種做法，到 ' + rc.end + ' 各剩多少</span><span class="dd-rh">點開看</span></summary>' +
      '<div class="dd-scroll"><table class="dd-tbl"><thead><tr><th>做法</th><th class="n">一共投入</th><th class="n">期末帳上</th><th class="n">賺賠</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="dd-small">四種都用 ' + rc.decideShort + ' 的收盤價成交，才比得起來；期末用 ' + rc.end + ' 收盤價，賣掉拿回的錢當現金放著、不算利息。金額單位是元。</p></details>';
    r.hidden = false;
    var lg = q('.dd-legend');
    lg.innerHTML = all.map(function (c) { return '<span' + (c === choice ? ' class="me"' : '') + '><i style="background:' + CC[c] + '"></i>' + esc(names[c] || c) + '</span>'; }).join('');
    lg.hidden = false;
  }
  function setAmt(v) {
    v = parseFloat(v); if (!(v > 0)) return;
    K = v / sc.base;
    go(cur); if (!q('.dd-res').hidden) result();
  }
  function after(v, animate, done) {
    stop(); choice = v; started = true; onDone = done || null;
    pick.classList.remove('now');
    q('.dd-res').hidden = true;
    if (animate && !REDUCE) { go(iDec); lastM = -1; run(); }
    else { go(iEnd); arrive(); }
  }

  amtIn.addEventListener('input', function () { setAmt(amtIn.value); });
  play.addEventListener('click', function () {
    if (timer) { stop(); return; }
    if (cur >= (choice ? iEnd : iDec)) { lastM = -1; go(i0); }
    run();
  });
  skip.addEventListener('click', function () { stop(); started = true; go(iDec); arrive(); });
  scrub.addEventListener('input', function () { stop(); started = true; go(+scrub.value); if (cur >= +scrub.max) arrive(); else label(); });
  var t0 = null;
  window.addEventListener('resize', function () { clearTimeout(t0); t0 = setTimeout(draw, 120); });
  var disclosure = root.closest('details');
  if (disclosure) {
    disclosure.addEventListener('toggle', function () {
      if (disclosure.open) draw();
      else stop();
    });
    new MutationObserver(function () { if (!disclosure.open) stop(); })
      .observe(disclosure, { attributes: true, attributeFilter: ['open'] });
  }

  /* 選了才能按；按了就從 4/9 播到 7 月底，播完才打開回饋 */
  $$('.dd-opts input', root).forEach(function (r) { r.addEventListener('change', function () { btn.disabled = false; }); });
  btn.addEventListener('click', function () {
    var r = $('.dd-opts input:checked', root); if (!r) return;
    reveal.hidden = true;
    after(r.value, true, function () {
      $('.dd-fb.mine', root).innerHTML = '<h5>你的選擇</h5>' + text(feed[r.value]);
      $('.dd-fb.after', root).innerHTML = '<h5>事後才知道的</h5>' + text(rc.after);
      reveal.hidden = false;
    });
  });

  pick.hidden = true; reveal.hidden = true;
  amtIn.value = sc.base;
  go(i0); label();
  q('.dd-note').innerHTML = text('先別看答案：按下面的按鈕，從頭開始一天一天走到' + rc.decideShort + '。走到那天會停下來，換你決定。');
  root.classList.add('ready');
})();
