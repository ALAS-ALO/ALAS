(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVGNS = 'http://www.w3.org/2000/svg';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- Services ---------- */
  function shape(kind, cx, cy, s, cls) {
    var h = s / 2;
    if (kind === 'circle') return '<circle class="' + cls + '" cx="' + cx + '" cy="' + cy + '" r="' + h + '"/>';
    if (kind === 'triangle') return '<polygon class="' + cls + '" points="' + [cx, cy - h * 1.05, cx + h * 1.12, cy + h * 0.9, cx - h * 1.12, cy + h * 0.9].join(' ') + '"/>';
    return '<rect class="' + cls + '" x="' + (cx - h) + '" y="' + (cy - h) + '" width="' + s + '" height="' + s + '"/>';
  }
  function services(el, list) {
    el.innerHTML = list.map(function (d) {
      return '<article class="service" style="--turn:' + (d.shape === 'square' ? '45deg' : d.shape === 'triangle' ? '180deg' : '0deg') + '">' +
        '<div class="fig' + (d.video ? ' has-video' : '') + '" aria-hidden="true"><svg viewBox="0 0 100 100">' + shape(d.shape, 50, 50, 64, 'shape') + '</svg>' + (d.video ? '<video muted loop playsinline preload="none" data-video' + (d.poster ? ' poster="' + esc(d.poster) + '"' : '') + '><source data-src="' + esc(d.video.replace(/\.mp4$/, '.webm')) + '" type="video/webm"><source data-src="' + esc(d.video) + '" type="video/mp4"></video>' : '') + '<span class="tag">' + esc(d.media) + '</span></div>' +
        '<div class="label">' + esc(d.label) + '</div><h3 class="h3">' + esc(d.title) + '</h3>' +
        '<ul>' + d.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul></article>';
    }).join('');
  }
  services(document.getElementById('studio-services'), [
    { shape: 'square', label: 'Studio · 01', title: 'Proyectos arquitectónicos', media: 'Proyecto', video: '/media/studio-proyectos.mp4', poster: '/media/studio-proyectos.jpg', items: ['Estudios de viabilidad', 'Desarrollo de proyectos arquitectónicos', 'Supervisión de obras', 'Proyectos llave en mano', 'Reformas', 'Gestión de proyectos', 'Consultoría para promotores'] },
    { shape: 'circle', label: 'Studio · 02', title: 'Servicios técnicos', media: 'Inspección', video: '/media/studio-tecnicos.mp4', poster: '/media/studio-tecnicos.jpg', items: ['Redacción presupuestaria', 'Informes de Evaluación de Edificios (IEE)', 'Informes de Estado Actual', 'Memorias de actividad', 'Cambios de uso', 'Certificados de eficiencia energética', 'Tramitaciones administrativas', 'Legalización de obras'] },
    { shape: 'triangle', label: 'Studio · 03', title: 'Modelado y BIM', media: 'Modelo', video: '/media/studio-bim.mp4', poster: '/media/studio-bim.jpg', items: ['Modelado BIM', 'BEP (BIM Execution Plan)', 'Coordinación BIM', 'Gemelos digitales', 'Implementación BIM para promotores', 'Estándares BIM personalizados'] },
    { shape: 'circle', label: 'Studio · 04', title: 'Visualización', media: 'Recorrido', video: '/media/studio-visualizacion.mp4', poster: '/media/studio-visualizacion.jpg', items: ['Conceptualización arquitectónica', 'Renderings', 'Recorridos virtuales (VR)', 'Visualización en tiempo real', 'Gemelos digitales navegables'] }
  ]);
  services(document.getElementById('space-services'), [
    { shape: 'square', label: 'Space · 01', title: 'Mentoring estratégico', media: 'Mentoring', video: '/media/space-mentoring.mp4', poster: '/media/space-mentoring.jpg', items: ['Optimización organizativa del estudio', 'Implementación BIM avanzada', 'Introducción aplicada a la inteligencia artificial', 'Diseño de sistemas internos personalizados', 'Creación de web e imagen corporativa'] },
    { shape: 'circle', label: 'Space · 02', title: 'Agentes automatizados', media: 'Agentes', video: '/media/space-agentes.mp4', poster: '/media/space-agentes.jpg', items: ['Agente de control normativo', 'Agente de revisión BIM', 'Agente documental', 'Agente de análisis de viabilidad', 'Agente generador de memorias'] },
    { shape: 'triangle', label: 'Space · 03', title: 'Plantillas y sistemas', media: 'Sistemas', video: '/media/space-plantillas.mp4', poster: '/media/space-plantillas.jpg', items: ['Automatizaciones para Revit: rutinas Dynamo y complementos propios', 'Templates optimizados para Revit', 'Librerías de familias BIM', 'Sistemas de gestión documental', 'Entornos de proyecto preconfigurados'] },
    { shape: 'circle', label: 'Space · 04', title: 'Freelancing', media: 'Colaboración', video: '/media/space-freelancing.mp4', poster: '/media/space-freelancing.jpg', items: ['Colaboración con otros estudios de arquitectura', 'Modelado BIM para terceros', 'Documentación y planos de proyecto', 'Coordinación BIM externa', 'Refuerzo en entregas y concursos'] }
  ]);

  // clips load and play only while their card is on screen
  (function () {
    var vids = [].slice.call(document.querySelectorAll('.service video[data-video]')); if (!vids.length) return;
    vids.forEach(function (v) { v.addEventListener('playing', function () { v.classList.add('ready'); }); });
    function on(v) { if (!v.dataset.loaded) { v.dataset.loaded = '1'; [].forEach.call(v.querySelectorAll('source'), function (sc) { sc.src = sc.getAttribute('data-src'); }); v.load(); } if (!reduce) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.classList.add('ready'); }
    if (!window.IntersectionObserver) { vids.forEach(on); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) on(e.target); else e.target.pause(); }); }, { rootMargin: '200px 0px' });
    vids.forEach(function (v) { io.observe(v); });
  })();


  /* ---------- Milestones: a pulse runs left to right (top to bottom on a phone) and discovers each step ---------- */
  (function () {
    var IC = {
      talk: 'M4 5 H16 V13 H9 L5.5 16 V13 H4 Z M18 9 H20.5 V16.5 H18.5 V19 L15.5 16.5 H11 V15',
      search: 'M4.5 10.5 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M15 15 L20 20',
      check: 'M6 3.5 H14.5 L18.5 7.5 V20.5 H6 Z M14.5 3.5 V7.5 H18.5 M9 14 L11 16 L15 11.5',
      pencil: 'M4 20 L5 15.5 L15.5 5 L19 8.5 L8.5 19 Z M13.5 7 L17 10.5',
      cube: 'M12 3.5 L19.5 7.5 V16.5 L12 20.5 L4.5 16.5 V7.5 Z M4.5 7.5 L12 11.5 L19.5 7.5 M12 11.5 V20.5',
      gov: 'M3.5 9 L12 4 L20.5 9 Z M5 9 V10.5 H19 V9 M6.5 10.5 V17.5 M10 10.5 V17.5 M14 10.5 V17.5 M17.5 10.5 V17.5 M4.5 17.5 H19.5 M3.5 20 H20.5',
      plane: 'M21 3.5 L3 10.5 L10 13.5 L13.5 21 Z M21 3.5 L10 13.5',
      audit: 'M8.5 3.5 H15.5 V6.5 H8.5 Z M8.5 5 H5.5 V20.5 H18.5 V5 H15.5 M8.5 11 H15.5 M8.5 14.5 H15.5 M8.5 18 H12.5',
      bulb: 'M9.5 17.5 H14.5 M10.5 20.5 H13.5 M12 3.5 A5.5 5.5 0 0 0 8.7 13.4 C9.5 14 10 15 10 16 V17.5 H14 V16 C14 15 14.5 14 15.3 13.4 A5.5 5.5 0 0 0 12 3.5 Z',
      gear: 'M9 12 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 M12 3.5 V6 M12 18 V20.5 M3.5 12 H6 M18 12 H20.5 M6 6 L7.8 7.8 M16.2 16.2 L18 18 M6 18 L7.8 16.2 M16.2 7.8 L18 6',
      euro: 'M17.5 7 A6.5 6.5 0 1 0 17.5 17 M5 10.5 H13.5 M5 13.5 H13.5',
      loop: 'M19.5 9 A8 8 0 0 0 5.2 8.5 M4.5 4.5 V9 H9 M4.5 15 A8 8 0 0 0 18.8 15.5 M19.5 19.5 V15 H15'
    };
    var DATA = {
      'ms-studio': [
        ['talk', 'Reunión de aproximación', 'Gratuita. Escuchamos qué quieres hacer y qué esperas del proyecto.'],
        ['search', 'Estudio y análisis', 'Analizamos el inmueble o la parcela y sus posibilidades reales.'],
        ['check', 'Informe preliminar', 'Contrastamos tus intenciones con la normativa antes de proyectar.'],
        ['pencil', 'Propuesta de proyecto', 'Solución, plazo y honorarios, por escrito.'],
        ['cube', 'Desarrollo', 'El proyecto completo, sobre un modelo BIM.'],
        ['gov', 'Tramitación', 'Licencias y permisos ante la Administración.'],
        ['plane', 'Entrega', 'Documentación final y seguimiento de obra.']
      ],
      'ms-space': [
        ['audit', 'Auditoría gratuita', 'Revisamos cómo trabaja tu estudio y dónde se pierde tiempo.'],
        ['bulb', 'Propuestas de mejora', 'Soluciones concretas, con su coste y el tiempo que te ahorran.'],
        ['gear', 'Implementación', 'Ponemos en marcha la solución que elijas y formamos a tu equipo.'],
        ['loop', 'Mantenimiento y mejora', 'Mantenemos tus sistemas al día y te proponemos mejoras antes de que las necesites.']
      ]
    };
    function svg(k) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + IC[k] + '"/></svg>'; }
    Object.keys(DATA).forEach(function (id) {
      var ms = document.getElementById(id); if (!ms) return;
      var d = DATA[id], h = '', n = 0;
      d.forEach(function (it) {
        if (it.fork) { h += '<li class="ms-fork">' + it.fork.map(function (o) { return '<div class="ms-opt"><span class="ms-dot">' + svg(o[0]) + '</span><div class="ms-tx"><h3>' + o[1] + '</h3><p>' + o[2] + '</p></div></div>'; }).join('') + '</li>'; }
        else h += '<li class="ms-i"><span class="ms-dot">' + svg(it[0]) + '</span><h3>' + it[1] + '</h3><p>' + it[2] + '</p></li>';
        n++;
      });
      ms.style.setProperty('--n', n);
      ms.innerHTML = '<span class="ms-line" aria-hidden="true"></span><span class="ms-fill" aria-hidden="true"></span><span class="ms-branch" aria-hidden="true"></span><span class="ms-branch-fill" aria-hidden="true"></span><span class="ms-pulse" aria-hidden="true"></span>' + h;
      setup(ms);
    });
    function setup(ms) {
      var line = ms.querySelector('.ms-line'), fill = ms.querySelector('.ms-fill'), pulse = ms.querySelector('.ms-pulse'), br = ms.querySelector('.ms-branch'), brf = ms.querySelector('.ms-branch-fill');
      var dots = [].slice.call(ms.querySelectorAll('.ms-dot')), G = null, t0 = null, seen = false, done = false, reached = -1e9;
      function layout() {
        var mr = ms.getBoundingClientRect(), hz = window.innerWidth >= 900;
        var P = dots.map(function (d) { var r = d.getBoundingClientRect(); return { x: r.left - mr.left + r.width / 2, y: r.top - mr.top + r.height / 2, r: r.width / 2, el: d.parentNode.classList.contains('ms-opt') ? d.parentNode : d.parentNode }; });
        var a0, a1, branch = null;
        if (hz) {
          var y = P[0].y, lv = P.filter(function (p) { return Math.abs(p.y - y) < 2; });
          a0 = P[0].x; a1 = lv[lv.length - 1].x;
          line.style.cssText = fill.style.cssText = 'left:' + a0 + 'px;top:' + (y - 1) + 'px;';
          line.style.width = (a1 - a0) + 'px'; line.style.height = fill.style.height = '2px';
          var low = P.filter(function (p) { return p.y > y + 2; });
          if (low.length) { var o = low[0], xj = o.x - o.r - 26; branch = { xj: xj }; [br, brf].forEach(function (b) { b.style.cssText = 'left:' + xj + 'px;top:' + (y - 1) + 'px;width:' + (o.x - o.r - xj) + 'px;height:' + (o.y - y + 1) + 'px;'; }); }
          else { br.style.cssText = brf.style.cssText = 'display:none'; }
        } else {
          var x = P[0].x; a0 = P[0].y; a1 = P[P.length - 1].y;
          line.style.cssText = fill.style.cssText = 'left:' + (x - 1) + 'px;top:' + a0 + 'px;width:2px;';
          line.style.height = (a1 - a0) + 'px';
        }
        G = { hz: hz, a0: a0, a1: a1, P: P, branch: branch, x: hz ? null : P[0].x, y: hz ? P[0].y : null };
      }
      function at(pos, show) {
        var g = G; reached = Math.max(reached, pos); var len = Math.max(0, reached - g.a0);
        if (g.hz) { fill.style.width = Math.min(len, g.a1 - g.a0) + 'px'; pulse.style.left = pos + 'px'; pulse.style.top = g.y + 'px'; }
        else { fill.style.height = Math.min(len, g.a1 - g.a0) + 'px'; pulse.style.left = g.x + 'px'; pulse.style.top = pos + 'px'; }
        pulse.style.opacity = show ? '1' : '0';
        g.P.forEach(function (p, i) { if ((g.hz ? p.x : p.y) <= pos + 1 && !p.el.classList.contains('on')) { p.el.classList.add('on'); p.el.style.setProperty('--d', (i * .18).toFixed(2) + 's'); } });
        if (g.branch && pos >= g.branch.xj) brf.style.opacity = '1';
      }
      layout();
      window.addEventListener('resize', function () { layout(); if (seen) at(G.a1, false); });
      if (reduce) { at(1e6, false); return; }
      if (window.IntersectionObserver) new IntersectionObserver(function (es) { if (es[0].isIntersecting && !seen) { seen = true; t0 = performance.now(); } }, { threshold: .35 }).observe(ms);
      else { seen = true; t0 = performance.now(); }
      (function loop(now) {
        if (seen && t0 !== null) {
          var span = G.a1 - G.a0, dur = 650 * G.P.length + 400, t = now - t0;
          if (t <= dur) at(G.a0 + span * (t / dur), true);
          else {
            if (!done) { done = true; at(G.a1 + 2, false); }
            // afterwards the pulse keeps running along the line, quieter, every few seconds
            var per = dur + 2200, q = ((t - dur) % per) / dur;
            if (q <= 1) { at(G.a0 + span * q, true); pulse.style.opacity = String(.55 * Math.sin(Math.PI * q)); } else pulse.style.opacity = '0';
          }
        }
        requestAnimationFrame(loop);
      })(performance.now());
    }
  })();

  /* ---------- Diagram ---------- */
  var steps = [
    { name: 'Conversación inicial', note: 'Entendemos el encargo', shape: 'square' },
    { name: 'Propuesta por escrito', note: 'Alcance, plazo y honorarios', shape: 'square' },
    { name: 'Desarrollo', note: 'Con las herramientas de Space', shape: 'circle', space: true },
    { name: 'Entrega y seguimiento', note: 'Documentación y tramitación', shape: 'triangle' }
  ];
  var hl = [0, 3];
  function wrapText(t, max) { var w = String(t || '').split(/\s+/), out = [], cur = ''; w.forEach(function (x) { if (cur && (cur + ' ' + x).length > max) { out.push(cur); cur = x; } else cur = cur ? cur + ' ' + x : x; }); if (cur) out.push(cur); return out; }
  function tsp(lines, x, lh) { return lines.map(function (l, i) { return '<tspan x="' + x + '" dy="' + (i ? lh : 0) + '">' + esc(l) + '</tspan>'; }).join(''); }
  function nodeCls(st, i) { return 'd-node' + (st.space ? ' space' : (i >= hl[0] && i <= hl[1] ? ' on' : '')); }
  function stepCls(st, i) { return 'd-step' + (st.space ? ' space' : (i >= hl[0] && i <= hl[1] ? ' on' : '')); }
  function drawH() {
    var n = steps.length, W = 1180, s = 48, ny = 104, x0 = 90, x1 = W - 90, gap = (x1 - x0) / (n - 1), body = '', grid = '', pts = [];
    var H = 290;
    steps.forEach(function (st, i) {
      var cx = x0 + i * gap;
      if (i < n - 1) {
        var xa = cx + s / 2 + 10, xb = cx + gap - s / 2 - 14;
        body += '<line class="d-line on" x1="' + xa + '" y1="' + ny + '" x2="' + xb + '" y2="' + ny + '"/>';
        body += '<polygon class="d-head on" points="' + (xb + 8) + ',' + ny + ' ' + xb + ',' + (ny - 5) + ' ' + xb + ',' + (ny + 5) + '"/>';
      }
      pts.push(cx);
      body += shape(st.shape, cx, ny, s, nodeCls(st, i));
      body += '<text class="' + stepCls(st, i) + '" x="' + cx + '" y="' + (ny - s / 2 - 22) + '" text-anchor="middle">' + String(i + 1).padStart(2, '0') + (st.space ? ' · SPACE' : '') + '</text>';
      var nl = wrapText(st.name, 20), no = wrapText(st.note, 26), ty = ny + s / 2 + 34;
      body += '<text class="d-name" x="' + cx + '" y="' + ty + '" text-anchor="middle">' + tsp(nl, cx, 20) + '</text>';
      body += '<text class="d-note" x="' + cx + '" y="' + (ty + nl.length * 20 + 4) + '" text-anchor="middle">' + tsp(no, cx, 15) + '</text>';
    });
    var pulse = reduce ? '' : '<circle class="d-pulse" r="4" cy="' + ny + '" cx="' + pts[0] + '"><animate attributeName="cx" values="' + pts.join(';') + '" dur="6s" repeatCount="indefinite" calcMode="spline" keyTimes="' + pts.map(function (_, i) { return (i / (pts.length - 1)).toFixed(3); }).join(';') + '" keySplines="' + pts.slice(1).map(function () { return '.6 0 .4 1'; }).join(';') + '"/></circle>';
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Cuatro fases: conversación inicial, propuesta por escrito, desarrollo con las herramientas de Space, y entrega y seguimiento">' + grid + body + pulse + '</svg>';
  }
  function drawV() {
    var n = steps.length, W = 360, s = 40, cx = 30, row = 96, y0 = 36, H = y0 + (n - 1) * row + 58, body = '', ys = [];
    steps.forEach(function (st, i) {
      var cy = y0 + i * row; ys.push(cy);
      if (i < n - 1) {
        var ya = cy + s / 2 + 10, yb = cy + row - s / 2 - 14;
        body += '<line class="d-line on" x1="' + cx + '" y1="' + ya + '" x2="' + cx + '" y2="' + yb + '"/>';
        body += '<polygon class="d-head on" points="' + cx + ',' + (yb + 8) + ' ' + (cx - 5) + ',' + yb + ' ' + (cx + 5) + ',' + yb + '"/>';
      }
      body += shape(st.shape, cx, cy, s, nodeCls(st, i));
      body += '<text class="' + stepCls(st, i) + '" x="76" y="' + (cy - 12) + '">' + String(i + 1).padStart(2, '0') + (st.space ? ' · SPACE' : '') + '</text>';
      var nl = wrapText(st.name, 28);
      body += '<text class="d-name" x="76" y="' + (cy + 8) + '">' + tsp(nl, 76, 20) + '</text>';
      body += '<text class="d-note" x="76" y="' + (cy + 8 + nl.length * 20) + '">' + esc(st.note) + '</text>';
    });
    var pulse = reduce ? '' : '<circle class="d-pulse" r="4" cx="' + cx + '" cy="' + ys[0] + '"><animate attributeName="cy" values="' + ys.join(';') + '" dur="6s" repeatCount="indefinite"/></circle>';
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Cuatro fases: conversación inicial, propuesta por escrito, desarrollo con las herramientas de Space, y entrega y seguimiento">' + body + pulse + '</svg>';
  }
  // compact horizontal version for screens that are wider than tall but small (short phones, landscape)
  function drawM() {
    var n = steps.length, W = 360, s = 28, ny = 50, col = W / n, body = '', pts = [];
    steps.forEach(function (st, i) {
      var cx = col / 2 + i * col; pts.push(cx);
      if (i < n - 1) {
        var xa = cx + s / 2 + 6, xb = cx + col - s / 2 - 10;
        body += '<line class="d-line on" x1="' + xa + '" y1="' + ny + '" x2="' + xb + '" y2="' + ny + '"/>';
        body += '<polygon class="d-head on" points="' + (xb + 6) + ',' + ny + ' ' + xb + ',' + (ny - 4) + ' ' + xb + ',' + (ny + 4) + '"/>';
      }
      body += shape(st.shape, cx, ny, s, nodeCls(st, i));
      body += '<text class="' + stepCls(st, i) + '" x="' + cx + '" y="' + (ny - s / 2 - 12) + '" text-anchor="middle" style="font-size:10px">' + String(i + 1).padStart(2, '0') + '</text>';
      var nl = wrapText(st.name, 12), no = wrapText(st.note, 14), ty = ny + s / 2 + 22;
      body += '<text class="d-name" x="' + cx + '" y="' + ty + '" text-anchor="middle" style="font-size:13px">' + tsp(nl, cx, 16) + '</text>';
      body += '<text class="d-note" x="' + cx + '" y="' + (ty + nl.length * 16 + 4) + '" text-anchor="middle" style="font-size:9.5px">' + tsp(no, cx, 13) + '</text>';
    });
    var pulse = reduce ? '' : '<circle class="d-pulse" r="3.5" cy="' + ny + '" cx="' + pts[0] + '"><animate attributeName="cx" values="' + pts.join(';') + '" dur="6s" repeatCount="indefinite"/></circle>';
    return '<svg viewBox="0 0 ' + W + ' 176" role="img" aria-label="Cuatro fases: conversación inicial, propuesta por escrito, desarrollo con las herramientas de Space, y entrega y seguimiento">' + body + pulse + '</svg>';
  }
  var dg = document.getElementById('diagram'), dmode = null;
  if (dg) {
  function drawDiagram() { var w = dg.clientWidth, h = dg.clientHeight; if (!w) return; var r = h > 0 ? w / h : 9, m = w >= 640 ? (r >= 1.8 ? 'h' : 'v') : (r >= 1.15 ? 'm' : 'v'); if (m === dmode) return; dmode = m; dg.innerHTML = m === 'h' ? drawH() : m === 'm' ? drawM() : drawV(); }
  drawDiagram();
  if (window.ResizeObserver) new ResizeObserver(drawDiagram).observe(dg);
  }

  /* ---------- Hero canvases ---------- */
  function setupCanvas(cv, draw) {
    var ctx = cv.getContext('2d'), w = 0, h = 0, dpr = 1;
    function size() { dpr = Math.min(2, window.devicePixelRatio || 1); w = cv.clientWidth; h = cv.clientHeight; cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size();
    if (window.ResizeObserver) new ResizeObserver(function () { size(); if (reduce) draw(ctx, w, h, 1e9); }).observe(cv);
    var t0 = performance.now(), visible = true;
    if (window.IntersectionObserver) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(cv);
    if (reduce) { draw(ctx, w, h, 1e9); return; }
    (function loop(now) { if (visible) draw(ctx, w, h, now - t0); requestAnimationFrame(loop); })(t0);
  }
  function css(el, name) { return getComputedStyle(el).getPropertyValue(name).trim(); }

  var SPLIT = 50;
  // Drawing area of a hero pane: below its copy, inside its visible half
  function region(pane, w, h, side) {
    var c = pane.querySelector('.pane-copy'), narrow = w < 900;
    var y0 = c.offsetTop + c.offsetHeight + 40, y1 = h - 72, x0, x1;
    if (narrow) { x0 = 24; x1 = w - 24; }
    else if (side === 'studio') { var pr = w * SPLIT / 100, si = Math.max(40, c.offsetLeft); x0 = si; x1 = Math.max(x0 + 120, pr - si); }  // centred in its pane, starting where the text starts
    else { var pl = w * SPLIT / 100, inset = Math.max(40, c.offsetLeft - pl); x0 = pl + inset; x1 = Math.max(x0 + 120, w - inset); }  // centred in its pane, starting where the text starts
    return { x0: x0, y0: y0, x1: x1, y1: Math.max(y0 + 120, y1), w: x1 - x0, h: Math.max(120, y1 - y0) };
  }
  function clamp01(v) { return Math.max(0, Math.min(1, v)); }

  // Studio: light construction lines first, then the proposal in a heavier line, as when you project
  var cs = document.getElementById('cv-studio'), pS = cs.parentNode, C30 = Math.cos(Math.PI / 6), STUDIO_T0 = performance.now();
  // A house drawn as it is projected: the plot and the axes in fine lines, then the house itself, only its visible edges, in a heavier line
  function rY(Y, x0, x1, z0, z1, open) { var e = [[x0, Y, z0, x0, Y, z1], [x0, Y, z1, x1, Y, z1], [x1, Y, z1, x1, Y, z0]]; if (!open) e.push([x1, Y, z0, x0, Y, z0]); return e; }
  function rX(X, y0, y1, z0, z1) { return [[X, y0, z0, X, y0, z1], [X, y0, z1, X, y1, z1], [X, y1, z1, X, y1, z0], [X, y1, z0, X, y0, z0]]; }
  // A modern house: a long, low ground floor and a smaller upper volume set back over it; flat roofs, large glazing
  var GUIDES = [
    // plot and axes on the ground
    [-1.6, -1.2, 0, 10.6, -1.2, 0], [-1.6, 6.2, 0, 10.6, 6.2, 0], [-1.2, -1.6, 0, -1.2, 6.6, 0], [10.2, -1.6, 0, 10.2, 6.6, 0],
    [-1.6, 4, 0, 10.6, 4, 0], [-1.6, 3.3, 0, 10.6, 3.3, 0], [-1.6, 0, 0, 10.6, 0, 0], [0, -1.6, 0, 0, 6.6, 0], [5.4, -1.6, 0, 5.4, 6.6, 0], [9, -1.6, 0, 9, 6.6, 0],
    // verticals and floor heights
    [0, 4, -.3, 0, 4, 5.6], [9, 4, -.3, 9, 4, 3.4], [5.4, 3.3, 2, 5.4, 3.3, 5.6], [9, 0, -.3, 9, 0, 3.4],
    [-1, 4, 2.6, 10, 4, 2.6], [-1, 3.3, 5, 6.6, 3.3, 5]
  ];
  var PEDGES = [].concat(
    // ground floor
    [[0, 4, 0, 9, 4, 0], [9, 4, 0, 9, 0, 0]],
    [[0, 4, 0, 0, 4, 2.6], [9, 4, 0, 9, 4, 2.6], [9, 0, 0, 9, 0, 2.6]],
    [[0, 4, 2.6, 9, 4, 2.6], [9, 4, 2.6, 9, 0, 2.6], [9, 0, 2.6, 5.4, 0, 2.6], [0, 4, 2.6, 0, 3.3, 2.6]],
    // upper volume, set back
    [[0, 3.3, 2.6, 5.4, 3.3, 2.6], [5.4, 3.3, 2.6, 5.4, 0, 2.6]],
    [[0, 3.3, 2.6, 0, 3.3, 5], [5.4, 3.3, 2.6, 5.4, 3.3, 5], [5.4, 0, 2.6, 5.4, 0, 5]],
    [[0, 3.3, 5, 5.4, 3.3, 5], [5.4, 3.3, 5, 5.4, 0, 5], [5.4, 0, 5, 0, 0, 5], [0, 0, 5, 0, 3.3, 5]],
    // glazing and door
    rY(4, .7, 1.6, 0, 2.2, true), rY(4, 2.4, 8.2, 0, 2.3, true), [[4.33, 4, 0, 4.33, 4, 2.3], [6.27, 4, 0, 6.27, 4, 2.3]],
    rX(9, .8, 3.2, .8, 2),
    rY(3.3, .6, 4.8, 3.3, 4.4), [[2.7, 3.3, 3.3, 2.7, 3.3, 4.4]],
    rX(5.4, .7, 2.6, 3.1, 4.6),
    // the path to the door
    [[.7, 4, 0, .7, 6, 0], [1.6, 4, 0, 1.6, 6, 0]]
  );
  function bounds(list) { var a = [Infinity, Infinity, -Infinity, -Infinity]; list.forEach(function (s) { [[s[0], s[1], s[2]], [s[3], s[4], s[5]]].forEach(function (p) { var x = (p[0] - p[1]) * C30, y = (p[0] + p[1]) * .5 - p[2]; a[0] = Math.min(a[0], x); a[1] = Math.min(a[1], y); a[2] = Math.max(a[2], x); a[3] = Math.max(a[3], y); }); }); return a; }
  var hb = bounds(PEDGES.slice(0, -2));  // the building, without the path
  var gb = (function () { var a = [Infinity, Infinity, -Infinity, -Infinity]; GUIDES.forEach(function (s) { [[s[0], s[1], s[2]], [s[3], s[4], s[5]]].forEach(function (p) { var x = (p[0] - p[1]) * C30, y = (p[0] + p[1]) * .5 - p[2]; a[0] = Math.min(a[0], x); a[1] = Math.min(a[1], y); a[2] = Math.max(a[2], x); a[3] = Math.max(a[3], y); }); }); return a; })();
  function drawSegs(ctx, P, list, prog) {
    var total = list.length * prog;
    ctx.beginPath();
    for (var i = 0; i < list.length && i < total; i++) {
      var s = list[i], f = Math.min(1, total - i), p = P(s[0], s[1], s[2]), q = P(s[0] + (s[3] - s[0]) * f, s[1] + (s[4] - s[1]) * f, s[2] + (s[5] - s[2]) * f);
      ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]);
    }
    ctx.stroke();
  }
  setupCanvas(cs, function (ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h);
    var R = region(pS, w, h, 'studio'), col = css(pS, '--draw');
    // scale so the plot and its guides fit, but centre the house itself in the free area
    var bw = gb[2] - gb[0], bh = gb[3] - gb[1], u = Math.min(R.w / bw, R.h / bh) * .96;
    var ox = R.x0 + R.w / 2 - (hb[0] + hb[2]) / 2 * u, oy = R.y0 + R.h / 2 - (hb[1] + hb[3]) / 2 * u;
    function P(x, y, z) { return [ox + (x - y) * C30 * u, oy + ((x + y) * .5 - z) * u]; }
    var sbt = t >= 1e9 ? 1e9 : performance.now() - STUDIO_T0;
    if (sbt < 0) return;
    var cyc = 12600, tt = sbt % cyc, pg = clamp01(tt / 2600), pp = clamp01((tt - 2400) / 6200), fade = tt > 11000 ? 1 - (tt - 11000) / 1300 : 1;
    if (t >= 1e9) { pg = 1; pp = 1; fade = 1; }
    ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.globalAlpha = .45 * fade; ctx.lineWidth = .8; drawSegs(ctx, P, GUIDES, pg);
    ctx.globalAlpha = fade; ctx.lineWidth = 2.2; drawSegs(ctx, P, PEDGES, pp);
    ctx.globalAlpha = 1;
  });

  // Space: an electric pulse runs left to right and discovers the stages; branches split, rejoin and end in one node
  var cp = document.getElementById('cv-space'), pP = cp.parentNode, SPACE_T0 = performance.now();
  var NODES = [
    { x: 0, y: 0, icon: 'brief' },
    { x: .25, y: 0, icon: 'data' },
    { x: .5, y: 0, icon: 'agent' },
    { x: .75, y: -1, icon: 'model' },
    { x: .75, y: 0, icon: 'plan' },
    { x: .75, y: 1, icon: 'docs' },
    { x: 1, y: 0, icon: 'done', big: true }
  ];
  var EDUR = 1000, EDGES = [
    { a: 0, b: 1, t0: 300, bend: 0 },
    { a: 1, b: 2, t0: 1500, bend: -1 }, { a: 1, b: 2, t0: 1500, bend: 1 },
    { a: 2, b: 3, t0: 2900, bend: 0 }, { a: 2, b: 4, t0: 2900, bend: 0 }, { a: 2, b: 5, t0: 2900, bend: 0 },
    { a: 3, b: 6, t0: 4300, bend: 0 }, { a: 4, b: 6, t0: 4300, bend: 0 }, { a: 5, b: 6, t0: 4300, bend: 0 }
  ];
  NODES.forEach(function (n, i) { n.td = i === 0 ? 0 : Infinity; });
  EDGES.forEach(function (e) { NODES[e.b].td = Math.min(NODES[e.b].td, e.t0 + EDUR); });
  var BUILT = 6000, FLOW = 6400;
  function backOut(x) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
  function bez(P, t) { var u = 1 - t; return [u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0], u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1]]; }
  function sampleEdge(P) {
    var pts = [], len = [0];
    for (var i = 0; i <= 48; i++) { pts.push(bez(P, i / 48)); if (i) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); }
    var L = len[48]; return { pts: pts, f: len.map(function (l) { return l / L; }) };
  }
  function at(S, p) { for (var i = 1; i < S.f.length; i++) if (S.f[i] >= p) { var k = (p - S.f[i - 1]) / ((S.f[i] - S.f[i - 1]) || 1); return [S.pts[i - 1][0] + (S.pts[i][0] - S.pts[i - 1][0]) * k, S.pts[i - 1][1] + (S.pts[i][1] - S.pts[i - 1][1]) * k]; } return S.pts[S.pts.length - 1]; }
  function stroke(ctx, S, p0, p1) { ctx.beginPath(); var a = at(S, p0); ctx.moveTo(a[0], a[1]); for (var i = 0; i < S.f.length; i++) if (S.f[i] > p0 && S.f[i] < p1) ctx.lineTo(S.pts[i][0], S.pts[i][1]); var b = at(S, p1); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
  function pulse(ctx, S, p, col, strength) {
    var tail = .24, n = 8;
    ctx.lineCap = 'round';
    for (var i = 0; i < n; i++) { var a = Math.max(0, p - tail * (1 - i / n)), b = Math.max(0, p - tail * (1 - (i + 1) / n)); if (b <= a) continue; ctx.globalAlpha = strength * (i + 1) / n * .9; ctx.lineWidth = 1 + 1.6 * (i + 1) / n; stroke(ctx, S, a, b); }
    var h = at(S, p); ctx.globalAlpha = strength; ctx.shadowColor = col; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(h[0], h[1], 2.6, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
  }
  function icon(ctx, kind) {
    ctx.beginPath();
    if (kind === 'brief') { ctx.moveTo(-6, -8); ctx.lineTo(2, -8); ctx.lineTo(6, -4); ctx.lineTo(6, 8); ctx.lineTo(-6, 8); ctx.closePath(); ctx.moveTo(2, -8); ctx.lineTo(2, -4); ctx.lineTo(6, -4); ctx.moveTo(-3, 0); ctx.lineTo(3, 0); ctx.moveTo(-3, 3.5); ctx.lineTo(3, 3.5); }
    else if (kind === 'data') { ctx.ellipse(0, -6, 7, 2.6, 0, 0, 7); ctx.moveTo(-7, -6); ctx.lineTo(-7, 6); ctx.moveTo(7, -6); ctx.lineTo(7, 6); ctx.moveTo(-7, 6); ctx.ellipse(0, 6, 7, 2.6, 0, Math.PI, 0, true); ctx.moveTo(-7, 0); ctx.ellipse(0, 0, 7, 2.6, 0, Math.PI, 0, true); }
    else if (kind === 'agent') { ctx.rect(-5, -5, 10, 10); ctx.rect(-1.8, -1.8, 3.6, 3.6); [-2.5, 0, 2.5].forEach(function (q) { ctx.moveTo(q, -5); ctx.lineTo(q, -8); ctx.moveTo(q, 5); ctx.lineTo(q, 8); ctx.moveTo(-5, q); ctx.lineTo(-8, q); ctx.moveTo(5, q); ctx.lineTo(8, q); }); }
    else if (kind === 'model') { ctx.moveTo(0, -8); ctx.lineTo(7, -4); ctx.lineTo(7, 4); ctx.lineTo(0, 8); ctx.lineTo(-7, 4); ctx.lineTo(-7, -4); ctx.closePath(); ctx.moveTo(-7, -4); ctx.lineTo(0, 0); ctx.lineTo(7, -4); ctx.moveTo(0, 0); ctx.lineTo(0, 8); }
    else if (kind === 'plan') { ctx.moveTo(-7, 7); ctx.lineTo(-7, -7); ctx.lineTo(7, 7); ctx.closePath(); ctx.moveTo(-4, 4); ctx.lineTo(-4, -.5); ctx.lineTo(.5, 4); ctx.closePath(); }
    else if (kind === 'docs') { ctx.moveTo(0, -8); ctx.lineTo(8, -4); ctx.lineTo(0, 0); ctx.lineTo(-8, -4); ctx.closePath(); ctx.moveTo(-8, 0); ctx.lineTo(0, 4); ctx.lineTo(8, 0); ctx.moveTo(-8, 4); ctx.lineTo(0, 8); ctx.lineTo(8, 4); }
    else { ctx.moveTo(-5.5, .5); ctx.lineTo(-1.5, 4.5); ctx.lineTo(6, -4); }
    ctx.stroke();
  }
  setupCanvas(cp, function (ctx, w, h, t) {
    ctx.clearRect(0, 0, w, h);
    var R = region(pP, w, h, 'space'), col = css(pP, '--draw'), gnd = css(pP, '--ground');
    var bt = t >= 1e9 ? 1e9 : performance.now() - SPACE_T0;
    if (bt < 0) return;
    var rad = Math.max(13, Math.min(24, R.w / 22, R.h / 8)), padX = rad * 1.7;
    var spread = Math.max(rad * 2.4, Math.min(R.h / 2 - rad * 1.9, rad * 4.4)), cy = R.y0 + R.h / 2;
    function X(n) { return R.x0 + padX + n.x * (R.w - 2 * padX); }
    function Y(n) { return cy + n.y * spread; }
    var lt = bt >= BUILT && bt < 1e9 ? (bt - BUILT) % FLOW : -1;
    ctx.strokeStyle = col; ctx.fillStyle = col;
    EDGES.forEach(function (e) {
      var A = NODES[e.a], B = NODES[e.b], ax = X(A), ay = Y(A), bx = X(B), by = Y(B), dx = bx - ax, P;
      if (e.bend) P = [[ax, ay], [ax + dx * .3, ay + e.bend * spread * .75], [bx - dx * .3, by + e.bend * spread * .75], [bx, by]];
      else P = [[ax, ay], [ax + dx * .5, ay], [bx - dx * .5, by], [bx, by]];
      var S = sampleEdge(P), p = clamp01((bt - e.t0) / EDUR);
      if (p <= 0) return;
      ctx.globalAlpha = .5; ctx.lineWidth = 1.2; ctx.lineCap = 'round'; stroke(ctx, S, 0, p);
      if (p < 1) pulse(ctx, S, p, col, 1);
      if (lt >= 0) { var q = (lt - (e.t0 - 300)) / EDUR; if (q > 0 && q < 1) pulse(ctx, S, q, col, .6); }
    });
    ctx.globalAlpha = 1;
    NODES.forEach(function (n) {
      var age = bt - n.td; if (age < 0) return;
      var r = rad * (n.big ? 1.25 : 1), x = X(n), y = Y(n), sc = age < 560 ? Math.max(0, backOut(clamp01(age / 560))) : 1;
      if (age < 1000) { var e1 = clamp01(age / 1000); ctx.globalAlpha = .7 * (1 - e1); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(x, y, r * (1 + 1.3 * e1), 0, 7); ctx.stroke(); }
      if (lt >= 0) {
        var ba = lt - Math.max(0, n.td - 300);
        if (ba >= 0 && ba < 1300) { var e2 = clamp01(ba / 1300); ctx.globalAlpha = .45 * (1 - e2); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x, y, r * (1 + .8 * e2), 0, 7); ctx.stroke(); sc *= 1 + .06 * Math.sin(Math.PI * clamp01(ba / 320)); }
      }
      ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(x, y, r * sc, 0, 7); ctx.fill();
      var ia = clamp01((age - 160) / 300);
      if (ia > 0) {
        var f = r * sc * .5 / 9;
        ctx.save(); ctx.translate(x, y); ctx.scale(f, f); ctx.globalAlpha = ia; ctx.strokeStyle = gnd; ctx.lineWidth = 1.5 / f; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; icon(ctx, n.icon); ctx.restore();
        ctx.strokeStyle = col;
      }
    });
    ctx.globalAlpha = 1;
  });

  /* ---------- Hero: the branch under the pointer gains room ---------- */
  var hero = document.querySelector('.hero'), target = 50, running = false;
  function fadePane(p, q) {
    var o = 1 - clamp01(q * 1.8);
    p.querySelector('.pane-copy').style.opacity = o.toFixed(3);
    p.querySelector('canvas').style.opacity = o.toFixed(3);
    var mt = p.querySelector('.media-tag'); if (mt) mt.style.opacity = (.7 * o).toFixed(3);
    p.querySelector('.iso').style.opacity = clamp01((q - .5) / .5).toFixed(3);
  }
  function applySplit() {
    hero.style.setProperty('--split', SPLIT.toFixed(2) + '%');
    fadePane(pS, clamp01((50 - SPLIT - 3) / 10));
    fadePane(pP, clamp01((SPLIT - 50 - 3) / 10));
  }
  function stepSplit() { SPLIT += (target - SPLIT) * .08; applySplit(); if (Math.abs(target - SPLIT) > .05) requestAnimationFrame(stepSplit); else { SPLIT = target; applySplit(); running = false; } }
  function aim(v) { target = v; if (!running) { running = true; requestAnimationFrame(stepSplit); } }
  if (!reduce) {
    hero.addEventListener('pointermove', function (e) {
      if (window.innerWidth < 900 || e.pointerType === 'touch') return;
      var r = hero.getBoundingClientRect(), x = (e.clientX - r.left) / r.width;
      aim(Math.max(32, Math.min(68, 50 - (x - .5) * 36)));
    });
    hero.addEventListener('pointerleave', function () { aim(50); });
  }

  /* ---------- Light threshold between the two worlds ---------- */
  var band = document.getElementById('umbral') || document.createElement('div');
  var L = [251, 250, 248], D = [12, 13, 15];
  function mix(a, b, p) { return 'rgb(' + a.map(function (v, i) { return Math.round(v + (b[i] - v) * p); }).join(',') + ')'; }
  function onScroll() {
    var r = band.getBoundingClientRect(), vh = window.innerHeight;
    var p = Math.max(0, Math.min(1, (vh * .85 - r.top) / (r.height * .9)));
    band.setAttribute('data-branch', p > .5 ? 'space' : 'studio');
    band.style.background = mix(L, D, p);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- Header follows the world beneath it ---------- */
  var top = document.getElementById('top'), radios = top.querySelectorAll('[role="radio"]');
  var zones = [].slice.call(document.querySelectorAll('main > section, footer'));
  function headerBranch() {
    var y = top.getBoundingClientRect().bottom + 1, branch = 'studio', inSpace = false;
    zones.forEach(function (z) { var r = z.getBoundingClientRect(); if (r.top <= y && r.bottom > y) { branch = z.getAttribute('data-branch') || 'studio'; if (z.id === 'space' || z.id === 'casos' || z.id === 'contacto') inSpace = true; } });
    if (zones[0].getBoundingClientRect().bottom > y) branch = 'studio';
    top.setAttribute('data-branch', branch);
    var active = inSpace || branch === 'space' ? 'space' : 'studio';
    if (window.innerWidth < 900) { var pr = pP.getBoundingClientRect(); if (pr.top <= y + 2 && pr.bottom > y) active = 'space'; }
    top.setAttribute('data-active', active);
    var ar = document.getElementById('alas').getBoundingClientRect();
    top.setAttribute('data-logo', zones[0].getBoundingClientRect().bottom > y || (ar.top <= y && ar.bottom > y) ? 'home' : active);
    radios.forEach(function (b) { b.setAttribute('aria-checked', String(b.getAttribute('data-go') === active)); b.tabIndex = b.getAttribute('data-go') === active ? 0 : -1; });
  }
  window.addEventListener('scroll', headerBranch, { passive: true });
  headerBranch();
  radios.forEach(function (b) {
    b.addEventListener('click', function () {
      var go = b.getAttribute('data-go');
      if (window.innerWidth < 900 && !reduce) { var pane = go === 'space' ? pP : pS; glide(pane.getBoundingClientRect().top + window.scrollY - top.offsetHeight); return; }
      document.getElementById(go).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
    b.addEventListener('keydown', function (e) { if (/Arrow/.test(e.key)) { e.preventDefault(); var o = [].filter.call(radios, function (x) { return x !== b; })[0]; o.focus(); o.click(); } });
  });
  // phone menu
  (function () {
    var btn = document.getElementById('menu-btn'); if (!btn) return;
    function set(open) { top.classList.toggle('menu-open', open); btn.setAttribute('aria-expanded', String(open)); btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); }
    btn.addEventListener('click', function () { set(!top.classList.contains('menu-open')); });
    top.querySelectorAll('.nav a').forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
    window.addEventListener('scroll', function () { if (top.classList.contains('menu-open') && !btn.matches(':focus')) set(false); }, { passive: true });
  })();

  /* ---------- Agent simulations: steps tick, the report fills in ---------- */
  document.querySelectorAll('[data-agent]').forEach(function (fig) {
    var items = [].slice.call(fig.querySelectorAll('.agent-steps li')), state = fig.querySelector('.agent-state'), rows = [].slice.call(fig.querySelectorAll('[data-at]'));
    if (!items.length) return;
    function paint(k) {
      items.forEach(function (li, i) { li.className = i < k ? 'done' : i === k ? 'run' : ''; li.querySelector('.st').textContent = i < k ? '●' : i === k ? '◐' : '○'; });
      rows.forEach(function (r) { r.classList.toggle('on', k >= +r.getAttribute('data-at')); });
      var done = k >= items.length; fig.classList.toggle('is-done', done); state.textContent = done ? 'completado' : 'en curso';
    }
    if (reduce) { paint(items.length); return; }
    var k = 0, timer = 0;
    function tick() { k = (k + 1) % (items.length + 4); paint(Math.min(k, items.length)); }
    paint(0);
    if (window.IntersectionObserver) new IntersectionObserver(function (es) { if (es[0].isIntersecting) { if (!timer) timer = setInterval(tick, 1100); } else { clearInterval(timer); timer = 0; } }, { threshold: .25 }).observe(fig);
    else timer = setInterval(tick, 1100);
  });

  /* ---------- Space: an automated commission, from the web form to the closed project ---------- */
  (function () {
    var host = document.getElementById('autoflow'); if (!host) return;
    var fig = host.parentNode, capN = fig.querySelector('.autoflow-cap .n'), capT = fig.querySelector('.autoflow-cap .t');
    var NS = 'http://www.w3.org/2000/svg';
    var ICON = {
      web: 'M3 6.5C3 5.7 3.7 5 4.5 5h15c.8 0 1.5.7 1.5 1.5v11c0 .8-.7 1.5-1.5 1.5h-15c-.8 0-1.5-.7-1.5-1.5zM3 9h18M6 7h.01M8.5 7h.01M7 13h6M7 15.5h4',
      form: 'M6 3h12v18H6zM9 7.5h6M9 11h6M9 14.5h6M9 18h3',
      hub: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
      agent: 'M8 8h8v8H8zM10.5 10.5h3v3h-3zM10 8V5M14 8V5M10 19v-3M14 19v-3M8 10H5M8 14H5M19 10h-3M19 14h-3',
      bim: 'M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9',
      docs: 'M8 3h8l4 4v11H8zM16 3v4h4M5 7v14h11M11 11h6M11 14h6',
      build: 'M3 21h10M7 21V4M3 7l4-3 13 3zM17 7v4.5M15.5 11.5h3v3h-3z',
      gov: 'M3 9l9-5 9 5zM5.5 10.5v7M9.5 10.5v7M14.5 10.5v7M18.5 10.5v7M3 20h18',
      done: 'M5.5 12.5l4.5 4.5 8.5-9'
    };
    // title and subtitle of every node; "|" marks where a long subtitle may break
    var NODES = {
      web: { ic: 'web', lab: 'Web', sub: 'Identidad visual ·|Funcionalidades ·|Mantenimiento' },
      form: { ic: 'form', lab: 'Formulario', sub: 'Automatizaciones ·|Integraciones API · MCP' },
      hub: { ic: 'hub', lab: 'Gestión interna', sub: 'CRM y proyectos', big: true },
      agent: { ic: 'agent', lab: 'Agentes automatizados', sub: 'Informes preliminares ·|Análisis normativo ·|Propuestas de aproximación' },
      bim: { ic: 'bim', lab: 'Modelo BIM', sub: 'Gemelo digital del edificio' },
      docs: { ic: 'docs', lab: 'Documentación y sistemas', sub: 'Estructura · MEP · Planimetría ·|Mediciones · Presupuestos ·|Memorias' },
      build: { ic: 'build', lab: 'Construcción', sub: 'Obra sobre el gemelo|digital vivo' },
      gov: { ic: 'gov', lab: 'Administración', sub: 'Tramitación · Gestión ·|Resolución de incidencias' },
      end: { ic: 'done', lab: 'Proyecto cerrado', sub: 'Entrega · Archivo', end: true }
    };
    var LOOP = { lab: 'Iteraciones con IA', sub: 'Alternativas proyectuales ·|Propuestas visuales' };
    var STEPS = [
      { a: 'web', b: 'form', txt: 'Creamos y mantenemos la web, su identidad visual y sus funcionalidades. El cliente entra y rellena el formulario.' },
      { a: 'form', b: 'hub', txt: 'El formulario dispara las automatizaciones: integraciones API y conectores MCP crean el proyecto en la herramienta de gestión.' },
      { a: 'hub', b: 'agent', txt: 'La gestión interna activa los agentes: informes preliminares, análisis normativo y propuestas de aproximación.' },
      { a: 'agent', b: 'bim', txt: 'Con esos datos desarrollamos el modelo BIM, el gemelo digital del edificio.' },
      { a: 'bim', b: 'bim', k: 'loop', txt: 'Iteramos con IA sobre el modelo: alternativas proyectuales y propuestas visuales.' },
      { a: 'bim', b: 'docs', txt: 'Del modelo salen la documentación y los sistemas: estructura, MEP, planos, mediciones, presupuestos y memorias.' },
      { a: 'docs', b: 'hub', txt: 'Todo vuelve a la gestión interna y el equipo lo revisa.' },
      { a: 'hub', b: 'build', txt: 'Empieza la construcción del modelo diseñado.' },
      { a: 'build', b: 'bim', k: 'sync', txt: 'Obra y gemelo digital avanzan juntos: el modelo sigue vivo y genera alternativas durante la obra.' },
      { a: 'build', b: 'gov', txt: 'Ante la Administración tramitamos, gestionamos y resolvemos incidencias.' },
      { a: 'gov', b: 'hub', txt: 'La respuesta vuelve a la gestión interna.' },
      { a: 'hub', b: 'end', txt: 'El proyecto se entrega y se cierra.' },
      { a: 'end', b: 'hub', k: 'close', txt: 'El cierre vuelve a la gestión interna: el ciclo se completa y queda listo para el siguiente encargo.' }
    ];
    var LOOPS = [['hub', 'agent', 'bim', 'docs'], ['hub', 'build', 'gov']];
    var LAY = {
      wide: { w: 1200, h: 650, r: 30, R: 44, fs: 15, ss: 12, lh: 17, bend: .16, lr: 13, side: 'top', sub: 3,
        p: { web: [80, 345], form: [255, 345], hub: [600, 345], agent: [420, 175], bim: [600, 132], docs: [780, 175], build: [780, 515], gov: [420, 515], end: [1115, 345] },
        l: { web: 'b', form: 'b', hub: 'b', agent: 'l', bim: 'b', docs: 'r', build: 'r', gov: 'l', end: 'b' } },
      narrow: { w: 360, h: 1010, r: 22, R: 30, fs: 12.5, ss: 10.5, lh: 14, bend: -.16, hubBend: .05, lr: 10, side: 'left', sub: 4,
        p: { web: [40, 36], form: [40, 130], hub: [64, 520], agent: [150, 250], bim: [150, 385], docs: [150, 520], build: [150, 680], gov: [150, 815], end: [64, 960] },
        l: { web: 'r', form: 'r', hub: 'b', agent: 'r', bim: 'r', docs: 'r', build: 'r', gov: 'r', end: 'r' } }
    };
    var T_EDGE = 1050, T_LOOP = 1700, T_SYNC = 3400, T_DWELL = 520, FADE_ORDER = ['web', 'form', 'agent', 'bim', 'docs', 'build', 'gov', 'end'], F0 = 700, F_GAP = 280, F_DUR = 450;
    var starts = [], tt = 400;
    function dur(s) { return s.k === 'loop' ? T_LOOP : s.k === 'sync' ? T_SYNC : s.k === 'close' ? T_EDGE * 1.2 : T_EDGE; }
    STEPS.forEach(function (s) { starts.push(tt); tt += dur(s) + T_DWELL; });
    // the close: the closed project lights up, its pulse runs back to internal management, which blinks while every other node fades out in order, and then fades itself
    var T_END = tt - T_DWELL, BRAND_AT = T_END + F0 + (FADE_ORDER.length - 1) * F_GAP + F_DUR, HUB_FADE = BRAND_AT + 2600, T_CYCLE = HUB_FADE + F_DUR + 900;
    function fadeAt(k) { return k === 'hub' ? HUB_FADE : T_END + F0 + FADE_ORDER.indexOf(k) * F_GAP; }
    var L, mode = '', svg, el = {}, edges = [], dot, shown = {}, lastStep = -2, finalOn = false, syncOn = false, active = false, clock = 0, last = null;

    function mk(tag, at, parent) { var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); if (parent) parent.appendChild(e); return e; }
    function rad(k) { return NODES[k].big ? L.R : L.r; }
    function centroid(ks) { var x = 0, y = 0; ks.forEach(function (k) { x += L.p[k][0]; y += L.p[k][1]; }); return [x / ks.length, y / ks.length]; }
    function loopCentre() { var P = L.p.bim, d = rad('bim') + L.lr + 3; return L.side === 'top' ? [P[0], P[1] - d] : [P[0] - d, P[1]]; }
    function circle3(p1, p2, p3) {
      var ax = p1[0], ay = p1[1], bx = p2[0], by = p2[1], cx = p3[0], cy = p3[1], d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
      var ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d, uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d;
      return [ux, uy, Math.hypot(ax - ux, ay - uy)];
    }
    function arcPath(a, b, O) {
      var A = L.p[a], B = L.p[b], ta = Math.atan2(A[1] - O[1], A[0] - O[0]), tb = Math.atan2(B[1] - O[1], B[0] - O[0]), d = tb - ta;
      while (d > Math.PI) d -= 2 * Math.PI; while (d <= -Math.PI) d += 2 * Math.PI;
      var sg = d > 0 ? 1 : -1, t0 = ta + sg * (rad(a) + 5) / O[2], t1 = tb - sg * (rad(b) + 9) / O[2];
      return 'M' + (O[0] + O[2] * Math.cos(t0)).toFixed(1) + ' ' + (O[1] + O[2] * Math.sin(t0)).toFixed(1) + 'A' + O[2].toFixed(1) + ' ' + O[2].toFixed(1) + ' 0 0 ' + (sg > 0 ? 1 : 0) + ' ' + (O[0] + O[2] * Math.cos(t1)).toFixed(1) + ' ' + (O[1] + O[2] * Math.sin(t1)).toFixed(1);
    }
    function edgePath(s) {
      if (mode === 'wide') {
        var P = L.p, hy = P.hub[1];
        if ((s.a === 'agent' && s.b === 'bim') || (s.a === 'bim' && s.b === 'docs')) return arcPath(s.a, s.b, circle3(P.agent, P.bim, P.docs));
        if (s.a === 'build' && s.b === 'gov') return arcPath(s.a, s.b, circle3(P.build, [P.bim[0], 2 * hy - P.bim[1]], P.gov));
      }
      var A = L.p[s.a], B = L.p[s.b], mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, dx = B[0] - A[0], dy = B[1] - A[1], len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len, c = [mx, my];
      var loop = LOOPS.filter(function (g) { return g.indexOf(s.a) > -1 && g.indexOf(s.b) > -1; })[0];
      if (s.bend) c = [mx + nx * len * s.bend, my + ny * len * s.bend];
      else if (loop) { var o = centroid(loop), bd = s.a === 'hub' || s.b === 'hub' ? (L.hubBend || Math.abs(L.bend)) : L.bend; if (nx * (mx - o[0]) + ny * (my - o[1]) < 0) { nx = -nx; ny = -ny; } c = [mx + nx * len * bd, my + ny * len * bd]; }
      function trim(P, Q, d) { var vx = Q[0] - P[0], vy = Q[1] - P[1], l = Math.hypot(vx, vy) || 1; return [P[0] + vx / l * d, P[1] + vy / l * d]; }
      var st = trim(A, c, rad(s.a) + 5), e = trim(B, c, rad(s.b) + 9);
      return 'M' + st[0].toFixed(1) + ' ' + st[1].toFixed(1) + 'Q' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + ' ' + e[0].toFixed(1) + ' ' + e[1].toFixed(1);
    }
    // the AI loop: a small circle beside the model, outside its incoming and outgoing arrows
    function loopPath() {
      var C = loopCentre(), q = L.lr, back = L.side === 'top' ? Math.PI / 2 : 0, a0 = back + .55, a1 = back - .55 + 2 * Math.PI;
      return 'M' + (C[0] + q * Math.cos(a0)).toFixed(1) + ' ' + (C[1] + q * Math.sin(a0)).toFixed(1) + 'A' + q + ' ' + q + ' 0 1 1 ' + (C[0] + q * Math.cos(a1)).toFixed(1) + ' ' + (C[1] + q * Math.sin(a1)).toFixed(1);
    }
    function subLines(txt) {
      var parts = txt.split('|').map(function (t) { return t.trim(); });
      if (mode === 'wide') return parts.join(' ').length < 34 ? [parts.join(' ')] : parts;
      // on a phone: rewrap to the width beside the nodes
      var out = [], line = '';
      parts.join(' ').split(' ').reduce(function (a, w) { if (w === '·' && a.length) a[a.length - 1] += ' ·'; else a.push(w); return a; }, []).forEach(function (w) { if (line && (line + ' ' + w).length > 25) { out.push(line); line = w; } else line = line ? line + ' ' + w : w; });
      if (line) out.push(line); return out;
    }
    function titleLines(txt) { return mode === 'narrow' && txt.length > (txt === NODES.hub.lab ? 10 : 19) && txt.indexOf(' ') > 0 ? [txt.slice(0, txt.lastIndexOf(' ', 16) > 0 ? txt.lastIndexOf(' ', 16) : txt.indexOf(' ')), txt.slice((txt.lastIndexOf(' ', 16) > 0 ? txt.lastIndexOf(' ', 16) : txt.indexOf(' ')) + 1)] : [txt]; }
    // a text block with a backing in the page colour, so lines that pass behind it never cut through the words
    function block(g, x, y, anc, lines, cls) {
      var tg = mk('g', {}, g), bg = mk('rect', { 'class': 'af-mask', rx: 4 }, tg);
      lines.forEach(function (ln, i) { mk('text', { x: x, y: (y + i * L.lh).toFixed(1), 'text-anchor': anc, 'class': ln[1] + (cls ? ' ' + cls : ''), style: 'font-size:' + ln[2] + 'px' }, tg).textContent = ln[0]; });
      try { var b = tg.getBBox(); bg.setAttribute('x', (b.x - 4).toFixed(1)); bg.setAttribute('y', (b.y - 2).toFixed(1)); bg.setAttribute('width', (b.width + 8).toFixed(1)); bg.setAttribute('height', (b.height + 4).toFixed(1)); } catch (err) {}
    }
    function place(P, r, pos, n) {
      var tot = (n - 1) * L.lh;
      if (pos === 'b') return [P[0], P[1] + r + L.fs + 6, 'middle'];
      if (pos === 't') return [P[0], P[1] - r - 10 - tot, 'middle'];
      return [P[0] + (pos === 'l' ? -1 : 1) * (r + 14), P[1] - tot / 2 + L.fs * .35, pos === 'l' ? 'end' : 'start'];
    }
    function linesOf(lab, sub, cls) { var lines = titleLines(lab).map(function (t) { return [t, cls || 'af-lab', L.fs]; }); subLines(sub).forEach(function (t) { lines.push([t, 'af-sub', L.ss]); }); return lines; }
    function nodeLabel(k, g) {
      var lines = linesOf(NODES[k].lab, NODES[k].sub), extra = k === 'bim' && L.side === 'left' ? linesOf(LOOP.lab, LOOP.sub).length : 0;
      var q = place(L.p[k], rad(k), L.l[k], lines.length + extra); block(g, q[0], q[1], q[2], lines);
      if (extra) el.loopAt = [q[0], q[1] + lines.length * L.lh + 4, q[2]];
    }
    function build() {
      var nm = fig.clientWidth >= 700 ? 'wide' : 'narrow'; if (nm === mode) return; mode = nm; L = LAY[nm];
      host.innerHTML = ''; el = {}; edges = []; shown = {}; lastStep = -2; finalOn = syncOn = false;
      svg = mk('svg', { viewBox: '0 0 ' + L.w + ' ' + L.h, 'aria-hidden': 'true' }, host);
      var defs = mk('defs', {}, svg);
      ['off', 'on'].forEach(function (m) { var mr = mk('marker', { id: 'af-ar-' + m, viewBox: '0 0 10 10', refX: 6, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, defs); mk('path', { d: 'M0 0L10 5L0 10z', 'class': 'af-ar-' + m }, mr); });
      var gE = mk('g', {}, svg), gL = mk('g', {}, svg), gN = mk('g', {}, svg);
      STEPS.forEach(function (s) {
        if (s.k === 'sync') { edges.push(null); return; }
        var d = s.k === 'loop' ? loopPath() : edgePath(s);
        var ghost = s.k === 'close' ? null : mk('path', { d: d, 'class': 'af-ghost', 'marker-end': 'url(#af-ar-off)' }, gE);
        var live = mk('path', { d: d, 'class': 'af-live' + (s.k === 'close' ? ' af-orange' : '') }, gE), len = live.getTotalLength();
        live.style.strokeDasharray = len + ' ' + len; live.style.strokeDashoffset = len;
        edges.push({ ghost: ghost, live: live, len: len, done: false });
      });
      Object.keys(NODES).forEach(function (k) {
        var P = L.p[k], r = rad(k), s = r / 19;
        var g = mk('g', { transform: 'translate(' + P[0] + ' ' + P[1] + ')', 'class': 'af-node' + (NODES[k].end ? ' af-end' : '') + (NODES[k].big ? ' af-hub' : '') }, gN);
        var pop = mk('g', { 'class': 'af-pop' }, g);
        mk('circle', { r: r + 8, 'class': 'af-ping' }, pop);
        mk('circle', { r: r, 'class': 'af-c' }, pop);
        mk('path', { d: ICON[NODES[k].ic], transform: 'translate(' + (-12 * s) + ' ' + (-12 * s) + ') scale(' + s + ')', 'class': 'af-ic' }, pop);
        var lg = mk('g', { 'class': 'af-l' }, gL); nodeLabel(k, lg);
        el[k] = { g: g, l: lg };
      });
      // the end of the cycle: internal management becomes ALAS, the isotype in its disc and the full wordmark underneath
      var iso = document.querySelector('.top .logo-mono'), word = document.querySelector('.foot .logo'), H = L.p.hub, R0 = rad('hub');
      if (iso) { var ig = mk('svg', { x: -R0, y: -R0, width: 2 * R0, height: 2 * R0, viewBox: iso.getAttribute('viewBox'), 'class': 'af-iso' }, el.hub.g.querySelector('.af-pop')); [].slice.call(iso.querySelectorAll('path:not(.disc)')).forEach(function (q) { mk('path', { d: q.getAttribute('d') }, ig); }); }
      el.brand = mk('g', { 'class': 'af-brand' }, gL);
      if (word) { var ww = mode === 'wide' ? 150 : 104, wh = ww * 332 / 1379, wg = mk('svg', { x: H[0] - ww / 2, y: H[1] + R0 + 14, width: ww, height: wh, viewBox: word.getAttribute('viewBox') }, el.brand); [].slice.call(word.querySelectorAll('path')).forEach(function (q) { mk('path', { d: q.getAttribute('d') }, wg); }); }
      // the loop's own title and subtitle
      var C = loopCentre(), ll = linesOf(LOOP.lab, LOOP.sub, 'af-lab af-acc');
      el.loop = mk('g', { 'class': 'af-l' }, gL);
      if (L.side === 'top') block(el.loop, C[0], C[1] - L.lr - 10 - (ll.length - 1) * L.lh, 'middle', ll);
      else block(el.loop, el.loopAt[0], el.loopAt[1], el.loopAt[2], ll);
      dot = mk('g', { 'class': 'af-dot', style: 'opacity:0' }, svg);
      mk('circle', { r: 11, 'class': 'af-glow' }, dot); mk('circle', { r: 4.5, 'class': 'af-core' }, dot);
      render(clock);
    }
    function ping(k, delay) { var p = el[k].g.querySelector('.af-ping'); p.style.animationDelay = (delay || 0) + 'ms'; p.classList.remove('go'); void p.getBBox(); p.classList.add('go'); }
    function on(k, v) {
      if (!!shown[k] === v) return; shown[k] = v;
      el[k].g.classList.toggle('on', v); el[k].l.classList.toggle('on', v);
      if (v && !reduce) ping(k);
    }
    function ease(x) { return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
    function render(t) {
      if (!svg) return;
      var cyc = reduce ? T_END : t % T_CYCLE;
      var reached = { web: true }, cur = -1, dotP = null, dotO = false, sync = false, loopSeen = false;
      STEPS.forEach(function (s, i) {
        var p = Math.max(0, Math.min(1, (cyc - starts[i]) / dur(s)));
        if (cyc >= starts[i]) cur = i;
        if (s.k === 'sync') { if (p > 0 && p < 1) sync = true; return; }
        var e = edges[i], k = ease(p); e.live.style.strokeDashoffset = (e.len * (1 - k)).toFixed(1);
        var done = p >= 1; if (done !== e.done) { e.done = done; if (e.ghost) { e.ghost.setAttribute('marker-end', done ? 'url(#af-ar-on)' : 'url(#af-ar-off)'); e.ghost.classList.toggle('done', done); } }
        if (p > 0 && p < 1) { dotP = e.live.getPointAtLength(e.len * k); dotO = s.k === 'close'; }
        if (s.k === 'loop' && p > 0) loopSeen = true;
        if (done) reached[s.b] = true;
      });
      Object.keys(NODES).forEach(function (k) { on(k, !!reached[k]); });
      el.loop.classList.toggle('on', loopSeen);
      if (sync !== syncOn) { syncOn = sync; el.bim.g.classList.toggle('sync', sync); el.build.g.classList.toggle('sync', sync); }
      // the close: orange on the closed project, then on internal management, which blinks while the rest fades out
      var endOn = edges[11].done, hubOn = edges[12].done;
      if (endOn !== !!el.end.or) { el.end.or = endOn; el.end.g.classList.toggle('orange', endOn); if (endOn && !reduce) ping('end'); }
      if (hubOn !== !!el.hub.or) { el.hub.or = hubOn; el.hub.g.classList.toggle('orange', hubOn); el.hub.g.classList.toggle('blink', hubOn && !reduce); if (hubOn && !reduce) ping('hub'); }
      var brand = !reduce && cyc >= BRAND_AT;
      if (brand !== !!el.brand.on) { el.brand.on = brand; el.hub.g.classList.toggle('brand', brand); el.hub.l.classList.toggle('off', brand); el.brand.classList.toggle('on', brand); }
      var op = {};
      Object.keys(NODES).forEach(function (k) { op[k] = reduce ? 1 : 1 - Math.max(0, Math.min(1, (cyc - fadeAt(k)) / F_DUR)); el[k].g.style.opacity = op[k]; el[k].l.style.opacity = op[k] < 1 ? op[k] * (el[k].l.classList.contains('on') ? 1 : .38) : ''; });
      el.loop.style.opacity = op.bim < 1 ? op.bim : '';
      el.brand.style.opacity = op.hub < 1 ? op.hub : ''; el.brand.style.transition = op.hub < 1 ? 'none' : '';
      STEPS.forEach(function (s, i) { var e = edges[i]; if (!e) return; var o = Math.min(op[s.a], op[s.b]); e.live.style.opacity = o; if (e.ghost) e.ghost.style.opacity = o; });
      if (dotP) { dot.setAttribute('transform', 'translate(' + dotP.x.toFixed(1) + ' ' + dotP.y.toFixed(1) + ')'); dot.style.opacity = 1; dot.classList.toggle('orange', dotO); } else dot.style.opacity = 0;
      var stp = Math.max(0, cur);
      if (stp !== lastStep) { lastStep = stp; capN.textContent = String(stp + 1).padStart(2, '0') + '/' + STEPS.length; capT.textContent = STEPS[stp].txt; }
    }
    function frame(now) {
      if (!active) { last = null; return; }
      if (last !== null) clock += now - last; last = now;
      render(clock); requestAnimationFrame(frame);
    }
    build();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { mode = ''; build(); });
    if (window.ResizeObserver) new ResizeObserver(function () { build(); }).observe(fig); else window.addEventListener('resize', build);
    if (reduce) { clock = T_END; render(clock); return; }
    if (window.IntersectionObserver) new IntersectionObserver(function (es) { var v = es[0].isIntersecting; if (v && !active) { active = true; requestAnimationFrame(frame); } else if (!v) active = false; }, { threshold: .3 }).observe(fig);
    else { active = true; requestAnimationFrame(frame); }
  })();

  /* ---------- Intro: full name, fade, then each S writes its branch ---------- */
  var intro = document.getElementById('intro'), timers = [], raf = 0;
  var ig = intro.querySelector('.intro-svg g'), ipaths = [].slice.call(ig.querySelectorAll('path')), twin = intro.querySelector('.intro-svg .twin'), heroEl = document.querySelector('.hero');
  // Centerlines of the four letters, redrawn on the logo's own geometry: straight strokes joined by arcs of one radius (logo units)
  var CL = [[[0.0,310.0],[1.6,306.3],[3.1,302.6],[4.7,298.9],[6.3,295.2],[7.8,291.5],[9.4,287.8],[11.0,284.1],[12.5,280.4],[14.1,276.7],[15.7,273.0],[17.2,269.3],[18.8,265.7],[20.4,262.0],[21.9,258.3],[23.5,254.6],[25.1,250.9],[26.6,247.2],[28.2,243.5],[29.8,239.8],[31.3,236.1],[32.9,232.4],[34.5,228.7],[36.0,225.0],[37.6,221.3],[39.2,217.6],[40.7,213.9],[42.3,210.2],[43.9,206.5],[45.4,202.8],[47.0,199.1],[48.6,195.4],[50.1,191.7],[51.7,188.0],[53.3,184.3],[54.8,180.7],[56.4,177.0],[58.0,173.3],[59.5,169.6],[61.1,165.9],[62.7,162.2],[64.2,158.5],[65.8,154.8],[67.4,151.1],[68.9,147.4],[70.5,143.7],[72.1,140.0],[73.6,136.3],[75.2,132.6],[76.8,128.9],[78.3,125.2],[79.9,121.5],[81.5,117.8],[83.0,114.1],[84.6,110.4],[86.2,106.7],[87.8,103.0],[89.3,99.3],[90.9,95.7],[92.5,92.0],[94.0,88.3],[95.6,84.6],[97.2,80.9],[98.7,77.2],[100.3,73.5],[101.9,69.8],[103.4,66.1],[105.0,62.4],[106.6,58.7],[108.1,55.0],[109.7,51.3],[111.3,47.6],[112.8,43.9],[114.4,40.2],[116.0,36.5],[117.5,32.8],[119.3,29.1],[121.4,25.6],[123.9,22.3],[126.6,19.2],[129.6,16.4],[132.9,13.9],[136.4,11.7],[140.0,9.8],[143.9,8.3],[147.8,7.2],[151.9,6.4],[156.0,6.0],[160.1,6.0],[164.2,6.4],[168.2,7.2],[172.2,8.3],[176.0,9.8],[179.7,11.7],[183.2,13.9],[186.4,16.4],[189.5,19.2],[192.2,22.3],[194.6,25.6],[196.8,29.1],[198.5,32.8],[200.1,36.5],[201.7,40.2],[203.2,43.9],[204.8,47.6],[206.4,51.3],[207.9,55.0],[209.5,58.7],[211.1,62.4],[212.6,66.1],[214.2,69.8],[215.8,73.5],[217.3,77.2],[218.9,80.9],[220.5,84.6],[222.0,88.3],[223.6,92.0],[225.2,95.7],[226.7,99.3],[228.3,103.0],[229.9,106.7],[231.4,110.4],[233.0,114.1],[234.6,117.8],[236.1,121.5],[237.7,125.2],[239.3,128.9],[240.8,132.6],[242.4,136.3],[244.0,140.0],[245.5,143.7],[247.1,147.4],[248.7,151.1],[250.3,154.8],[251.8,158.5],[253.4,162.2],[255.0,165.9],[256.5,169.6],[258.1,173.3],[259.7,177.0],[261.2,180.7],[262.8,184.3],[264.4,188.0],[265.9,191.7],[267.5,195.4],[269.1,199.1],[270.6,202.8],[272.2,206.5],[273.8,210.2],[275.3,213.9],[276.9,217.6],[278.5,221.3],[280.0,225.0],[281.6,228.7],[283.2,232.4],[284.7,236.1],[286.3,239.8],[287.9,243.5],[289.4,247.2],[291.0,250.9],[292.6,254.6],[294.1,258.3],[295.7,262.0],[297.3,265.7],[298.8,269.3],[300.4,273.0],[302.0,276.7],[303.5,280.4],[305.1,284.1],[306.7,287.8],[308.2,291.5],[309.8,295.2],[311.4,298.9],[312.9,302.6],[314.5,306.3],[316.1,310.0]],[[645.0,310.0],[641.0,310.0],[637.0,310.0],[633.0,310.0],[628.9,310.0],[624.9,310.0],[620.9,310.0],[616.9,310.0],[612.8,310.0],[608.8,310.0],[604.8,310.0],[600.8,310.0],[596.8,310.0],[592.7,310.0],[588.7,310.0],[584.7,310.0],[580.7,310.0],[576.6,310.0],[572.6,310.0],[568.6,310.0],[564.6,310.0],[560.5,310.0],[556.5,310.0],[552.5,310.0],[548.5,310.0],[544.5,310.0],[540.4,310.0],[536.4,310.0],[532.4,310.0],[528.4,310.0],[524.3,310.0],[520.3,310.0],[516.3,310.0],[512.3,310.0],[508.2,310.0],[504.2,310.0],[500.2,310.0],[496.2,310.0],[492.1,310.0],[488.1,310.0],[484.1,310.0],[480.1,310.0],[476.1,310.0],[472.0,310.0],[468.0,309.8],[463.9,309.3],[460.0,308.3],[456.1,307.0],[452.4,305.4],[448.9,303.4],[445.5,301.1],[442.4,298.5],[439.5,295.6],[436.9,292.5],[434.6,289.2],[432.6,285.6],[431.0,281.9],[429.7,278.0],[428.8,274.1],[428.2,270.1],[428.0,266.0],[428.0,262.0],[428.0,258.0],[428.0,254.0],[428.0,250.0],[428.0,246.0],[428.0,242.0],[428.0,238.0],[428.0,234.0],[428.0,230.0],[428.0,226.0],[428.0,222.0],[428.0,218.0],[428.0,214.0],[428.0,210.0],[428.0,206.0],[428.0,202.0],[428.0,198.0],[428.0,194.0],[428.0,190.0],[428.0,186.0],[428.0,182.0],[428.0,178.0],[428.0,174.0],[428.0,170.0],[428.0,166.0],[428.0,162.0],[428.0,158.0],[428.0,154.0],[428.0,150.0],[428.0,146.0],[428.0,142.0],[428.0,138.0],[428.0,134.0],[428.0,130.0],[428.0,126.0],[428.0,122.0],[428.0,118.0],[428.0,114.0],[428.0,110.0],[428.0,106.0],[428.0,102.0],[428.0,98.0],[428.0,94.0],[428.0,90.0],[428.0,86.0],[428.0,82.0],[428.0,78.0],[428.0,74.0],[428.0,70.0],[428.0,66.0],[428.0,62.0],[428.0,58.0],[428.0,54.0],[428.0,50.0],[428.0,46.0],[428.0,42.0],[428.0,38.0],[428.0,34.0],[428.0,30.0],[428.0,26.0],[428.0,22.0],[428.0,18.0],[428.0,14.0],[428.0,10.0],[428.0,6.0]],[[708.0,310.0],[709.6,306.3],[711.1,302.6],[712.7,298.9],[714.3,295.2],[715.8,291.5],[717.4,287.8],[719.0,284.1],[720.5,280.4],[722.1,276.7],[723.7,273.0],[725.2,269.3],[726.8,265.7],[728.4,262.0],[729.9,258.3],[731.5,254.6],[733.1,250.9],[734.6,247.2],[736.2,243.5],[737.8,239.8],[739.3,236.1],[740.9,232.4],[742.5,228.7],[744.0,225.0],[745.6,221.3],[747.2,217.6],[748.7,213.9],[750.3,210.2],[751.9,206.5],[753.4,202.8],[755.0,199.1],[756.6,195.4],[758.1,191.7],[759.7,188.0],[761.3,184.3],[762.8,180.7],[764.4,177.0],[766.0,173.3],[767.5,169.6],[769.1,165.9],[770.7,162.2],[772.2,158.5],[773.8,154.8],[775.4,151.1],[776.9,147.4],[778.5,143.7],[780.1,140.0],[781.6,136.3],[783.2,132.6],[784.8,128.9],[786.3,125.2],[787.9,121.5],[789.5,117.8],[791.0,114.1],[792.6,110.4],[794.2,106.7],[795.8,103.0],[797.3,99.3],[798.9,95.7],[800.5,92.0],[802.0,88.3],[803.6,84.6],[805.2,80.9],[806.7,77.2],[808.3,73.5],[809.9,69.8],[811.4,66.1],[813.0,62.4],[814.6,58.7],[816.1,55.0],[817.7,51.3],[819.3,47.6],[820.8,43.9],[822.4,40.2],[824.0,36.5],[825.5,32.8],[827.3,29.1],[829.4,25.6],[831.9,22.3],[834.6,19.2],[837.6,16.4],[840.9,13.9],[844.4,11.7],[848.0,9.8],[851.9,8.3],[855.8,7.2],[859.9,6.4],[864.0,6.0],[868.1,6.0],[872.2,6.4],[876.2,7.2],[880.2,8.3],[884.0,9.8],[887.7,11.7],[891.2,13.9],[894.4,16.4],[897.5,19.2],[900.2,22.3],[902.6,25.6],[904.8,29.1],[906.5,32.8],[908.1,36.5],[909.7,40.2],[911.2,43.9],[912.8,47.6],[914.4,51.3],[915.9,55.0],[917.5,58.7],[919.1,62.4],[920.6,66.1],[922.2,69.8],[923.8,73.5],[925.3,77.2],[926.9,80.9],[928.5,84.6],[930.0,88.3],[931.6,92.0],[933.2,95.7],[934.7,99.3],[936.3,103.0],[937.9,106.7],[939.4,110.4],[941.0,114.1],[942.6,117.8],[944.1,121.5],[945.7,125.2],[947.3,128.9],[948.8,132.6],[950.4,136.3],[952.0,140.0],[953.5,143.7],[955.1,147.4],[956.7,151.1],[958.3,154.8],[959.8,158.5],[961.4,162.2],[963.0,165.9],[964.5,169.6],[966.1,173.3],[967.7,177.0],[969.2,180.7],[970.8,184.3],[972.4,188.0],[973.9,191.7],[975.5,195.4],[977.1,199.1],[978.6,202.8],[980.2,206.5],[981.8,210.2],[983.3,213.9],[984.9,217.6],[986.5,221.3],[988.0,225.0],[989.6,228.7],[991.2,232.4],[992.7,236.1],[994.3,239.8],[995.9,243.5],[997.4,247.2],[999.0,250.9],[1000.6,254.6],[1002.1,258.3],[1003.7,262.0],[1005.3,265.7],[1006.8,269.3],[1008.4,273.0],[1010.0,276.7],[1011.5,280.4],[1013.1,284.1],[1014.7,287.8],[1016.2,291.5],[1017.8,295.2],[1019.4,298.9],[1020.9,302.6],[1022.5,306.3],[1024.1,310.0]],[[1126.0,310.0],[1130.1,310.0],[1134.1,310.0],[1138.1,310.0],[1142.1,310.0],[1146.1,310.0],[1150.2,310.0],[1154.2,310.0],[1158.2,310.0],[1162.2,310.0],[1166.3,310.0],[1170.3,310.0],[1174.3,310.0],[1178.3,310.0],[1182.3,310.0],[1186.4,310.0],[1190.4,310.0],[1194.4,310.0],[1198.4,310.0],[1202.5,310.0],[1206.5,310.0],[1210.5,310.0],[1214.5,310.0],[1218.5,310.0],[1222.6,310.0],[1226.6,310.0],[1230.6,310.0],[1234.6,310.0],[1238.7,310.0],[1242.7,310.0],[1246.7,310.0],[1250.7,310.0],[1254.7,310.0],[1258.8,310.0],[1262.8,310.0],[1266.8,310.0],[1270.8,310.0],[1274.9,310.0],[1278.9,310.0],[1282.9,310.0],[1286.9,310.0],[1290.9,310.0],[1295.0,310.0],[1299.0,310.0],[1303.0,310.0],[1307.0,310.0],[1311.1,309.8],[1315.1,309.3],[1319.1,308.3],[1322.9,307.0],[1326.6,305.4],[1330.2,303.4],[1333.5,301.1],[1336.7,298.5],[1339.5,295.6],[1342.1,292.5],[1344.4,289.2],[1346.4,285.6],[1348.1,281.9],[1349.4,278.0],[1350.3,274.1],[1350.8,270.1],[1351.0,266.0],[1351.0,262.0],[1351.0,258.0],[1351.0,254.0],[1351.0,250.0],[1351.0,246.0],[1351.0,242.0],[1351.0,238.0],[1351.0,234.0],[1351.0,230.0],[1351.0,226.0],[1351.0,222.0],[1351.0,218.0],[1351.0,214.0],[1351.0,210.0],[1351.0,206.0],[1351.0,202.0],[1350.8,197.9],[1350.3,193.9],[1349.4,190.0],[1348.1,186.1],[1346.4,182.4],[1344.4,178.8],[1342.1,175.5],[1339.5,172.4],[1336.7,169.5],[1333.5,166.9],[1330.2,164.6],[1326.6,162.6],[1322.9,161.0],[1319.1,159.7],[1315.1,158.7],[1311.1,158.2],[1307.0,158.0],[1303.0,158.0],[1299.0,158.0],[1295.0,158.0],[1290.9,158.0],[1286.9,158.0],[1282.9,158.0],[1278.9,158.0],[1274.8,158.0],[1270.8,158.0],[1266.8,158.0],[1262.7,158.0],[1258.7,158.0],[1254.7,158.0],[1250.7,158.0],[1246.6,158.0],[1242.6,158.0],[1238.6,158.0],[1234.6,158.0],[1230.5,158.0],[1226.5,158.0],[1222.5,158.0],[1218.5,158.0],[1214.4,158.0],[1210.4,158.0],[1206.4,158.0],[1202.4,158.0],[1198.3,158.0],[1194.3,158.0],[1190.3,158.0],[1186.3,158.0],[1182.2,158.0],[1178.2,158.0],[1174.2,158.0],[1170.2,158.0],[1166.1,158.0],[1162.1,158.0],[1158.1,158.0],[1154.1,158.0],[1150.0,158.0],[1146.0,157.8],[1141.9,157.3],[1138.0,156.3],[1134.1,155.0],[1130.4,153.4],[1126.9,151.4],[1123.5,149.1],[1120.4,146.5],[1117.5,143.6],[1114.9,140.5],[1112.6,137.2],[1110.6,133.6],[1109.0,129.9],[1107.7,126.0],[1106.8,122.1],[1106.2,118.1],[1106.0,114.0],[1106.0,110.0],[1106.0,106.0],[1106.0,102.0],[1106.0,98.0],[1106.0,94.0],[1106.0,90.0],[1106.0,86.0],[1106.0,82.0],[1106.0,78.0],[1106.0,74.0],[1106.0,70.0],[1106.0,66.0],[1106.0,62.0],[1106.0,58.0],[1106.0,54.0],[1106.0,50.0],[1106.2,45.9],[1106.8,41.9],[1107.7,38.0],[1109.0,34.1],[1110.6,30.4],[1112.6,26.8],[1114.9,23.5],[1117.5,20.4],[1120.4,17.5],[1123.5,14.9],[1126.9,12.6],[1130.4,10.6],[1134.1,9.0],[1138.0,7.7],[1141.9,6.7],[1146.0,6.2],[1150.0,6.0],[1154.1,6.0],[1158.1,6.0],[1162.1,6.0],[1166.1,6.0],[1170.1,6.0],[1174.2,6.0],[1178.2,6.0],[1182.2,6.0],[1186.2,6.0],[1190.3,6.0],[1194.3,6.0],[1198.3,6.0],[1202.3,6.0],[1206.3,6.0],[1210.4,6.0],[1214.4,6.0],[1218.4,6.0],[1222.4,6.0],[1226.5,6.0],[1230.5,6.0],[1234.5,6.0],[1238.5,6.0],[1242.5,6.0],[1246.6,6.0],[1250.6,6.0],[1254.6,6.0],[1258.6,6.0],[1262.7,6.0],[1266.7,6.0],[1270.7,6.0],[1274.7,6.0],[1278.7,6.0],[1282.8,6.0],[1286.8,6.0],[1290.8,6.0],[1294.8,6.0],[1298.9,6.0],[1302.9,6.0],[1306.9,6.0],[1310.9,6.0],[1314.9,6.0],[1319.0,6.0],[1323.0,6.0],[1327.0,6.0],[1331.0,6.0]]];
  function wrapA(a) { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; }
  var LET = CL.map(function (P) {
    var seg = [], ang = [], L = 0;
    for (var i = 1; i < P.length; i++) { var dx = P[i][0] - P[i - 1][0], dy = P[i][1] - P[i - 1][1], l = Math.hypot(dx, dy); seg.push(l); ang.push(Math.atan2(dy, dx)); L += l; }
    var rel = [0]; for (i = 1; i < ang.length; i++) rel.push(rel[i - 1] + wrapA(ang[i] - ang[i - 1]));
    var flat = Math.cos(ang[0]) >= 0 ? 0 : Math.PI;
    return { p0: P[0], seg: seg, rel: rel, L: L, flat: flat, base: wrapA(ang[0] - flat) };
  });
  var LTOT = LET.reduce(function (a, l) { return a + l.L; }, 0), BASE_Y = 310;
  function ease(x) { return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  // A letter as a wire: e = 0 lies flat on the baseline, e = 1 is the letter
  function bend(l, e, ax, ay) {
    var a0 = l.flat + l.base * e, x = ax, y = ay, d = 'M' + x.toFixed(1) + ',' + y.toFixed(1);
    for (var k = 0; k < l.seg.length; k++) { var a = a0 + l.rel[k] * e; x += l.seg[k] * Math.cos(a); y += l.seg[k] * Math.sin(a); d += 'L' + x.toFixed(1) + ',' + y.toFixed(1); }
    return d;
  }
  function introFrame(t) {
    var vw = window.innerWidth, vh = window.innerHeight;
    var G = 70 * ease(clamp01((t - 1500) / 800)), W = LTOT + 3 * G, x0 = 675.50 - W / 2;
    var k1 = Math.min(vw * .78, 1100) / 1351.0, k0 = Math.min(k1, vw * .88 / (LTOT + 210));
    var kz = k0 + (k1 - k0) * ease(clamp01((t - 2300) / 3200));
    ig.setAttribute('transform', 'translate(' + (vw / 2) + ',' + (vh / 2) + ') scale(' + kz.toFixed(4) + ') translate(-675.50,-158)');
    var q = ease(clamp01(t / 1500)) * LTOT, s = x0, cum = 0;
    LET.forEach(function (l, i) {
      var e = ease(clamp01((t - 2300 - i * 320) / 2300));
      var fa = l.flat === 0 ? s : s + l.L, ax = fa + (l.p0[0] - fa) * e, ay = BASE_Y + (l.p0[1] - BASE_Y) * e;
      var path = ipaths[i];
      path.setAttribute('d', bend(l, e, ax, ay));
      if (t < 1500) {
        var vis = Math.max(0, Math.min(l.L, q - cum));
        path.style.opacity = vis > .5 ? '1' : '0';
        path.style.strokeDasharray = vis + ' 100000';
        path.style.strokeDashoffset = l.flat === 0 ? '0' : String(-(l.L - vis));
      } else { path.style.strokeDasharray = ''; path.style.strokeDashoffset = ''; path.style.opacity = ''; }
      s += l.L + G; cum += l.L;
    });
  }
  var INTRO_SPEED = 1.6, VISITED = false;
  try { VISITED = localStorage.getItem('alas-visited') === '1'; } catch (err) {}
  function runLine() {
    cancelAnimationFrame(raf);
    var start = performance.now();
    (function loop(now) { var t = (now - start) * INTRO_SPEED; introFrame(t); if (t < 5600) raf = requestAnimationFrame(loop); })(start);
  }
  var words = [].slice.call(document.querySelectorAll('.hero .word'));
  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  var SC = CL[3], SMIN = Infinity, SB = 310, SK = 1;
  SC.forEach(function (p) { if (p[0] < SMIN) SMIN = p[0]; });
  var LRIGHT = CL.map(function (P) { return P.reduce(function (m, p) { return Math.max(m, p[0]); }, -Infinity); });
  function poly(P) { return 'M' + P.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join('L'); }
  function easeIn(x) { return x * x * x; }
  // One frame of a hero word: ALAS compresses right to left, the S slides and shrinks into an s, then the rest is drawn
  function renderWord(w, t) {
    var lw = w.querySelectorAll('.lw'), gl = [].slice.call(w.querySelectorAll('.ink .gl'));
    [2, 1, 0].forEach(function (li, n) {
      var e = easeIn(clamp01((t - n * 130) / 440)), R = LRIGHT[li], el = lw[li];
      if (e >= 1) { el.setAttribute('d', ''); return; }
      el.setAttribute('d', poly(CL[li].map(function (p) { return [R + (p[0] - R) * (1 - e), p[1]]; })));
      el.style.opacity = String(1 - e);
    });
    var es = ease(clamp01((t - 140) / 780)), sc = 1 + (SK - 1) * es, shift = SMIN * (1 - es);
    lw[3].setAttribute('d', poly(SC.map(function (p) { return [shift + (p[0] - SMIN) * sc, SB - (SB - p[1]) * sc]; })));
    lw[3].style.opacity = '1';
    gl.forEach(function (g, i) {
      var e = clamp01((t - 980 - i * 170) / 220);
      g.querySelectorAll('.g').forEach(function (pth) { pth.style.strokeDasharray = '1 1'; pth.style.strokeDashoffset = String(1 - e); });
      g.querySelectorAll('.gf').forEach(function (c) { c.style.opacity = String(e); });
    });
  }
  var wordRaf = [];
  function settle(w) { renderWord(w, 1e9); }
  function prep(w) { renderWord(w, 0); }
  function write(w, delay) {
    var idx = words.indexOf(w); cancelAnimationFrame(wordRaf[idx]);
    var start = performance.now() + delay, end = 980 + w.querySelectorAll('.ink .gl').length * 170 + 260;
    (function loop(now) { var t = now - start; renderWord(w, Math.max(0, t)); if (t < end) wordRaf[idx] = requestAnimationFrame(loop); })(performance.now());
  }
  words.forEach(settle);
  /* ---------- Hero panes: each one plays its sequence once it covers the screen ---------- */
  var armed = false, NEVER = 1e12;
  function waitPane(p) { p.played = false; p.classList.add('is-waiting'); prep(p.querySelector('.word')); if (p === pS) STUDIO_T0 = performance.now() + NEVER; else SPACE_T0 = performance.now() + NEVER; }
  function playPane(p, delay) {
    if (p.played) return; p.played = true;
    var HOLD = 1000, w = p.querySelector('.word'), n = w.querySelectorAll('.ink .gl').length;
    delay += HOLD;
    var wordEnd = delay + 980 + n * 170 + 200;
    write(w, delay);
    later(function () { p.classList.remove('is-waiting'); }, wordEnd);
    var t0 = performance.now() + wordEnd + 600;
    if (p === pS) STUDIO_T0 = t0; else SPACE_T0 = t0;
  }
  function headerH() { return top.offsetHeight; }
  function covers(p) {
    var r = p.getBoundingClientRect(), hh = headerH(), vh = window.innerHeight;
    return (Math.min(r.bottom, vh) - Math.max(r.top, hh)) / (vh - hh) >= .92;
  }
  function checkPanes() {
    if (!armed || snapping) return;
    [pS, pP].forEach(function (p) { if (!p.played && covers(p)) playPane(p, 120); });
  }
  function startPanes() {
    armed = true;
    if (window.innerWidth >= 900) { playPane(pS, 0); playPane(pP, 200); }
    else checkPanes();
  }
  // Slides: the hero (two screens on mobile) and the ALAS screen. A gesture moves one screen, with a soft glide; past ALAS the page scrolls freely
  var snapping = false, touching = false, lastY = window.scrollY, dir = 0, endTimer = 0, checkQueued = false, gStart = null, wheelT = 0, wheelHold = false;
  var alasSec = document.getElementById('alas'), heroSec = document.querySelector('.hero');
  function setHH() { document.documentElement.style.setProperty('--hh', headerH() + 'px'); }
  setHH(); window.addEventListener('resize', setHH);
  function snapPoints() {
    var hh = headerH(), els = window.innerWidth < 900 ? [pS, pP, alasSec] : [heroSec, alasSec];
    return els.map(function (el) { return Math.round(el.getBoundingClientRect().top + window.scrollY - hh); });
  }
  function glide(to) {
    snapping = true;
    var root = document.documentElement, from = window.scrollY, d = to - from, st = performance.now(), dur = Math.min(900, 420 + Math.abs(d) * .5);
    root.style.scrollBehavior = 'auto';
    (function f(now) {
      var k = clamp01((now - st) / dur), e = ease(k);
      window.scrollTo(0, from + d * e);
      if (k < 1) requestAnimationFrame(f); else { root.style.scrollBehavior = ''; snapping = false; lastY = window.scrollY; gStart = null; checkPanes(); }
    })(st);
  }
  function blocked() { return reduce || !intro.hidden; }
  // where one step from y in direction d lands, or null when y is outside the slides
  function stepFrom(y, d) {
    var T = snapPoints(), last = T[T.length - 1];
    if (d > 0) { if (y >= last - 2) return null; for (var i = 0; i < T.length; i++) if (T[i] > y + 2) return T[i]; }
    else { if (y > last + 2 || y <= T[0] + 2) return null; for (var j = T.length - 1; j >= 0; j--) if (T[j] < y - 2) return T[j]; }
    return null;
  }
  function maybeSnap() {
    if (blocked() || snapping || touching) return;
    var T = snapPoints(), y = window.scrollY, last = T[T.length - 1], vh = window.innerHeight;
    if (T.some(function (p) { return Math.abs(p - y) < 2; })) return;
    if (y > last) { if (dir < 0 && y < last + vh * .5) glide(last); return; }
    for (var i = 0; i < T.length - 1; i++) if (y > T[i] && y < T[i + 1]) {
      var fr = (y - T[i]) / (T[i + 1] - T[i]);
      glide(dir > 0 ? (fr > .15 ? T[i + 1] : T[i]) : (fr < .85 ? T[i] : T[i + 1])); return;
    }
  }
  window.addEventListener('scroll', function () {
    var y = window.scrollY; if (y !== lastY && !snapping) dir = y > lastY ? 1 : -1; lastY = y;
    // a fling never carries past the next screen: stop on the first slide it crosses
    if (!snapping && !touching && gStart !== null && !blocked()) {
      var T = snapPoints(), hit = null;
      T.forEach(function (p) { if (dir > 0 && gStart < p - 2 && y > p + 1 && hit === null) hit = p; if (dir < 0 && gStart > p + 2 && y < p - 1) hit = p; });
      if (hit !== null) { glide(hit); return; }
    }
    document.body.classList.toggle('past-hero', y > 40);
    clearTimeout(endTimer); endTimer = setTimeout(maybeSnap, 130);
    if (!checkQueued) { checkQueued = true; requestAnimationFrame(function () { checkQueued = false; checkPanes(); }); }
  }, { passive: true });
  window.addEventListener('touchstart', function () { touching = true; if (!snapping) gStart = window.scrollY; }, { passive: true });
  window.addEventListener('touchend', function () { touching = false; clearTimeout(endTimer); endTimer = setTimeout(maybeSnap, 130); }, { passive: true });
  window.addEventListener('touchcancel', function () { touching = false; }, { passive: true });
  // Wheel and trackpad: one notch or one swipe moves one screen; the inertia tail is absorbed
  window.addEventListener('wheel', function (e) {
    if (blocked() || e.ctrlKey || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    var now = performance.now(), quiet = now - wheelT > 240; wheelT = now;
    var T = snapPoints(), y = window.scrollY, inZone = y <= T[T.length - 1] + 2;
    if (snapping) { if (inZone || wheelHold) e.preventDefault(); wheelHold = true; return; }
    if (wheelHold && !quiet) { e.preventDefault(); return; }
    wheelHold = false;
    var to = stepFrom(y, e.deltaY > 0 ? 1 : -1);
    if (to === null) return;
    e.preventDefault(); wheelHold = true; glide(to);
  }, { passive: false });
  window.addEventListener('keydown', function (e) {
    if (blocked() || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
    var tg = e.target, tag = tg && tg.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (tg && tg.isContentEditable)) return;
    var d = { ArrowDown: 1, PageDown: 1, ' ': e.shiftKey ? -1 : 1, ArrowUp: -1, PageUp: -1 }[e.key];
    if (!d || (e.key === ' ' && tag === 'BUTTON')) return;
    if (snapping) { e.preventDefault(); return; }
    var to = stepFrom(window.scrollY, d); if (to === null) return;
    e.preventDefault(); glide(to);
  });

  function endIntro() { intro.hidden = true; document.documentElement.style.overflow = ''; }
  var forceFull = false;
  function playIntro() {
    timers.forEach(clearTimeout); timers = [];
    words.forEach(settle);
    if (reduce) return;
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = 'hidden';
    [pS, pP].forEach(waitPane); armed = false;
    heroEl.classList.add('is-landing'); top.classList.add('logo-wait'); ig.appendChild(ipaths[3]);
    ipaths.forEach(function (pth) { pth.style.strokeWidth = ''; pth.style.stroke = ''; pth.style.fill = ''; }); twin.style.display = 'none'; ig.style.stroke = ''; twin.style.stroke = '';
    document.getElementById('intro-skip').style.visibility = '';
    intro.hidden = false; intro.style.opacity = '1'; intro.style.backgroundColor = '';
    intro.getAnimations().forEach(function (a) { a.cancel(); });
    cancelAnimationFrame(raf); introFrame(1e6);
    ig.getAnimations().forEach(function (a) { a.cancel(); });
    ig.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, easing: 'cubic-bezier(.2,.7,.2,1)' });
    later(morph, 900); later(flyHome, 900 + MORPH_DUR + 150);
    try { localStorage.setItem('alas-visited', '1'); } catch (err) {}
    VISITED = true; forceFull = false;
  }
  // The finished name splits and flies into each block, turning from ink to white as the page behind appears
  function wordBox(w) {
    var r = w.getBoundingClientRect(), sc = Math.min(r.width / 1375, r.height / 448);
    return { s: sc, tx: r.left + (r.width - 1375 * sc) / 2 + 12 * sc, ty: r.top + (r.height - 448 * sc) / 2 + 12 * sc };
  }
  function land() { heroEl.classList.remove('is-landing'); top.classList.remove('logo-wait'); endIntro(); startPanes(); }
  // After ALAS is built: the first A stays, L and the second A fold left into the monogram, the S unrolls into its circle
  var MONO = {"src":[[[645.0,310.0],[641.4,310.0],[637.8,310.0],[634.2,310.0],[630.6,310.0],[626.9,310.0],[623.3,310.0],[619.7,310.0],[616.1,310.0],[612.5,310.0],[608.9,310.0],[605.3,310.0],[601.7,310.0],[598.0,310.0],[594.4,310.0],[590.8,310.0],[587.2,310.0],[583.6,310.0],[580.0,310.0],[576.4,310.0],[572.8,310.0],[569.1,310.0],[565.5,310.0],[561.9,310.0],[558.3,310.0],[554.7,310.0],[551.1,310.0],[547.5,310.0],[543.9,310.0],[540.3,310.0],[536.6,310.0],[533.0,310.0],[529.4,310.0],[525.8,310.0],[522.2,310.0],[518.6,310.0],[515.0,310.0],[511.4,310.0],[507.7,310.0],[504.1,310.0],[500.5,310.0],[496.9,310.0],[493.3,310.0],[489.7,310.0],[486.1,310.0],[482.5,310.0],[478.8,310.0],[475.2,310.0],[471.6,310.0],[468.0,309.8],[464.4,309.4],[460.9,308.5],[457.5,307.5],[454.1,306.1],[450.9,304.5],[447.8,302.7],[444.9,300.6],[442.1,298.2],[439.6,295.7],[437.2,292.9],[435.1,290.0],[433.3,286.9],[431.7,283.6],[430.4,280.2],[429.4,276.8],[428.7,273.2],[428.2,269.7],[428.0,266.1],[428.0,262.5],[428.0,258.8],[428.0,255.2],[428.0,251.6],[428.0,248.0],[428.0,244.4],[428.0,240.8],[428.0,237.2],[428.0,233.6],[428.0,229.9],[428.0,226.3],[428.0,222.7],[428.0,219.1],[428.0,215.5],[428.0,211.9],[428.0,208.3],[428.0,204.7],[428.0,201.0],[428.0,197.4],[428.0,193.8],[428.0,190.2],[428.0,186.6],[428.0,183.0],[428.0,179.4],[428.0,175.8],[428.0,172.2],[428.0,168.5],[428.0,164.9],[428.0,161.3],[428.0,157.7],[428.0,154.1],[428.0,150.5],[428.0,146.9],[428.0,143.3],[428.0,139.6],[428.0,136.0],[428.0,132.4],[428.0,128.8],[428.0,125.2],[428.0,121.6],[428.0,118.0],[428.0,114.4],[428.0,110.7],[428.0,107.1],[428.0,103.5],[428.0,99.9],[428.0,96.3],[428.0,92.7],[428.0,89.1],[428.0,85.5],[428.0,81.9],[428.0,78.2],[428.0,74.6],[428.0,71.0],[428.0,67.4],[428.0,63.8],[428.0,60.2],[428.0,56.6],[428.0,53.0],[428.0,49.3],[428.0,45.7],[428.0,42.1],[428.0,38.5],[428.0,34.9],[428.0,31.3],[428.0,27.7],[428.0,24.1],[428.0,20.4],[428.0,16.8],[428.0,13.2],[428.0,9.6],[428.0,6.0]],[[708.0,310.0],[710.0,305.3],[711.9,300.7],[714.0,296.0],[715.9,291.3],[717.9,286.6],[719.9,282.0],[721.8,277.3],[723.8,272.6],[725.8,268.0],[727.8,263.3],[729.8,258.6],[731.8,254.0],[733.8,249.3],[735.7,244.6],[737.7,240.0],[739.7,235.3],[741.7,230.6],[743.6,225.9],[745.6,221.3],[747.6,216.6],[749.6,211.9],[751.6,207.3],[753.5,202.6],[755.5,197.9],[757.5,193.2],[759.5,188.6],[761.5,183.9],[763.4,179.2],[765.4,174.6],[767.4,169.9],[769.4,165.2],[771.4,160.6],[773.3,155.9],[775.3,151.2],[777.3,146.5],[779.3,141.9],[781.2,137.2],[783.2,132.5],[785.2,127.9],[787.2,123.2],[789.2,118.5],[791.1,113.8],[793.1,109.2],[795.1,104.5],[797.1,99.8],[799.1,95.2],[801.1,90.5],[803.1,85.8],[805.1,81.2],[807.0,76.5],[809.0,71.8],[811.0,67.2],[813.0,62.5],[815.0,57.8],[816.9,53.1],[818.9,48.5],[820.8,43.8],[822.9,39.1],[824.8,34.5],[826.9,29.9],[829.5,25.5],[832.6,21.5],[836.1,17.8],[840.0,14.6],[844.2,11.8],[848.8,9.5],[853.5,7.8],[858.5,6.7],[863.5,6.0],[868.6,6.0],[873.6,6.7],[878.5,7.8],[883.3,9.5],[887.8,11.8],[892.1,14.6],[896.0,17.8],[899.5,21.5],[902.5,25.5],[905.2,29.9],[907.2,34.5],[909.2,39.1],[911.2,43.8],[913.2,48.5],[915.2,53.2],[917.1,57.8],[919.1,62.5],[921.1,67.2],[923.1,71.8],[925.0,76.5],[927.0,81.2],[929.0,85.9],[931.0,90.5],[933.0,95.2],[934.9,99.9],[937.0,104.5],[938.9,109.2],[940.9,113.9],[942.9,118.5],[944.8,123.2],[946.9,127.9],[948.8,132.6],[950.8,137.2],[952.8,141.9],[954.7,146.6],[956.8,151.2],[958.7,155.9],[960.7,160.6],[962.7,165.2],[964.6,169.9],[966.7,174.6],[968.6,179.3],[970.6,183.9],[972.6,188.6],[974.6,193.3],[976.6,197.9],[978.5,202.6],[980.5,207.3],[982.5,211.9],[984.5,216.6],[986.5,221.3],[988.4,226.0],[990.4,230.6],[992.4,235.3],[994.4,240.0],[996.4,244.6],[998.3,249.3],[1000.3,254.0],[1002.3,258.7],[1004.3,263.3],[1006.3,268.0],[1008.2,272.6],[1010.2,277.3],[1012.2,282.0],[1014.2,286.6],[1016.1,291.3],[1018.1,296.0],[1020.1,300.7],[1022.1,305.3],[1024.1,310.0]],[[1126.0,310.0],[1132.6,310.0],[1139.3,310.0],[1145.9,310.0],[1152.6,310.0],[1159.2,310.0],[1165.9,310.0],[1172.5,310.0],[1179.1,310.0],[1185.8,310.0],[1192.4,310.0],[1199.1,310.0],[1205.7,310.0],[1212.4,310.0],[1219.0,310.0],[1225.6,310.0],[1232.3,310.0],[1238.9,310.0],[1245.6,310.0],[1252.2,310.0],[1258.9,310.0],[1265.5,310.0],[1272.1,310.0],[1278.8,310.0],[1285.4,310.0],[1292.1,310.0],[1298.7,310.0],[1305.4,310.0],[1312.0,309.7],[1318.5,308.4],[1324.7,306.2],[1330.6,303.1],[1335.9,299.1],[1340.5,294.4],[1344.5,289.0],[1347.5,283.1],[1349.7,276.9],[1350.8,270.3],[1351.0,263.7],[1351.0,257.0],[1351.0,250.4],[1351.0,243.8],[1351.0,237.1],[1351.0,230.5],[1351.0,223.8],[1351.0,217.2],[1351.0,210.5],[1351.0,203.9],[1350.7,197.3],[1349.6,190.7],[1347.4,184.5],[1344.3,178.6],[1340.3,173.3],[1335.6,168.6],[1330.3,164.6],[1324.4,161.6],[1318.1,159.4],[1311.6,158.3],[1304.9,158.0],[1298.3,158.0],[1291.6,158.0],[1285.0,158.0],[1278.4,158.0],[1271.7,158.0],[1265.1,158.0],[1258.4,158.0],[1251.8,158.0],[1245.1,158.0],[1238.5,158.0],[1231.9,158.0],[1225.2,158.0],[1218.6,158.0],[1211.9,158.0],[1205.3,158.0],[1198.6,158.0],[1192.0,158.0],[1185.4,158.0],[1178.7,158.0],[1172.1,158.0],[1165.4,158.0],[1158.8,158.0],[1152.1,158.0],[1145.5,157.7],[1139.0,156.6],[1132.7,154.4],[1126.8,151.4],[1121.5,147.4],[1116.8,142.7],[1112.8,137.4],[1109.7,131.6],[1107.5,125.3],[1106.3,118.8],[1106.0,112.1],[1106.0,105.5],[1106.0,98.9],[1106.0,92.2],[1106.0,85.6],[1106.0,78.9],[1106.0,72.3],[1106.0,65.6],[1106.0,59.0],[1106.0,52.4],[1106.2,45.7],[1107.4,39.2],[1109.5,32.9],[1112.5,27.0],[1116.5,21.6],[1121.1,16.9],[1126.4,12.9],[1132.3,9.8],[1138.5,7.6],[1145.0,6.3],[1151.6,6.0],[1158.3,6.0],[1164.9,6.0],[1171.6,6.0],[1178.2,6.0],[1184.9,6.0],[1191.5,6.0],[1198.1,6.0],[1204.8,6.0],[1211.4,6.0],[1218.1,6.0],[1224.7,6.0],[1231.4,6.0],[1238.0,6.0],[1244.6,6.0],[1251.3,6.0],[1257.9,6.0],[1264.6,6.0],[1271.2,6.0],[1277.9,6.0],[1284.5,6.0],[1291.1,6.0],[1297.8,6.0],[1304.4,6.0],[1311.1,6.0],[1317.7,6.0],[1324.4,6.0],[1331.0,6.0]]],"dst":[[[608.2,310.0],[604.4,310.0],[600.7,310.0],[596.9,310.0],[593.1,310.0],[589.3,310.0],[585.5,310.0],[581.8,310.0],[578.0,310.0],[574.2,310.0],[570.4,310.0],[566.6,310.0],[562.8,310.0],[559.1,310.0],[555.3,310.0],[551.5,310.0],[547.7,310.0],[543.9,310.0],[540.2,310.0],[536.4,310.0],[532.6,310.0],[528.8,310.0],[525.0,310.0],[521.3,310.0],[517.5,310.0],[513.7,310.0],[509.9,310.0],[506.1,310.0],[502.4,310.0],[498.6,310.0],[494.8,310.0],[491.0,310.0],[487.2,310.0],[483.5,310.0],[479.7,310.0],[475.9,310.0],[472.1,310.0],[468.3,310.0],[464.5,310.0],[460.8,310.0],[457.0,310.0],[453.2,310.0],[449.4,310.0],[445.6,310.0],[441.9,310.0],[438.1,310.0],[434.3,310.0],[430.5,309.7],[426.8,309.2],[423.1,308.3],[419.5,307.1],[416.1,305.6],[412.7,303.8],[409.6,301.7],[406.6,299.4],[403.8,296.8],[401.3,294.0],[399.0,291.0],[397.0,287.8],[395.3,284.5],[393.8,281.0],[392.3,277.5],[390.8,274.0],[389.4,270.5],[387.9,267.1],[386.4,263.6],[384.9,260.1],[383.4,256.6],[382.0,253.1],[380.5,249.7],[379.0,246.2],[377.5,242.7],[376.1,239.2],[374.6,235.7],[373.1,232.3],[371.6,228.8],[370.2,225.3],[368.7,221.8],[367.2,218.3],[365.7,214.8],[364.3,211.4],[362.8,207.9],[361.3,204.4],[359.8,200.9],[358.4,197.4],[356.9,194.0],[355.4,190.5],[353.9,187.0],[352.5,183.5],[351.0,180.0],[349.5,176.6],[348.0,173.1],[346.6,169.6],[345.1,166.1],[343.6,162.6],[342.1,159.2],[340.6,155.7],[339.2,152.2],[337.7,148.7],[336.2,145.2],[334.7,141.8],[333.3,138.3],[331.8,134.8],[330.3,131.3],[328.8,127.8],[327.4,124.3],[325.9,120.9],[324.4,117.4],[322.9,113.9],[321.5,110.4],[320.0,106.9],[318.5,103.5],[317.0,100.0],[315.6,96.5],[314.1,93.0],[312.6,89.5],[311.1,86.1],[309.7,82.6],[308.2,79.1],[306.7,75.6],[305.2,72.1],[303.8,68.7],[302.3,65.2],[300.8,61.7],[299.3,58.2],[297.8,54.7],[296.4,51.3],[294.9,47.8],[293.4,44.3],[291.9,40.8],[290.5,37.3],[289.0,33.8],[287.5,30.4],[286.0,26.9],[284.6,23.4],[283.1,19.9],[281.6,16.4],[280.1,13.0],[278.7,9.5],[277.2,6.0]],[[367.2,6.0],[368.0,7.8],[368.7,9.7],[369.5,11.5],[370.3,13.3],[371.1,15.1],[371.8,17.0],[372.6,18.8],[373.4,20.6],[374.2,22.4],[374.9,24.3],[375.7,26.1],[376.5,27.9],[377.3,29.8],[378.0,31.6],[378.8,33.4],[379.6,35.2],[380.4,37.1],[381.1,38.9],[381.9,40.7],[382.7,42.5],[383.5,44.4],[384.2,46.2],[385.0,48.0],[385.8,49.9],[386.6,51.7],[387.3,53.5],[388.1,55.3],[388.9,57.2],[389.7,59.0],[390.4,60.8],[391.2,62.6],[392.0,64.5],[392.8,66.3],[393.5,68.1],[394.3,70.0],[395.1,71.8],[395.9,73.6],[396.6,75.4],[397.4,77.3],[398.2,79.1],[399.0,80.9],[399.7,82.7],[400.5,84.6],[401.3,86.4],[402.1,88.2],[402.8,90.1],[403.6,91.9],[404.4,93.7],[405.2,95.5],[405.9,97.4],[406.7,99.2],[407.5,101.0],[408.2,102.8],[409.0,104.7],[409.8,106.5],[410.6,108.3],[411.3,110.2],[412.1,112.0],[412.9,113.8],[413.7,115.6],[414.4,117.5],[415.2,119.3],[416.0,121.1],[416.8,122.9],[417.5,124.8],[418.3,126.6],[419.1,128.4],[419.9,130.3],[420.6,132.1],[421.4,133.9],[422.2,135.7],[423.0,137.6],[423.7,139.4],[424.5,141.2],[425.3,143.1],[426.1,144.9],[426.8,146.7],[427.6,148.5],[428.4,150.4],[429.2,152.2],[429.9,154.0],[430.7,155.8],[431.5,157.7],[432.3,159.5],[433.0,161.3],[433.8,163.2],[434.6,165.0],[435.4,166.8],[436.1,168.6],[436.9,170.5],[437.7,172.3],[438.5,174.1],[439.2,175.9],[440.0,177.8],[440.8,179.6],[441.6,181.4],[442.3,183.3],[443.1,185.1],[443.9,186.9],[444.7,188.7],[445.4,190.6],[446.2,192.4],[447.0,194.2],[447.8,196.0],[448.5,197.9],[449.3,199.7],[450.1,201.5],[450.9,203.4],[451.6,205.2],[452.4,207.0],[453.2,208.8],[454.0,210.7],[454.7,212.5],[455.5,214.3],[456.3,216.1],[457.1,218.0],[457.8,219.8],[458.6,221.6],[459.4,223.5],[460.2,225.3],[460.9,227.1],[461.7,228.9],[462.5,230.8],[463.3,232.6],[464.0,234.4],[464.8,236.2],[465.6,238.1],[466.4,239.9],[467.1,241.7],[467.9,243.6],[468.7,245.4],[469.5,247.2],[470.2,249.0],[471.0,250.9],[471.8,252.7],[472.6,254.5],[473.3,256.3],[474.1,258.2],[474.9,260.0]],[[689.6,229.3],[692.4,211.8],[694.4,194.2],[695.6,176.5],[696.1,158.8],[695.7,141.1],[694.5,123.4],[692.6,105.8],[689.8,88.3],[686.3,71.0],[682.0,53.8],[676.9,36.8],[671.0,20.1],[664.4,3.7],[657.0,-12.5],[649.0,-28.2],[640.2,-43.6],[630.8,-58.6],[620.6,-73.1],[609.9,-87.2],[598.5,-100.8],[586.5,-113.8],[573.9,-126.3],[560.8,-138.2],[547.1,-149.5],[533.0,-160.1],[518.4,-170.2],[503.3,-179.5],[487.9,-188.2],[472.0,-196.1],[455.9,-203.3],[439.4,-209.8],[422.6,-215.6],[405.6,-220.5],[388.4,-224.7],[371.0,-228.1],[353.5,-230.8],[335.9,-232.6],[318.2,-233.6],[300.5,-233.9],[282.8,-233.3],[265.1,-231.9],[247.6,-229.8],[230.1,-226.8],[212.8,-223.1],[195.6,-218.6],[178.7,-213.3],[162.1,-207.2],[145.7,-200.4],[129.7,-192.9],[114.0,-184.7],[98.7,-175.7],[83.9,-166.1],[69.4,-155.8],[55.5,-144.9],[42.1,-133.4],[29.2,-121.2],[16.8,-108.5],[5.1,-95.3],[-6.1,-81.5],[-16.6,-67.2],[-26.4,-52.5],[-35.6,-37.4],[-44.1,-21.8],[-51.8,-5.9],[-58.9,10.4],[-65.2,26.9],[-70.7,43.7],[-75.5,60.8],[-79.5,78.0],[-82.7,95.5],[-85.2,113.0],[-86.8,130.6],[-87.6,148.3],[-87.7,166.0],[-86.9,183.7],[-85.3,201.4],[-83.0,218.9],[-79.8,236.4],[-75.9,253.6],[-71.2,270.7],[-65.7,287.6],[-59.5,304.1],[-52.5,320.4],[-44.8,336.4],[-36.4,352.0],[-27.3,367.1],[-17.5,381.9],[-7.0,396.2],[4.0,410.0],[15.7,423.3],[28.0,436.1],[40.9,448.3],[54.2,459.9],[68.1,470.9],[82.5,481.2],[97.4,490.9],[112.6,499.9],[128.2,508.2],[144.3,515.8],[160.6,522.7],[177.2,528.8],[194.1,534.1],[211.2,538.7],[228.5,542.5],[246.0,545.6],[263.5,547.8],[281.2,549.2],[298.9,549.9],[316.6,549.7],[334.3,548.7],[351.9,547.0],[369.4,544.4],[386.8,541.1],[404.1,537.0],[421.1,532.1],[437.9,526.4],[454.4,520.0],[470.6,512.8],[486.4,504.9],[501.9,496.3],[517.0,487.1],[531.7,477.1],[545.9,466.5],[559.6,455.3],[572.7,443.4],[585.4,431.0],[597.4,418.0],[608.9,404.5],[619.7,390.5],[629.9,376.0],[639.4,361.0],[648.2,345.7],[656.4,329.9],[663.8,313.8],[670.4,297.4],[676.4,280.7],[681.5,263.8],[685.9,246.6],[689.6,229.3]]],"cx":304.1,"cy":158.0,"R":392.0,"vb":[-109.9,-256.0,827.9,827.9]};
  var monoScale = 1;
  function monoTarget() { var vw = window.innerWidth, vh = window.innerHeight; return Math.min(vh * .58, vw * .72) / (2 * MONO.R); }
  // Variant 'slide': the second A keeps its shape and slides left; the left leg and the left half of the apex vanish, left to right,
  // as they cross the line of the final diagonal. The right quarter of the apex straightens at the same pace, so the right diagonal
  // never loses length at the top; at the bottom it lifts off the foot of the L, as in the monogram.
  var THIRD = {"tb": 496.08, "s": 0.424, "yT": 6.0, "yB": 310.0, "yE": 260.0}, A2 = CL[2], A2X = A2[A2.length - 1][0], A2DX = THIRD.tb - A2X;
  var APEX = 0; A2.forEach(function (p, i) { if (p[1] < A2[APEX][1]) APEX = i; });
  var TRI = APEX; while (TRI < A2.length - 1 && Math.abs(A2[TRI][0] - (A2X - THIRD.s * (THIRD.yB - A2[TRI][1]))) > .6) TRI++;
  // distance from a point to a polyline
  function distTo(x, y, Q) {
    var best = Infinity;
    for (var i = 1; i < Q.length; i++) {
      var ax = Q[i - 1][0], ay = Q[i - 1][1], vx = Q[i][0] - ax, vy = Q[i][1] - ay, l2 = vx * vx + vy * vy || 1;
      var t = Math.max(0, Math.min(1, ((x - ax) * vx + (y - ay) * vy) / l2)), dx = ax + vx * t - x, dy = ay + vy * t - y, d = dx * dx + dy * dy;
      if (d < best) best = d;
    }
    return Math.sqrt(best);
  }
  // The gap between the second A and the L in the finished isotipo; while it slides, the A never comes closer than that:
  // whatever would enter that band (first the foot of its left leg, from the bottom up) disappears
  // The second A slides left into the third diagonal. What has to go is erased at one constant speed along the stroke itself:
  // the left leg from its foot upwards, then the left half of the apex, ending exactly at the top of the diagonal, with nothing left over.
  // The right leg's foot is erased (bottom up, same speed) before it reaches the foot of the L. The schedule keeps every line at least as far
  // from the L as the finished isotipo does (checked frame by frame); the distance test below only guards against rounding.
  var A2CUM = [0]; for (var ci = 1; ci < A2.length; ci++) A2CUM.push(A2CUM[ci - 1] + Math.hypot(A2[ci][0] - A2[ci - 1][0], A2[ci][1] - A2[ci - 1][1]));
  var A2LV = A2CUM[APEX], GAP = null;
  function slideA(k, Lp) {
    if (GAP === null) { GAP = Infinity; slideRuns(1, null, A2LV, 1, 1).forEach(function (r) { r.forEach(function (p) { GAP = Math.min(GAP, distTo(p[0], p[1], MONO.dst[0])); }); }); GAP -= 1.5; }
    var c = A2LV * clamp01((k - .02) / .28), e = ease(clamp01((k - .08) / .40)), lift = clamp01((k - .235) / .045);
    var st = e;
    return slideRuns(e, Lp, c, lift, st).map(poly).join('') || 'M0,0';
  }
  function slideRuns(e, Lp, c, lift, st) {
    var dx = A2DX * e, yCut = THIRD.yB + (THIRD.yE - THIRD.yB) * lift, runs = [], cur = null;
    A2.forEach(function (p, i) {
      var x = p[0] + dx, y = p[1], ok = A2CUM[i] >= c - .01;
      if (i >= APEX && i <= TRI) {
        // the right quarter of the apex straightens into the top of the diagonal
        var f = (i - APEX) / Math.max(1, TRI - APEX), ly = THIRD.yT + (A2[TRI][1] - THIRD.yT) * f, lx = A2X - THIRD.s * (THIRD.yB - ly) + dx;
        x += (lx - x) * st; y += (ly - y) * st;
      }
      if (i > TRI && y > yCut + .01) ok = false;
      if (ok && Lp && distTo(x, y, Lp) < GAP) ok = false;
      if (ok) { if (!cur) { cur = []; runs.push(cur); } cur.push([x, y]); } else cur = null;
    });
    return runs.filter(function (r) { return r.length > 1; });
  }
  var INTRO_MODE = 'slide';
  var MORPH_DUR = 2600;
  // The S as a wire: its own bends relax, step by step, into the curvature of the circle, so it unrolls instead of being dragged.
  // Anchored at its middle, which travels to the right-hand point of the circle; then it runs round like a loader and closes.
  var SW = (function () {
    var P = MONO.src[2], n = P.length, seg = [], ang = [], turn = [0], m = Math.floor((n - 1) / 2), R = MONO.R;
    for (var i = 1; i < n; i++) { seg.push(Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1])); ang.push(Math.atan2(P[i][1] - P[i - 1][1], P[i][0] - P[i - 1][0])); }
    for (i = 1; i < n - 1; i++) turn.push(wrapA(ang[i] - ang[i - 1]));
    var before = 0, after = 0; for (i = 0; i < seg.length; i++) { if (i < m) before += seg[i]; else after += seg[i]; }
    // dir: the S is stretched in the sense that keeps its lower-left end at the bottom (no flip); -1 when the path starts there
    var dir = P[0][1] > P[n - 1][1] ? -1 : 1;
    return { P: P, n: n, seg: seg, ang: ang, turn: turn, m: m, dir: dir, a0: -dir * before / R, a1: dir * after / R, span: (before + after) / R };
  })();
  function sWire(e, mv) {
    var W = SW, R = MONO.R, m = W.m, pm = W.P[m], tx = MONO.cx + R, ty = MONO.cy;
    var x0 = pm[0] + (tx - pm[0]) * mv, y0 = pm[1] + (ty - pm[1]) * mv;
    var aT = W.dir * (Math.PI / 2 + W.seg[m] / (2 * R)), a0 = W.ang[m] + wrapA(aT - W.ang[m]) * e;
    function tn(j) { return W.turn[j] * (1 - e) + W.dir * ((W.seg[j - 1] + W.seg[j]) / (2 * R)) * e; }
    var fwd = [[x0, y0]], a = a0, x = x0, y = y0;
    for (var k = m; k < W.seg.length; k++) { if (k > m) a += tn(k); x += W.seg[k] * Math.cos(a); y += W.seg[k] * Math.sin(a); fwd.push([x, y]); }
    var back = [], b = a0; x = x0; y = y0;
    for (k = m - 1; k >= 0; k--) { b -= tn(k + 1); x -= W.seg[k] * Math.cos(b); y -= W.seg[k] * Math.sin(b); back.unshift([x, y]); }
    return back.concat(fwd);
  }
  function arcPts(t0, t1, n) { var out = []; for (var i = 0; i < n; i++) { var a = t0 + (t1 - t0) * i / (n - 1); out.push([MONO.cx + MONO.R * Math.cos(a), MONO.cy + MONO.R * Math.sin(a)]); } return out; }
  function morph() {
    var vw = window.innerWidth, vh = window.innerHeight, k1 = Math.min(vw * .78, 1100) / 1351.0, k2 = monoTarget();
    var st = performance.now(), dur = MORPH_DUR, NS = MONO.src[2].length;
    cancelAnimationFrame(raf);
    (function step(now) {
      var k = clamp01((now - st) / dur), tr = ease(clamp01(k / .85));
      var E = [ease(clamp01((k - .02) / .36)), ease(clamp01((k - .05) / .35))];
      var Lnow = null;
      for (var i = 0; i < 2; i++) {
        var a = MONO.src[i], b = MONO.dst[i], e = E[i];
        if (i === 1 && INTRO_MODE === 'slide') { ipaths[2].setAttribute('d', slideA(k, Lnow)); }
        else { var pp = a.map(function (p, j) { return [p[0] + (b[j][0] - p[0]) * e, p[1] + (b[j][1] - p[1]) * e]; }); if (i === 0) Lnow = pp; ipaths[i + 1].setAttribute('d', poly(pp)); }
        ipaths[i + 1].style.strokeDasharray = ''; ipaths[i + 1].style.strokeDashoffset = ''; ipaths[i + 1].style.opacity = '';
      }
      // S: it unrolls into an arc on the right of the circle, outside the letters; then, without stopping, it runs round
      // clockwise, its head pulling ahead of its tail until they meet and the circle closes
      var pts, K1 = .56;
      if (k < K1) pts = sWire(ease(clamp01((k - .04) / .34)), ease(clamp01((k - .2) / (K1 - .2))));
      else {
        var u = clamp01((k - K1) / (1 - K1)), rot = 1.25 * Math.PI * (1 - Math.cos(Math.PI * u)) / 2;
        // clockwise: the end that leads is the one at the bottom, the S's own lower-left end
        var grow = (2 * Math.PI - SW.span) * ease(clamp01((u - .04) / .96));
        pts = arcPts(SW.a0 + rot + (SW.dir < 0 ? grow : 0), SW.a1 + rot + (SW.dir > 0 ? grow : 0), NS);
      }
      ipaths[3].setAttribute('d', poly(pts));
      ipaths[3].style.strokeDasharray = ''; ipaths[3].style.strokeDashoffset = ''; ipaths[3].style.opacity = '';
      var sc = k1 + (k2 - k1) * tr, ccx = 675.5 + (MONO.cx - 675.5) * tr, ccy = 158 + (MONO.cy - 158) * tr;
      ig.setAttribute('transform', 'translate(' + (vw / 2 - ccx * sc).toFixed(2) + ',' + (vh / 2 - ccy * sc).toFixed(2) + ') scale(' + sc.toFixed(5) + ')');
      monoScale = sc;
      if (k < 1) raf = requestAnimationFrame(step);
    })(st);
  }
  // The monogram travels to the header while the two blocks appear behind it
  function flyHome() {
    var vw = window.innerWidth, vh = window.innerHeight, k2 = monoScale;
    var hl = top.querySelector('.logo-mono'), r = hl.getBoundingClientRect(), vb = MONO.vb, s2 = r.height / vb[3];
    var from = { s: k2, tx: vw / 2 - MONO.cx * k2, ty: vh / 2 - MONO.cy * k2 }, to = { s: s2, tx: r.left - vb[0] * s2, ty: r.top - vb[1] * s2 };
    document.getElementById('intro-skip').style.visibility = 'hidden';
    later(function () { heroEl.classList.remove('is-landing'); }, 250);
    var st = performance.now(), dur = 1050, INK = [19, 20, 22], WHITE = [255, 255, 255];
    var DISC = [19, 20, 22];
    function mixc(a, b, k) { return 'rgb(' + a.map(function (v, i) { return Math.round(v + (b[i] - v) * k); }).join(',') + ')'; }
    ig.insertBefore(ipaths[3], ig.firstChild);
    cancelAnimationFrame(raf);
    (function step(now) {
      var k = clamp01((now - st) / dur), e = ease(k), c = ease(clamp01((now - st - 100) / 750));
      intro.style.backgroundColor = 'rgba(251,250,248,' + (1 - c).toFixed(3) + ')';
      // the isotipo arrives exactly as it was drawn: black lines, no fill
      var ink = mixc(INK, INK, c), dcol = ink;
      for (var i = 0; i < 3; i++) ipaths[i].style.stroke = ink;
      ipaths[3].style.stroke = dcol; ipaths[3].style.fill = 'none';
      var sc = from.s + (to.s - from.s) * e;
      ig.setAttribute('transform', 'translate(' + (from.tx + (to.tx - from.tx) * e).toFixed(2) + ',' + (from.ty + (to.ty - from.ty) * e).toFixed(2) + ') scale(' + sc.toFixed(5) + ')');
      var sw = (12 + (30 - 12) * e).toFixed(2); ipaths.forEach(function (pth) { pth.style.strokeWidth = sw; });
      if (k < 1) raf = requestAnimationFrame(step); else land();
    })(st);
  }
  function fly() {
    var vw = window.innerWidth, vh = window.innerHeight, k1 = Math.min(vw * .78, 1100) / 1351.0, mobile = vw < 900;
    var from = { s: k1, tx: vw / 2 - 675.50 * k1, ty: vh / 2 - 158 * k1 };
    var groups = [ig], dest = [wordBox(words[0])];
    if (!mobile) { [].slice.call(twin.children).forEach(function (pth, i) { pth.setAttribute('d', ipaths[i].getAttribute('d')); }); twin.style.display = ''; groups.push(twin); dest.push(wordBox(words[1])); }
    document.getElementById('intro-skip').style.visibility = 'hidden';
    var st = performance.now(), dur = 1500, A = [19, 20, 22];
    cancelAnimationFrame(raf);
    (function step(now) {
      // one shared progress: the colours appear and the strokes whiten at exactly the same pace
      var k = clamp01((now - st) / dur), e = ease(k), c = ease(clamp01((now - st - 100) / 750));
      intro.style.backgroundColor = 'rgba(251,250,248,' + (1 - c).toFixed(3) + ')';
      var col = 'rgb(' + A.map(function (v) { return Math.round(v + (255 - v) * c); }).join(',') + ')';
      groups.forEach(function (g, i) {
        var D = dest[i], sc = from.s + (D.s - from.s) * e, tx = from.tx + (D.tx - from.tx) * e, ty = from.ty + (D.ty - from.ty) * e;
        g.setAttribute('transform', 'translate(' + tx.toFixed(2) + ',' + ty.toFixed(2) + ') scale(' + sc.toFixed(5) + ')');
        g.style.stroke = col;
      });
      if (k < 1) raf = requestAnimationFrame(step); else land();
    })(st);
  }
  document.getElementById('intro-skip').addEventListener('click', function () {
    timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf);
    intro.getAnimations().forEach(function (a) { a.cancel(); }); ig.getAnimations().forEach(function (a) { a.cancel(); });
    land();
  });
  

  playIntro();

  /* ---------- Who we are: Studio and Space, joined by ALAS, each with its clients; shared clients sit between them ---------- */
  (function () {
    var fig = document.getElementById('eco'); if (!fig) return;
    var IC = {
      house: 'M3.5 11.5 L12 4.5 L20.5 11.5 M5.5 10 V20 H18.5 V10 M10 20 V14.5 H14 V20',
      block: 'M5.5 21 V3.5 H18.5 V21 M3 21 H21 M8.5 7 H10 M14 7 H15.5 M8.5 10.5 H10 M14 10.5 H15.5 M8.5 14 H10 M14 14 H15.5 M10.5 21 V17.5 H13.5 V21',
      crane: 'M7 21 V3 M4 21 H10 M7 3 H20.5 M7 6.5 L10.5 3 M3.5 5 L7 3 M17.5 3 V8.5 M16 8.5 H19 V11.5 H16 Z',
      square: 'M4.5 19.5 V4.5 L19.5 19.5 Z M8 16 V12.5 L11.5 16 Z M14 4 L20 10 M12.5 5.5 L14.5 3.5 M18.5 8.5 L20.5 6.5',
      bricks: 'M3.5 5.5 H20.5 V19.5 H3.5 Z M3.5 10.2 H20.5 M3.5 14.8 H20.5 M9 5.5 V10.2 M15 5.5 V10.2 M6.2 10.2 V14.8 M12 10.2 V14.8 M17.8 10.2 V14.8 M9 14.8 V19.5 M15 14.8 V19.5',
      gov: 'M3.5 9 L12 4 L20.5 9 Z M5 9 V10.5 H19 V9 M6.5 10.5 V17.5 M10 10.5 V17.5 M14 10.5 V17.5 M17.5 10.5 V17.5 M4.5 17.5 H19.5 M3.5 20 H20.5'
    };
    // to: which branch(es) the client works with; side: where its name goes
    var N = {
      part: { ic: 'house', side: 'L', to: ['studio'], lab: ['Particulares'] },
      com: { ic: 'block', side: 'L', to: ['studio'], lab: ['Comunidades', 'de propietarios'] },
      est: { ic: 'square', side: 'R', to: ['space'], lab: ['Estudios de', 'arquitectura'] },
      con: { ic: 'bricks', side: 'R', to: ['space'], lab: ['Constructoras'] },
      adm: { ic: 'gov', side: 'T', to: ['studio', 'space'], lab: ['Administraciones'] },
      prom: { ic: 'crane', side: 'B', to: ['studio', 'space'], lab: ['Promotoras'] }
    };
    var LAY = {
      wide: { w: 1200, h: 480, fs: 18, ics: 1.9, bt: 26, bs: 15, wordW: 168, lbl: 'side',
        n: { studio: [400, 240, 92], space: [800, 240, 92], word: [600, 240], part: [215, 140, 50], com: [215, 340, 50], est: [985, 140, 50], con: [985, 340, 50], adm: [600, 62, 44], prom: [600, 418, 44] } },
      narrow: { w: 360, h: 372, fs: 10.5, ics: 1.4, bt: 13, bs: 9, wordW: 76, lbl: 'below',
        n: { studio: [96, 190, 34], space: [264, 190, 34], word: [180, 190], part: [40, 96, 20], com: [40, 284, 20], est: [320, 96, 20], con: [320, 284, 20], adm: [180, 62, 20], prom: [180, 318, 20] } }
    };
    var SHOW = { studio: 0, word: 350, space: 650, part: 1100, com: 1200, est: 1300, con: 1400, adm: 1500, prom: 1600 };
    var lay, n, size = '', els = {}, edges = [], t0 = null;
    function icon(k, r) { var sc = r * 1.05 / 24; return '<g class="ic" transform="translate(' + (-12 * sc) + ',' + (-12 * sc) + ') scale(' + sc.toFixed(3) + ')" style="stroke-width:' + (lay.ics / sc).toFixed(2) + '"><path d="' + IC[k] + '"/></g>'; }
    function trim(a, b) { var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1; return [a[0] + dx / L * (a[2] + 4), a[1] + dy / L * (a[2] + 4), b[0] - dx / L * (b[2] + 4), b[1] - dy / L * (b[2] + 4)]; }
    function build() {
      var fw = fig.clientWidth, fh = fig.clientHeight || 1, nw = fw >= 640 && fw / fh > 1.55 ? 'wide' : 'narrow'; if (nw === size) return; size = nw; lay = LAY[nw]; n = nw === 'narrow';
      var P = lay.n, h = '<svg viewBox="0 0 ' + lay.w + ' ' + lay.h + '">';
      // client edges, drawn from the client towards the branch
      edges = [];
      Object.keys(N).forEach(function (k) { N[k].to.forEach(function (b) { var c = trim(P[k], P[b]); edges.push({ k: k, b: b }); h += '<path class="edge ' + (b === 'studio' ? 'edge-s' : 'edge-p') + '" id="eco-e' + (edges.length - 1) + '" pathLength="1" d="M' + c[0] + ',' + c[1] + ' L' + c[2] + ',' + c[3] + '" style="stroke-dasharray:1 1;stroke-dashoffset:1"/>'; }); });
      // Studio and Space joined by the ALAS wordmark
      var W = lay.wordW, Wh = W * 332 / 1379, wx = P.word[0], wy = P.word[1], gap = n ? 5 : 12;
      h += '<path class="link" id="eco-l0" pathLength="1" d="M' + (P.studio[0] + P.studio[2] + 4) + ',' + wy + ' H' + (wx - W / 2 - gap) + '" style="stroke-dasharray:1 1;stroke-dashoffset:1"/>';
      h += '<path class="link" id="eco-l1" pathLength="1" d="M' + (P.space[0] - P.space[2] - 4) + ',' + wy + ' H' + (wx + W / 2 + gap) + '" style="stroke-dasharray:1 1;stroke-dashoffset:1"/>';
      h += '<g id="eco-word" style="opacity:0"><svg class="eco-word" x="' + (wx - W / 2) + '" y="' + (wy - Wh / 2) + '" width="' + W + '" height="' + Wh + '" viewBox="-14 -8 1379 332">' + document.querySelector('.foot .logo').innerHTML + '</svg></g>';
      for (var i = 0; i < 10; i++) h += '<circle r="' + (n ? 2.6 : 4) + '" id="eco-p' + i + '" style="opacity:0"/>';
      // clients: icon inside, name outside
      Object.keys(N).forEach(function (k) {
        var p = P[k], d = N[k];
        h += '<g class="client" id="eco-' + k + '" transform="translate(' + p[0] + ',' + p[1] + ') scale(0)"><circle r="' + p[2] + '"/>' + icon(d.ic, p[2]) + '</g>';
        var lh = lay.fs * 1.2, tx, ty, anc;
        if (!n && d.side !== 'T' && d.side !== 'B') { tx = p[0] + (d.side === 'L' ? -1 : 1) * (p[2] + 16); ty = p[1] - (d.lab.length - 1) * lh / 2; anc = d.side === 'L' ? 'end' : 'start'; }
        else if (!n) { tx = p[0] + p[2] + 16; ty = p[1]; anc = 'start'; }
        else if (d.side === 'T' || p[1] < P.studio[1]) { tx = p[0]; ty = p[1] - p[2] - 11 - (d.lab.length - 1) * lh; anc = 'middle'; }
        else { tx = p[0]; ty = p[1] + p[2] + 11; anc = 'middle'; }
        h += '<text class="lab" id="eco-t' + k + '" x="' + tx + '" y="' + ty + '" text-anchor="' + anc + '" style="font-size:' + lay.fs + 'px;opacity:0">' + d.lab.map(function (l, j) { return '<tspan x="' + tx + '" dy="' + (j ? lh : 0) + '">' + l + '</tspan>'; }).join('') + '</text>';
      });
      // the two branches: their isotipo in their own colours
      var iso = document.querySelector('.logo-mono').innerHTML.replace(/<path class="disc"[^>]*>/, '');
      [['studio', 'Studio', 'Arquitectura'], ['space', 'Space', 'Tecnología · I+D']].forEach(function (b) {
        var p = P[b[0]], r = p[2], s2 = r * .78;
        h += '<g class="branch b-' + b[0] + '" id="eco-' + b[0] + '" transform="translate(' + p[0] + ',' + p[1] + ') scale(0)"><circle r="' + r + '"/><svg class="eco-iso" x="' + (-s2) + '" y="' + (-s2) + '" width="' + s2 * 2 + '" height="' + s2 * 2 + '" viewBox="' + MONO.vb.join(' ') + '">' + iso + '</svg></g>';
        var y = p[1] + r + (n ? 13 : 28);
        h += '<g id="eco-t' + b[0] + '" style="opacity:0"><text class="bt" x="' + p[0] + '" y="' + y + '" text-anchor="middle" style="font-size:' + lay.bt + 'px">' + b[1] + '</text>' + (n ? '' : '<text class="bs" x="' + p[0] + '" y="' + (y + lay.bt * .95) + '" text-anchor="middle" style="font-size:' + lay.bs + 'px">' + b[2] + '</text>') + '</g>';
      });
      fig.innerHTML = h + '</svg>';
      els = {}; fig.querySelectorAll('[id^="eco-"]').forEach(function (e) { els[e.id.slice(4)] = e; });
      draw(t0 === null ? (reduce ? 1e9 : 0) : performance.now() - t0);
    }
    function along(el, q) { var L = el.getTotalLength(), pt = el.getPointAtLength(L * q); return [pt.x, pt.y]; }
    function draw(t) {
      var all = t >= 1e9, P = lay.n;
      ['studio', 'space', 'part', 'com', 'est', 'con', 'adm', 'prom'].forEach(function (k) {
        var p = P[k], sc = all ? 1 : Math.max(0, backOut(clamp01((t - SHOW[k]) / 520)));
        els[k].setAttribute('transform', 'translate(' + p[0] + ',' + p[1] + ') scale(' + sc.toFixed(3) + ')');
        els['t' + k].style.opacity = String(all ? 1 : clamp01((t - SHOW[k] - 250) / 400));
      });
      els.word.style.opacity = String(all ? 1 : clamp01((t - SHOW.word) / 450));
      els.l0.style.strokeDashoffset = String(1 - (all ? 1 : ease(clamp01((t - 250) / 400))));
      els.l1.style.strokeDashoffset = String(1 - (all ? 1 : ease(clamp01((t - 550) / 400))));
      edges.forEach(function (e, i) { els['e' + i].style.strokeDashoffset = String(1 - (all ? 1 : ease(clamp01((t - SHOW[e.k] - 120) / 500)))); });
      // each client sends a pulse to the branch it works with; Studio and Space each send one into ALAS
      var list = edges.map(function (e, i) { return ['e' + i, e.b === 'studio' ? 'p-studio' : 'p-space', i * 380]; }).concat([['l0', 'p-studio', 200], ['l1', 'p-space', 1500]]);
      list.forEach(function (rt, j) {
        var c = els['p' + j]; if (!c) return;
        if (all || t < 2600) { c.style.opacity = '0'; return; }
        var per = 3000, q = ((t - 2600 - rt[2]) % per + per) % per / 1100;
        if (q > 1) { c.style.opacity = '0'; return; }
        var pt = along(els[rt[0]], ease(q)); c.setAttribute('class', rt[1]); c.setAttribute('cx', pt[0].toFixed(1)); c.setAttribute('cy', pt[1].toFixed(1)); c.style.opacity = String(Math.sin(Math.PI * q).toFixed(2));
      });
    }
    build();
    if (window.ResizeObserver) new ResizeObserver(build).observe(fig);
    if (reduce) return;
    (function loop(now) { var r = fig.getBoundingClientRect(); if (r.width && r.left < window.innerWidth && r.right > 0 && r.bottom > 0 && r.top < window.innerHeight) { if (t0 === null) t0 = now; draw(now - t0); } requestAnimationFrame(loop); })(performance.now());
  })();

  /* ---------- How: the traditional process, one task after another, against ours: data split three ways, the BIM model with AI iterations, parallel production, then permits and delivery ---------- */
  (function () {
    var fig = document.getElementById('flow'); if (!fig) return;
    // time in % of the traditional process; lanes in units across a band of 4
    var TRAD = [['Datos', 0, 8], ['Análisis|normativo', 8.00, 16.36], ['Simulaciones', 16.36, 24.73], ['Propuestas|iniciales', 24.73, 33.09], ['Modelado 2D', 33.09, 41.45], ['Planos', 41.45, 49.82], ['Iteraciones|manuales', 49.82, 58.18], ['Sistemas|estructurales', 58.18, 66.55], ['Sistemas|energéticos', 66.55, 74.91], ['Mediciones y|presupuestos', 74.91, 83.27], ['Propuestas|visuales', 83.27, 91.64], ['Tramitación', 91.64, 100.00]];
    var PH = [
      { t: [0, 8], k: 'base', bars: ['Datos'] },
      { t: [9.6, 20.4], k: 'lane', bars: ['Análisis|normativo', 'Simulaciones', 'Propuestas|iniciales'] },
      { t: [22, 33.4], k: 'mix', bars: ['Propuestas|visuales', 'Modelo BIM', '↻ Iteraciones|con IA'], lanes: [[0, 1.15], [1.45, 2.55], [2.85, 4]], chain: [false, true, false] },
      { t: [35, 47.4], k: 'lane', bars: ['Planos', 'Sistemas|energéticos', 'Sistemas|estructurales', 'Mediciones y|presupuestos'], small: true },
      { t: [49, 57.5], k: 'res', bars: ['Tramitación'] }
    ], OURS = 59.5;
    var LAY = {
      wide: { w: 1100, h: 396, hz: true, tf: 20, sf: 12.5, fs: 14, trf: 11, a0: 4, a1: 1058, t1: 14, s1: 37, bar: 54, bh: 46, t2: 140, s2: 163, l0: 188, unit: 50, g: 7 },
      narrow: { w: 360, h: 452, hz: false, tf: 13.5, sf: 9.5, fs: 10.4, trf: 8.8, a0: 46, a1: 420, c0: 3, c1: 72, l0: 84, unit: 68, g: 5, er: 9 }
    };
    var size = '', L, el = {}, bars = [], conns = [], t0 = null, itT = [0, 0];
    function T(p) { return L.a0 + p / 100 * (L.a1 - L.a0); }
    function U(u) { return L.l0 + u * L.unit; }
    function box(ta, tb, ua, ub) {
      var g = L.g;
      return L.hz ? { x: T(ta), y: U(ua) + g / 2, w: T(tb) - T(ta), h: U(ub) - U(ua) - g } : { x: U(ua) + g / 2, y: T(ta), w: U(ub) - U(ua) - g, h: T(tb) - T(ta) };
    }
    function label(r, txt, fs, cls) {
      var lines = txt.split('|'), one = lines.join(' '), avail = (L.hz ? r.w - 18 : r.w - 6);
      if (one.length * fs * .55 <= avail) lines = [one];
      var lh = fs * 1.15, cy = r.y + r.h / 2 - (lines.length - 1) * lh / 2 + 1, x = r.x + r.w / 2;
      return '<text class="' + cls + '" x="' + x + '" y="' + cy + '" text-anchor="middle" style="font-size:' + fs + 'px;opacity:0">' + lines.map(function (l, i) { return '<tspan x="' + x + '" dy="' + (i ? lh : 0) + '">' + l + '</tspan>'; }).join('') + '</text>';
    }
    function slot(r, cls, id) { return '<rect class="fl-slot" x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" rx="5"/><rect class="' + cls + '" id="' + id + '" x="' + r.x + '" y="' + r.y + '" width="' + (L.hz ? 0 : r.w) + '" height="' + (L.hz ? r.h : 0) + '" rx="5"/>'; }
    function build() {
      var fw = fig.clientWidth, fh = fig.clientHeight || 1, nw = fw >= 640 && fw / fh > 1.7 ? 'wide' : 'narrow';
      // on a phone the drawing takes the whole width it is given: the extra goes into the gaps between columns and lanes
      // on a wide screen too: the drawing grows sideways into the room it has instead of just scaling up
      var W = nw === 'narrow' ? Math.max(360, Math.min(520, Math.round(LAY.narrow.h * fw / fh))) : Math.max(LAY.wide.w, Math.min(1800, Math.round(LAY.wide.h * fw / fh / 10) * 10)), key = nw + W;
      if (key === size) return; size = key; L = Object.assign({}, LAY[nw]);
      if (nw === 'wide') { var gx = Math.min(1, (W - LAY.wide.w) / 400); L.w = W; L.a1 = W - 42; L.trf += 1.6 * gx; L.fs += 1 * gx; }
      if (nw === 'narrow') { var ex = W - 360; L.w = W; L.c1 = 72 + ex * .28; L.l0 = L.c1 + 12 + ex * .18; L.unit = (W - 4 - L.l0) / 4; L.g = 5 + Math.min(7, ex * .1); }
      var hz = L.hz, h = '<svg viewBox="0 0 ' + L.w + ' ' + L.h + '" preserveAspectRatio="xMinYMid meet">';
      bars = []; conns = [];
      // traditional: a single line of tasks
      var tr = [];
      TRAD.forEach(function (s, i) {
        var r = hz ? { x: T(s[1]) + (i ? 1.5 : 0), y: L.bar, w: T(s[2]) - T(s[1]) - (i ? 3 : 1.5), h: L.bh } : { x: L.c0, y: T(s[1]) + (i ? 1 : 0), w: L.c1 - L.c0, h: T(s[2]) - T(s[1]) - (i ? 2 : 1) };
        h += slot(r, 'fl-seg', 'fl-tr' + i) + label(r, s[0], L.trf, 'fl-in');
        bars.push({ id: 'fl-tr' + i, r: r, t: [s[1], s[2]], lab: i });
      });
      // ours: phases, each split into parallel lanes, every lane linked to every lane of the next phase
      var prev = [];
      PH.forEach(function (ph, pi) {
        var m = ph.bars.length, cur = [], all = [];
        ph.bars.forEach(function (name, bi) {
          var ln = ph.lanes ? ph.lanes[bi] : [bi * 4 / m, (bi + 1) * 4 / m], r = box(ph.t[0], ph.t[1], ln[0], ln[1]), cls = ph.k === 'base' ? 'fl-seg' : ph.k === 'res' || (ph.k === 'mix' && ph.chain[bi]) ? 'fl-bim' : 'fl-lane';
          var id = 'fl-o' + pi + '-' + bi;
          h += slot(r, cls, id) + label(r, name, ph.small ? (L.hz ? 13 : 9) : L.fs, cls === 'fl-lane' ? 'fl-lane-t' : 'fl-in');
          bars.push({ id: id, r: r, t: ph.t });
          all.push(r); if (!ph.chain || ph.chain[bi]) cur.push(r);
        });
        if (ph.chain) {
          // visual proposals and AI iterations only talk to the BIM model, back and forth, outside the main chain
          var A = all[ph.chain.indexOf(true)];
          itT = ph.t;
          all.forEach(function (B, bi) {
            if (ph.chain[bi]) return;
            var up = hz ? B.y < A.y : B.x < A.x, q = hz ? [A.x + A.w / 2, up ? A.y - 2 : A.y + A.h + 2, A.x + A.w / 2, up ? B.y + B.h + 2 : B.y - 2] : [up ? A.x - 2 : A.x + A.w + 2, A.y + A.h / 2, up ? B.x + B.w + 2 : B.x - 2, A.y + A.h / 2];
            h += '<line class="fl-x fl-it" x1="' + q[0] + '" y1="' + q[1] + '" x2="' + q[2] + '" y2="' + q[3] + '" style="opacity:0"/><circle class="fl-x-dot fl-itd" r="' + (hz ? 3 : 2.4) + '" cx="' + q[0] + '" cy="' + q[1] + '" style="opacity:0"/>';
          });
        }
        prev.forEach(function (a) {
          cur.forEach(function (c) {
            var p0 = hz ? [a.x + a.w, a.y + a.h / 2] : [a.x + a.w / 2, a.y + a.h], p1 = hz ? [c.x, c.y + c.h / 2] : [c.x + c.w / 2, c.y], d;
            d = hz ? 'M' + p0[0] + ',' + p0[1] + ' C' + (p0[0] + p1[0]) / 2 + ',' + p0[1] + ' ' + (p0[0] + p1[0]) / 2 + ',' + p1[1] + ' ' + p1[0] + ',' + p1[1]
                   : 'M' + p0[0] + ',' + p0[1] + ' C' + p0[0] + ',' + (p0[1] + p1[1]) / 2 + ' ' + p1[0] + ',' + (p0[1] + p1[1]) / 2 + ' ' + p1[0] + ',' + p1[1];
            conns.push({ id: 'fl-c' + conns.length, t: [PH[pi - 1].t[1], ph.t[0]] });
            h += '<path class="fl-ar" id="fl-c' + (conns.length - 1) + '" d="' + d + '" pathLength="1" style="stroke-dasharray:1 1;stroke-dashoffset:1"/>';
          });
        });
        prev = cur;
      });
      var er = hz ? 16 : L.er, last = prev[0];
      // titles
      if (hz) {
        h += '<text class="fl-t" x="0" y="' + L.t1 + '" style="font-size:' + L.tf + 'px">Proceso tradicional</text><text class="fl-s" x="0" y="' + L.s1 + '" style="font-size:' + L.sf + 'px">Una tarea tras otra</text>';
        h += '<text class="fl-t" x="0" y="' + L.t2 + '" style="font-size:' + L.tf + 'px">Método ALAS</text><text class="fl-s" x="0" y="' + L.s2 + '" style="font-size:' + L.sf + 'px">En paralelo sobre el modelo BIM</text>';
      } else {
        h += '<text class="fl-t" x="' + L.c0 + '" y="10" style="font-size:' + L.tf + 'px">Tradicional</text><text class="fl-s" x="' + L.c0 + '" y="27" style="font-size:' + L.sf + 'px">Una tarea</text><text class="fl-s" x="' + L.c0 + '" y="38" style="font-size:' + L.sf + 'px">tras otra</text>';
        h += '<text class="fl-t" x="' + L.l0 + '" y="10" style="font-size:' + L.tf + 'px">Método ALAS</text><text class="fl-s" x="' + L.l0 + '" y="27" style="font-size:' + L.sf + 'px">En paralelo sobre el modelo BIM</text>';
      }
      // deliveries, guides and the time won
      var e1, e2, g1, g2, brk, PLANE = 'M21 3.5 L3 10.5 L10 13.5 L13.5 21 Z M21 3.5 L10 13.5';
      function endNode(id, pt, ours) { var sc = er * 1.1 / 24; return '<g id="' + id + '" transform="translate(' + pt[0] + ',' + pt[1] + ') scale(0)"><circle class="fl-end' + (ours ? ' ours' : '') + '" r="' + er + '"/><path class="fl-plane" d="' + PLANE + '" transform="translate(' + (-12.5 * sc) + ',' + (-11.5 * sc) + ') scale(' + sc.toFixed(3) + ')" style="stroke-width:' + (1.6 / sc).toFixed(2) + '"/><title>Entrega</title></g>'; }
      function brace(x0, x1, y0, d) { var m = (x0 + x1) / 2, r = Math.min(10, (x1 - x0) / 6); return 'M' + x0 + ',' + y0 + ' Q' + x0 + ',' + (y0 + d / 2) + ' ' + (x0 + r) + ',' + (y0 + d / 2) + ' H' + (m - r) + ' Q' + m + ',' + (y0 + d / 2) + ' ' + m + ',' + (y0 + d) + ' Q' + m + ',' + (y0 + d / 2) + ' ' + (m + r) + ',' + (y0 + d / 2) + ' H' + (x1 - r) + ' Q' + x1 + ',' + (y0 + d / 2) + ' ' + x1 + ',' + y0; }
      if (hz) {
        var my = last.y + last.h / 2, ey = L.bar + L.bh / 2, x2 = T(100) + er + 4, x1 = T(OURS) + er, xa = x1 + er + 10, y0 = my - 14;
        e1 = [x1, my]; e2 = [x2, ey];
        g1 = [x1, my, x1, my]; g2 = [x2, ey + er + 6, x2, y0 - 2];
        brk = '<path class="fl-brk" d="' + brace(xa, x2, y0, 16) + '"/><text class="fl-gain" x="' + (xa + x2) / 2 + '" y="' + (y0 + 38) + '" style="font-size:18px">Tiempo ganado</text>';
      } else {
        var mx = last.x + last.w / 2, cx2 = (L.c0 + L.c1) / 2, yb1 = T(OURS) + er, yb2 = T(100) + er + 4, bx = U(4) - 10;
        e1 = [mx, yb1]; e2 = [cx2, yb2];
        g1 = [mx + er + 4, yb1, bx - 2, yb1]; g2 = [cx2 + er + 4, yb2, bx - 2, yb2];
        var ym = (yb1 + yb2) / 2, rr = 8, dd = -12;
        brk = '<path class="fl-brk" d="M' + bx + ',' + yb1 + ' Q' + (bx + dd / 2) + ',' + yb1 + ' ' + (bx + dd / 2) + ',' + (yb1 + rr) + ' V' + (ym - rr) + ' Q' + (bx + dd / 2) + ',' + ym + ' ' + (bx + dd) + ',' + ym + ' Q' + (bx + dd / 2) + ',' + ym + ' ' + (bx + dd / 2) + ',' + (ym + rr) + ' V' + (yb2 - rr) + ' Q' + (bx + dd / 2) + ',' + yb2 + ' ' + bx + ',' + yb2 + '"/><text class="fl-gain" x="' + (bx + dd - 8) + '" y="' + ym + '" text-anchor="end" style="font-size:12.5px;text-anchor:end">Tiempo ganado</text>';
      }
      h += endNode('fl-e1', e1, true) + endNode('fl-e2', e2, false);
      h += '<line class="fl-guide" id="fl-g1" x1="' + g1[0] + '" y1="' + g1[1] + '" x2="' + g1[2] + '" y2="' + g1[3] + '" style="opacity:0"/>';
      h += '<line class="fl-guide" id="fl-g2" x1="' + g2[0] + '" y1="' + g2[1] + '" x2="' + g2[2] + '" y2="' + g2[3] + '" style="opacity:0"/>';
      h += '<g id="fl-brk" style="opacity:0">' + brk + '</g>';
      h += hz ? '<line class="fl-head" id="fl-head" x1="0" y1="' + (L.bar - 8) + '" x2="0" y2="' + (U(4) + 2) + '" style="opacity:0"/>' : '<line class="fl-head" id="fl-head" x1="' + (L.c0 - 4) + '" y1="0" x2="' + (U(4) + 4) + '" y2="0" style="opacity:0"/>';
      fig.innerHTML = h + '</svg>';
      el = {}; fig.querySelectorAll('[id^="fl-"]').forEach(function (e) { el[e.id] = e; });
      bars.forEach(function (b) { var n = el[b.id].nextElementSibling; b.lab = n && n.tagName === 'text' ? n : null; });
      draw(t0 === null ? (reduce ? 1e9 : 0) : performance.now() - t0);
    }
    function op(id, v) { if (el[id]) el[id].style.opacity = String(v); }
    function draw(t) {
      // one playhead runs at the same speed over both processes
      var CYC = 10600, RUN = 6600, tt = t >= 1e9 ? 1e9 : t % CYC, p = tt >= 1e9 ? 100 : clamp01((tt - 300) / RUN) * 100;
      fig.firstChild.style.opacity = String(tt >= 1e9 ? 1 : 1 - clamp01((tt - CYC + 700) / 600));
      bars.forEach(function (b) {
        var k = clamp01((p - b.t[0]) / (b.t[1] - b.t[0])), e = el[b.id];
        if (L.hz) e.setAttribute('width', (b.r.w * k).toFixed(1)); else e.setAttribute('height', (b.r.h * k).toFixed(1));
        if (b.lab) b.lab.style.opacity = String(clamp01((p - b.t[0] - .5) / 2.5));
      });
      conns.forEach(function (c) { el[c.id].style.strokeDashoffset = String(1 - clamp01((p - c.t[0]) / (c.t[1] - c.t[0]))); });
      fig.querySelectorAll('.fl-it').forEach(function (it, j) {
        var itd = it.nextElementSibling;
        it.style.opacity = String(clamp01((p - itT[0]) / 2));
        var on = tt < 1e9 && p > itT[0] + 1 && p < 100, w = (Math.sin(tt / 230 + j * 1.6) + 1) / 2;
        itd.setAttribute('cx', (+it.getAttribute('x1') + (it.getAttribute('x2') - it.getAttribute('x1')) * w).toFixed(1));
        itd.setAttribute('cy', (+it.getAttribute('y1') + (it.getAttribute('y2') - it.getAttribute('y1')) * w).toFixed(1));
        itd.style.opacity = on ? '1' : '0';
      });
      function pop(id, k) { var g = el[id], tr = g.getAttribute('transform').replace(/scale\([^)]*\)/, ''); g.setAttribute('transform', tr + 'scale(' + (k <= 0 ? 0 : Math.max(0, backOut(k))).toFixed(3) + ')'); }
      pop('fl-e1', tt >= 1e9 ? 1 : clamp01((p - OURS + 1.5) / 4)); pop('fl-e2', tt >= 1e9 ? 1 : clamp01((tt - 300 - RUN) / 450));
      op('fl-g1', tt >= 1e9 ? 1 : clamp01((p - OURS) / 4)); op('fl-g2', tt >= 1e9 ? 1 : clamp01((tt - RUN - 300) / 400));
      op('fl-brk', tt >= 1e9 ? 1 : clamp01((tt - RUN - 500) / 500));
      var hd = el['fl-head'], v = T(p).toFixed(1);
      if (L.hz) { hd.setAttribute('x1', v); hd.setAttribute('x2', v); } else { hd.setAttribute('y1', v); hd.setAttribute('y2', v); }
      hd.style.opacity = tt < 1e9 && p > 0 && p < 100 ? '' : '0';
    }
    build();
    if (window.ResizeObserver) new ResizeObserver(build).observe(fig);
    if (reduce) return;
    (function loop(now) { var r = fig.getBoundingClientRect(); if (r.width && r.left < window.innerWidth && r.right > 0 && r.bottom > 0 && r.top < window.innerHeight) { if (t0 === null) t0 = now; draw(now - t0); } requestAnimationFrame(loop); })(performance.now());
  })();


  /* ---------- Why: a typical project, process by process; each ALAS method cuts hours from several processes at once ---------- */
  (function () {
    var fig = document.getElementById('why'); if (!fig) return;
    var ICW = {
      search: 'M4.5 10.5 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M15 15 L20 20',
      pencil: 'M4 20 L5 15.5 L15.5 5 L19 8.5 L8.5 19 Z M13.5 7 L17 10.5',
      cube: 'M12 3.5 L19.5 7.5 V16.5 L12 20.5 L4.5 16.5 V7.5 Z M4.5 7.5 L12 11.5 L19.5 7.5 M12 11.5 V20.5',
      plan: 'M3.5 4 H20.5 V20 H3.5 Z M3.5 12 H10 V20 M14 4 V8.5 M14 13 H20.5',
      frame: 'M5 4.5 H19 M5 19.5 H19 M12 4.5 V19.5 M5 4.5 V6.5 M19 4.5 V6.5 M5 19.5 V17.5 M19 19.5 V17.5',
      calc: 'M6 3.5 H18 V20.5 H6 Z M8.5 6.5 H15.5 V9.5 H8.5 Z M9 13 H9.1 M12 13 H12.1 M15 13 H15.1 M9 16.8 H9.1 M12 16.8 H12.1 M15 16.8 H15.1',
      doc: 'M6 3.5 H14.5 L18.5 7.5 V20.5 H6 Z M14.5 3.5 V7.5 H18.5 M9 11 H15.5 M9 14 H15.5 M9 17 H12.5',
      stamp: 'M3.5 9 L12 4 L20.5 9 Z M5 9 V10.5 H19 V9 M6.5 10.5 V17.5 M10 10.5 V17.5 M14 10.5 V17.5 M17.5 10.5 V17.5 M4.5 17.5 H19.5 M3.5 20 H20.5',
      gear: 'M9 12 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 M12 3.5 V6 M12 18 V20.5 M3.5 12 H6 M18 12 H20.5 M6 6 L7.8 7.8 M16.2 16.2 L18 18 M6 18 L7.8 16.2 M16.2 7.8 L18 6'
    };
    var PROC = [['Análisis previo y normativo', 'search', 11], ['Diseño y propuestas', 'pencil', 13], ['Modelado', 'cube', 14], ['Producción de planimetría', 'plan', 16], ['Cálculo de sistemas (MEP y estructura)', 'frame', 9], ['Mediciones y presupuestos', 'calc', 9], ['Redacción documental', 'doc', 11], ['Tramitación', 'stamp', 8], ['Gestión interna y coordinación', 'gear', 9]];
    // hours each method saves in each process (illustrative)
    var METH = [['Modelo BIM', { 1: 2, 3: 6, 4: 2, 5: 4 }], ['Agentes inteligentes', { 0: 5, 1: 2, 6: 4, 7: 2 }], ['Plantillas y sistemas', { 1: 2, 2: 4, 3: 3, 6: 3 }], ['Flujos automatizados', { 0: 2, 4: 1, 5: 2, 8: 1 }], ['Suite de trabajo adecuada', { 2: 2, 8: 3 }], ['Flujos propios', { 7: 1, 8: 2 }]];
    var OUT = ['Menos errores', 'Menos tiempo', 'Menos trabajo', 'Menos coste'], OUTS = OUT;
    var TOTAL = 100, SAVED = 0; METH.forEach(function (m) { Object.keys(m[1]).forEach(function (k) { SAVED += m[1][k]; }); });
    var LAY = {
      wide: { w: 1100, h: 424, hz: true, x0: 340, u: 26, ut: 4.16, y0: 30, pitch: 38, bh: 18, fs: 14, vf: 12, ir: 13, totY: 388, tbh: 22, lgX: 850 },
      narrow: { w: 360, h: 448, hz: false, x0: 26, u: 18, ut: 2.9, y0: 60, pitch: 34, bh: 11, fs: 11, vf: 9.5, ir: 8, totY: 376, tbh: 14 }
    };
    var size = '', L, n, el = {}, t0 = null;
    var T0 = 900, STEP = 1000, CUT = 650, END = T0 + (METH.length - 1) * STEP + CUT, CYC = 12600;
    function icon(k, x, y, r) { var sc = r * 1.1 / 24; return '<g transform="translate(' + x + ',' + y + ')"><circle class="w-icb" r="' + r + '"/><g class="w-ic" transform="translate(' + (-12 * sc) + ',' + (-12 * sc) + ') scale(' + sc.toFixed(3) + ')" style="stroke-width:' + (1.5 / sc).toFixed(2) + '"><path d="' + ICW[k] + '"/></g></g>'; }
    function build() {
      var fw = fig.clientWidth, fh = fig.clientHeight || 1, nw = fw >= 640 && fw / fh > 1.6 ? 'wide' : 'narrow'; if (nw === size) return; size = nw; L = LAY[nw]; n = !L.hz;
      var h = '<svg viewBox="0 0 ' + L.w + ' ' + L.h + '" preserveAspectRatio="xMinYMid meet">';
      PROC.forEach(function (p, i) {
        var y = L.y0 + i * L.pitch, by = n ? y + 7 : y - L.bh / 2, lx = n ? L.x0 : 40, ly = n ? y - 1 : y;
        h += icon(p[1], n ? 9 : 14, n ? y + 5 : y, L.ir);
        h += '<text x="' + lx + '" y="' + ly + '" style="font-size:' + L.fs + 'px">' + p[0] + '</text>';
        h += '<rect class="w-slot" x="' + L.x0 + '" y="' + by + '" width="' + p[2] * L.u + '" height="' + L.bh + '" rx="3"/>';
        // one piece per method that saves time here, drawn from the right end inwards
        var before = 0;
        METH.forEach(function (m, j) { var c = m[1][i]; if (!c) return; h += '<rect class="w-cut" id="w-c' + j + '-' + i + '" data-a="' + (p[2] - before - c) + '" data-b="' + (p[2] - before) + '" x="0" y="' + by + '" width="0" height="' + L.bh + '" rx="3"/>'; before += c; });
        h += '<rect class="w-bar" id="w-b' + i + '" x="' + L.x0 + '" y="' + by + '" width="0" height="' + L.bh + '" rx="3"/>';
        h += '<text class="w-val" id="w-v' + i + '" x="' + (L.x0 + p[2] * L.u + 8) + '" y="' + (by + L.bh / 2 + 1) + '" style="font-size:' + L.vf + 'px;opacity:0">' + p[2] + ' h</text>';
      });
      // the whole project: what is left, and everything the methods saved, gathered in one bar
      var ty = L.totY, tby = n ? ty + 8 : ty - L.tbh / 2;
      h += '<text class="w-tot" x="' + (n ? L.x0 : 40) + '" y="' + (n ? ty - 2 : ty) + '" style="font-size:' + (L.fs + 1) + 'px">Proyecto completo</text>';
      h += '<rect class="w-slot" x="' + L.x0 + '" y="' + tby + '" width="' + TOTAL * L.ut + '" height="' + L.tbh + '" rx="3"/>';
      h += '<rect class="w-cut on" id="w-ts" x="0" y="' + tby + '" width="0" height="' + L.tbh + '" rx="3"/>';
      h += '<rect class="w-bar" id="w-tb" x="' + L.x0 + '" y="' + tby + '" width="0" height="' + L.tbh + '" rx="3"/>';
      h += '<text class="w-sv" id="w-sv" x="0" y="' + (tby + L.tbh / 2 + 1) + '" text-anchor="middle" style="font-size:' + (n ? 9.5 : 13) + 'px;opacity:0"></text>';
      h += '<text class="w-val" id="w-tv" x="' + (L.x0 + TOTAL * L.ut + 8) + '" y="' + (tby + L.tbh / 2 + 1) + '" style="font-size:' + (L.vf + 1) + 'px;opacity:0">100 h</text>';
      if (L.hz) {
        h += '<text class="w-kick" x="' + L.lgX + '" y="22" style="font-size:12px">MÉTODOS ALAS</text>';
        METH.forEach(function (m, j) { var tot = 0; Object.keys(m[1]).forEach(function (k) { tot += m[1][k]; }); var y = 54 + j * 30; h += '<g class="w-lg" id="w-l' + j + '" style="opacity:.35"><rect x="' + L.lgX + '" y="' + (y - 6) + '" width="12" height="12" rx="3"/><text class="w-lt" x="' + (L.lgX + 20) + '" y="' + y + '" style="font-size:14px">' + m[0] + '</text><text class="w-lv" x="1096" y="' + y + '" style="font-size:12px">−' + tot + ' h</text></g>'; });
        h += '<text class="w-kick" id="w-ok" x="' + L.lgX + '" y="262" style="font-size:12px;opacity:0">RESULTADO</text>';
        OUT.forEach(function (o, j) { var y = 290 + j * 29; h += '<g class="w-out" id="w-o' + j + '" style="opacity:0"><circle cx="' + (L.lgX + 6) + '" cy="' + y + '" r="5"/><text x="' + (L.lgX + 20) + '" y="' + y + '" style="font-size:15px">' + o + '</text></g>'; });
      } else {
        h += '<text class="w-kick" id="w-step" x="' + L.x0 + '" y="10" style="font-size:9px">MÉTODO ALAS</text><text class="w-met" id="w-name" x="' + L.x0 + '" y="30" style="font-size:15px"></text>';
        var cw = (L.w - L.x0 - 18) / 4;
        OUTS.forEach(function (o, j) { var x = L.x0 + j * (cw + 6); h += '<g class="w-out w-chip" id="w-o' + j + '" style="opacity:0"><rect x="' + x + '" y="' + (L.h - 26) + '" width="' + cw + '" height="22" rx="11"/><text x="' + (x + cw / 2) + '" y="' + (L.h - 14) + '" text-anchor="middle" style="font-size:9.6px">' + o + '</text></g>'; });
      }
      fig.innerHTML = h + '</svg>';
      el = {}; fig.querySelectorAll('[id^="w-"]').forEach(function (e) { el[e.id] = e; });
      draw(t0 === null ? (reduce ? 1e9 : 0) : performance.now() - t0);
    }
    function draw(t) {
      var all = t >= 1e9, tt = all ? 1e9 : t % CYC;
      fig.firstChild.style.opacity = String(all ? 1 : 1 - clamp01((tt - CYC + 700) / 600));
      var prog = METH.map(function (m, j) { return all ? 1 : ease(clamp01((tt - T0 - j * STEP) / CUT)); });
      var cur = -1; METH.forEach(function (m, j) { if (!all && tt >= T0 + j * STEP - 150) cur = j; }); if (!all && tt > END + 300) cur = -1;
      var savedNow = 0;
      PROC.forEach(function (p, i) {
        var g = all ? 1 : ease(clamp01((tt - 100 - i * 60) / 600)), cut = 0;
        METH.forEach(function (m, j) {
          var c = m[1][i]; if (!c) return; cut += c * prog[j];
          var r = el['w-c' + j + '-' + i], a = +r.getAttribute('data-a'), b = +r.getAttribute('data-b'), x = b - c * prog[j];
          r.setAttribute('x', (L.x0 + x * L.u).toFixed(1)); r.setAttribute('width', Math.max(0, (b - x) * L.u - (prog[j] > 0 ? 1.5 : 0)).toFixed(1));
          r.classList.toggle('on', j === cur);
        });
        savedNow += cut;
        el['w-b' + i].setAttribute('width', Math.max(0, (p[2] - cut) * L.u * g - 1.5).toFixed(1));
        var v = el['w-v' + i]; v.style.opacity = String(all ? 1 : clamp01((tt - 500 - i * 60) / 400)); v.textContent = Math.round(p[2] - cut) + ' h';
      });
      var gt = all ? 1 : ease(clamp01((tt - 500) / 700)), left = TOTAL - savedNow;
      el['w-tb'].setAttribute('width', Math.max(0, left * L.ut * gt - 1.5).toFixed(1));
      el['w-ts'].setAttribute('x', (L.x0 + left * L.ut).toFixed(1)); el['w-ts'].setAttribute('width', Math.max(0, savedNow * L.ut).toFixed(1));
      var fin = all ? 1 : clamp01((tt - END - 200) / 500);
      el['w-tb'].setAttribute('class', fin > .5 ? 'w-res' : 'w-bar');
      el['w-tv'].style.opacity = String(all ? 1 : clamp01((tt - 900) / 400));
      el['w-tv'].textContent = Math.round(left) + ' h';
      // what has been saved so far, written inside the blue part once it is wide enough
      var sw = savedNow * L.ut; el['w-sv'].setAttribute('x', (L.x0 + left * L.ut + sw / 2).toFixed(1)); el['w-sv'].textContent = '−' + Math.round(savedNow) + ' h ahorradas'; el['w-sv'].style.opacity = sw > (n ? 78 : 120) ? '1' : '0';
      METH.forEach(function (m, j) { var lg = el['w-l' + j]; if (!lg) return; lg.style.opacity = all ? '1' : j === cur ? '1' : prog[j] >= 1 ? '.7' : '.35'; });
      if (el['w-name']) { el['w-name'].textContent = all || cur < 0 ? (fin > 0 ? 'Todos los métodos: −' + SAVED + ' h' : '') : METH[cur][0]; el['w-step'].textContent = all || cur < 0 ? 'MÉTODOS ALAS' : 'MÉTODO ALAS ' + (cur + 1) + '/' + METH.length; }
      if (el['w-ok']) el['w-ok'].style.opacity = String(fin);
      OUT.forEach(function (o, j) { el['w-o' + j].style.opacity = String(all ? 1 : clamp01((tt - END - 400 - j * 250) / 400)); });
    }
    build();
    if (window.ResizeObserver) new ResizeObserver(build).observe(fig);
    if (reduce) return;
    (function loop(now) { var r = fig.getBoundingClientRect(); if (r.width && r.left < window.innerWidth && r.right > 0 && r.bottom > 0 && r.top < window.innerHeight) { if (t0 === null) t0 = now; draw(now - t0); } requestAnimationFrame(loop); })(performance.now());
  })();

  /* ---------- What we do: read left to right — Studio works with people, Space with companies, each with its four kinds of commission ---------- */
  (function () {
    var fig = document.getElementById('svc'); if (!fig) return;
    var SV = { studio: ['Proyectos arquitectónicos', 'Servicios técnicos', 'Modelado y BIM', 'Visualización'], space: ['Mentoring estratégico', 'Agentes automatizados', 'Plantillas y sistemas', 'Freelancing'] };
    // one line icon per service, on a 24 grid
    var SIC = { studio: [
        'M3.5 4 H20.5 V20 H3.5 Z M3.5 12 H10 V20 M14 4 V8.5 M14 13 H20.5 M10 8 A4 4 0 0 1 14 12',
        'M6 3.5 H14.5 L18.5 7.5 V20.5 H6 Z M14.5 3.5 V7.5 H18.5 M9 11 H15.5 M9 14 H15.5 M9 17 H12.5',
        'M12 3.5 L19.5 7.5 V16.5 L12 20.5 L4.5 16.5 V7.5 Z M4.5 7.5 L12 11.5 L19.5 7.5 M12 11.5 V20.5',
        'M2.5 12 C5 7.5 8.5 5.5 12 5.5 C15.5 5.5 19 7.5 21.5 12 C19 16.5 15.5 18.5 12 18.5 C8.5 18.5 5 16.5 2.5 12 Z M9 12 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0'],
      space: [
        'M3.5 5 H15 V13 H9 L5.5 16 V13 H3.5 Z M17.5 9 H20.5 V16.5 H18.5 V19.5 L15.5 16.5 H11 V15.5',
        'M7 7 H17 V17 H7 Z M10 10 H14 V14 H10 Z M9.5 4 V7 M12 4 V7 M14.5 4 V7 M9.5 17 V20 M12 17 V20 M14.5 17 V20 M4 9.5 H7 M4 12 H7 M4 14.5 H7 M17 9.5 H20 M17 12 H20 M17 14.5 H20',
        'M12 4 L20.5 8.5 L12 13 L3.5 8.5 Z M3.5 12.5 L12 17 L20.5 12.5 M3.5 16.5 L12 21 L20.5 16.5',
        'M5.5 9 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0 M13.5 9 a2.5 2.5 0 1 0 5 0 a2.5 2.5 0 1 0 -5 0 M3.5 19 C3.5 15.5 5.5 13.5 8 13.5 C10.5 13.5 12 15 12 17 C12 15 13.5 13.5 16 13.5 C18.5 13.5 20.5 15.5 20.5 19'] };
    var LAY = {
      wide: { w: 1100, h: 452, fs: 20, df: 22, r: 78, br: 27, ics: 1.8, kf: 12, hf: 24,
        hd: { studio: [40, 18, 'start'], space: [1060, 18, 'end'] },
        studio: { c: [440, 254], mx: 298, side: -1, ys: [114, 207, 300, 393] }, space: { c: [660, 254], mx: 802, side: 1, ys: [114, 207, 300, 393] } },
      narrow: { w: 360, h: 452, fs: 13.5, df: 13, r: 46, br: 17, ics: 1.3, kf: 8.6, hf: 15,
        hd: { studio: [124, 8, 'start'], space: [124, 242, 'start'] },
        studio: { c: [56, 134], mx: 142, side: 1, ys: [70, 112, 154, 196] }, space: { c: [56, 366], mx: 142, side: 1, ys: [304, 346, 388, 430] } }
    };
    var WHO = { studio: ['STUDIO TRABAJA CON', 'Personas'], space: ['SPACE TRABAJA CON', 'Empresas'] };
    var size = '', L, n, br = [], mk = [], lb = [], pz = [], disc = {}, nm = {}, hd = {}, link, dot, t0 = null;
    function build() {
      var fw = fig.clientWidth, fh = fig.clientHeight || 1, nw = fw >= 640 && fw / fh > 1.55 ? 'wide' : 'narrow'; if (nw === size) return; size = nw; L = LAY[nw]; n = nw === 'narrow';
      var h = '<svg viewBox="0 0 ' + L.w + ' ' + L.h + '">';
      ['studio', 'space'].forEach(function (k) {
        var q = L.hd[k];
        h += '<g id="svh-' + k + '" style="opacity:0"><text class="kick kick-' + (k === 'studio' ? 's' : 'p') + '" x="' + q[0] + '" y="' + q[1] + '" text-anchor="' + q[2] + '" style="font-size:' + L.kf + 'px">' + WHO[k][0] + '</text><text class="hd" x="' + q[0] + '" y="' + (q[1] + L.hf * 1.15) + '" text-anchor="' + q[2] + '" style="font-size:' + L.hf + 'px">' + WHO[k][1] + '</text></g>';
        var g = L[k], c = g.c, sx = n ? c[0] + L.r : c[0] + g.side * L.r, br = L.br, isc = br * 1.1 / 24;
        g.ys.forEach(function (y, i) {
          var ex = g.mx - g.side * (br + 4), mx = (sx + ex) / 2;
          h += '<path class="br br-' + k + '" pathLength="1" d="M' + sx + ',' + c[1] + ' C' + mx + ',' + c[1] + ' ' + mx + ',' + y + ' ' + ex + ',' + y + '" style="stroke-dasharray:1 1;stroke-dashoffset:1"/>';
          // the service: its icon in a bubble ringed with the branch colour, its name outside
          h += '<g transform="translate(' + g.mx + ',' + y + ')"><g class="mk sb sb-' + k + '" transform="scale(0)"><circle r="' + br + '"/><g class="ic" transform="translate(' + (-12 * isc) + ',' + (-12 * isc) + ') scale(' + isc.toFixed(3) + ')" style="stroke-width:' + (L.ics / isc).toFixed(2) + '"><path d="' + SIC[k][i] + '"/></g></g></g>';
          h += '<text class="lb" x="' + (g.mx + g.side * (br + 14)) + '" y="' + (y + 1) + '" text-anchor="' + (g.side < 0 ? 'end' : 'start') + '" style="font-size:' + L.fs + 'px;opacity:0">' + SV[k][i] + '</text>';
          h += '<circle class="pz ' + (k === 'studio' ? 'm-studio' : 'm-space') + '" r="' + (n ? 3 : 4) + '"/>';
        });
      });
      // one line from Studio to Space; the work travels left to right (top to bottom on a phone)
      var a = L.studio.c, b = L.space.c;
      h += n ? '<line class="lk" x1="' + a[0] + '" y1="' + (a[1] + L.r + 6) + '" x2="' + b[0] + '" y2="' + (b[1] - L.r - 6) + '"/>' : '<line class="lk" x1="' + (a[0] + L.r + 6) + '" y1="' + a[1] + '" x2="' + (b[0] - L.r - 6) + '" y2="' + b[1] + '"/>';
      h += '<circle class="lkd" r="' + (n ? 3 : 4.5) + '"/>';
      // each branch shows its isotipo in its own colours; the name sits outside the disc
      var iso = document.querySelector('.logo-mono').innerHTML.replace(/<path class="disc"[^>]*>/, ''), s2 = L.r * .78;
      ['studio', 'space'].forEach(function (k) {
        var c = L[k].c, ty = n && k === 'studio' ? c[1] - L.r - 12 : c[1] + L.r + (n ? 14 : 30);
        h += '<g class="sv-disc b-' + k + '" id="svd-' + k + '" transform="translate(' + c[0] + ',' + c[1] + ') scale(0)"><circle class="d-' + k + '" r="' + L.r + '"/><svg class="sv-iso" x="' + (-s2) + '" y="' + (-s2) + '" width="' + s2 * 2 + '" height="' + s2 * 2 + '" viewBox="' + MONO.vb.join(' ') + '">' + iso + '</svg></g>';
        h += '<text class="sv-name" id="svn-' + k + '" x="' + c[0] + '" y="' + ty + '" text-anchor="middle" style="font-size:' + L.df + 'px;opacity:0">' + (k === 'studio' ? 'Studio' : 'Space') + '</text>';
      });
      fig.innerHTML = h + '</svg>';
      br = [].slice.call(fig.querySelectorAll('.br')); mk = [].slice.call(fig.querySelectorAll('.mk')); lb = [].slice.call(fig.querySelectorAll('.lb')); pz = [].slice.call(fig.querySelectorAll('.pz'));
      link = fig.querySelector('.lk'); dot = fig.querySelector('.lkd');
      disc = { studio: fig.querySelector('#svd-studio'), space: fig.querySelector('#svd-space') }; nm = { studio: fig.querySelector('#svn-studio'), space: fig.querySelector('#svn-space') }; hd = { studio: fig.querySelector('#svh-studio'), space: fig.querySelector('#svh-space') };
      draw(t0 === null ? (reduce ? 1e9 : 0) : performance.now() - t0);
    }
    // timeline, left to right: people and Studio's commissions, into Studio, across to Space, out to Space's commissions and companies
    var T = { hdS: 0, itemS: 200, brS: 650, discS: 1100, link: 1400, discP: 1650, brP: 1950, itemP: 2350, hdP: 2600, live: 3200 };
    function draw(t) {
      var all = t >= 1e9;
      hd.studio.style.opacity = String(all ? 1 : clamp01((t - T.hdS) / 500)); hd.space.style.opacity = String(all ? 1 : clamp01((t - T.hdP) / 500));
      ['studio', 'space'].forEach(function (k) { var c = L[k].c, t1 = k === 'studio' ? T.discS : T.discP, sc = all ? 1 : Math.max(0, backOut(clamp01((t - t1) / 520))); disc[k].setAttribute('transform', 'translate(' + c[0] + ',' + c[1] + ') scale(' + sc.toFixed(3) + ')'); nm[k].style.opacity = String(all ? 1 : clamp01((t - t1 - 250) / 400)); });
      br.forEach(function (p, i) {
        var st = i < 4, j = i % 4;
        var mt = st ? T.itemS + j * 100 : T.itemP + j * 100, bt = st ? T.brS + j * 80 : T.brP + j * 80, k = all ? 1 : ease(clamp01((t - bt) / 500));
        // Studio's branches grow from the commission towards Studio; Space's from Space out to the commission
        p.style.strokeDashoffset = String(st ? k - 1 : 1 - k);
        mk[i].setAttribute('transform', 'scale(' + (all ? 1 : Math.max(0, backOut(clamp01((t - mt) / 420)))).toFixed(3) + ')');
        lb[i].style.opacity = String(all ? 1 : clamp01((t - mt - 100) / 400));
        var live = !all && t > T.live, q = live ? ((t - T.live - j * 380 - (st ? 0 : 1500)) % 3000 + 3000) % 3000 / 1100 : 2;
        if (q < 1) { var L1 = p.getTotalLength(), pt = p.getPointAtLength(L1 * (st ? 1 - ease(q) : ease(q))); pz[i].setAttribute('cx', pt.x.toFixed(1)); pz[i].setAttribute('cy', pt.y.toFixed(1)); pz[i].style.opacity = String(Math.sin(Math.PI * q).toFixed(2)); }
        else pz[i].style.opacity = '0';
      });
      link.style.opacity = String(all ? 1 : clamp01((t - T.link) / 300));
      var x1 = +link.getAttribute('x1'), y1 = +link.getAttribute('y1'), x2 = +link.getAttribute('x2'), y2 = +link.getAttribute('y2');
      if (all || t < T.live) { dot.style.opacity = '0'; return; }
      var q = ((t - T.live + 1100) % 3000) / 1100; if (q > 1) { dot.style.opacity = '0'; return; }
      var e = ease(q); dot.setAttribute('cx', (x1 + (x2 - x1) * e).toFixed(1)); dot.setAttribute('cy', (y1 + (y2 - y1) * e).toFixed(1)); dot.style.opacity = String(Math.sin(Math.PI * q).toFixed(2));
      dot.style.fill = e < .5 ? 'var(--studio-orange)' : 'var(--space-blue)';
    }
    build();
    if (window.ResizeObserver) new ResizeObserver(build).observe(fig);
    if (reduce) return;
    (function loop(now) { var r = fig.getBoundingClientRect(); if (r.width && r.left < window.innerWidth && r.right > 0 && r.bottom > 0 && r.top < window.innerHeight) { if (t0 === null) t0 = now; draw(now - t0); } requestAnimationFrame(loop); })(performance.now());
  })();

  /* ---------- What we do: a figure-eight loop, Studio on one side, Space on the other ---------- */
  (function () {
    var fig = document.getElementById('loop'); if (!fig) return;
    var size = '', dot, pathS, pathP, lay, t0 = null, visible = false, N = 240;
    function lem(t, ax, ay) { var d = 1 + Math.sin(t) * Math.sin(t); return [ax * Math.cos(t) / d, ay * Math.sin(t) * Math.cos(t) / d]; }
    function build() {
      var fw = fig.clientWidth, fh = fig.clientHeight || 1, nw = fw >= 640 && fw / fh > 1.55 ? 'wide' : 'narrow'; if (nw === size) return; size = nw;
      var v = nw === 'narrow';
      fig.classList.toggle('loop--c', v);
      lay = v ? { w: 360, h: 380, cx: 180, cy: 130, ax: 166, ay: 270 } : { w: 1100, h: 440, cx: 470, cy: 220, ax: 400, ay: 400 };
      var ptsS = [], ptsP = [];
      for (var i = 0; i <= N; i++) {
        var t = Math.PI / 2 + Math.PI * i / N, p = lem(t, lay.ax, lay.ay); ptsS.push([lay.cx + p[0], lay.cy + p[1]]);
        var t2 = -Math.PI / 2 + Math.PI * i / N, q = lem(t2, lay.ax, lay.ay); ptsP.push([lay.cx + q[0], lay.cy + q[1]]);
      }
      function d(P) { return 'M' + P.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join('L'); }
      var sC = [lay.cx - lay.ax * .56, lay.cy], pC = [lay.cx + lay.ax * .56, lay.cy], er = v ? 46 : 66, lh = v ? 19 : 27, ty = v ? 28 : 40;
      function block(c, title, verbs) { return '<text class="t" x="' + c[0] + '" y="' + (c[1] - ty) + '">' + title + '</text>' + verbs.map(function (w, i) { return '<text class="v" x="' + c[0] + '" y="' + (c[1] + 2 + i * lh - (v ? 4 : 0)) + '">' + w + '</text>'; }).join(''); }
      var ext = v ? [pC[0], lay.h - er - 6] : [lay.w - er - 4, lay.cy];
      var o1 = v ? [pC[0], lay.cy + lay.ay * .3536 + 10] : [lay.cx + lay.ax + 10, lay.cy], o2 = v ? [ext[0], ext[1] - er - 8] : [ext[0] - er - 8, ext[1]];
      fig.innerHTML = '<svg viewBox="0 0 ' + lay.w + ' ' + lay.h + '">' +
        '<path class="lobe lobe-s" pathLength="1" d="' + d(ptsS) + '"/><path class="lobe lobe-p" pathLength="1" d="' + d(ptsP) + '"/>' +
        '<line class="out" x1="' + o1[0] + '" y1="' + o1[1] + '" x2="' + o2[0] + '" y2="' + o2[1] + '"/>' +
        '<g class="ext"><circle cx="' + ext[0] + '" cy="' + ext[1] + '" r="' + er + '"/><text class="o" x="' + ext[0] + '" y="' + (ext[1] - (v ? 8 : 11)) + '">Otros estudios</text><text class="o" x="' + ext[0] + '" y="' + (ext[1] + (v ? 9 : 12)) + '">y empresas</text></g>' +
        block(sC, 'Studio', ['Proyectamos', 'Tramitamos', 'Dirigimos']) + block(pC, 'Space', ['Analizamos', 'Automatizamos', 'Formamos']) +
        '<circle class="dot" r="6" id="loop-dot"/></svg>';
      dot = fig.querySelector('#loop-dot'); pathS = ptsS; pathP = ptsP;
      draw(t0 === null ? (reduce ? 1e9 : 0) : performance.now() - t0);
    }
    function draw(t) {
      var lobes = fig.querySelectorAll('.lobe'), e1 = t >= 1e9 ? 1 : ease(clamp01(t / 900)), e2 = t >= 1e9 ? 1 : ease(clamp01((t - 500) / 900));
      lobes[0].style.strokeDasharray = '1 1'; lobes[0].style.strokeDashoffset = String(1 - e1);
      lobes[1].style.strokeDasharray = '1 1'; lobes[1].style.strokeDashoffset = String(1 - e2);
      var out = fig.querySelector('.out'), ex = fig.querySelector('.ext'), k = t >= 1e9 ? 1 : clamp01((t - 1300) / 500);
      out.style.opacity = String(k); ex.style.opacity = String(k);
      if (t >= 1e9 || t < 1400) { dot.style.opacity = '0'; return; }
      // one pulse runs the whole figure-eight: Studio lobe, crossing, Space lobe, crossing
      var per = 5200, q = ((t - 1400) % per) / per, all = q < .5 ? pathS : pathP, f = (q < .5 ? q : q - .5) * 2, idx = Math.min(all.length - 1, Math.floor(f * (all.length - 1)));
      dot.setAttribute('cx', all[idx][0].toFixed(1)); dot.setAttribute('cy', all[idx][1].toFixed(1)); dot.style.opacity = '1';
      dot.setAttribute('class', 'dot'); dot.style.fill = q < .5 ? 'var(--studio-orange)' : 'var(--space-blue)';
    }
    build();
    if (window.ResizeObserver) new ResizeObserver(build).observe(fig);
    if (reduce) return;
    if (window.IntersectionObserver) new IntersectionObserver(function (es) { var r = fig.getBoundingClientRect(); visible = es[0].isIntersecting && r.left < window.innerWidth && r.right > 0; if (visible && t0 === null) t0 = performance.now(); }, { threshold: .3 }).observe(fig);
    (function loop(now) { var r = fig.getBoundingClientRect(); if (r.left < window.innerWidth && r.right > 0 && r.bottom > 0 && r.top < window.innerHeight) { if (t0 === null) t0 = now; draw(now - t0); } requestAnimationFrame(loop); })(performance.now());
  })();

  document.getElementById('tabs-logo').innerHTML = document.querySelector('.foot .logo').innerHTML;
  /* ---------- Sliders (ALAS panels, Space tools): tabs, arrows, swipe ---------- */
  function slider(root, full) {
    var track = root.querySelector('.track'), tabs = [].slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    var prev = root.querySelector('.tab-prev, #tab-prev'), next = root.querySelector('.tab-next, #tab-next'), cur = 0, queued = false;
    if (panels.length < 2) root.classList.add('is-single');
    panels.forEach(function (p) { p.hidden = false; });
    function fit() { if (!full) track.style.height = panels[cur].offsetHeight + 'px'; }
    function mark(i) {
      cur = i;
      tabs.forEach(function (t, j) { t.setAttribute('aria-selected', String(j === i)); t.tabIndex = j === i ? 0 : -1; });
      panels.forEach(function (p, j) { p.classList.toggle('is-visible', Math.abs(j - i) <= 1); p.setAttribute('aria-hidden', String(j !== i)); p.inert = j !== i; p.tabIndex = j === i ? 0 : -1; });
      panels[i].classList.add('seen');
      var bar = tabs[i].parentNode; bar.scrollTo({ left: Math.max(0, tabs[i].offsetLeft - bar.offsetLeft - 8), behavior: reduce ? 'auto' : 'smooth' });
      prev.disabled = i === 0; next.disabled = i === panels.length - 1;
      fit();
    }
    function go(i, focus) {
      i = Math.max(0, Math.min(panels.length - 1, i));
      track.scrollTo({ left: i * track.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
      mark(i); if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { go(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1, true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1, true); }
      });
    });
    prev.addEventListener('click', function () { go(cur - 1); });
    next.addEventListener('click', function () { go(cur + 1); });
    track.addEventListener('scroll', function () {
      if (queued) return; queued = true;
      requestAnimationFrame(function () { queued = false; var i = Math.round(track.scrollLeft / track.clientWidth); if (i !== cur) mark(i); });
      panels.forEach(function (p) { p.classList.add('is-visible'); });
    }, { passive: true });
    window.addEventListener('resize', function () { track.scrollLeft = cur * track.clientWidth; fit(); });
    if (window.ResizeObserver) { var ro = new ResizeObserver(fit); panels.forEach(function (p) { ro.observe(p); }); }
    mark(0);
  }
  slider(document.getElementById('alas'), true);
  document.querySelectorAll('.cases').forEach(function (c) { slider(c, false); });

  // a call to action opens the form with its branch already chosen
  document.querySelectorAll('.cta[data-rama]').forEach(function (a) { a.addEventListener('click', function () { var r = document.getElementById('r-' + a.getAttribute('data-rama')); if (r) r.checked = true; }); });

  /* ---------- Form ---------- */
  document.getElementById('form').addEventListener('submit', function (e) {
    e.preventDefault();
    var mail = document.getElementById('f-mail').value.trim(), note = document.getElementById('form-note');
    if (!mail || mail.indexOf('@') < 1) { note.textContent = 'Escribe un correo válido para poder responderte.'; document.getElementById('f-mail').focus(); return; }
    // the record as it will be created in the Notion CRM ("Clientes"): a new lead coming from the web
    var f = e.target, rama = { studio: 'Studio', space: 'Space', both: 'Ambas' }[f.rama.value];
    var lead = { Nombre: f.name.value.trim() || mail, Email: mail, 'Teléfono': f.tel.value.trim(), Tipo: f.tipo.value, Rama: rama, 'Fuente del lead': 'Web', 'Estado pipeline': 'Lead', Notas: f.msg.value.trim(), idioma: document.documentElement.lang, web: f.web ? f.web.value : '' };
    {
      note.textContent = 'Enviando…';
      fetch('/api/contacto', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); note.textContent = 'Gracias. Te respondemos en dos días laborables.'; f.reset(); })
        .catch(function () { note.textContent = 'No se ha podido enviar. Escríbenos directamente por correo.'; });
    }
  });
})();
