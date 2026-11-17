// RF Audio Pro — biblioteca de imágenes para las teclas (RF ShowKeys Full y Solo)
// Ilustraciones propias en SVG: se ven nítidas a cualquier tamaño y pesan muy poco.
// Cada imagen: fondo con degradado del color de su categoría + dibujo en línea blanca.
'use strict';
(function ()
{
  const CATS = {
    audio:  { c: ['#2f7bff', '#0a1f52'], n: { es: 'Audio',   en: 'Audio',   pt: 'Áudio',    fr: 'Audio',     it: 'Audio' } },
    video:  { c: ['#8f4dff', '#260b55'], n: { es: 'Video',   en: 'Video',   pt: 'Vídeo',    fr: 'Vidéo',     it: 'Video' } },
    luces:  { c: ['#ffae1a', '#5c2600'], n: { es: 'Luces',   en: 'Lights',  pt: 'Luzes',    fr: 'Lumières',  it: 'Luci' } },
    evento: { c: ['#14b89c', '#033b33'], n: { es: 'Evento',  en: 'Event',   pt: 'Evento',   fr: 'Événement', it: 'Evento' } },
    control:{ c: ['#e5484d', '#3d0a0c'], n: { es: 'Control', en: 'Control', pt: 'Controle', fr: 'Contrôle',  it: 'Controllo' } }
  };
  const W = '#fff';
  // [id, categoria, nombres es|en|pt|fr|it, dibujo (viewBox 0 0 100 100, linea blanca)]
  const L = [
    // ---------------------------------------------------------------- AUDIO
    ['mic', 'audio', 'Micrófono|Microphone|Microfone|Micro|Microfono',
      '<rect x="38" y="12" width="24" height="42" rx="12"/><path d="M38 27h24M38 36h24" opacity=".55"/><path d="M27 46a23 23 0 0 0 46 0"/><path d="M50 69v13M37 84h26"/>'],
    ['mic-mano', 'audio', 'Micrófono inalámbrico|Wireless mic|Microfone sem fio|Micro sans fil|Radiomicrofono',
      '<circle cx="50" cy="24" r="13"/><path d="M41 22h18M43 15h14M43 30h14" opacity=".5"/><path d="M41 37l4 49h10l4-49z"/><path d="M45 60h10"/>'],
    ['headset', 'audio', 'Micrófono de diadema|Headset mic|Microfone headset|Micro serre-tête|Microfono ad archetto',
      '<path d="M24 56a26 26 0 0 1 52 0"/><rect x="17" y="50" width="11" height="20" rx="5"/><rect x="72" y="50" width="11" height="20" rx="5"/><path d="M22 70c0 13 11 17 24 17"/><circle cx="50" cy="87" r="4" fill="#fff"/>'],
    ['audifonos', 'audio', 'Audífonos|Headphones|Fones de ouvido|Casque|Cuffie',
      '<path d="M20 62V50a30 30 0 0 1 60 0v12"/><rect x="14" y="56" width="17" height="28" rx="7"/><rect x="69" y="56" width="17" height="28" rx="7"/>'],
    ['in-ear', 'audio', 'In-ear (IEM)|In-ear monitors|In-ear (IEM)|Ear monitors|In-ear (IEM)',
      '<circle cx="31" cy="30" r="11"/><circle cx="69" cy="30" r="11"/><path d="M31 41c0 22 19 22 19 41M69 41c0 22-19 22-19 41"/><rect x="42" y="80" width="16" height="9" rx="3"/>'],
    ['monitor', 'audio', 'Monitor de piso|Floor monitor|Monitor de chão|Retour de scène|Monitor da palco',
      '<path d="M12 76l15-44h46l15 44z"/><circle cx="50" cy="59" r="12"/><circle cx="50" cy="59" r="4" fill="#fff"/><circle cx="50" cy="40" r="3.5"/>'],
    ['bocina', 'audio', 'Bocina (PA)|Speaker (PA)|Caixa de som (PA)|Enceinte (façade)|Cassa (PA)',
      '<rect x="29" y="10" width="42" height="80" rx="6"/><circle cx="50" cy="30" r="7"/><circle cx="50" cy="61" r="16"/><circle cx="50" cy="61" r="5" fill="#fff"/>'],
    ['line-array', 'audio', 'Line array|Line array|Line array|Line array|Line array',
      '<path d="M50 6v8"/><path d="M26 14h48l-2 14H28z"/><path d="M28 30h44l-3 14H31z"/><path d="M31 46h38l-5 14H36z"/><path d="M36 62h28l-7 14H43z"/><path d="M40 21h20M40 37h20M42 53h16M45 69h10" opacity=".55"/>'],
    ['sub', 'audio', 'Subwoofer|Subwoofer|Subwoofer|Caisson de basses|Subwoofer',
      '<rect x="16" y="16" width="68" height="68" rx="8"/><circle cx="50" cy="50" r="24"/><circle cx="50" cy="50" r="9" fill="#fff"/><circle cx="24" cy="24" r="2" fill="#fff"/><circle cx="76" cy="24" r="2" fill="#fff"/><circle cx="24" cy="76" r="2" fill="#fff"/><circle cx="76" cy="76" r="2" fill="#fff"/>'],
    ['consola', 'audio', 'Consola de audio|Mixing console|Mesa de som|Console de mixage|Mixer audio',
      '<rect x="10" y="20" width="80" height="60" rx="6"/><path d="M24 33v36M38 33v36M52 33v36M66 33v36M80 33v36" opacity=".45"/><rect x="19" y="51" width="10" height="7" rx="2" fill="#fff"/><rect x="33" y="39" width="10" height="7" rx="2" fill="#fff"/><rect x="47" y="57" width="10" height="7" rx="2" fill="#fff"/><rect x="61" y="44" width="10" height="7" rx="2" fill="#fff"/><rect x="75" y="36" width="10" height="7" rx="2" fill="#fff"/>'],
    ['guitarra', 'audio', 'Guitarra|Guitar|Violão / guitarra|Guitare|Chitarra',
      '<circle cx="36" cy="66" r="18"/><circle cx="52" cy="50" r="11"/><circle cx="38" cy="64" r="5"/><path d="M58 44L82 20"/><path d="M78 14l10 10" stroke-width="7"/><path d="M29 71l12-12" opacity=".6"/>'],
    ['bajo', 'audio', 'Bajo|Bass|Baixo|Basse|Basso',
      '<path d="M30 86c-12-2-16-16-8-24 4-4 10-4 12-10 3-7 10-9 15-5 5 4 4 11-1 15-6 4-6 10-10 14-3 4-3 9-8 10z"/><path d="M48 50L84 14"/><path d="M80 9l9 9" stroke-width="7"/><path d="M33 70l9-9" opacity=".6"/>'],
    ['bateria', 'audio', 'Batería|Drums|Bateria|Batterie|Batteria',
      '<ellipse cx="50" cy="44" rx="31" ry="11"/><path d="M19 44v24c0 7 14 12 31 12s31-5 31-12V44"/><path d="M28 52l10 22M72 52l-10 22M50 55v24" opacity=".5"/><path d="M22 12l22 24M78 12L56 36"/>'],
    ['teclado', 'audio', 'Teclado / piano|Keyboard / piano|Teclado / piano|Clavier / piano|Tastiera / piano',
      '<rect x="8" y="28" width="84" height="44" rx="4"/><path d="M20 28v44M32 28v44M44 28v44M56 28v44M68 28v44M80 28v44" opacity=".6"/><rect x="16" y="28" width="7" height="25" fill="#fff" stroke="none"/><rect x="28" y="28" width="7" height="25" fill="#fff" stroke="none"/><rect x="52" y="28" width="7" height="25" fill="#fff" stroke="none"/><rect x="64" y="28" width="7" height="25" fill="#fff" stroke="none"/><rect x="76" y="28" width="7" height="25" fill="#fff" stroke="none"/>'],
    ['musica', 'audio', 'Música|Music|Música|Musique|Musica',
      '<path d="M38 70V22l40-9v48"/><path d="M38 34l40-9" opacity=".6"/><circle cx="29" cy="70" r="10" fill="#fff"/><circle cx="69" cy="61" r="10" fill="#fff"/>'],
    ['onda', 'audio', 'Onda de audio|Audio waveform|Forma de onda|Forme d’onde|Forma d’onda',
      '<path d="M8 50h9l6-18 8 36 8-50 8 64 8-46 8 30 7-18 6 10h16"/>'],
    ['volumen', 'audio', 'Volumen|Volume|Volume|Volume|Volume',
      '<path d="M16 40h14l20-15v50L30 60H16z"/><path d="M62 38a17 17 0 0 1 0 24M71 29a30 30 0 0 1 0 42"/>'],
    ['mute', 'audio', 'Silenciar (mute)|Mute|Silenciar (mute)|Muet (mute)|Muto',
      '<path d="M16 40h14l20-15v50L30 60H16z"/><path d="M62 40l20 20M82 40L62 60"/>'],
    ['voz', 'audio', 'Voz / anuncio|Voice / announcement|Voz / anúncio|Voix / annonce|Voce / annuncio',
      '<path d="M18 42v16h11l32 17V25L29 42z"/><path d="M29 58l6 20h9l-4-16"/><path d="M70 38l12-6M72 50h14M70 62l12 6"/>'],
    ['efecto', 'audio', 'Efecto de sonido|Sound effect|Efeito sonoro|Effet sonore|Effetto sonoro',
      '<path d="M50 12l9 22 24 2-18 15 6 23-21-13-21 13 6-23-18-15 24-2z"/><path d="M14 84h72" opacity=".5"/>'],

    // ---------------------------------------------------------------- VIDEO
    ['camara', 'video', 'Cámara de video|Video camera|Câmera de vídeo|Caméra|Videocamera',
      '<rect x="10" y="34" width="56" height="38" rx="6"/><path d="M66 48l24-13v36L66 58z"/><circle cx="26" cy="24" r="8"/><circle cx="48" cy="22" r="10"/>'],
    ['proyector', 'video', 'Proyector|Projector|Projetor|Projecteur|Proiettore',
      '<rect x="10" y="36" width="80" height="34" rx="7"/><circle cx="66" cy="53" r="11"/><circle cx="66" cy="53" r="4" fill="#fff"/><path d="M21 46h24M21 55h16"/><path d="M22 70v7M78 70v7"/>'],
    ['pantalla', 'video', 'Pantalla|Screen|Tela|Écran|Schermo',
      '<rect x="10" y="16" width="80" height="52" rx="4"/><path d="M50 68v14M33 85h34"/>'],
    ['video', 'video', 'Video|Video|Vídeo|Vidéo|Video',
      '<rect x="10" y="18" width="80" height="56" rx="8"/><path d="M42 34v24l22-12z" fill="#fff"/><path d="M22 86h56" opacity=".5"/>'],
    ['grabar', 'video', 'Grabar (REC)|Record (REC)|Gravar (REC)|Enregistrer (REC)|Registra (REC)',
      '<rect x="6" y="26" width="88" height="48" rx="10"/><circle cx="26" cy="50" r="10" fill="#ff4d4d" stroke="none"/><text x="64" y="59" text-anchor="middle" font-family="system-ui,Helvetica,Arial,sans-serif" font-weight="800" font-size="26" fill="#fff" stroke="none">REC</text>'],
    ['envivo', 'video', 'Transmisión en vivo|Live stream|Transmissão ao vivo|Diffusion en direct|Diretta streaming',
      '<circle cx="50" cy="44" r="7" fill="#fff"/><path d="M36 30a20 20 0 0 0 0 28M64 30a20 20 0 0 1 0 28M25 19a35 35 0 0 0 0 50M75 19a35 35 0 0 1 0 50"/><rect x="30" y="76" width="40" height="14" rx="7" fill="#ff4d4d" stroke="none"/><path d="M38 79v8h4M46 79v8M51 79l3 8 3-8M66 79h-5v8h5M61 83h4" stroke-width="2"/>'],
    ['diapositivas', 'video', 'Diapositivas|Slides|Slides|Diapositives|Diapositive',
      '<rect x="22" y="12" width="62" height="44" rx="4" opacity=".5"/><rect x="16" y="22" width="62" height="44" rx="4"/><path d="M26 54l12-14 9 9 7-7 14 12"/><circle cx="60" cy="34" r="4" fill="#fff"/><path d="M47 66v12M34 84h26"/>'],
    ['foto', 'video', 'Fotografía|Photo|Fotografia|Photo|Foto',
      '<path d="M12 34h18l6-10h28l6 10h18v46H12z"/><circle cx="50" cy="56" r="15"/><circle cx="50" cy="56" r="6" fill="#fff"/>'],
    ['streaming', 'video', 'Redes / streaming|Social / streaming|Redes / streaming|Réseaux / streaming|Social / streaming',
      '<rect x="30" y="10" width="40" height="80" rx="8"/><path d="M45 82h10"/><path d="M44 38v20l16-10z" fill="#fff"/><path d="M12 30a40 40 0 0 0 0 40M88 30a40 40 0 0 1 0 40" opacity=".6"/>'],

    // ---------------------------------------------------------------- LUCES
    ['cabeza-movil', 'luces', 'Cabeza móvil|Moving head|Moving head|Lyre asservie|Testa mobile',
      '<path d="M40 30L22 4M60 30L78 4" opacity=".6"/><rect x="33" y="74" width="34" height="13" rx="3"/><path d="M30 74V44M70 74V44"/><rect x="35" y="28" width="30" height="36" rx="8"/><circle cx="50" cy="40" r="7" fill="#fff"/>'],
    ['par', 'luces', 'Reflector (PAR)|PAR light|Refletor (PAR)|Projecteur PAR|Faro PAR',
      '<path d="M48 44L92 88H30z" fill="#fff" fill-opacity=".22" stroke="none"/><path d="M14 30l22-14 14 22-22 14z"/><path d="M22 22l-6-8M40 34l12-4" /><path d="M24 52l-4 14h20"/>'],
    ['seguidor', 'luces', 'Seguidor|Follow spot|Canhão seguidor|Poursuite|Seguipersone',
      '<path d="M58 34L94 18v40z" fill="#fff" fill-opacity=".22" stroke="none"/><rect x="12" y="26" width="46" height="22" rx="6"/><path d="M30 48v18M18 84l12-18 12 18M14 84h32"/>'],
    ['estrobo', 'luces', 'Estrobo|Strobe|Estrobo|Stroboscope|Strobo',
      '<rect x="12" y="26" width="76" height="48" rx="6"/><path d="M56 32L40 52h12l-6 16 18-22H52z" fill="#fff"/>'],
    ['humo', 'luces', 'Humo / haze|Haze / fog|Fumaça / haze|Fumée / brouillard|Fumo / haze',
      '<path d="M26 60a12 12 0 0 1 1-24 17 17 0 0 1 32-7 14 14 0 0 1 20 13 10 10 0 0 1-2 18z"/><path d="M18 74c8-5 14 5 22 0s14 5 22 0 14 5 22 0M26 86c8-5 14 5 22 0s14 5 22 0" opacity=".6"/>'],
    ['laser', 'luces', 'Láser|Laser|Laser|Laser|Laser',
      '<rect x="10" y="66" width="28" height="18" rx="4"/><path d="M38 72L90 18M38 74L92 40M38 76L92 64M38 70L72 12" stroke-width="2.5"/>'],
    ['color', 'luces', 'Color / wash|Color wash|Cor / wash|Couleur / wash|Colore / wash',
      '<circle cx="38" cy="40" r="20" fill="#ff4d6d" fill-opacity=".85" stroke="none"/><circle cx="62" cy="40" r="20" fill="#3ddc84" fill-opacity=".85" stroke="none"/><circle cx="50" cy="61" r="20" fill="#3d8bff" fill-opacity=".85" stroke="none"/>'],
    ['luz-sala', 'luces', 'Luz de sala|House lights|Luz da plateia|Lumière de salle|Luci di sala',
      '<path d="M38 64c-7-6-12-13-12-22a24 24 0 0 1 48 0c0 9-5 16-12 22v8H38z"/><path d="M40 80h20M43 88h14"/><path d="M50 8v6M22 20l4 4M78 20l-4 4" opacity=".7"/>'],
    ['blackout', 'luces', 'Blackout|Blackout|Blackout|Blackout|Blackout',
      '<path d="M38 64c-7-6-12-13-12-22a24 24 0 0 1 48 0c0 9-5 16-12 22v8H38z" opacity=".45"/><path d="M40 80h20M43 88h14" opacity=".45"/><path d="M18 14l64 72"/>'],
    ['consola-luces', 'luces', 'Consola de luces (DMX)|Lighting console (DMX)|Mesa de luz (DMX)|Console lumière (DMX)|Console luci (DMX)',
      '<rect x="10" y="24" width="80" height="54" rx="6"/><circle cx="26" cy="40" r="6"/><circle cx="44" cy="40" r="6"/><circle cx="62" cy="40" r="6"/><circle cx="80" cy="40" r="4" fill="#fff"/><path d="M22 54v14M34 54v14M46 54v14M58 54v14M70 54v14" opacity=".5"/><rect x="18" y="60" width="8" height="5" fill="#fff" stroke="none"/><rect x="30" y="56" width="8" height="5" fill="#fff" stroke="none"/><rect x="42" y="62" width="8" height="5" fill="#fff" stroke="none"/><rect x="54" y="57" width="8" height="5" fill="#fff" stroke="none"/><rect x="66" y="60" width="8" height="5" fill="#fff" stroke="none"/>'],
    ['escenario', 'luces', 'Escenario|Stage|Palco|Scène|Palco',
      '<path d="M8 12h84M14 12v12c8 6 14 18 14 30M86 12v12c-8 6-14 18-14 30"/><path d="M38 12l-6 50h36l-6-50" fill="#fff" fill-opacity=".18" stroke="none"/><path d="M8 72h84v12H8z"/>'],

    // ---------------------------------------------------------------- EVENTO
    ['iglesia', 'evento', 'Iglesia|Church|Igreja|Église|Chiesa',
      '<path d="M50 8v14M43 14h14"/><path d="M28 46l22-20 22 20v42H28z"/><path d="M44 88V68a6 6 0 0 1 12 0v20"/><circle cx="50" cy="48" r="5"/>'],
    ['pulpito', 'evento', 'Púlpito / atril|Pulpit / lectern|Púlpito|Pupitre|Leggio',
      '<path d="M28 42h44l-7 46H35z"/><path d="M24 42l8-13h36l8 13"/><path d="M58 29c0-12 6-16 12-18"/><rect x="66" y="6" width="9" height="9" rx="3"/>'],
    ['boda', 'evento', 'Boda|Wedding|Casamento|Mariage|Matrimonio',
      '<circle cx="38" cy="58" r="18"/><circle cx="62" cy="58" r="18"/><path d="M54 22l8-8 8 8-8 10z" fill="#fff"/>'],
    ['cumple', 'evento', 'Cumpleaños|Birthday|Aniversário|Anniversaire|Compleanno',
      '<rect x="18" y="50" width="64" height="34" rx="5"/><path d="M18 62c8 6 16 6 24 0s16-6 24 0 12 4 16 0"/><path d="M34 50V36M50 50V32M66 50V36"/><path d="M34 28c-3 3 0 6 0 6s3-3 0-6zM50 24c-3 3 0 6 0 6s3-3 0-6zM66 28c-3 3 0 6 0 6s3-3 0-6z" fill="#fff"/>'],
    ['fiesta', 'evento', 'Celebración|Celebration|Celebração|Fête|Festa',
      '<path d="M14 86l20-52 32 32z"/><path d="M24 62l12 12M30 46l20 20" opacity=".5"/><path d="M58 22l4-10M72 30l10-4M66 18l8-8"/><circle cx="80" cy="46" r="3" fill="#fff"/><circle cx="50" cy="12" r="3" fill="#fff"/><circle cx="86" cy="16" r="2.5" fill="#fff"/>'],
    ['adoracion', 'evento', 'Adoración|Worship|Adoração|Louange|Adorazione',
      '<path d="M50 84C26 66 12 52 12 36a18 18 0 0 1 38-8 18 18 0 0 1 38 8c0 16-14 30-38 48z"/>'],
    ['receso', 'evento', 'Receso / café|Break / coffee|Intervalo / café|Pause café|Pausa caffè',
      '<path d="M18 40h52v18a24 24 0 0 1-24 24h-4a24 24 0 0 1-24-24z"/><path d="M70 46h6a10 10 0 0 1 0 20h-8"/><path d="M32 30c-4-6 4-8 0-14M46 30c-4-6 4-8 0-14M60 30c-4-6 4-8 0-14" opacity=".7"/><path d="M14 90h60"/>'],
    ['bienvenida', 'evento', 'Bienvenida|Welcome|Boas-vindas|Bienvenue|Benvenuto',
      '<rect x="28" y="12" width="44" height="76" rx="3"/><path d="M28 12l28 8v76l-28-8z" fill="#fff" fill-opacity=".2"/><circle cx="50" cy="54" r="3" fill="#fff"/><path d="M84 40l8 8-8 8M76 48h16" opacity=".8"/>'],
    ['reloj', 'evento', 'Reloj / tiempo|Clock / timer|Relógio / tempo|Horloge / minuteur|Orologio / timer',
      '<circle cx="50" cy="54" r="32"/><path d="M50 34v20l14 10"/><path d="M40 10h20M50 10v12"/>'],
    ['salida', 'evento', 'Salida / fin|Exit / end|Saída / fim|Sortie / fin|Uscita / fine',
      '<path d="M56 16H22v68h34"/><path d="M44 50h44M74 36l14 14-14 14"/>'],
    ['ofrenda', 'evento', 'Ofrenda|Offering|Oferta|Offrande|Offerta',
      '<path d="M14 52h72l-8 30H22z"/><path d="M30 52V30h40v22"/><path d="M42 42h16" stroke-width="6"/><path d="M50 10v10M42 14l8 6 8-6" opacity=".7"/>'],
    ['premio', 'evento', 'Premio / trofeo|Award / trophy|Prêmio / troféu|Prix / trophée|Premio / trofeo',
      '<path d="M32 14h36v22a18 18 0 0 1-36 0z"/><path d="M32 22H20c0 12 6 18 14 18M68 22h12c0 12-6 18-14 18"/><path d="M50 54v14M36 86h28l-4-18H40z"/>'],

    // ---------------------------------------------------------------- CONTROL
    ['play', 'control', 'Reproducir|Play|Tocar|Lecture|Play',
      '<circle cx="50" cy="50" r="36"/><path d="M42 33v34l26-17z" fill="#fff"/>'],
    ['pausa', 'control', 'Pausa|Pause|Pausa|Pause|Pausa',
      '<circle cx="50" cy="50" r="36"/><path d="M41 34v32M59 34v32" stroke-width="8"/>'],
    ['stop', 'control', 'Detener|Stop|Parar|Arrêt|Stop',
      '<circle cx="50" cy="50" r="36"/><rect x="36" y="36" width="28" height="28" rx="3" fill="#fff"/>'],
    ['fade-out', 'control', 'Fade out|Fade out|Fade out|Fondu sortant|Dissolvenza in uscita',
      '<path d="M12 26h20c18 0 32 48 56 48"/><path d="M12 82h76" opacity=".5"/><path d="M78 64l10 10-10 10" opacity=".8"/>'],
    ['fade-in', 'control', 'Fade in|Fade in|Fade in|Fondu entrant|Dissolvenza in entrata',
      '<path d="M12 74c24 0 38-48 56-48h20"/><path d="M12 82h76" opacity=".5"/>'],
    ['siguiente', 'control', 'Siguiente|Next|Próximo|Suivant|Successivo',
      '<path d="M18 28v44l30-22z" fill="#fff"/><path d="M48 28v44l30-22z" fill="#fff"/><path d="M82 28v44" stroke-width="7"/>'],
    ['anterior', 'control', 'Anterior|Previous|Anterior|Précédent|Precedente',
      '<path d="M82 28v44L52 50z" fill="#fff"/><path d="M52 28v44L22 50z" fill="#fff"/><path d="M18 28v44" stroke-width="7"/>'],
    ['repetir', 'control', 'Repetir (loop)|Loop|Repetir (loop)|Boucle|Ripeti (loop)',
      '<path d="M20 44a26 26 0 0 1 46-14l6 6"/><path d="M74 22v14H60"/><path d="M80 56a26 26 0 0 1-46 14l-6-6"/><path d="M26 78V64h14"/>'],
    ['panico', 'control', 'Pánico / parar todo|Panic / stop all|Pânico / parar tudo|Panique / tout arrêter|Panico / ferma tutto',
      '<path d="M34 10h32l24 24v32L66 90H34L10 66V34z"/><path d="M50 28v28" stroke-width="8"/><circle cx="50" cy="70" r="5" fill="#fff" stroke="none"/>'],
    ['ok', 'control', 'Listo / OK|Ready / OK|Pronto / OK|Prêt / OK|Pronto / OK',
      '<circle cx="50" cy="50" r="36"/><path d="M33 51l12 12 23-25" stroke-width="7"/>'],
    ['atencion', 'control', 'Atención|Attention|Atenção|Attention|Attenzione',
      '<path d="M50 12l40 72H10z"/><path d="M50 38v22" stroke-width="7"/><circle cx="50" cy="72" r="4.5" fill="#fff" stroke="none"/>']
  ];

  function svg (cat, glyph)
  {
    const [c1, c2] = CATS[cat].c;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
      + '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient>'
      + '<radialGradient id="h" cx=".28" cy=".18" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>'
      + '<rect width="100" height="100" fill="url(#g)"/><rect width="100" height="100" fill="url(#h)"/>'
      + '<g transform="translate(19 9) scale(.62)" fill="none" stroke="' + W + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">' + glyph + '</g></svg>';
  }
  const lang = () => (window.rfI18n && window.rfI18n.lang) || 'es';
  const LI = { es: 0, en: 1, pt: 2, fr: 3, it: 4 };
  const items = L.map (([id, cat, names, glyph]) =>
  {
    const n = names.split ('|');
    return { id, cat, names: n, get name () { return n[LI[lang()] ?? 0] || n[0]; },
             url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent (svg (cat, glyph)) };
  });

  // Ventana para elegir: onPick(url, nombre)
  let dlg = null;
  function open (onPick)
  {
    const T = { es: ['Biblioteca de imágenes', 'Cerrar', 'Buscar…'], en: ['Image library', 'Close', 'Search…'], pt: ['Biblioteca de imagens', 'Fechar', 'Buscar…'], fr: ['Bibliothèque d’images', 'Fermer', 'Rechercher…'], it: ['Libreria immagini', 'Chiudi', 'Cerca…'] }[lang()] || ['Biblioteca de imágenes', 'Cerrar', 'Buscar…'];
    if (dlg) dlg.remove();
    dlg = document.createElement ('dialog'); dlg.id = 'imgLib'; dlg.setAttribute ('data-noi18n', '');
    dlg.style.cssText = 'max-width:min(860px,94vw);width:94vw;max-height:88vh;padding:16px';
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
        const g = document.createElement ('div'); g.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:8px';
        for (const it of list)
        {
          const b = document.createElement ('button'); b.type = 'button'; b.title = it.name;
          b.style.cssText = 'padding:0;border:1px solid var(--line,#253650);border-radius:12px;overflow:hidden;background:#000;cursor:pointer;color:#fff;font:600 11px system-ui;text-align:center';
          b.innerHTML = '<img src="' + it.url + '" alt="" style="display:block;width:100%;aspect-ratio:1"><div style="padding:5px 4px;background:#111a28;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"></div>';
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
