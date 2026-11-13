/* experiment.js - virtual worksheet */
(function () {
  const $ = id => document.getElementById(id), rows = [];
  const f = x => Number(x).toPrecision(4);
  function draw() {
    $('tbody').innerHTML = rows.map((r, i) => `<tr><td>${i + 1}</td><td>${r.l}</td><td>${r.d}</td><td>${r.D}</td><td>${f(r.beta * 1e3)}</td>
      <td>${r.meas === null ? '—' : r.meas}</td><td>${r.meas === null ? '—' : f(Math.abs(r.meas - r.beta * 1e3) / (r.beta * 1e3) * 100) + ' %'}</td>
      <td>${r.note || ''}</td><td><button data-i="${i}" class="btn small">✕</button></td></tr>`).join('') || '<tr><td colspan="9">No readings yet.</td></tr>';
    document.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { rows.splice(+b.dataset.i, 1); draw(); });
  }
  $('add').onclick = () => {
    const l = +$('l').value, d = +$('d').value, D = +$('D').value, m = $('meas').value;
    if (!(l >= 400 && l <= 700) || !(d >= 0.1 && d <= 0.8) || !(D >= 0.5 && D <= 3)) { $('err').textContent = 'Enter valid values: λ 400–700 nm, d 0.10–0.80 mm, D 0.5–3 m.'; return; }
    if (m !== '' && !(+m > 0)) { $('err').textContent = 'Measured fringe width must be a positive number.'; return; }
    $('err').textContent = '';
    const s = Physics.toSI(l, d, D);
    rows.push({ l, d, D, beta: Physics.fringeWidth(s.lambda, s.d, s.D), meas: m === '' ? null : +m, note: $('note').value }); draw();
  };
  $('clearAll').onclick = () => { rows.length = 0; draw(); }; draw();
})();
