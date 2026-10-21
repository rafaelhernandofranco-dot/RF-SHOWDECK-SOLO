// RF Showdeck Solo (iPad): Editor de clip (una pista, tipo DAW). No destructivo: guarda los ajustes en config.clips[archivo].
(() => {
  const css = document.createElement ('style');
  css.textContent = `
  #clipEd{position:fixed;inset:0;z-index:60;background:#0b1118;color:#d8e2f0;display:none;flex-direction:column;gap:12px;padding:16px 20px;font-family:-apple-system,system-ui,sans-serif;overflow:auto}
  #clipEd.on{display:flex}
  #clipEd .ce-top{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
  #clipEd .ce-title{font-size:18px;font-weight:700;color:#f2f6fb}
  #clipEd .ce-sub{font-size:12px;color:#8aa0bd}
  #clipEd .ce-right{margin-left:auto;display:flex;gap:8px;flex-wrap:wrap}
  #clipEd .ce-bar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:#111a26;border:1px solid #22324a;border-radius:14px;padding:10px 12px}
  #clipEd .ce-t{font:700 22px ui-monospace,Menlo,monospace;color:#5cc8ff;background:#0a1019;border:1px solid #22324a;border-radius:10px;padding:5px 12px;min-width:120px;text-align:center}
  #clipEd .ce-tb{width:44px;height:44px;border-radius:10px;border:1px solid #2a3a52;background:#1a2636;color:#d8e2f0;font-size:18px;cursor:pointer}
  #clipEd .ce-tb.pri{background:#5cc8ff;color:#0b1118;border-color:#5cc8ff}
  #clipEd .ce-track{display:flex;background:#0e1520;border:1px solid #22324a;border-radius:14px;overflow:hidden;min-height:250px}
  #clipEd .ce-side{width:150px;flex:none;border-right:1px solid #22324a;background:#111a26;padding:12px;display:flex;flex-direction:column;gap:8px;font-size:12px;color:#8aa0bd}
  #clipEd .ce-side b{color:#eef3f9;font-size:13px}
  #clipEd .ce-meter{display:flex;gap:4px;height:90px;align-items:flex-end}
  #clipEd .ce-meter i{flex:1;background:#1a2636;border-radius:3px;height:100%;position:relative;overflow:hidden}
  #clipEd .ce-meter i b{position:absolute;left:0;right:0;bottom:0;background:#3ddc84}
  #clipEd .ce-scroll{flex:1;min-width:0;overflow-x:auto;overflow-y:hidden;position:relative;touch-action:pan-x}
  #clipEd canvas{display:block;cursor:crosshair}
  #clipEd .ce-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}
  @media (max-width:900px){#clipEd .ce-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#clipEd .ce-side{width:110px}}
  #clipEd .ce-card{background:#111a26;border:1px solid #22324a;border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:8px;font-size:12px;color:#8aa0bd}
  #clipEd .ce-card h4{margin:0;font-size:13px;color:#eef3f9}
  #clipEd .ce-card input[type=range]{width:100%;accent-color:#ffd166}
  #clipEd .ce-card .num{font:600 13px ui-monospace,Menlo,monospace;color:#eef3f9}
  #clipEd .ce-seg{display:flex;gap:4px}
  #clipEd .ce-seg button{flex:1;font:600 11px system-ui;color:#8aa0bd;background:transparent;border:1px solid #2a3a52;border-radius:7px;padding:6px 0;cursor:pointer}
  #clipEd .ce-seg button.on{background:#ffd166;color:#0b1118;border-color:#ffd166}
  #clipEd .ce-msg{font-size:13px;color:#ffd166}
  #clipEd input[type=number]{width:90px;background:#0a1019;color:#eef3f9;border:1px solid #2a3a52;border-radius:8px;padding:6px}`;
  document.head.appendChild (css);

  const ed = document.createElement ('div'); ed.id = 'clipEd';
  ed.innerHTML = `
  <div class="ce-top">
    <button class="hbtn" id="ceBack">← Volver</button>
    <div><div class="ce-title">Editor de clip</div><div class="ce-sub" id="ceSub"></div></div>
    <div class="ce-right">
      <button class="hbtn" id="ceUndo">Deshacer</button>
      <button class="hbtn" id="ceReset">Restaurar original</button>
      <button class="hbtn primary" id="ceSave">Guardar</button>
    </div>
  </div>
  <div class="ce-bar">
    <button class="ce-tb" id="ceHome" aria-label="Ir al inicio">⏮</button>
    <button class="ce-tb pri" id="cePlay" aria-label="Escuchar">▶</button>
    <button class="ce-tb" id="ceStop" aria-label="Detener">■</button>
    <div class="ce-t" id="ceTime">0:00.0</div>
    <div class="ce-sub">Duración final <b id="ceLen" style="color:#eef3f9">—</b></div>
    <label class="ce-sub" style="margin-left:auto;display:flex;align-items:center;gap:8px">Zoom <input type="range" id="ceZoom" min="1" max="20" step="0.5" value="1" style="width:140px;accent-color:#5cc8ff"></label>
  </div>
  <div class="ce-msg" id="ceMsg"></div>
  <div class="ce-track">
    <div class="ce-side">
      <b id="ceName">—</b><span id="ceInfo"></span>
      <span>Ganancia <b id="ceGainTxt">0.0 dB</b></span>
      <div class="ce-meter"><i><b id="ceM1"></b></i><i><b id="ceM2"></b></i></div>
      <span id="cePeak">Pico —</span>
    </div>
    <div class="ce-scroll" id="ceScroll"><canvas id="ceCanvas" height="250"></canvas></div>
  </div>
  <div class="ce-grid">
    <div class="ce-card"><h4>Recorte</h4>
      <label>Inicio (s) <input type="number" id="ceStart" step="0.1" min="0"></label>
      <label>Final (s) <input type="number" id="ceEnd" step="0.1" min="0"></label>
      <button class="hbtn" id="ceSilence">Quitar silencios</button></div>
    <div class="ce-card"><h4>Fade in</h4><span>Duración <span class="num" id="ceFiTxt">0.0 s</span></span>
      <input type="range" id="ceFi" min="0" max="20" step="0.1" value="0">
      <div class="ce-seg" id="ceFiC"><button data-c="lin">Lineal</button><button data-c="sin">Suave</button><button data-c="exp">Expo</button></div></div>
    <div class="ce-card"><h4>Fade out</h4><span>Duración <span class="num" id="ceFoTxt">0.0 s</span></span>
      <input type="range" id="ceFo" min="0" max="30" step="0.1" value="0">
      <div class="ce-seg" id="ceFoC"><button data-c="lin">Lineal</button><button data-c="sin">Suave</button><button data-c="exp">Expo</button></div></div>
    <div class="ce-card"><h4>Ganancia</h4><span><span class="num" id="ceGTxt">0.0 dB</span></span>
      <input type="range" id="ceG" min="-20" max="12" step="0.5" value="0" style="accent-color:#5cc8ff">
      <button class="hbtn" id="ceNorm">Normalizar (pico −1 dB)</button></div>
    <div class="ce-card"><h4>Cómo se usa</h4>
      <span>Arrastra las barras <b style="color:#ffd166">amarillas</b> para recortar, y los círculos <b style="color:#3ddc97">IN</b> y <b style="color:#ff9f43">OUT</b> hacia el centro para los fades. Toca la onda para escuchar desde ahí.</span>
      <span>El archivo original no se modifica.</span></div>
  </div>`;
  document.body.appendChild (ed);
  const $ = (id) => document.getElementById (id);
  const cv = $('ceCanvas'), g = cv.getContext ('2d'), scroller = $('ceScroll');

  let file = '', folder = 'music', ckey = '', buf = null, dur = 0, peaks = null, PB = 256, actx = null;
  let st = null, hist = [];
  let play = null;                 // { src, gain, t0, from }
  let head = 0;                    // cabezal (s)
  const def = () => ({ start: 0, end: dur, fadeIn: 0, fadeOut: 0, inCurve: 'sin', outCurve: 'sin', gainDb: 0 });
  const fmt = (s) => { s = Math.max (0, s); return Math.floor (s / 60) + ':' + (s % 60).toFixed (1).padStart (4, '0'); };
  const curve = (k, c) => { k = Math.max (0, Math.min (1, k)); return c === 'lin' ? k : c === 'exp' ? k * k : Math.sin (k * Math.PI / 2); };
  const env = (t) => { let e = 1; if (st.fadeIn > 0 && t < st.start + st.fadeIn) e *= curve ((t - st.start) / st.fadeIn, st.inCurve); if (st.fadeOut > 0 && t > st.end - st.fadeOut) e *= curve ((st.end - t) / st.fadeOut, st.outCurve); return t < st.start || t > st.end ? 0 : e; };
  const push = () => { hist.push (JSON.stringify (st)); if (hist.length > 50) hist.shift(); };

  // ---------- abrir
  async function open (f, fold)
  {
    file = f; folder = fold || 'music'; ckey = folder === 'vog' ? 'vog/' + f : f; stop(); buf = null; peaks = null; hist = [];
    ed.classList.add ('on');
    $('ceSub').textContent = f; $('ceName').textContent = f.replace (/\.[^.]+$/, ''); $('ceInfo').textContent = '';
    msg ('Cargando audio…'); draw();
    try
    {
      const rec = await fileGet (folder + '/' + f);
      if (!rec) { msg ('No encuentro el archivo en la biblioteca.'); return; }
      if (rec.size > 200e6) { msg ('Este archivo es muy pesado (' + Math.round (rec.size / 1e6) + ' MB). Usa una versión MP3 o M4A.'); return; }
      const ab = await rec.blob.arrayBuffer();
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      buf = await new Promise ((ok, bad) => { const p = actx.decodeAudioData (ab, ok, bad); if (p && p.catch) p.catch (bad); });
    }
    catch (e) { msg ('No se pudo abrir el audio: ' + (e && e.message || e)); return; }
    dur = buf.duration;
    $('ceInfo').textContent = (buf.numberOfChannels > 1 ? 'Estéreo' : 'Mono') + ' · ' + Math.round (buf.sampleRate / 100) / 10 + ' kHz · ' + fmt (dur);
    buildPeaks();
    const saved = (config.clips || {})[ckey];
    st = Object.assign (def(), saved || {});
    st.end = Math.min (st.end || dur, dur);
    head = st.start;
    msg (''); sync(); draw();
  }
  function msg (t) { $('ceMsg').textContent = t; }
  function buildPeaks ()
  {
    const n = Math.ceil (buf.length / PB), ch = [];
    for (let c = 0; c < Math.min (2, buf.numberOfChannels); ++c) ch.push (buf.getChannelData (c));
    peaks = new Float32Array (n);
    for (let i = 0; i < n; ++i)
    {
      let m = 0; const a = i * PB, b = Math.min (buf.length, a + PB);
      for (const d of ch) for (let j = a; j < b; j += 2) { const v = d[j] < 0 ? -d[j] : d[j]; if (v > m) m = v; }
      peaks[i] = m;
    }
  }
  const peakIn = (t0, t1) => { if (!peaks) return 0; const sr = buf.sampleRate; let m = 0; for (let i = Math.floor (t0 * sr / PB); i < Math.min (peaks.length, Math.ceil (t1 * sr / PB)); ++i) if (peaks[i] > m) m = peaks[i]; return m; };

  // ---------- dibujo
  function width () { return Math.max (300, Math.round (scroller.clientWidth * (+$('ceZoom').value))); }
  const PAD = 18, FY = 44, X = (t) => PAD + (t / dur) * (cv.width - 2 * PAD), T = (x) => Math.max (0, Math.min (dur, ((x - PAD) / (cv.width - 2 * PAD)) * dur));   // margen para ver las barras de los extremos
  function draw ()
  {
    const W = width(), H = 250; if (cv.width !== W) cv.width = W;
    g.clearRect (0, 0, W, H); g.fillStyle = '#0e1520'; g.fillRect (0, 0, W, H);
    if (!peaks || !st) return;
    // regla
    g.fillStyle = '#111a26'; g.fillRect (0, 0, W, 22); g.fillStyle = '#8aa0bd'; g.font = '11px ui-monospace,Menlo,monospace';
    const step = [1, 2, 5, 10, 15, 30, 60, 120, 300].find (s => (s / dur) * W > 70) || 600;
    for (let s = 0; s <= dur; s += step) { const x = X (s); g.fillRect (x, 0, 1, 22); g.fillText (Math.floor (s / 60) + ':' + String (Math.floor (s % 60)).padStart (2, '0'), x + 4, 15); }
    // onda
    const mid = 22 + (H - 22) / 2, amp = (H - 22) / 2 - 6, gl = Math.pow (10, st.gainDb / 20);
    for (let x = 0; x < W; x += 2)
    {
      const t0 = T (x), t1 = T (x + 2), p = Math.min (1, peakIn (t0, t1) * gl), tc = (t0 + t1) / 2;
      const inside = tc >= st.start && tc <= st.end, h = Math.max (1, p * amp * (inside ? env (tc) : 1));
      g.fillStyle = inside ? (p >= 0.999 ? '#ff6b6b' : '#4fb6ea') : '#2c4058';
      g.fillRect (x, mid - h, 1.6, h * 2);
    }
    // zonas recortadas
    g.fillStyle = 'rgba(5,8,12,.72)'; g.fillRect (0, 22, X (st.start), H); g.fillRect (X (st.end), 22, W - X (st.end), H);
    // curvas de fade
    g.strokeStyle = '#ffd166'; g.lineWidth = 2; g.beginPath();
    const top = FY, bot = H - 6;
    for (let x = Math.floor (X (st.start)); x <= Math.ceil (X (st.end)); x += 2) { const y = bot - (bot - top) * env (T (x)); x === Math.floor (X (st.start)) ? g.moveTo (x, y) : g.lineTo (x, y); }
    g.stroke();
    // tiradores
    g.fillStyle = '#ffd166';
    for (const t of [st.start, st.end]) { g.fillRect (X (t) - 1.5, 22, 3, H); g.fillRect (X (t) - 8, mid - 22, 16, 44); }
    // tiradores de fade: circulos grandes para el dedo (IN verde, OUT naranja)
    for (const [t, col, txt] of [[st.start + st.fadeIn, '#3ddc97', 'IN'], [st.end - st.fadeOut, '#ff9f43', 'OUT']])
    {
      const cx = X (t);
      g.fillStyle = col; g.globalAlpha = .35; g.fillRect (cx - 1, 22, 2, H); g.globalAlpha = 1;
      g.beginPath(); g.arc (cx, FY, 15, 0, Math.PI * 2); g.fill();
      g.lineWidth = 2; g.strokeStyle = '#0b1118'; g.stroke();
      g.fillStyle = '#0b1118'; g.font = '700 10px system-ui'; g.textAlign = 'center'; g.fillText (txt, cx, FY + 3.5); g.textAlign = 'left';
    }
    // cabezal
    const ph = play ? play.from + (actx.currentTime - play.t0) : head;
    g.fillStyle = '#5cc8ff'; g.fillRect (X (ph), 22, 2, H);
  }

  // ---------- sincronizar controles
  function sync ()
  {
    $('ceStart').value = st.start.toFixed (1); $('ceEnd').value = st.end.toFixed (1);
    $('ceFi').value = st.fadeIn; $('ceFo').value = st.fadeOut; $('ceG').value = st.gainDb;
    $('ceFiTxt').textContent = st.fadeIn.toFixed (1) + ' s'; $('ceFoTxt').textContent = st.fadeOut.toFixed (1) + ' s';
    $('ceGTxt').textContent = $('ceGainTxt').textContent = (st.gainDb > 0 ? '+' : '') + st.gainDb.toFixed (1) + ' dB';
    $('ceLen').textContent = fmt (st.end - st.start);
    for (const [box, c] of [['ceFiC', st.inCurve], ['ceFoC', st.outCurve]]) for (const b of $(box).children) b.classList.toggle ('on', b.dataset.c === c);
    const pk = peakIn (st.start, st.end) * Math.pow (10, st.gainDb / 20);
    const db = pk > 0 ? 20 * Math.log10 (pk) : -96;
    $('cePeak').textContent = 'Pico ' + db.toFixed (1) + ' dB' + (db > -0.1 ? ' ⚠️' : '');
    const lvl = Math.max (0, Math.min (100, (db + 60) / 60 * 100)) + '%';
    $('ceM1').style.height = $('ceM2').style.height = lvl;
    $('ceM1').style.background = $('ceM2').style.background = db > -0.1 ? '#ff6b6b' : db > -6 ? '#ffd166' : '#3ddc84';
  }
  const clampSt = () =>
  {
    st.start = Math.max (0, Math.min (st.start, dur - 0.5)); st.end = Math.max (st.start + 0.5, Math.min (st.end, dur));
    const len = st.end - st.start;
    st.fadeIn = Math.max (0, Math.min (st.fadeIn, len)); st.fadeOut = Math.max (0, Math.min (st.fadeOut, len - st.fadeIn));
  };
  const change = (fn) => { if (!st) return; push(); fn(); clampSt(); sync(); draw(); if (play) { const t = play.from + (actx.currentTime - play.t0); start (t); } };

  $('ceStart').onchange = () => change (() => st.start = +$('ceStart').value || 0);
  $('ceEnd').onchange = () => change (() => st.end = +$('ceEnd').value || dur);
  $('ceFi').oninput = () => change (() => st.fadeIn = +$('ceFi').value);
  $('ceFo').oninput = () => change (() => st.fadeOut = +$('ceFo').value);
  $('ceG').oninput = () => change (() => st.gainDb = +$('ceG').value);
  $('ceFiC').onclick = (e) => e.target.dataset.c && change (() => st.inCurve = e.target.dataset.c);
  $('ceFoC').onclick = (e) => e.target.dataset.c && change (() => st.outCurve = e.target.dataset.c);
  $('ceZoom').oninput = () => draw();
  $('ceNorm').onclick = () => change (() => { const pk = peakIn (st.start, st.end); if (pk > 0) st.gainDb = Math.max (-20, Math.min (12, Math.round ((-1 - 20 * Math.log10 (pk)) * 2) / 2)); });
  $('ceSilence').onclick = () => change (() =>
  {
    const th = 0.003, sr = buf.sampleRate;               // ~ -50 dB
    let a = 0, b = peaks.length - 1;
    while (a < b && peaks[a] < th) ++a;
    while (b > a && peaks[b] < th) --b;
    st.start = Math.max (0, a * PB / sr - 0.05); st.end = Math.min (dur, (b + 1) * PB / sr + 0.05);
  });
  $('ceUndo').onclick = () => { if (!hist.length) return; st = JSON.parse (hist.pop()); sync(); draw(); };
  $('ceReset').onclick = () => change (() => { st = def(); });

  // ---------- arrastrar en la onda
  let drag = null;
  cv.addEventListener ('pointerdown', (e) =>
  {
    if (!st) return;
    const r = cv.getBoundingClientRect (), x = e.clientX - r.left, y = e.clientY - r.top;
    const near = (t, tol = 18) => Math.abs (X (t) - x) < tol;
    let kind = null;
    if (y < FY + 26 && near (st.start + st.fadeIn, 26)) kind = 'fi';
    else if (y < FY + 26 && near (st.end - st.fadeOut, 26)) kind = 'fo';
    else if (near (st.start)) kind = 'start';
    else if (near (st.end)) kind = 'end';
    if (!kind) { head = Math.max (0, Math.min (dur, T (x))); if (play) start (head); draw(); return; }
    push(); drag = kind; cv.setPointerCapture (e.pointerId); e.preventDefault();
  });
  cv.addEventListener ('pointermove', (e) =>
  {
    if (!st) return;
    const r = cv.getBoundingClientRect (), x = e.clientX - r.left, y = e.clientY - r.top, t = Math.max (0, Math.min (dur, T (x)));
    if (!drag)
    {
      const near = (tt) => Math.abs (X (tt) - x) < 18;
      cv.style.cursor = (y < FY + 26 && (near (st.start + st.fadeIn) || near (st.end - st.fadeOut))) || near (st.start) || near (st.end) ? 'ew-resize' : 'crosshair';
      return;
    }
    if (drag === 'start') st.start = t; else if (drag === 'end') st.end = t;
    else if (drag === 'fi') st.fadeIn = t - st.start; else if (drag === 'fo') st.fadeOut = st.end - t;
    clampSt(); sync(); draw();
  });
  // En el iPad, si el dedo cae sobre un tirador, evitar que la onda se desplace en vez de arrastrar
  cv.addEventListener ('touchstart', (e) =>
  {
    if (!st || !e.touches[0]) return;
    const r = cv.getBoundingClientRect (), x = e.touches[0].clientX - r.left, y = e.touches[0].clientY - r.top;
    const near = (t, tol) => Math.abs (X (t) - x) < tol;
    if ((y < FY + 26 && (near (st.start + st.fadeIn, 26) || near (st.end - st.fadeOut, 26))) || near (st.start, 18) || near (st.end, 18)) e.preventDefault();
  }, { passive: false });
  const endDrag = () => { drag = null; };
  cv.addEventListener ('pointerup', endDrag); cv.addEventListener ('pointercancel', endDrag);

  // ---------- escuchar (en este dispositivo, p. ej. con audífonos)
  function start (from)
  {
    stopSrc();
    if (!buf) return;
    actx.resume && actx.resume();
    from = Math.max (st.start, Math.min (from, st.end - 0.05));
    const src = actx.createBufferSource (); src.buffer = buf;
    const gn = actx.createGain (); src.connect (gn).connect (actx.destination);
    src.start (0, from);
    play = { src, gain: gn, t0: actx.currentTime, from };
    $('cePlay').textContent = '⏸';
    tick();
  }
  function stopSrc () { if (play) { try { play.src.stop(); } catch {} play = null; } $('cePlay').textContent = '▶'; }
  function stop () { if (play) head = play.from + (actx.currentTime - play.t0); stopSrc(); draw(); }
  function tick ()
  {
    if (!play) return;
    const t = play.from + (actx.currentTime - play.t0);
    if (t >= st.end) { head = st.start; stopSrc(); draw(); return; }
    { const g2 = play.gain.gain, tt = actx.currentTime; g2.cancelScheduledValues (tt); g2.setValueAtTime (env (t) * Math.pow (10, st.gainDb / 20), tt); }
    $('ceTime').textContent = fmt (t);
    draw();
    requestAnimationFrame (tick);
  }
  $('cePlay').onclick = () => { if (!st) return; play ? stop() : start (head < st.start || head >= st.end ? st.start : head); };
  $('ceStop').onclick = () => { stopSrc(); head = st ? st.start : 0; $('ceTime').textContent = fmt (head); draw(); };
  $('ceHome').onclick = () => { head = st ? st.start : 0; if (play) start (head); $('ceTime').textContent = fmt (head); draw(); };

  // ---------- guardar / volver
  function close () { stopSrc(); ed.classList.remove ('on'); }
  $('ceBack').onclick = close;
  $('ceSave').onclick = () =>
  {
    if (!st) return close();
    config.clips = config.clips || {};
    const d = def(), same = Math.abs (st.start) < 0.05 && Math.abs (st.end - dur) < 0.05 && !st.fadeIn && !st.fadeOut && !st.gainDb;
    if (same) delete config.clips[ckey];
    else config.clips[ckey] = { start: +st.start.toFixed (2), end: +st.end.toFixed (2), fadeIn: +st.fadeIn.toFixed (2), fadeOut: +st.fadeOut.toFixed (2), inCurve: st.inCurve, outCurve: st.outCurve, gainDb: st.gainDb, dur: +dur.toFixed (2) };
    save(); close();
  };
  window.addEventListener ('resize', () => ed.classList.contains ('on') && draw());

  // ---------- boton "Editar audio" en el editor de teclas
  const act = document.querySelector ('#dlg .actions');
  const bEd = document.createElement ('button'); bEd.className = 'hbtn'; bEd.textContent = '🎚 Editar audio';
  bEd.onclick = () =>
  {
    const sel = document.querySelector ('#fParams [data-key="file"]');
    if (!sel || !sel.value) { alert ('Primero elige el audio.'); return; }
    const fold = document.getElementById ('fType').value === 'vog' ? 'vog' : 'music';
    const f = sel.value; document.getElementById ('fSave').click();      // guarda la tecla y abre el editor
    open (f, fold);
  };
  if (act) act.insertBefore (bEd, document.getElementById ('fCancel'));
  const _fill = fillParams;
  fillParams = function (type, b) { const r = _fill.apply (this, arguments); bEd.style.display = type === 'music.play' || type === 'vog' ? '' : 'none'; return r; };
  window.rfOpenClip = open;
})();
