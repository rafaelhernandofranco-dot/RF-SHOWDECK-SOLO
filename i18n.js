// RF Audio Pro — idiomas (ES · EN · PT · FR · IT) para RF ShowKeys Solo y Full.
// La app esta escrita en espanol; este archivo traduce lo que aparece en pantalla:
// textos, placeholders, titulos, opciones y los avisos de confirm/alert.
//  - Los numeros y lo que va entre «comillas» son variables (nombres de canciones, IDs, versiones…).
//  - Lo que escribe el usuario (nombres de teclas, canciones) no se traduce, salvo que coincida con un texto de la app.
//  - Diccionario: window.RF_I18N = { "texto en español": ["English", "Português", "Français", "Italiano"], ... }
'use strict';
(function ()
{
  const LANGS = { es: 'Español', en: 'English', pt: 'Português', fr: 'Français', it: 'Italiano' };
  const IDX = { en: 0, pt: 1, fr: 2, it: 3 };
  const KEY = 'rf_lang';

  function autoLang ()
  {
    const list = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'es']);
    for (const l of list) { const c = String (l).slice (0, 2).toLowerCase(); if (LANGS[c]) return c; }
    return 'en';
  }
  // Sin idioma elegido: quien ya usaba la app sigue en español; una instalación nueva toma el idioma del equipo
  function getPref ()
  {
    try
    {
      const v = localStorage.getItem (KEY); if (v) return v;
      let old = false; for (let i = 0; i < localStorage.length; ++i) { const k = localStorage.key (i); if (k && /^rf/i.test (k)) { old = true; break; } }
      const p = old ? 'es' : 'auto'; localStorage.setItem (KEY, p); return p;
    }
    catch { return 'auto'; }
  }
  let pref = getPref();
  let lang = pref === 'auto' ? autoLang() : (LANGS[pref] ? pref : 'es');

  // ------------------------------------------------------------ normalizar: numeros y «…» son variables
  const NUM = /\d+(?:[.,:]\d+)*/g;
  const QUOTE = /«[^«»]*»|“[^“”]*”/g;
  function norm (t)
  {
    return String (t).replace (/\s+/g, ' ').trim().replace (QUOTE, '«{q}»').replace (NUM, '{#}');
  }
  let MAP = null, WILD = [];
  function build ()
  {
    MAP = new Map(); WILD = [];
    const D = window.RF_I18N || {};
    for (const k of Object.keys (D))
    {
      const nk = norm (k);
      if (nk.includes ('{*}'))
      {
        // comodines: solo si el texto fijo es suficientemente largo (si no, "{*}de {*}" atraparía cualquier frase)
        const lits = nk.split ('{*}').map (x => x.replace (/«\{q\}»|\{#\}|[^A-Za-zÁÉÍÓÚÑáéíóúñü]/g, ''));
        if (lits.join ('').length < 8 || Math.max (...lits.map (x => x.length)) < 4) continue;
        const re = new RegExp ('^' + nk.split ('{*}').map (s => s.replace (/[.*+?^${}()|[\]\\]/g, '\\$&').replace (/\\\{#\\\}/g, '(\\d+(?:[.,:]\\d+)*)').replace (/«\\\{q\\\}»/g, '(«[^«»]*»|“[^“”]*”)')).join ('(.+?)') + '$');
        WILD.push ([re, D[k]]);
      }
      else MAP.set (nk, D[k]);
    }
  }
  function fill (tpl, nums, quotes)
  {
    let i = 0, j = 0;
    // lo que va entre comillas tambien se traduce si es un texto de la app (ej: «🎛 Programa: ventana de funciones»)
    const tq = (q) => { if (!q) return ''; const o = q[0], c = q[q.length - 1], inner = q.slice (1, -1); const t = tr (inner); return o + t + c; };
    return tpl.replace (/«\{q\}»|\{#\}/g, (m) => m === '{#}' ? (nums[i++] ?? '') : tq (quotes[j++]));
  }
  function tr (text)
  {
    if (lang === 'es' || text == null) return text;
    const s = String (text);
    if (!/[A-Za-zÁÉÍÓÚÑáéíóúñ¿¡]/.test (s)) return s;
    if (!MAP) build();
    const lead = s.match (/^\s*/)[0], tail = s.match (/\s*$/)[0];
    const core = s.trim().replace (/\s+/g, ' ');
    const quotes = core.match (QUOTE) || [];
    const nums = core.replace (QUOTE, '«{q}»').match (NUM) || [];
    const row = MAP.get (norm (core));
    if (row) { const t = row[IDX[lang]]; return t ? lead + fill (t, nums, quotes) + tail : s; }
    for (const [re, rowW] of WILD)
    {
      const m = core.match (re);
      if (m) { const t = rowW[IDX[lang]]; if (!t) return s; let k = 1; return lead + t.replace (/\{\*\}|«\{q\}»|\{#\}/g, () => m[k++] ?? '') + tail; }
    }
    // texto con varias lineas: se traduce linea por linea
    if (s.includes ('\n')) { const parts = s.split ('\n'); if (parts.length > 1) return parts.map (p => p.trim() ? tr (p) : p).join ('\n'); }
    return s;
  }

  // ------------------------------------------------------------ aplicar a la pagina
  const ATTRS = ['placeholder', 'title', 'aria-label', 'alt'];
  const SKIP = new Set (['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE']);
  const orig = new WeakMap();   // nodo -> { src: texto original en español, out: lo que pusimos }
  function doText (n)
  {
    const p = n.parentNode; if (!p || SKIP.has (p.nodeName) || (p.closest && p.closest ('[data-noi18n],[contenteditable="true"]'))) return;
    const cur = n.nodeValue; let rec = orig.get (n);
    if (!rec || cur !== rec.out) { rec = { src: cur, out: cur }; orig.set (n, rec); }
    const out = tr (rec.src);
    if (out !== cur) { rec.out = out; n.nodeValue = out; } else rec.out = cur;
  }
  const attrOrig = new WeakMap();
  function doAttrs (el)
  {
    if (el.closest && el.closest ('[data-noi18n]')) return;
    let m = attrOrig.get (el); if (!m) { m = {}; attrOrig.set (el, m); }
    for (const a of ATTRS)
    {
      if (!el.hasAttribute || !el.hasAttribute (a)) continue;
      const cur = el.getAttribute (a); let rec = m[a];
      if (!rec || cur !== rec.out) rec = m[a] = { src: cur, out: cur };
      const out = tr (rec.src);
      if (out !== cur) { rec.out = out; el.setAttribute (a, out); }
    }
    if (el.tagName === 'INPUT' && (el.type === 'button' || el.type === 'submit') && el.value)
    {
      const rec = m.value && el.value === m.value.out ? m.value : (m.value = { src: el.value, out: el.value });
      const out = tr (rec.src); if (out !== el.value) { rec.out = out; el.value = out; }
    }
  }
  function walk (root)
  {
    if (!root) return;
    if (root.nodeType === 3) return doText (root);
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1) { if (SKIP.has (root.nodeName)) return; doAttrs (root); }
    const tw = document.createTreeWalker (root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let n; while ((n = tw.nextNode())) { if (n.nodeType === 3) doText (n); else if (!SKIP.has (n.nodeName)) doAttrs (n); }
  }
  let busy = false;
  const mo = new MutationObserver ((list) =>
  {
    if (busy || lang === 'es') return;
    busy = true;
    try
    {
      for (const r of list)
      {
        if (r.type === 'characterData') doText (r.target);
        else if (r.type === 'attributes') doAttrs (r.target);
        else for (const n of r.addedNodes) walk (n);
      }
    }
    finally { busy = false; }
  });
  function start ()
  {
    if (lang !== 'es') walk (document.documentElement);
    document.documentElement.lang = lang;
    mo.observe (document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS.concat (['value']) });
    if (document.title) document.title = tr (document.title);
  }

  // avisos del navegador
  const _alert = window.alert.bind (window), _confirm = window.confirm.bind (window), _prompt = window.prompt.bind (window);
  window.alert = (m) => _alert (tr (m));
  window.confirm = (m) => _confirm (tr (m));
  window.prompt = (m, d) => _prompt (tr (m), d);

  // ------------------------------------------------------------ API
  window.rfT = tr;
  window.rfI18n = {
    langs: LANGS,
    get lang () { return lang; },
    get pref () { return pref; },
    norm,
    set (p)
    {
      pref = LANGS[p] || p === 'auto' ? p : 'auto';
      try { localStorage.setItem (KEY, pref); } catch {}
      location.reload();   // lo mas seguro: todo se vuelve a dibujar en el idioma nuevo
    },
    // selector listo para poner en Ajustes
    picker ()
    {
      const sel = document.createElement ('select'); sel.setAttribute ('data-noi18n', '');
      const o0 = document.createElement ('option'); o0.value = 'auto'; o0.textContent = { es: 'Automático', en: 'Automatic', pt: 'Automático', fr: 'Automatique', it: 'Automatico' }[lang] + ' (' + LANGS[autoLang()] + ')'; sel.appendChild (o0);
      for (const [k, v] of Object.entries (LANGS)) { const o = document.createElement ('option'); o.value = k; o.textContent = v; sel.appendChild (o); }
      sel.value = pref; sel.onchange = () => window.rfI18n.set (sel.value);
      return sel;
    }
  };
  if (document.readyState === 'loading') document.addEventListener ('DOMContentLoaded', start); else start();
})();
