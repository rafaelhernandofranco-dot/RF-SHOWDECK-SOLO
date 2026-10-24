// RF ShowKeys Solo: Ajustes (crossfade), Ayuda, Bienvenida y Licencia (demo + activacion).
'use strict';
(() =>
{
  // ------------------------------------------------------------------ licencia
  // Clave publica de RF Audio Pro (las claves se firman con la clave privada, que solo tiene Rafael).
  // Mientras sea null, la licencia esta desactivada y la app funciona completa.
  const LIC_PUB = 'H_-6tFEsPeTZ_9VFVyRb1EuUbZ91ZFs0kkwauBBy53U.AfTwin69lnXzAEPHREhTfwsRzhO0TG-eZQBXYnhdVcg';   // firma de RF Audio Pro
  const DEMO_DAYS = 14;
  const LIC_CONTACT = 'RF Audio Pro';
  const PRODUCTS = { solo: 'ShowKeys Solo', full: 'ShowKeys Full', pack: 'ShowKeys Solo + Full' };

  const b64u = (s) => Uint8Array.from (atob (s.replace (/-/g, '+').replace (/_/g, '/') + '==='.slice ((s.length + 3) % 4)), c => c.charCodeAt (0));
  let lic = { state: 'off' };      // off | ok | demo | expired

  async function verifyKey (key)
  {
    key = String (key || '').trim().replace (/\s+/g, '');
    const m = /^RF1-([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)$/.exec (key);
    if (!m) return null;
    try
    {
      const [x, y] = LIC_PUB.split ('.');
      const pub = await crypto.subtle.importKey ('jwk', { kty: 'EC', crv: 'P-256', x, y, ext: true }, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
      const data = b64u (m[1]), sig = b64u (m[2]);
      const ok = await crypto.subtle.verify ({ name: 'ECDSA', hash: 'SHA-256' }, pub, sig, data);
      if (!ok) return null;
      const info = JSON.parse (new TextDecoder().decode (data));
      if (info.p !== 'solo' && info.p !== 'pack') return { wrong: info.p };
      return info;
    }
    catch (e) { return null; }
  }
  async function demoStart ()
  {
    let a = await kvGet ('demo0'), b = null;
    try { b = Number (localStorage.getItem ('rfsd_demo0')) || null; } catch {}
    const t = Math.min (a || Infinity, b || Infinity, Date.now());
    if (a !== t) await kvSet ('demo0', t);
    try { localStorage.setItem ('rfsd_demo0', String (t)); } catch {}
    return t;
  }
  async function licCheck ()
  {
    if (!LIC_PUB || !window.crypto || !crypto.subtle) { lic = { state: 'off' }; return licShow(); }
    const saved = await kvGet ('lic');
    if (saved && saved.key) { const info = await verifyKey (saved.key); if (info && !info.wrong) { lic = { state: 'ok', info }; return licShow(); } }
    const t0 = await demoStart (), left = Math.ceil (DEMO_DAYS - (Date.now() - t0) / 864e5);
    lic = left > 0 ? { state: 'demo', left } : { state: 'expired' };
    licShow();
  }
  async function activate (key, msgEl)
  {
    const info = await verifyKey (key);
    if (info && info.wrong) { msgEl.textContent = 'Esa clave es de ' + (PRODUCTS[info.wrong] || 'otro producto') + ', no de ShowKeys Solo.'; msgEl.style.color = 'var(--red)'; return false; }
    if (!info) { msgEl.textContent = 'Esa clave no es válida para ShowKeys Solo. Cópiala completa, empieza con RF1-.'; msgEl.style.color = 'var(--red)'; return false; }
    await kvSet ('lic', { key: key.trim(), at: Date.now() });
    lic = { state: 'ok', info }; licShow();
    msgEl.textContent = '✓ Activada a nombre de ' + info.n; msgEl.style.color = 'var(--green)';
    toast ('✓ ShowKeys Solo activado. ¡Gracias!', 4000);
    return true;
  }

  // ------------------------------------------------------------------ interfaz
  const css = document.createElement ('style');
  css.textContent = `
  body.locked #bSet { display:none !important; }
  #pLic { background:transparent; cursor:pointer; color:var(--amber); border-color:var(--amber); }
  .set-sec { border-top:1px solid var(--line); padding:12px 0 4px; }
  .set-sec:first-of-type { border-top:0; padding-top:0; }
  .set-sec h4 { margin:0 0 6px; font-size:15px; }
  #hlp details { border:1px solid var(--line); border-radius:12px; margin:8px 0; background:var(--panel2); }
  #hlp summary { padding:12px 14px; font-weight:700; cursor:pointer; list-style:none; }
  #hlp summary::-webkit-details-marker { display:none; }
  #hlp summary::after { content:'＋'; float:right; color:var(--dim); }
  #hlp details[open] summary::after { content:'－'; }
  #hlp .hb { padding:0 14px 12px; color:var(--text); font-size:14px; line-height:1.5; }
  #hlp .hb li { margin:3px 0; }
  #hlp .hb b { color:var(--cyan); }
  #wel { position:fixed; inset:0; z-index:95; background:rgba(5,9,14,.92); display:none; align-items:center; justify-content:center; padding:20px; }
  #wel .card { background:var(--panel); border:1px solid var(--line); border-radius:20px; width:min(560px, 94vw); padding:26px 26px 20px; text-align:center; }
  #wel .ico { font-size:52px; line-height:1; margin-bottom:10px; }
  #wel h2 { margin:0 0 10px; font-size:24px; }
  #wel p { color:var(--dim); font-size:16px; line-height:1.5; margin:0 0 18px; }
  #wel .dots { display:flex; gap:7px; justify-content:center; margin-bottom:16px; }
  #wel .dots i { width:8px; height:8px; border-radius:50%; background:var(--line); }
  #wel .dots i.on { background:var(--cyan); }
  #licWall { position:fixed; inset:0; z-index:96; background:var(--bg); display:none; flex-direction:column; align-items:center; justify-content:center; gap:12px; padding:20px; text-align:center; }
  #licWall input, #setKey { width:min(520px, 90vw); font:14px ui-monospace,Menlo,monospace; background:var(--panel2); color:var(--text); border:1px solid var(--line); border-radius:10px; padding:11px 12px; }
  #setKey { width:100%; }
  `;
  document.head.appendChild (css);

  // botones de cabecera
  const hdr = $('bEdit');
  const bSet = document.createElement ('button'); bSet.className = 'hbtn'; bSet.id = 'bSet'; bSet.textContent = '⚙'; bSet.setAttribute ('aria-label', 'Ajustes y ayuda');
  hdr.parentNode.insertBefore (bSet, hdr);
  const pLic = document.createElement ('button'); pLic.className = 'pill'; pLic.id = 'pLic'; pLic.style.display = 'none';
  $('pClock').after (pLic);

  // ajustes
  const dSet = document.createElement ('dialog'); dSet.id = 'set';
  dSet.innerHTML = `
    <h3>⚙ Ajustes</h3>
    <div class="set-sec" id="setLicSec"><h4>Licencia</h4><p class="hint" id="setLicTxt" style="margin:0 0 8px"></p>
      <div id="setLicForm"><input id="setKey" placeholder="Pega aquí tu clave (RF1-…)" autocomplete="off" autocapitalize="off" spellcheck="false">
      <div class="actions" style="justify-content:flex-start;margin-top:8px"><button class="hbtn primary" id="setAct">Activar</button></div><p class="hint" id="setMsg"></p></div></div>
    <div class="set-sec"><h4>Crossfade entre canciones</h4>
      <p class="hint" style="margin:0 0 8px">Al tocar otra canción (o en las listas), la que suena baja mientras la nueva sube. 0 = cambio directo.</p>
      <div style="display:flex;align-items:center;gap:12px"><input type="range" id="setXf" min="0" max="10" step="0.5" style="flex:1;accent-color:var(--cyan)"><b id="setXfTxt" style="min-width:64px;text-align:right;font-variant-numeric:tabular-nums"></b></div></div>
    <div class="set-sec"><h4>Ayuda</h4>
      <div class="actions" style="justify-content:flex-start"><button class="hbtn primary" id="setHelp">❓ Cómo se usa</button><button class="hbtn" id="setWel">Ver bienvenida</button></div></div>
    <div class="set-sec"><p class="hint" id="setAbout" style="margin:0"></p></div>
    <div class="actions"><button class="hbtn primary" id="setOk">Listo</button></div>`;
  document.body.appendChild (dSet);

  const xfTxt = (v) => v > 0 ? v.toFixed (1) + ' s' : 'Apagado';
  bSet.onclick = () =>
  {
    $('setXf').value = Number (config.xfade) || 0; $('setXfTxt').textContent = xfTxt (Number (config.xfade) || 0);
    $('setMsg').textContent = ''; $('setKey').value = '';
    const ver = (document.querySelector ('.name .solo + .solo') || {}).textContent || '';
    $('setAbout').textContent = 'RF ShowKeys Solo ' + ver + ' · © RF Audio Pro';
    licShow(); dSet.showModal();
  };
  $('setOk').onclick = () => dSet.close();
  $('setXf').oninput = () => { config.xfade = +$('setXf').value; $('setXfTxt').textContent = xfTxt (config.xfade); save(); };
  $('setAct').onclick = () => activate ($('setKey').value, $('setMsg'));
  $('setHelp').onclick = () => { dSet.close(); dHlp.showModal(); };
  $('setWel').onclick = () => { dSet.close(); welcome (true); };
  pLic.onclick = () => bSet.onclick();

  function licShow ()
  {
    const sec = $('setLicSec'), txt = $('setLicTxt'), form = $('setLicForm');
    sec.style.display = lic.state === 'off' ? 'none' : '';
    pLic.style.display = lic.state === 'demo' ? '' : 'none';
    if (lic.state === 'demo') pLic.textContent = 'DEMO ' + lic.left + 'd';
    if (lic.state === 'ok') { txt.innerHTML = '✓ Activada a nombre de <b></b> · ' + (PRODUCTS[lic.info.p] || ''); txt.querySelector ('b').textContent = lic.info.n; form.style.display = 'none'; }
    else if (lic.state === 'demo') { txt.textContent = 'Versión de prueba: te quedan ' + lic.left + (lic.left === 1 ? ' día' : ' días') + '. Para seguir usándola después, activa tu clave de ' + LIC_CONTACT + '.'; form.style.display = ''; }
    else if (lic.state === 'expired') { form.style.display = ''; }
    wall.style.display = lic.state === 'expired' ? 'flex' : 'none';
  }

  // pantalla de demo terminada
  const wall = document.createElement ('div'); wall.id = 'licWall';
  wall.innerHTML = `
    <div style="font-size:46px">🔑</div>
    <div style="font-size:24px;font-weight:700">Terminó la versión de prueba</div>
    <div style="color:var(--dim);max-width:460px;line-height:1.5">Tus teclas y canciones siguen guardadas. Activa tu licencia de ${LIC_CONTACT} para seguir usando RF ShowKeys Solo.</div>
    <input id="wKey" placeholder="Pega aquí tu clave (RF1-…)" autocomplete="off" autocapitalize="off" spellcheck="false">
    <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="hbtn primary" id="wAct">Activar</button><button class="hbtn" id="wBk">Guardar respaldo</button></div>
    <p class="hint" id="wMsg"></p>`;
  document.body.appendChild (wall);
  $('wAct').onclick = () => activate ($('wKey').value, $('wMsg'));
  $('wBk').onclick = () => { const l = $('lib'); if (l && $('bLib')) $('bLib').click(); };

  // ------------------------------------------------------------------ ayuda
  const dHlp = document.createElement ('dialog'); dHlp.id = 'hlp'; dHlp.style.width = 'min(720px, 96vw)';
  const H = (t, body) => `<details><summary>${t}</summary><div class="hb">${body}</div></details>`;
  dHlp.innerHTML = `<h3>❓ Cómo se usa RF ShowKeys Solo</h3>` +
    H ('1. Primeros pasos', `<ol>
      <li><b>Importar</b> → elige canciones de la app Archivos, iCloud o un USB. Cada canción crea su tecla.</li>
      <li>Toca una tecla y suena. Tócala otra vez y <b>pausa</b>; otra vez y sigue desde donde iba.</li>
      <li><b>Editar</b> → toca una tecla para cambiar nombre, color, ícono, imagen, acción y volumen. Arrastra las teclas para ordenarlas.</li>
      <li>La primera vez que suene algo, toca la pantalla una vez: el iPad pide ese toque para activar el audio.</li></ol>`) +
    H ('2. Tipos de tecla', `<ul>
      <li><b>Música</b>: una canción, con delay, fade in/out, bucle y volumen propio.</li>
      <li><b>Lista</b>: varias canciones seguidas (⏮ ⏭ abajo para saltar).</li>
      <li><b>Anuncio (Voice of God)</b>: baja la música mientras habla y la sube al terminar.</li>
      <li><b>Voz sintética</b>: escribe un texto y el iPad lo lee con la voz que elijas.</li>
      <li><b>Macro</b>: varias acciones en orden (ver punto 4).</li>
      <li><b>Pausa/Reanudar, Detener, Fade out, Parar anuncio</b>: controles rápidos.</li>
      <li><b>Spotify</b>: abre tu lista en la app de Spotify; vuelve con «◀ ShowKeys» y sigue sonando.</li>
      <li><b>⛔ Parar todo</b>: detiene música, anuncios y macros de una.</li></ul>`) +
    H ('3. Editor de audio (onda)', `<ul>
      <li>En <b>Editar</b>, abre una tecla de música o anuncio y toca <b>🎚 Editar audio</b>.</li>
      <li>Barras <b>amarillas</b>: recortan inicio y final. Círculos <b>IN</b> (verde) y <b>OUT</b> (naranja): arrástralos hacia el centro para los fades.</li>
      <li>Abajo: curvas Lineal / Suave / Expo, ganancia y <b>Normalizar</b>.</li>
      <li>Escucha con ▶ y toca <b>Guardar</b>. El archivo original no se modifica.</li></ul>`) +
    H ('4. Macros', `<ul>
      <li>Crea una tecla tipo <b>Macro</b> y agrega pasos: Fade out, Detener, Reproducir canción, Anuncio, Voz, Esperar, Parar anuncio.</li>
      <li>Ejemplo: <i>1. Fade out 3 s → 2. Anuncio "Bienvenida" → 3. Reproducir "Entrada"</i>.</li>
      <li>Mientras suena lo que arrancó, la tecla queda encendida. <b>Tócala otra vez para parar todo</b> lo que ella puso a sonar.</li>
      <li>El botón 🎚 junto a cada paso abre el editor de ese audio.</li></ul>`) +
    H ('5. Crossfade', `<ul><li>En <b>⚙ Ajustes</b> elige los segundos de crossfade. Al tocar otra canción mientras suena una, se cruzan suavemente.</li>
      <li>En las listas, la siguiente entra antes de que termine la actual.</li></ul>`) +
    H ('6. Anuncios', `<ul><li><b>Importar → 🎙 Grabar anuncio</b>: graba con el micrófono y queda como tecla.</li>
      <li>En <b>Biblioteca</b>, «→ Música» / «→ Anuncio» cambia el tipo de un archivo si entró mal.</li></ul>`) +
    H ('7. En vivo', `<ul>
      <li><b>🔓 / 🔒 Modo show</b>: bloquea Editar, Importar y Biblioteca para evitar toques accidentales.</li>
      <li><b>☀︎ Pantalla</b>: mantiene la pantalla encendida mientras la app está abierta.</li>
      <li><b>Reloj</b>: tócalo para un temporizador (discursos, recesos).</li>
      <li><b>Teclado o pedal Bluetooth</b>: asigna un atajo a cada tecla. <b>Espacio</b> = pausa/sigue, <b>Esc</b> = parar todo.</li>
      <li>Si abres otra app, el iPad puede pausar ShowKeys: vuelve y toca la tecla.</li></ul>`) +
    H ('8. Respaldo y otro equipo', `<ul>
      <li><b>Biblioteca → Guardar respaldo</b>: guarda teclas y canciones en un archivo (Archivos o iCloud).</li>
      <li><b>Restaurar respaldo</b> en otro iPad, Android o computadora para tener todo igual.</li>
      <li>Haz un respaldo antes de cada evento importante.</li></ul>`) +
    H ('9. Instalar en otros equipos', `<ul>
      <li><b>iPad / iPhone</b>: Safari → Compartir → <i>Agregar a inicio</i>.</li>
      <li><b>Android</b>: Chrome → menú ⋮ → <i>Instalar app</i>.</li>
      <li><b>Windows / Mac</b>: Chrome o Edge → ícono <i>Instalar</i> en la barra de dirección, o la app de escritorio de RF Audio Pro.</li>
      <li>Cada equipo guarda sus propias canciones: pásalas con un respaldo.</li></ul>`) +
    `<div class="actions"><button class="hbtn primary" id="hlpOk">Cerrar</button></div>`;
  document.body.appendChild (dHlp);
  $('hlpOk').onclick = () => dHlp.close();

  // ------------------------------------------------------------------ bienvenida
  const SL = [
    ['🎛', 'Bienvenido a RF ShowKeys Solo', 'Tu reproductor de música y anuncios para eventos en vivo, en el iPad, sin internet.'],
    ['🎵', 'Importa y toca', 'Toca <b>Importar</b> y elige tus canciones. Cada una crea una tecla: tócala para que suene y otra vez para pausar.'],
    ['✏️', 'Hazlo tuyo', 'Con <b>Editar</b> cambias nombres, colores, imágenes y acciones, editas el audio con la onda y armas macros.'],
    ['🔒', 'Listo para el show', 'Activa <b>🔒 Modo show</b> y <b>☀︎ Pantalla</b> antes del evento. La ayuda completa está en <b>⚙</b>.'],
  ];
  const wel = document.createElement ('div'); wel.id = 'wel';
  wel.innerHTML = '<div class="card"><div class="ico"></div><h2></h2><p></p><div class="dots"></div><div style="display:flex;gap:10px;justify-content:center"><button class="hbtn" id="welSkip">Saltar</button><button class="hbtn primary" id="welNext">Siguiente</button></div></div>';
  document.body.appendChild (wel);
  let wi = 0;
  function welDraw ()
  {
    const [ic, t, p] = SL[wi];
    wel.querySelector ('.ico').textContent = ic; wel.querySelector ('h2').textContent = t; wel.querySelector ('p').innerHTML = p;
    wel.querySelector ('.dots').innerHTML = SL.map ((_, i) => '<i' + (i === wi ? ' class="on"' : '') + '></i>').join ('');
    $('welNext').textContent = wi === SL.length - 1 ? 'Empezar' : 'Siguiente';
    $('welSkip').style.visibility = wi === SL.length - 1 ? 'hidden' : '';
  }
  const welEnd = () => { wel.style.display = 'none'; kvSet ('welcomed', 1); };
  $('welNext').onclick = () => { if (wi < SL.length - 1) { ++wi; welDraw(); } else welEnd(); };
  $('welSkip').onclick = welEnd;
  function welcome (force) { wi = 0; welDraw(); wel.style.display = 'flex'; }

  // ------------------------------------------------------------------ arranque (espera a que la app cargue la configuracion)
  (async function boot ()
  {
    while (typeof db === 'undefined' || !db || !config) { await new Promise (r => setTimeout (r, 100)); }
    // clave en el enlace (#lic=RF1-...): se activa sola
    const m = /[#&]lic=([^&]+)/.exec (location.hash);
    if (m && LIC_PUB) { await licCheck(); await activate (decodeURIComponent (m[1]), $('setMsg')); history.replaceState (null, '', location.pathname + location.search); }
    await licCheck();
    if (!(await kvGet ('welcomed'))) welcome();
    setInterval (licCheck, 6 * 3600e3);
  })();
  window.rfLic = () => lic;
})();
