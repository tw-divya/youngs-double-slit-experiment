/* simulation.js - controls, canvases, math panel, graph, comparison */
(function () {
  const $ = id => document.getElementById(id), P = Physics;
  const DEF = { l: 550, d: 0.30, D: 1.5 }, RANGE_MM = 10;     // screen window: +/-10 mm
  const st = { ...DEF }, saved = []; let running = true, t = 0;
  const setup = $('setup'), scr = $('screen'), gr = $('graph');
  const fmt = (x, n = 3) => Number(x).toPrecision(n);

  function sync() {
    st.l = +$('l').value; st.d = +$('d').value; st.D = +$('D').value;
    $('lv').textContent = st.l + ' nm'; $('dv').textContent = st.d.toFixed(2) + ' mm'; $('Dv').textContent = st.D.toFixed(1) + ' m';
    $('sw').style.background = `rgb(${P.wavelengthToRGB(st.l)})`;
    render();
  }
  function rgb() { return P.wavelengthToRGB(st.l); }
  function drawScreen() {
    const ctx = Waves.fit(scr), W = scr.width, H = scr.height, c = rgb(), s = P.toSI(st.l, st.d, st.D);
    const img = ctx.createImageData(W, 1);
    for (let x = 0; x < W; x++) { const y = (x / W - 0.5) * 2 * RANGE_MM * 1e-3, I = P.intensity(y, s.lambda, s.d, s.D);
      img.data.set([c[0] * I, c[1] * I, c[2] * I, 255], x * 4); }
    for (let y = 0; y < H; y++) ctx.putImageData(img, 0, y);
    ctx.fillStyle = '#fff'; ctx.font = `${12 * (window.devicePixelRatio || 1)}px sans-serif`;
    ctx.fillText('−10 mm', 6, H - 6); ctx.fillText('+10 mm', W - 60, H - 6);
  }
  function drawGraph() {
    const ctx = Waves.fit(gr), W = gr.width, H = gr.height, p = window.devicePixelRatio || 1, m = 46 * p;
    const X = y => m + (y + RANGE_MM) / (2 * RANGE_MM) * (W - m - 12 * p), Y = I => H - m * 0.8 - I * (H - m * 1.4);
    ctx.fillStyle = '#0a1230'; ctx.fillRect(0, 0, W, H); ctx.font = `${11 * p}px sans-serif`; ctx.lineWidth = p;
    for (let v = -10; v <= 10; v += 2) { ctx.strokeStyle = '#1e2c55'; ctx.beginPath(); ctx.moveTo(X(v), Y(0)); ctx.lineTo(X(v), Y(1)); ctx.stroke();
      ctx.fillStyle = '#9fb3e8'; ctx.fillText(v, X(v) - 6 * p, Y(0) + 14 * p); }
    for (let v = 0; v <= 1; v += 0.25) { ctx.strokeStyle = '#1e2c55'; ctx.beginPath(); ctx.moveTo(X(-10), Y(v)); ctx.lineTo(X(10), Y(v)); ctx.stroke();
      ctx.fillStyle = '#9fb3e8'; ctx.fillText(v.toFixed(2), 6 * p, Y(v) + 4 * p); }
    ctx.fillText('Position on screen y (mm)', W / 2 - 60 * p, H - 4 * p);
    ctx.save(); ctx.translate(12 * p, H / 2 + 50 * p); ctx.rotate(-Math.PI / 2); ctx.fillText('Relative intensity I/Imax', 0, 0); ctx.restore();
    ctx.fillStyle = 'rgba(0,229,255,.12)'; const b0 = P.fringeWidth(st.l * 1e-9, st.d * 1e-3, st.D) * 500;
    ctx.fillRect(X(-b0), Y(1), X(b0) - X(-b0), Y(0) - Y(1));
    const curve = (cfg, color, w) => { const s = P.toSI(cfg.l, cfg.d, cfg.D); ctx.strokeStyle = color; ctx.lineWidth = w * p; ctx.beginPath();
      for (let x = 0; x <= 600; x++) { const y = -RANGE_MM + x / 600 * 2 * RANGE_MM, I = P.intensity(y * 1e-3, s.lambda, s.d, s.D);
        x ? ctx.lineTo(X(y), Y(I)) : ctx.moveTo(X(y), Y(I)); } ctx.stroke(); };
    const pal = ['#ff9f43', '#a78bfa', '#34d399', '#f472b6'];
    saved.forEach((c, i) => curve(c, pal[i % 4], 1.5)); curve(st, '#00e5ff', 2.5);
    $('legend').innerHTML = `<span style="color:#00e5ff">■ Live</span> ` + saved.map((c, i) =>
      `<span style="color:${pal[i % 4]}">■ #${i + 1}: λ=${c.l}nm d=${c.d}mm D=${c.D}m</span>`).join(' ');
  }
  function drawMath() {
    const s = P.toSI(st.l, st.d, st.D), b = P.fringeWidth(s.lambda, s.d, s.D), y1 = P.bright(1, s.lambda, s.d, s.D),
      y2 = P.bright(2, s.lambda, s.d, s.D), yd = P.dark(0, s.lambda, s.d, s.D), dl = P.pathDiff(s.d, y1, s.D);
    $('math').innerHTML = `
    <p><b>Unit conversion:</b> λ = ${st.l} nm = ${fmt(s.lambda)} m; d = ${st.d} mm = ${fmt(s.d)} m; D = ${st.D} m</p>
    <p><b>1. Fringe width</b> β = λD/d = (${fmt(s.lambda)} × ${st.D}) / ${fmt(s.d)} = <b>${fmt(b)} m = ${fmt(b * 1e3)} mm</b></p>
    <p><b>2. Bright fringes</b> yₘ = mβ → y₁ = ${fmt(y1 * 1e3)} mm, y₂ = ${fmt(y2 * 1e3)} mm</p>
    <p><b>3. Dark fringes</b> y = (m+½)β → y₀ = ${fmt(yd * 1e3)} mm, y₁ = ${fmt(P.dark(1, s.lambda, s.d, s.D) * 1e3)} mm</p>
    <p><b>4. Path difference</b> Δ ≈ d·y/D at y₁ = (${fmt(s.d)} × ${fmt(y1)}) / ${st.D} = <b>${fmt(dl)} m</b> = ${fmt(dl / s.lambda)} λ (should be 1 λ ✔)</p>
    <p><b>5. Intensity</b> I/Imax = cos²(πdy/λD); at y = β/4: <b>${fmt(P.intensity(b / 4, s.lambda, s.d, s.D))}</b></p>
    <p class="note">Variables: λ wavelength, d slit separation, D screen distance, y position from centre, m order (0, ±1, ±2…). Model: ideal coherent slits of equal intensity, far-field, small-angle; the single-slit diffraction envelope is not included.</p>`;
    $('stats').innerHTML = `β = <b>${fmt(b * 1e3)} mm</b> · y₁ = <b>${fmt(y1 * 1e3)} mm</b> · fringes in ±10 mm window ≈ <b>${Math.floor(20e-3 / b)}</b>`;
  }
  function render() { drawScreen(); drawGraph(); drawMath(); }
  function loop() { if (running) t += 0.03; Waves.draw(setup, t, rgb(), st.d / 0.1, true); requestAnimationFrame(loop); }
  function resize() { const r = setup.getBoundingClientRect(), p = window.devicePixelRatio || 1; setup.width = r.width * p; setup.height = r.height * p; render(); }

  ['l', 'd', 'D'].forEach(k => $(k).addEventListener('input', sync));
  const setVals = v => { $('l').value = v.l; $('d').value = v.d; $('D').value = v.D; sync(); };
  $('start').onclick = () => { running = true; }; $('pause').onclick = () => { running = false; };
  $('reset').onclick = () => { t = 0; running = true; setVals(DEF); }; $('defaults').onclick = () => setVals(DEF);
  $('random').onclick = () => setVals({ l: Math.round(400 + Math.random() * 300), d: +(0.1 + Math.random() * 0.7).toFixed(2), D: +(0.5 + Math.random() * 2.5).toFixed(1) });
  $('save').onclick = () => { if (saved.length >= 4) saved.shift(); saved.push({ ...st }); drawGraph(); };
  $('clear').onclick = () => { saved.length = 0; drawGraph(); };
  window.addEventListener('resize', resize); resize(); sync(); loop();
})();
