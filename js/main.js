/* main.js - shared navigation + wave animation helper */
(function () {
  const root = document.body.dataset.root || '';
  const links = [['index.html', 'Home'], ['pages/simulation.html', 'Simulation'], ['pages/theory.html', 'Theory'],
    ['pages/experiment.html', 'Experiment'], ['pages/quiz.html', 'Quiz'], ['pages/about.html', 'About']];
  const here = location.pathname.split('/').pop() || 'index.html';
  const nav = document.getElementById('nav');
  if (nav) {
    nav.innerHTML = `<div class="bar"><a class="brand" href="${root}index.html">◐ YDSE <span>Virtual Lab</span></a>
      <button id="burger" aria-label="Menu">☰</button><nav id="menu">${links.map(l =>
      `<a href="${root}${l[0]}" class="${l[0].endsWith(here) ? 'active' : ''}">${l[1]}</a>`).join('')}</nav></div>`;
    document.getElementById('burger').onclick = () => document.getElementById('menu').classList.toggle('open');
  }
  const f = document.getElementById('footer');
  if (f) f.innerHTML = 'Engineering Physics · Physical Optics · Young\'s Double-Slit Experiment · B.Tech ECE PBL';
})();

/* Draw laser, plate, slits, circular wavefronts and screen into a canvas */
const Waves = {
  fit(c) { const r = c.getBoundingClientRect(), p = window.devicePixelRatio || 1;
    c.width = r.width * p; c.height = r.height * p; return c.getContext('2d'); },
  draw(c, t, rgb, sep, labels) {
    const ctx = c.getContext('2d'), W = c.width, H = c.height, s = W / 900;
    ctx.clearRect(0, 0, W, H);
    const col = `rgb(${rgb})`, px = W * 0.32, sx = W * 0.9, cy = H / 2, gap = Math.max(12, sep * 60) * s;
    const s1 = cy - gap / 2, s2 = cy + gap / 2;
    ctx.save(); ctx.beginPath(); ctx.rect(px, 0, sx - px, H); ctx.clip();
    for (const sy of [s1, s2]) for (let r = ((t * 40) % 24); r < sx - px; r += 24) {
      ctx.strokeStyle = `rgba(${rgb},${0.5 * (1 - r / (sx - px))})`; ctx.lineWidth = 1.5 * s;
      ctx.beginPath(); ctx.arc(px, sy, r * s, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    }
    ctx.restore();
    ctx.shadowColor = col; ctx.shadowBlur = 12 * s; ctx.fillStyle = col;
    ctx.fillRect(W * 0.1, cy - 2 * s, px - W * 0.1, 4 * s); ctx.shadowBlur = 0;
    ctx.fillStyle = '#5b6b9a'; ctx.fillRect(W * 0.1 - 40 * s, cy - 12 * s, 40 * s, 24 * s);
    ctx.fillStyle = '#9fb3e8';
    [[0, s1 - 5 * s], [s1 + 5 * s, s2 - 5 * s], [s2 + 5 * s, H]].forEach(a => ctx.fillRect(px - 4 * s, a[0], 8 * s, a[1] - a[0]));
    ctx.fillStyle = '#0a1230'; ctx.fillRect(sx, 0, 10 * s, H);
    for (let y = 0; y < H; y += 2) { const I = Math.cos(Math.PI * (y - cy) / (60 * s * (1 / Math.max(.3, sep)))) ** 2;
      ctx.fillStyle = `rgba(${rgb},${I})`; ctx.fillRect(sx, y, 10 * s, 2); }
    if (labels) { ctx.fillStyle = '#cfe3ff'; ctx.font = `${13 * s}px sans-serif`;
      ctx.fillText('Laser (λ)', W * 0.04, cy - 24 * s); ctx.fillText('Double slit', px - 30 * s, 18 * s);
      ctx.fillText('S1', px + 10 * s, s1 + 4 * s); ctx.fillText('S2', px + 10 * s, s2 + 4 * s);
      ctx.fillText('Screen', sx - 20 * s, 18 * s); ctx.fillText('Coherent wavefronts', W * 0.5, H - 12 * s); }
  }
};
