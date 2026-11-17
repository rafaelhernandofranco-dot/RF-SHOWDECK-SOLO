// RF Audio Pro — biblioteca de imágenes para las teclas (RF ShowKeys Full y Solo)
// Escenas ilustradas propias en SVG que llenan toda la tecla: luz, sombras, brillos y ambiente.
// Nítidas a cualquier tamaño y livianas. El nombre de la tecla va encima, abajo.
'use strict';
(function ()
{
  const CATS = {
    audio:  { n: { es: 'Audio',   en: 'Audio',   pt: 'Áudio',    fr: 'Audio',     it: 'Audio' } },
    video:  { n: { es: 'Video',   en: 'Video',   pt: 'Vídeo',    fr: 'Vidéo',     it: 'Video' } },
    luces:  { n: { es: 'Luces',   en: 'Lights',  pt: 'Luzes',    fr: 'Lumières',  it: 'Luci' } },
    evento: { n: { es: 'Evento',  en: 'Event',   pt: 'Evento',   fr: 'Événement', it: 'Evento' } },
    control:{ n: { es: 'Control', en: 'Control', pt: 'Controle', fr: 'Contrôle',  it: 'Controllo' } }
  };

  // ------------------------------------------------------------------ piezas reutilizables
  // numeros "al azar" pero siempre iguales (cada imagen sale idéntica en todos lados)
  function rnd (seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  const G = {
    // degradado vertical de fondo
    bg: (a, b, id = 'bg') => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`,
    // brillo redondo
    glow: (id, c, o = 1) => `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${o}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`,
    // haz de luz que se desvanece
    beam: (id, c, o = .55) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity="${o}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient>`,
    metal: (id = 'metal') => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5b6372"/><stop offset=".35" stop-color="#e9eef5"/><stop offset=".55" stop-color="#9aa3b2"/><stop offset="1" stop-color="#3a404b"/></linearGradient>`,
    black: (id = 'blk') => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a3f48"/><stop offset=".5" stop-color="#1b1e24"/><stop offset="1" stop-color="#0a0b0e"/></linearGradient>`,
    cone: (id = 'cone') => `<radialGradient id="${id}" cx=".45" cy=".4"><stop offset="0" stop-color="#4a505b"/><stop offset=".55" stop-color="#16181d"/><stop offset=".8" stop-color="#2a2e36"/><stop offset="1" stop-color="#08090b"/></radialGradient>`
  };
  const beamPoly = (x, top, w, spread, id) => `<path d="M${x - w} ${top}L${x + w} ${top}L${x + spread} 112L${x - spread} 112z" fill="url(#${id})"/>`;
  const confetti = (seed, cols, n = 70) => { const r = rnd (seed); let o = ''; for (let i = 0; i < n; ++i) { const x = r() * 100, y = r() * 100, w = 1.5 + r() * 2.5, h = 1 + r() * 2, a = r() * 180; o += `<rect x="${x.toFixed (1)}" y="${y.toFixed (1)}" width="${w.toFixed (1)}" height="${h.toFixed (1)}" fill="${cols[i % cols.length]}" transform="rotate(${a.toFixed (0)} ${x.toFixed (1)} ${y.toFixed (1)})" opacity="${(.6 + r() * .4).toFixed (2)}"/>`; } return o; };
  const bokeh = (seed, c, n = 18) => { const r = rnd (seed); let o = ''; for (let i = 0; i < n; ++i) o += `<circle cx="${(r() * 100).toFixed (1)}" cy="${(r() * 100).toFixed (1)}" r="${(1 + r() * 6).toFixed (1)}" fill="${c}" opacity="${(.08 + r() * .25).toFixed (2)}"/>`; return o; };
  const stars = (seed, n = 30) => { const r = rnd (seed); let o = ''; for (let i = 0; i < n; ++i) o += `<circle cx="${(r() * 100).toFixed (1)}" cy="${(r() * 70).toFixed (1)}" r="${(.3 + r() * .8).toFixed (2)}" fill="#fff" opacity="${(.3 + r() * .7).toFixed (2)}"/>`; return o; };
  const floor = (c = '#000') => `<rect y="78" width="100" height="22" fill="${c}" opacity=".45"/>`;
  const spotBg = (c1, c2, glowC) => G.bg (c1, c2) + G.glow ('sp', glowC, .55);
  const SPOT = `<rect width="100" height="100" fill="url(#bg)"/><ellipse cx="50" cy="40" rx="48" ry="44" fill="url(#sp)"/>`;
  const wrap = (defs, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs>${body}</svg>`;

  // objetos
  const micStudio = (x = 50, y = 18, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
      <rect x="-12" y="0" width="24" height="44" rx="12" fill="url(#metal)"/>
      <g stroke="#2a2f38" stroke-width=".8" opacity=".7">${Array.from ({ length: 9 }, (_, i) => `<path d="M-11 ${6 + i * 4}h22"/>`).join ('')}</g>
      <rect x="-12" y="0" width="24" height="44" rx="12" fill="none" stroke="#fff" stroke-opacity=".35"/>
      <path d="M-20 30a20 20 0 0 0 40 0" fill="none" stroke="url(#metal)" stroke-width="3"/>
      <path d="M0 50v18M-12 70h24" stroke="url(#metal)" stroke-width="3.5" stroke-linecap="round"/></g>`;
  const micHand = (x = 50, y = 14, s = 1, rot = -18) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
      <circle cx="0" cy="12" r="13" fill="url(#metal)"/>
      <g stroke="#2a2f38" stroke-width=".7" opacity=".55">${Array.from ({ length: 6 }, (_, i) => `<path d="M-12 ${4 + i * 3.4}h24"/>`).join ('')}${Array.from ({ length: 6 }, (_, i) => `<path d="M${-9 + i * 3.6} 0v24"/>`).join ('')}</g>
      <path d="M-9 24l5 52h8l5-52z" fill="url(#blk)"/><rect x="-6" y="40" width="12" height="3" fill="#5cc8ff" opacity=".8"/></g>`;
  const speaker = (x, y, w, h) => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="url(#blk)" stroke="#000" stroke-width="1"/>
      <circle cx="${x + w / 2}" cy="${y + h * .25}" r="${w * .16}" fill="url(#cone)" stroke="#555" stroke-width=".6"/>
      <circle cx="${x + w / 2}" cy="${y + h * .64}" r="${w * .34}" fill="url(#cone)" stroke="#555" stroke-width=".8"/>
      <circle cx="${x + w / 2}" cy="${y + h * .64}" r="${w * .1}" fill="#20232a" stroke="#666" stroke-width=".5"/></g>`;

  // ------------------------------------------------------------------ las imágenes
  // [id, categoria, 'es|en|pt|fr|it', () => svg]
  const L = [
    // ================================================================ AUDIO
    ['mic', 'audio', 'Micrófono|Microphone|Microfone|Micro|Microfono', () => wrap (
      spotBg ('#0d2236', '#04080e', '#3d8bd6') + G.metal() + G.black(),
      SPOT + bokeh (3, '#7fb8ff') + micStudio (50, 16, 1.05) + floor())],
    ['mic-mano', 'audio', 'Micrófono inalámbrico|Wireless mic|Microfone sem fio|Micro sans fil|Radiomicrofono', () => wrap (
      spotBg ('#1a1030', '#05030b', '#a35cff') + G.metal() + G.black(),
      SPOT + bokeh (5, '#d0a0ff') + micHand (52, 12, 1.1) + floor())],
    ['voz', 'audio', 'Voz / anuncio|Voice / announcement|Voz / anúncio|Voix / annonce|Voce / annuncio', () => wrap (
      spotBg ('#2a0f12', '#080304', '#ff6a3d') + G.metal() + G.black(),
      SPOT + `<g fill="none" stroke="#ffb08a" stroke-linecap="round" opacity=".75"><path d="M66 30a16 16 0 0 1 0 26" stroke-width="2.5"/><path d="M73 22a28 28 0 0 1 0 42" stroke-width="2" opacity=".7"/><path d="M80 14a40 40 0 0 1 0 58" stroke-width="1.5" opacity=".45"/></g>` + micHand (40, 14, 1, -10) + floor())],
    ['audifonos', 'audio', 'Audífonos|Headphones|Fones de ouvido|Casque|Cuffie', () => wrap (
      spotBg ('#0b2a2a', '#020909', '#2ad1c1') + G.metal() + G.black(),
      SPOT + bokeh (7, '#7ff5e8') + `<path d="M22 60V48a28 28 0 0 1 56 0v12" fill="none" stroke="url(#metal)" stroke-width="5" stroke-linecap="round"/>
        <rect x="14" y="52" width="18" height="30" rx="8" fill="url(#blk)" stroke="#555"/><rect x="68" y="52" width="18" height="30" rx="8" fill="url(#blk)" stroke="#555"/>
        <rect x="27" y="55" width="6" height="24" rx="3" fill="#2ad1c1" opacity=".6"/><rect x="67" y="55" width="6" height="24" rx="3" fill="#2ad1c1" opacity=".6"/>` + floor())],
    ['in-ear', 'audio', 'In-ear (IEM)|In-ear monitors|In-ear (IEM)|Ear monitors|In-ear (IEM)', () => wrap (
      spotBg ('#151a2b', '#04050a', '#5c7cff') + G.metal() + G.black(),
      SPOT + `<path d="M34 40c0 22 16 22 16 42M66 40c0 22-16 22-16 42" fill="none" stroke="#c9d3e6" stroke-width="1.6"/>
        <g transform="translate(34 32)"><ellipse rx="10" ry="8" fill="url(#blk)" stroke="#6f7c96"/><ellipse cx="-2" cy="-1" rx="5" ry="3.5" fill="#5c7cff" opacity=".7"/></g>
        <g transform="translate(66 32)"><ellipse rx="10" ry="8" fill="url(#blk)" stroke="#6f7c96"/><ellipse cx="2" cy="-1" rx="5" ry="3.5" fill="#ff5c7c" opacity=".7"/></g>
        <rect x="42" y="80" width="16" height="12" rx="3" fill="url(#blk)" stroke="#6f7c96"/>` + floor())],
    ['monitor', 'audio', 'Monitor de piso|Floor monitor|Monitor de chão|Retour de scène|Monitor da palco', () => wrap (
      G.bg ('#141821', '#050608') + G.beam ('b1', '#fff3c4', .35) + G.black() + G.cone(),
      `<rect width="100" height="100" fill="url(#bg)"/>${beamPoly (50, -5, 4, 34, 'b1')}<rect y="74" width="100" height="26" fill="#1c1a16"/>
        <path d="M14 82l14-34h44l14 34z" fill="url(#blk)" stroke="#000"/><path d="M28 48h44l14 34" fill="none" stroke="#fff" stroke-opacity=".12"/>
        <circle cx="50" cy="67" r="12" fill="url(#cone)" stroke="#555"/><circle cx="50" cy="54" r="4" fill="url(#cone)"/>`)],
    ['bocina', 'audio', 'Bocina (PA)|Speaker (PA)|Caixa de som (PA)|Enceinte (façade)|Cassa (PA)', () => wrap (
      spotBg ('#1b1f2a', '#050608', '#ffffff') + G.black() + G.cone(),
      SPOT + speaker (30, 8, 40, 72) + `<path d="M36 82h28v6H36z" fill="#0a0b0e"/>` + floor())],
    ['line-array', 'audio', 'Line array|Line array|Line array|Line array|Line array', () => wrap (
      G.bg ('#0f1420', '#030407') + G.black() + G.glow ('sp', '#4d7cff', .4),
      `<rect width="100" height="100" fill="url(#bg)"/><ellipse cx="50" cy="30" rx="50" ry="40" fill="url(#sp)"/><path d="M50 0v8M44 8h12" stroke="#777" stroke-width="1.5"/>` +
        [0, 1, 2, 3, 4, 5].map (i => { const y = 10 + i * 13, w = 46 - i * 1.5, x = 50 - w / 2 + i * 1.2, a = i * 2.5; return `<g transform="rotate(${a} 50 ${y})"><rect x="${x}" y="${y}" width="${w}" height="11" rx="1.5" fill="url(#blk)" stroke="#000"/><rect x="${x + 3}" y="${y + 3}" width="${w - 6}" height="5" fill="#2a2e36"/><path d="M${x + 4} ${y + 5.5}h${w - 8}" stroke="#4d7cff" stroke-opacity=".35"/></g>`; }).join (''))],
    ['sub', 'audio', 'Subwoofer|Subwoofer|Subwoofer|Caisson de basses|Subwoofer', () => wrap (
      spotBg ('#20120a', '#060302', '#ff8a3d') + G.black() + G.cone(),
      SPOT + `<rect x="14" y="16" width="72" height="66" rx="4" fill="url(#blk)" stroke="#000"/><circle cx="50" cy="49" r="27" fill="url(#cone)" stroke="#666" stroke-width="1.2"/><circle cx="50" cy="49" r="10" fill="#1b1d22" stroke="#777"/><g fill="none" stroke="#ff8a3d" opacity=".35"><circle cx="50" cy="49" r="32"/><circle cx="50" cy="49" r="37" opacity=".6"/></g>` + floor())],
    ['consola', 'audio', 'Consola de audio|Mixing console|Mesa de som|Console de mixage|Mixer audio', () => wrap (
      G.bg ('#0d1626', '#030509') + G.glow ('sp', '#3d8bff', .35),
      `<rect width="100" height="100" fill="url(#bg)"/><ellipse cx="50" cy="30" rx="60" ry="40" fill="url(#sp)"/>
        <path d="M2 40L98 40L100 100L0 100z" fill="#1b1f27"/><path d="M2 40h96" stroke="#5c6575"/>` +
        Array.from ({ length: 8 }, (_, i) => { const x = 8 + i * 12, f = 62 + ((i * 37) % 22); return `<circle cx="${x}" cy="47" r="2.6" fill="#8b93a3"/><circle cx="${x}" cy="54" r="2.2" fill="${['#ff5c5c', '#ffd166', '#5cc8ff', '#7ae582'][i % 4]}"/><path d="M${x} 60v34" stroke="#05070a" stroke-width="2.4"/><rect x="${x - 3.5}" y="${f}" width="7" height="5" rx="1" fill="#d9dee7"/><path d="M${x - 3.5} ${f + 2.5}h7" stroke="#333" stroke-width=".6"/>`; }).join (''))],
    ['guitarra', 'audio', 'Guitarra|Guitar|Violão / guitarra|Guitare|Chitarra', () => wrap (
      spotBg ('#2a1508', '#080402', '#ffb347') + `<radialGradient id="wood" cx=".4" cy=".35"><stop offset="0" stop-color="#f3b867"/><stop offset=".6" stop-color="#b8682a"/><stop offset="1" stop-color="#5a2a0c"/></radialGradient>`,
      SPOT + `<g transform="rotate(-32 50 55)"><path d="M47 6h6v42h-6z" fill="#3a2414"/><rect x="45" y="2" width="10" height="9" rx="2" fill="#241509"/>
        <path d="M50 46c-9 0-14 6-12 12 1 4-4 6-6 11-4 10 4 20 18 20s22-10 18-20c-2-5-7-7-6-11 2-6-3-12-12-12z" fill="url(#wood)" stroke="#2a1508"/>
        <circle cx="50" cy="62" r="5" fill="#1a0e06"/><path d="M48 50v34M50 50v34M52 50v34" stroke="#f0e2c8" stroke-width=".35"/><rect x="44" y="76" width="12" height="3" fill="#1a0e06"/></g>` + floor())],
    ['bateria', 'audio', 'Batería|Drums|Bateria|Batterie|Batteria', () => wrap (
      spotBg ('#1d0a14', '#060205', '#ff4d8d') + G.metal() + `<linearGradient id="shell" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a0d1f"/><stop offset=".4" stop-color="#e0294f"/><stop offset="1" stop-color="#3a0814"/></linearGradient>`,
      SPOT + `<ellipse cx="22" cy="30" rx="16" ry="3.5" fill="#d9b44a"/><path d="M22 30v40" stroke="#888"/><ellipse cx="80" cy="34" rx="14" ry="3" fill="#d9b44a"/><path d="M80 34v36" stroke="#888"/>
        <path d="M30 48h40v26c0 5-9 9-20 9s-20-4-20-9z" fill="url(#shell)"/><ellipse cx="50" cy="48" rx="20" ry="6" fill="#f2f2ee" stroke="url(#metal)" stroke-width="1.5"/>
        <path d="M30 54h40M30 70h40" stroke="url(#metal)" stroke-width="1.2"/><path d="M36 20l12 22M66 20L54 42" stroke="#e8d6b0" stroke-width="2.4" stroke-linecap="round"/>` + floor())],
    ['teclado', 'audio', 'Teclado / piano|Keyboard / piano|Teclado / piano|Clavier / piano|Tastiera / piano', () => wrap (
      spotBg ('#101626', '#030407', '#8fb6ff'),
      SPOT + `<path d="M4 42h92l4 30H0z" fill="#16181d"/><path d="M2 58h96v24H2z" fill="#eef1f6"/>` +
        Array.from ({ length: 14 }, (_, i) => `<path d="M${2 + i * 6.86} 58v24" stroke="#9aa3b2" stroke-width=".5"/>`).join ('') +
        [0, 1, 3, 4, 5, 7, 8, 10, 11, 12].map (i => `<rect x="${6.5 + i * 6.86}" y="58" width="4" height="14" rx=".6" fill="#111"/>`).join ('') +
        `<circle cx="14" cy="50" r="2" fill="#5cc8ff"/><circle cx="22" cy="50" r="2" fill="#ffd166"/><rect x="60" y="47" width="28" height="6" rx="1" fill="#0c3a55"/>` + floor())],
    ['musica', 'audio', 'Música|Music|Música|Musique|Musica', () => wrap (
      G.bg ('#2b0f4d', '#0a0418') + G.glow ('sp', '#ff5cd6', .45),
      `<rect width="100" height="100" fill="url(#bg)"/><ellipse cx="50" cy="45" rx="50" ry="45" fill="url(#sp)"/>${bokeh (11, '#ffb8f0', 26)}
        <g fill="#fff" filter="drop-shadow(0 0 3px #ff5cd6)"><path d="M38 66V24l36-8v44" fill="none" stroke="#fff" stroke-width="4"/><circle cx="31" cy="66" r="9"/><circle cx="67" cy="60" r="9"/></g>`)],
    ['onda', 'audio', 'Onda de audio|Audio waveform|Forma de onda|Forme d’onde|Forma d’onda', () => wrap (
      G.bg ('#06222b', '#010708'),
      `<rect width="100" height="100" fill="url(#bg)"/>` + Array.from ({ length: 48 }, (_, i) => { const x = 2 + i * 2.05, h = 6 + Math.abs (Math.sin (i * .55) * Math.cos (i * .17)) * 70; return `<rect x="${x.toFixed (1)}" y="${(48 - h / 2).toFixed (1)}" width="1.3" height="${h.toFixed (1)}" rx=".6" fill="#2ee6c8" opacity="${(.45 + h / 140).toFixed (2)}"/>`; }).join ('') + `<rect y="47.5" width="100" height="1" fill="#fff" opacity=".25"/>`)],
    ['efecto', 'audio', 'Efecto de sonido|Sound effect|Efeito sonoro|Effet sonore|Effetto sonoro', () => wrap (
      G.bg ('#2a1a00', '#070400') + G.glow ('sp', '#ffd166', .6),
      `<rect width="100" height="100" fill="url(#bg)"/><circle cx="50" cy="44" r="40" fill="url(#sp)"/>${Array.from ({ length: 12 }, (_, i) => `<path d="M50 44L${(50 + 60 * Math.cos (i * Math.PI / 6)).toFixed (1)} ${(44 + 60 * Math.sin (i * Math.PI / 6)).toFixed (1)}" stroke="#ffd166" stroke-width="1.2" opacity=".35"/>`).join ('')}
        <path d="M50 22l6 14 15 1-11 10 4 15-14-8-14 8 4-15-11-10 15-1z" fill="#fff4cc" stroke="#ffd166"/>`)],

    // ================================================================ VIDEO
    ['camara', 'video', 'Cámara de video|Video camera|Câmera de vídeo|Caméra|Videocamera', () => wrap (
      spotBg ('#1a1426', '#050308', '#b28cff') + G.black() + G.cone(),
      SPOT + `<rect x="18" y="34" width="50" height="30" rx="4" fill="url(#blk)" stroke="#000"/><circle cx="72" cy="49" r="11" fill="url(#cone)" stroke="#888"/><circle cx="72" cy="49" r="5" fill="#120f1a"/><circle cx="70" cy="47" r="1.6" fill="#b28cff" opacity=".9"/>
        <rect x="24" y="26" width="18" height="8" rx="2" fill="#2a2e36"/><circle cx="26" cy="40" r="2" fill="#ff4d4d"/><path d="M43 64l-8 22M43 64v22M43 64l8 22" stroke="#555" stroke-width="2"/>` + floor())],
    ['proyector', 'video', 'Proyector|Projector|Projetor|Projecteur|Proiettore', () => wrap (
      G.bg ('#0b0f1c', '#020307') + G.beam ('b1', '#c6dcff', .45) + G.black() + G.cone(),
      `<rect width="100" height="100" fill="url(#bg)"/><path d="M60 58L100 10V100z" fill="url(#b1)" transform="rotate(0)"/>
        <rect x="8" y="50" width="56" height="20" rx="4" fill="url(#blk)" stroke="#000"/><circle cx="56" cy="60" r="8" fill="url(#cone)" stroke="#888"/><circle cx="56" cy="60" r="3" fill="#dbe8ff"/><path d="M14 56h22M14 62h14" stroke="#444"/>` + floor())],
    ['pantalla', 'video', 'Pantalla|Screen|Tela|Écran|Schermo', () => wrap (
      G.bg ('#05070d', '#000') + G.glow ('sp', '#5cc8ff', .35) + `<linearGradient id="scr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5cc8ff"/><stop offset=".5" stop-color="#3a4bd6"/><stop offset="1" stop-color="#b84dff"/></linearGradient>`,
      `<rect width="100" height="100" fill="url(#bg)"/><ellipse cx="50" cy="40" rx="55" ry="40" fill="url(#sp)"/><rect x="10" y="14" width="80" height="48" rx="2" fill="url(#scr)"/><rect x="10" y="14" width="80" height="48" rx="2" fill="none" stroke="#000" stroke-width="2"/>
        <path d="M10 14L60 14L30 62H10z" fill="#fff" opacity=".08"/><path d="M50 62v12M34 76h32" stroke="#333" stroke-width="3"/>`)],
    ['video', 'video', 'Video|Video|Vídeo|Vidéo|Video', () => wrap (
      G.bg ('#2a0606', '#0a0101') + G.glow ('sp', '#ff3b3b', .5),
      `<rect width="100" height="100" fill="url(#bg)"/><circle cx="50" cy="44" r="42" fill="url(#sp)"/><rect x="18" y="22" width="64" height="44" rx="12" fill="#ff2d2d"/><rect x="18" y="22" width="64" height="22" rx="12" fill="#fff" opacity=".12"/><path d="M43 33v22l20-11z" fill="#fff"/>`)],
    ['grabar', 'video', 'Grabar (REC)|Record (REC)|Gravar (REC)|Enregistrer (REC)|Registra (REC)', () => wrap (
      G.bg ('#140606', '#050101') + G.glow ('sp', '#ff3b3b', .7),
      `<rect width="100" height="100" fill="url(#bg)"/><circle cx="50" cy="38" r="26" fill="url(#sp)"/><circle cx="50" cy="38" r="13" fill="#ff3030"/><circle cx="46" cy="34" r="4" fill="#fff" opacity=".35"/>
        <text x="50" y="72" text-anchor="middle" font-family="system-ui,Helvetica,Arial,sans-serif" font-weight="800" font-size="16" fill="#fff" letter-spacing="2">REC</text>`)],
    ['envivo', 'video', 'Transmisión en vivo|Live stream|Transmissão ao vivo|Diffusion en direct|Diretta streaming', () => wrap (
      G.bg ('#1a0b2e', '#05020b') + G.glow ('sp', '#ff3b6b', .5),
      `<rect width="100" height="100" fill="url(#bg)"/><circle cx="50" cy="40" r="44" fill="url(#sp)"/><circle cx="50" cy="40" r="6" fill="#fff"/>
        <g fill="none" stroke="#fff" stroke-linecap="round"><path d="M38 28a17 17 0 0 0 0 24M62 28a17 17 0 0 1 0 24" stroke-width="3"/><path d="M29 19a30 30 0 0 0 0 42M71 19a30 30 0 0 1 0 42" stroke-width="2.4" opacity=".6"/></g>
        <rect x="32" y="66" width="36" height="13" rx="6.5" fill="#ff2d55"/><text x="50" y="75.5" text-anchor="middle" font-family="system-ui,Helvetica,Arial,sans-serif" font-weight="800" font-size="9" fill="#fff" letter-spacing="1.5">LIVE</text>`)],
    ['diapositivas', 'video', 'Diapositivas|Slides|Slides|Diapositives|Diapositive', () => wrap (
      G.bg ('#0d1a2e', '#03060b') + `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb26b"/><stop offset="1" stop-color="#7a4bd6"/></linearGradient>`,
      `<rect width="100" height="100" fill="url(#bg)"/><rect x="22" y="12" width="64" height="42" rx="2" fill="#2a3550" opacity=".7"/><rect x="14" y="20" width="64" height="42" rx="2" fill="url(#sky)"/>
        <circle cx="62" cy="32" r="5" fill="#fff4cc"/><path d="M14 62l18-20 12 12 10-8 24 16z" fill="#2a1a4d"/><path d="M46 62v12M32 78h28" stroke="#666" stroke-width="2.5"/>`)],
    ['foto', 'video', 'Fotografía|Photo|Fotografia|Photo|Foto', () => wrap (
      spotBg ('#1a1a1a', '#050505', '#ffffff') + G.black() + G.cone(),
      SPOT + `<path d="M16 34h16l5-8h26l5 8h16v38H16z" fill="url(#blk)" stroke="#000"/><circle cx="50" cy="53" r="14" fill="url(#cone)" stroke="#999"/><circle cx="50" cy="53" r="6" fill="#0d1a2e"/><circle cx="47" cy="50" r="2" fill="#fff" opacity=".8"/><rect x="70" y="38" width="8" height="4" rx="1" fill="#ffd166"/>` + floor())],
    ['streaming', 'video', 'Redes / streaming|Social / streaming|Redes / streaming|Réseaux / streaming|Social / streaming', () => wrap (
      G.bg ('#0b1e3a', '#02060d') + G.glow ('sp', '#5cc8ff', .45) + `<linearGradient id="scr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff5cd6"/><stop offset="1" stop-color="#5c7cff"/></linearGradient>`,
      `<rect width="100" height="100" fill="url(#bg)"/><circle cx="50" cy="45" r="42" fill="url(#sp)"/>${bokeh (21, '#9fdcff', 14)}<rect x="32" y="8" width="36" height="72" rx="7" fill="#111"/><rect x="35" y="14" width="30" height="58" rx="2" fill="url(#scr)"/><path d="M45 34v18l15-9z" fill="#fff"/><path d="M38 64h24" stroke="#fff" stroke-opacity=".7" stroke-width="1.5"/><text x="73" y="22" font-family="system-ui" font-size="9" fill="#ff5c7c">♥</text><text x="20" y="40" font-family="system-ui" font-size="7" fill="#ff5c7c" opacity=".8">♥</text>`)],

    // ================================================================ LUCES
    ['escenario', 'luces', 'Escenario / intro show|Stage / show intro|Palco / abertura|Scène / intro|Palco / intro',
      () => wrap (G.bg ('#1a0d2b', '#050208') + G.beam ('b1', '#5c7cff') + G.beam ('b2', '#ff8a3d') + G.beam ('b3', '#ff5cd6'),
        `<rect width="100" height="100" fill="url(#bg)"/>${beamPoly (18, 0, 2, 18, 'b1')}${beamPoly (50, 0, 2, 20, 'b2')}${beamPoly (82, 0, 2, 18, 'b3')}
        <circle cx="18" cy="2" r="3" fill="#dfe6ff"/><circle cx="50" cy="2" r="3" fill="#fff0dd"/><circle cx="82" cy="2" r="3" fill="#ffe0f6"/><rect y="80" width="100" height="20" fill="#0a0610"/><path d="M0 80h100" stroke="#3a2a55"/>`)],
    ['cabeza-movil', 'luces', 'Cabeza móvil|Moving head|Moving head|Lyre asservie|Testa mobile', () => wrap (
      G.bg ('#06101e', '#010306') + `<linearGradient id="bu" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#5cc8ff" stop-opacity=".75"/><stop offset="1" stop-color="#5cc8ff" stop-opacity="0"/></linearGradient>` + G.black() + G.glow ('sp', '#5cc8ff', .35),
      `<rect width="100" height="100" fill="url(#bg)"/><ellipse cx="22" cy="6" rx="30" ry="14" fill="url(#sp)"/><path d="M39 37L49 41L30 -8L-6 2z" fill="url(#bu)"/>
        <rect x="34" y="78" width="32" height="12" rx="2" fill="url(#blk)"/><path d="M32 78V48h6v30M62 78V48h6v30" fill="#23262d"/>
        <g transform="rotate(-25 50 52)"><rect x="37" y="36" width="26" height="32" rx="7" fill="url(#blk)" stroke="#000"/><ellipse cx="50" cy="38" rx="10" ry="3.5" fill="#bdeaff"/></g>`)],
    ['par', 'luces', 'Reflector (PAR)|PAR light|Refletor (PAR)|Projecteur PAR|Faro PAR', () => wrap (
      G.bg ('#200a0a', '#060202') + G.beam ('b1', '#ff3b3b', .55) + G.black(),
      `<rect width="100" height="100" fill="url(#bg)"/><path d="M38 30L-6 110H74z" fill="url(#b1)"/><path d="M62 30L26 110H106z" fill="url(#b1)" opacity=".7"/>
        <rect x="28" y="12" width="20" height="20" rx="3" fill="url(#blk)" transform="rotate(10 38 22)"/><ellipse cx="38" cy="31" rx="9" ry="2.5" fill="#ffb3b3"/>
        <rect x="52" y="12" width="20" height="20" rx="3" fill="url(#blk)" transform="rotate(-10 62 22)"/><ellipse cx="62" cy="31" rx="9" ry="2.5" fill="#ffb3b3"/><path d="M10 10h80" stroke="#444" stroke-width="2"/>`)],
    ['seguidor', 'luces', 'Seguidor|Follow spot|Canhão seguidor|Poursuite|Seguipersone', () => wrap (
      G.bg ('#0d0d14', '#020203') + G.beam ('b1', '#fff6d6', .5) + G.glow ('sp', '#fff6d6', .5),
      `<rect width="100" height="100" fill="url(#bg)"/><path d="M14 20L70 70H96z" fill="url(#b1)"/><ellipse cx="78" cy="82" rx="18" ry="5" fill="url(#sp)"/>
        <path d="M74 50c0-6 3-9 6-9s6 3 6 9v14h-12z" fill="#0a0a0f"/><circle cx="80" cy="38" r="4" fill="#0a0a0f"/><rect x="6" y="14" width="16" height="10" rx="3" fill="#2a2d36" transform="rotate(42 14 19)"/><rect y="84" width="100" height="16" fill="#08080c"/>`)],
    ['estrobo', 'luces', 'Estrobo|Strobe|Estrobo|Stroboscope|Strobo', () => wrap (
      G.bg ('#e8f2ff', '#5c7cff') + G.glow ('sp', '#ffffff', 1),
      `<rect width="100" height="100" fill="url(#bg)"/><circle cx="50" cy="42" r="48" fill="url(#sp)"/><rect x="22" y="30" width="56" height="24" rx="3" fill="#1b1e24"/><rect x="26" y="34" width="48" height="16" rx="2" fill="#ffffff"/>
        <path d="M56 8L44 26h8l-4 12 14-18h-8z" fill="#ffd166" stroke="#c99a1a"/>`)],
    ['humo', 'luces', 'Humo / haze|Haze / fog|Fumaça / haze|Fumée / brouillard|Fumo / haze', () => wrap (
      G.bg ('#141a2b', '#04060a') + G.beam ('b1', '#8fb6ff', .4) + G.glow ('f', '#c9d6ee', .35),
      `<rect width="100" height="100" fill="url(#bg)"/>${beamPoly (30, 0, 2, 22, 'b1')}${beamPoly (70, 0, 2, 22, 'b1')}
        <ellipse cx="25" cy="70" rx="40" ry="18" fill="url(#f)"/><ellipse cx="70" cy="64" rx="45" ry="20" fill="url(#f)"/><ellipse cx="50" cy="82" rx="55" ry="18" fill="url(#f)"/><ellipse cx="40" cy="50" rx="30" ry="12" fill="url(#f)" opacity=".7"/>`)],
    ['laser', 'luces', 'Láser|Laser|Laser|Laser|Laser', () => wrap (
      G.bg ('#04140a', '#000'),
      `<rect width="100" height="100" fill="url(#bg)"/><g stroke-linecap="round">${Array.from ({ length: 11 }, (_, i) => { const a = -70 + i * 14; const x = 50 + 120 * Math.sin (a * Math.PI / 180), y = 88 - 120 * Math.cos (a * Math.PI / 180); return `<path d="M50 88L${x.toFixed (1)} ${y.toFixed (1)}" stroke="${i % 3 === 0 ? '#ff2d55' : '#2dff7a'}" stroke-width="1" opacity=".9"/><path d="M50 88L${x.toFixed (1)} ${y.toFixed (1)}" stroke="${i % 3 === 0 ? '#ff2d55' : '#2dff7a'}" stroke-width="3" opacity=".18"/>`; }).join ('')}</g><rect x="40" y="86" width="20" height="10" rx="2" fill="#1b1e24"/><circle cx="50" cy="88" r="2" fill="#fff"/>`)],
    ['color', 'luces', 'Color / wash|Color wash|Cor / wash|Couleur / wash|Colore / wash', () => wrap (
      G.bg ('#0a0a12', '#000') + G.glow ('r', '#ff2d55', .95) + G.glow ('g', '#2dff7a', .95) + G.glow ('b', '#2d6bff', .95),
      `<rect width="100" height="100" fill="url(#bg)"/><g style="mix-blend-mode:screen"><circle cx="36" cy="38" r="34" fill="url(#r)"/><circle cx="64" cy="38" r="34" fill="url(#g)"/><circle cx="50" cy="62" r="34" fill="url(#b)"/></g>`)],
    ['luz-sala', 'luces', 'Luz de sala|House lights|Luz da plateia|Lumière de salle|Luci di sala', () => wrap (
      G.bg ('#2a1f0d', '#0a0703') + G.glow ('sp', '#ffd98a', .8),
      `<rect width="100" height="100" fill="url(#bg)"/><circle cx="50" cy="40" r="40" fill="url(#sp)"/><path d="M50 0v10" stroke="#555" stroke-width="1.5"/>
        <path d="M40 10h20l6 10H34z" fill="#2a2d36"/><path d="M40 52c-8-6-12-13-12-21a22 22 0 0 1 44 0c0 8-4 15-12 21v6H40z" fill="#fff4d0" opacity=".95"/><path d="M42 60h16M43 64h14" stroke="#9aa3b2" stroke-width="2.5"/>`)],
    ['blackout', 'luces', 'Blackout|Blackout|Blackout|Blackout|Blackout', () => wrap (
      G.bg ('#05060a', '#000'),
      `<rect width="100" height="100" fill="url(#bg)"/>${stars (31, 22)}<path d="M40 52c-8-6-12-13-12-21a22 22 0 0 1 44 0c0 8-4 15-12 21v6H40z" fill="#1b1e24" stroke="#3a3f48"/><path d="M42 60h16M43 64h14" stroke="#3a3f48" stroke-width="2.5"/><path d="M20 14l60 66" stroke="#ff4d4d" stroke-width="4" stroke-linecap="round"/>`)],
    ['consola-luces', 'luces', 'Consola de luces (DMX)|Lighting console (DMX)|Mesa de luz (DMX)|Console lumière (DMX)|Console luci (DMX)', () => wrap (
      G.bg ('#1e1406', '#050301') + G.glow ('sp', '#ffae1a', .35),
      `<rect width="100" height="100" fill="url(#bg)"/><ellipse cx="50" cy="20" rx="60" ry="30" fill="url(#sp)"/><path d="M0 34h100v66H0z" fill="#17191e"/><rect x="6" y="38" width="40" height="18" rx="1" fill="#0d2a3a"/><path d="M8 50l8-6 6 4 8-8 6 6 8-4" stroke="#5cc8ff" fill="none"/>
        ${[54, 66, 78, 90].map ((x, i) => `<circle cx="${x}" cy="46" r="4.2" fill="#3a3f48" stroke="#777"/><path d="M${x} 46l2-3" stroke="#fff"/>`).join ('')}
        ${Array.from ({ length: 10 }, (_, i) => { const x = 7 + i * 9.4, f = 70 + ((i * 29) % 18); return `<path d="M${x} 64v30" stroke="#05070a" stroke-width="2.2"/><rect x="${x - 3}" y="${f}" width="6" height="4" rx="1" fill="#e6e9ef"/><circle cx="${x}" cy="60" r="1.5" fill="${['#ffae1a', '#ff5c5c', '#7ae582'][i % 3]}"/>`; }).join ('')}`)],

    // ================================================================ EVENTO
    ['iglesia', 'evento', 'Iglesia|Church|Igreja|Église|Chiesa', () => wrap (
      G.bg ('#ff9d5c', '#5a2a6b') + G.glow ('sun', '#fff1c4', .9),
      `<rect width="100" height="100" fill="url(#bg)"/><circle cx="50" cy="66" r="34" fill="url(#sun)"/><rect y="78" width="100" height="22" fill="#2a1438"/>
        <path d="M50 6v12M44 12h12" stroke="#1a0b24" stroke-width="2.6"/><path d="M30 46l20-26 20 26v34H30z" fill="#1a0b24"/><path d="M14 80V56l16-10v34zM86 80V56l-16-10v34z" fill="#24102f"/><path d="M44 80V64a6 6 0 0 1 12 0v16" fill="#ffcf8a"/><circle cx="50" cy="44" r="4" fill="#ffcf8a"/>`)],
    ['pulpito', 'evento', 'Púlpito / atril|Pulpit / lectern|Púlpito|Pupitre|Leggio', () => wrap (
      spotBg ('#1e140a', '#060402', '#ffd28a') + `<linearGradient id="wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a2f12"/><stop offset=".45" stop-color="#b8743a"/><stop offset="1" stop-color="#3a1e0a"/></linearGradient>` + G.metal(),
      SPOT + `<path d="M60 30c0-10 4-14 10-16" fill="none" stroke="url(#metal)" stroke-width="1.6"/><rect x="66" y="10" width="8" height="7" rx="3" fill="#222"/>
        <path d="M24 38l8-10h36l8 10z" fill="#6b3a16"/><path d="M28 38h44l-6 44H34z" fill="url(#wood)"/><path d="M38 50h24M38 66h24" stroke="#2a1508" opacity=".5"/><path d="M42 54l8 6 8-6" fill="none" stroke="#e8c48a" stroke-width="1.5" opacity=".7"/>` + floor())],
    ['boda', 'evento', 'Boda|Wedding|Casamento|Mariage|Matrimonio', () => wrap (
      G.bg ('#3a2433', '#120a10') + G.glow ('sp', '#ffd6e8', .5) + `<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".5" stop-color="#e0b04a"/><stop offset="1" stop-color="#8a5a12"/></linearGradient>`,
      `<rect width="100" height="100" fill="url(#bg)"/><circle cx="50" cy="48" r="44" fill="url(#sp)"/>${bokeh (41, '#ffd6e8', 22)}
        <circle cx="40" cy="56" r="16" fill="none" stroke="url(#gold)" stroke-width="5"/><circle cx="60" cy="56" r="16" fill="none" stroke="url(#gold)" stroke-width="5"/><path d="M53 26l7-7 7 7-7 9z" fill="#eaf6ff" stroke="#9fd6ff"/><circle cx="58" cy="22" r="1.2" fill="#fff"/>`)],
    ['cumple', 'evento', 'Cumpleaños|Birthday|Aniversário|Anniversaire|Compleanno', () => wrap (
      G.bg ('#d9a21a', '#7a4a06'),
      `<rect width="100" height="100" fill="url(#bg)"/>${confetti (51, ['#ff3b6b', '#2ec4ff', '#7ae582', '#ffffff', '#b84dff', '#ff8a3d'], 80)}`)],
    ['fiesta', 'evento', 'Celebración / aplausos|Celebration / applause|Celebração / aplausos|Fête / applaudissements|Festa / applausi', () => wrap (
      G.bg ('#2a0b3d', '#08020f') + G.glow ('sp', '#ff5cd6', .4),
      `<rect width="100" height="100" fill="url(#bg)"/><circle cx="50" cy="40" r="46" fill="url(#sp)"/>${confetti (61, ['#ffd166', '#2ec4ff', '#ff3b6b', '#7ae582', '#ffffff'], 60)}
        ${[[24, 30, 10], [72, 24, 8], [56, 58, 12], [30, 66, 7]].map (([x, y, r]) => Array.from ({ length: 10 }, (_, i) => `<path d="M${x} ${y}L${(x + r * Math.cos (i * .628)).toFixed (1)} ${(y + r * Math.sin (i * .628)).toFixed (1)}" stroke="${['#ffd166', '#ff5cd6', '#5cc8ff'][i % 3]}" stroke-width="1.2" stroke-linecap="round"/>`).join ('')).join ('')}`)],
    ['adoracion', 'evento', 'Adoración|Worship|Adoração|Louange|Adorazione', () => wrap (
      G.bg ('#1a0f2e', '#05030a') + G.beam ('b1', '#ffe8b0', .55) + G.glow ('sp', '#ffe8b0', .45),
      `<rect width="100" height="100" fill="url(#bg)"/><path d="M42 0h16L80 100H20z" fill="url(#b1)"/><circle cx="50" cy="20" r="30" fill="url(#sp)"/>${bokeh (71, '#ffe8b0', 16)}
        <path d="M18 100V84c0-6 4-9 8-9s8 3 8 9v16M40 100V80c0-6 4-9 8-9s8 3 8 9v20M64 100V84c0-6 4-9 8-9s8 3 8 9v16" fill="#05030a"/><path d="M28 78l-4-22M50 74l2-26M74 78l5-22" stroke="#05030a" stroke-width="4" stroke-linecap="round"/>`)],
    ['receso', 'evento', 'Receso / café|Break / coffee|Intervalo / café|Pause café|Pausa caffè', () => wrap (
      G.bg ('#3a2414', '#120a05') + G.glow ('sp', '#ffcf8a', .45),
      `<rect width="100" height="100" fill="url(#bg)"/><circle cx="50" cy="46" r="42" fill="url(#sp)"/><ellipse cx="46" cy="80" rx="34" ry="6" fill="#1a0f07"/>
        <path d="M22 44h48v18a22 22 0 0 1-22 22h-4a22 22 0 0 1-22-22z" fill="#f4efe8"/><ellipse cx="46" cy="44" rx="24" ry="5" fill="#5a2f12"/><path d="M70 50h5a9 9 0 0 1 0 18h-7" fill="none" stroke="#f4efe8" stroke-width="4"/>
        <path d="M36 34c-4-6 4-8 0-15M48 34c-4-6 4-8 0-15M60 34c-4-6 4-8 0-15" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".55"/>`)],
    ['bienvenida', 'evento', 'Bienvenida|Welcome|Boas-vindas|Bienvenue|Benvenuto', () => wrap (
      G.bg ('#0b1e3a', '#030810') + G.glow ('sp', '#ffd98a', .8),
      `<rect width="100" height="100" fill="url(#bg)"/>${stars (81, 26)}<rect x="30" y="18" width="40" height="66" fill="#ffdfa0"/><circle cx="50" cy="52" r="34" fill="url(#sp)"/><path d="M30 18l24 6v66l-24-6z" fill="#3a2414"/><circle cx="50" cy="56" r="2" fill="#e0b04a"/><path d="M0 84h100v16H0z" fill="#0a1424"/><path d="M30 84L4 100h66L70 84z" fill="#ffdfa0" opacity=".25"/>`)],
    ['reloj', 'evento', 'Reloj / tiempo|Clock / timer|Relógio / tempo|Horloge / minuteur|Orologio / timer', () => wrap (
      spotBg ('#0d1d2a', '#030709', '#5cc8ff') + G.metal(),
      SPOT + `<circle cx="50" cy="50" r="30" fill="#f4f7fb" stroke="url(#metal)" stroke-width="5"/>${Array.from ({ length: 12 }, (_, i) => `<path d="M${(50 + 24 * Math.cos (i * .5236)).toFixed (1)} ${(50 + 24 * Math.sin (i * .5236)).toFixed (1)}L${(50 + 27 * Math.cos (i * .5236)).toFixed (1)} ${(50 + 27 * Math.sin (i * .5236)).toFixed (1)}" stroke="#222" stroke-width="${i % 3 ? 1 : 2}"/>`).join ('')}
        <path d="M50 50V30M50 50l12 8" stroke="#111" stroke-width="2.6" stroke-linecap="round"/><path d="M50 50l-6 16" stroke="#e5484d" stroke-width="1.2"/><circle cx="50" cy="50" r="2.4" fill="#e5484d"/>`)],
    ['salida', 'evento', 'Salida / fin|Exit / end|Saída / fim|Sortie / fin|Uscita / fine', () => wrap (
      G.bg ('#06140a', '#010402') + G.glow ('sp', '#2dff7a', .45),
      `<rect width="100" height="100" fill="url(#bg)"/><circle cx="50" cy="44" r="40" fill="url(#sp)"/><rect x="14" y="28" width="72" height="32" rx="3" fill="#0aa84a" stroke="#7dffb0"/>
        <text x="50" y="51" text-anchor="middle" font-family="system-ui,Helvetica,Arial,sans-serif" font-weight="800" font-size="16" fill="#fff" letter-spacing="1">EXIT</text><path d="M60 72h16M70 66l6 6-6 6" stroke="#7dffb0" stroke-width="2.5" fill="none" stroke-linecap="round"/>`)],
    ['ofrenda', 'evento', 'Ofrenda|Offering|Oferta|Offrande|Offerta', () => wrap (
      spotBg ('#1e1406', '#060402', '#ffd166') + `<linearGradient id="wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a2f12"/><stop offset=".45" stop-color="#c0803e"/><stop offset="1" stop-color="#3a1e0a"/></linearGradient>`,
      SPOT + `<path d="M14 50h72l-8 30H22z" fill="url(#wood)"/><ellipse cx="50" cy="50" rx="36" ry="6" fill="#2a1508"/><path d="M36 30h28v20H36z" fill="#f4f7fb" transform="rotate(-8 50 40)"/><path d="M44 40h12" stroke="#5cc86a" stroke-width="3" transform="rotate(-8 50 40)"/><circle cx="64" cy="46" r="5" fill="#e0b04a" stroke="#fff3c4"/>` + floor())],
    ['premio', 'evento', 'Premio / trofeo|Award / trophy|Prêmio / troféu|Prix / trophée|Premio / trofeo', () => wrap (
      G.bg ('#2a1f05', '#080601') + G.glow ('sp', '#ffd166', .55) + `<linearGradient id="gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8a5a12"/><stop offset=".4" stop-color="#fff3c4"/><stop offset=".6" stop-color="#e0b04a"/><stop offset="1" stop-color="#6b4108"/></linearGradient>`,
      `<rect width="100" height="100" fill="url(#bg)"/><circle cx="50" cy="40" r="42" fill="url(#sp)"/>${bokeh (91, '#ffe08a', 16)}
        <path d="M34 14h32v20a16 16 0 0 1-32 0z" fill="url(#gold)"/><path d="M34 20H24c0 11 5 16 12 16M66 20h10c0 11-5 16-12 16" fill="none" stroke="url(#gold)" stroke-width="3"/><path d="M47 50h6v12h-6z" fill="url(#gold)"/><path d="M36 64h28v8H36z" fill="#3a2414"/><rect x="40" y="66" width="20" height="4" fill="url(#gold)"/>`)],

    // ================================================================ CONTROL (botones de luz tipo neón)
    ...[['play', 'Reproducir|Play|Tocar|Lecture|Play', '#2dff7a', '<path d="M43 34v32l26-16z" fill="#fff"/>'],
        ['pausa', 'Pausa|Pause|Pausa|Pause|Pausa', '#ffd166', '<path d="M42 35v30M58 35v30" stroke="#fff" stroke-width="8" stroke-linecap="round"/>'],
        ['stop', 'Detener|Stop|Parar|Arrêt|Stop', '#ff3b3b', '<rect x="37" y="37" width="26" height="26" rx="3" fill="#fff"/>'],
        ['siguiente', 'Siguiente|Next|Próximo|Suivant|Successivo', '#5cc8ff', '<path d="M30 36v28l20-14zM50 36v28l20-14z" fill="#fff"/><path d="M72 36v28" stroke="#fff" stroke-width="5" stroke-linecap="round"/>'],
        ['anterior', 'Anterior|Previous|Anterior|Précédent|Precedente', '#5cc8ff', '<path d="M70 36v28L50 50zM50 36v28L30 50z" fill="#fff"/><path d="M28 36v28" stroke="#fff" stroke-width="5" stroke-linecap="round"/>'],
        ['repetir', 'Repetir (loop)|Loop|Repetir (loop)|Boucle|Ripeti (loop)', '#b84dff', '<g fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><path d="M30 46a20 20 0 0 1 34-12l4 4"/><path d="M70 28v12H58"/><path d="M70 54a20 20 0 0 1-34 12l-4-4"/><path d="M30 72V60h12"/></g>'],
        ['ok', 'Listo / OK|Ready / OK|Pronto / OK|Prêt / OK|Pronto / OK', '#2dff7a', '<path d="M34 51l11 11 22-24" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>']
       ].map (([id, names, c, glyph]) => [id, 'control', names, () => wrap (
         G.bg ('#0b0d12', '#000') + G.glow ('sp', c, .55) + `<radialGradient id="btn" cx=".4" cy=".35"><stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity=".35"/></radialGradient>`,
         `<rect width="100" height="100" fill="url(#bg)"/><circle cx="50" cy="50" r="46" fill="url(#sp)"/><circle cx="50" cy="50" r="28" fill="url(#btn)" stroke="${c}" stroke-width="2"/><ellipse cx="46" cy="36" rx="16" ry="7" fill="#fff" opacity=".18"/>${glyph}`)]),
    ['fade-out', 'control', 'Fade out|Fade out|Fade out|Fondu sortant|Dissolvenza in uscita', () => wrap (
      G.bg ('#0b0d12', '#000') + `<linearGradient id="fo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5cc8ff"/><stop offset="1" stop-color="#5cc8ff" stop-opacity="0"/></linearGradient>`,
      `<rect width="100" height="100" fill="url(#bg)"/>${Array.from ({ length: 22 }, (_, i) => { const h = 60 * (1 - i / 22) + 3; return `<rect x="${(6 + i * 4).toFixed (1)}" y="${(70 - h).toFixed (1)}" width="2.6" height="${h.toFixed (1)}" rx="1" fill="url(#fo)" opacity="${(1 - i / 24).toFixed (2)}"/>`; }).join ('')}<path d="M8 12c30 0 50 52 84 58" fill="none" stroke="#fff" stroke-width="2" opacity=".85"/>`)],
    ['fade-in', 'control', 'Fade in|Fade in|Fade in|Fondu entrant|Dissolvenza in entrata', () => wrap (
      G.bg ('#0b0d12', '#000') + `<linearGradient id="fi" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2dff7a" stop-opacity="0"/><stop offset="1" stop-color="#2dff7a"/></linearGradient>`,
      `<rect width="100" height="100" fill="url(#bg)"/>${Array.from ({ length: 22 }, (_, i) => { const h = 60 * (i / 22) + 3; return `<rect x="${(6 + i * 4).toFixed (1)}" y="${(70 - h).toFixed (1)}" width="2.6" height="${h.toFixed (1)}" rx="1" fill="url(#fi)" opacity="${(.1 + i / 24).toFixed (2)}"/>`; }).join ('')}<path d="M8 70c34-6 54-58 84-58" fill="none" stroke="#fff" stroke-width="2" opacity=".85"/>`)],
    ['drop', 'control', 'Drop / efecto|Drop / effect|Drop / efeito|Drop / effet|Drop / effetto', () => wrap (
      G.bg ('#2a0a12', '#0a0205'),
      `<rect width="100" height="100" fill="url(#bg)"/><g fill="none" stroke="#ff5c7c" stroke-width=".6" opacity=".8">${Array.from ({ length: 26 }, (_, i) => { const x = -10 + i * 5; return `<ellipse cx="${x}" cy="${50 + 14 * Math.sin (i * .45)}" rx="${8 + 6 * Math.abs (Math.sin (i * .3))}" ry="${26 + 10 * Math.cos (i * .3)}" transform="rotate(${-20 + i * 2} ${x} 50)"/>`; }).join ('')}</g>`)],
    ['panico', 'control', 'Pánico / parar todo|Panic / stop all|Pânico / parar tudo|Panique / tout arrêter|Panico / ferma tutto', () => wrap (
      G.bg ('#2a0606', '#080101') + G.glow ('sp', '#ff3b3b', .7),
      `<rect width="100" height="100" fill="url(#bg)"/><circle cx="50" cy="48" r="46" fill="url(#sp)"/><path d="M36 18h28l20 20v28L64 86H36L16 66V38z" fill="#d61f1f" stroke="#fff" stroke-width="3"/>
        <text x="50" y="57" text-anchor="middle" font-family="system-ui,Helvetica,Arial,sans-serif" font-weight="900" font-size="17" fill="#fff" letter-spacing="1">STOP</text>`)],
    ['atencion', 'control', 'Atención|Attention|Atenção|Attention|Attenzione', () => wrap (
      G.bg ('#2a2005', '#080601') + G.glow ('sp', '#ffd166', .6),
      `<rect width="100" height="100" fill="url(#bg)"/><circle cx="50" cy="50" r="46" fill="url(#sp)"/><path d="M50 16l36 64H14z" fill="#ffc21a" stroke="#1a1405" stroke-width="3" stroke-linejoin="round"/><path d="M50 38v20" stroke="#1a1405" stroke-width="7" stroke-linecap="round"/><circle cx="50" cy="69" r="4.5" fill="#1a1405"/>`)]
  ];

  const lang = () => (window.rfI18n && window.rfI18n.lang) || 'es';
  const LI = { es: 0, en: 1, pt: 2, fr: 3, it: 4 };
  const items = L.map (([id, cat, names, make]) =>
  {
    const n = names.split ('|');
    let u = null;
    return { id, cat, names: n, get name () { return n[LI[lang()] ?? 0] || n[0]; },
             get url () { return u || (u = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent (make())); } };
  });

  // Ventana para elegir: onPick(url, nombre)
  let dlg = null;
  function open (onPick)
  {
    const T = { es: ['Biblioteca de imágenes', 'Cerrar', 'Buscar…'], en: ['Image library', 'Close', 'Search…'], pt: ['Biblioteca de imagens', 'Fechar', 'Buscar…'], fr: ['Bibliothèque d’images', 'Fermer', 'Rechercher…'], it: ['Libreria immagini', 'Chiudi', 'Cerca…'] }[lang()] || ['Biblioteca de imágenes', 'Cerrar', 'Buscar…'];
    if (dlg) dlg.remove();
    dlg = document.createElement ('dialog'); dlg.id = 'imgLib'; dlg.setAttribute ('data-noi18n', '');
    dlg.style.cssText = 'max-width:min(900px,94vw);width:94vw;max-height:88vh;padding:16px';
    dlg.innerHTML = '<div style="display:flex;gap:10px;align-items:center;margin-bottom:10px"><h3 style="margin:0;flex:1">🖼 ' + T[0] + '</h3><input id="ilQ" placeholder="' + T[2] + '" style="max-width:220px;background:var(--bg,#0d1420);color:var(--text,#e8eef8);border:1px solid var(--line,#253650);border-radius:8px;padding:8px;font:14px system-ui"><button class="hbtn" id="ilX">' + T[1] + '</button></div><div id="ilBody" style="overflow:auto;max-height:calc(88vh - 90px)"></div>';
    document.body.appendChild (dlg);
    const draw = () =>
    {
      const q = dlg.querySelector ('#ilQ').value.trim().toLowerCase();
      const body = dlg.querySelector ('#ilBody'); body.innerHTML = '';
      for (const [cat, info] of Object.entries (CATS))
      {
        const list = items.filter (it => it.cat === cat && (!q || it.names.some (n => n.toLowerCase().includes (q))));
        if (!list.length) continue;
        const h = document.createElement ('div'); h.textContent = info.n[lang()] || info.n.es; h.style.cssText = 'font:700 12px system-ui;letter-spacing:.08em;text-transform:uppercase;opacity:.7;margin:10px 2px 6px';
        const g = document.createElement ('div'); g.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px';
        for (const it of list)
        {
          const b = document.createElement ('button'); b.type = 'button'; b.title = it.name;
          b.style.cssText = 'position:relative;padding:0;border:1px solid var(--line,#253650);border-radius:12px;overflow:hidden;background:#000 center/cover no-repeat;cursor:pointer;aspect-ratio:1;color:#fff;font:700 11px system-ui;text-align:left';
          b.style.backgroundImage = 'url("' + it.url + '")';
          b.innerHTML = '<div style="position:absolute;left:0;right:0;bottom:0;padding:16px 7px 6px;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.8));text-shadow:0 1px 3px #000;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"></div>';
          b.querySelector ('div').textContent = it.name;
          b.onclick = () => { dlg.close(); onPick (it.url, it.name); };
          g.appendChild (b);
        }
        body.append (h, g);
      }
    };
    dlg.querySelector ('#ilQ').oninput = draw;
    dlg.querySelector ('#ilX').onclick = () => dlg.close();
    draw(); dlg.showModal();
  }
  window.RF_IMG_LIB = { items, open, cats: CATS };
})();
