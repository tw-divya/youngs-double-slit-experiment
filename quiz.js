/* quiz.js - 10 MCQs with feedback and score */
(function () {
  const Q = [
    ['Young\'s experiment demonstrates which property of light?', ['Particle nature', 'Wave nature', 'Polarization only', 'Photoelectric effect'], 1, 'Interference fringes can only be explained by waves superposing.'],
    ['Fringe width formula is:', ['β = λd/D', 'β = λD/d', 'β = dD/λ', 'β = λ/(dD)'], 1, 'β = λD/d.'],
    ['Condition for constructive interference:', ['Δ = (m+½)λ', 'Δ = mλ', 'Δ = λ/4', 'Δ = 0 only'], 1, 'Path difference is an integer multiple of λ.'],
    ['Condition for destructive interference:', ['Δ = mλ', 'Δ = (m+½)λ', 'Δ = 2mλ', 'Δ = λ²'], 1, 'Δ = (m+½)λ gives a phase difference of an odd multiple of π.'],
    ['If slit separation d is doubled, fringe width becomes:', ['Double', 'Half', 'Same', 'Four times'], 1, 'β ∝ 1/d.'],
    ['Increasing screen distance D makes fringes:', ['Narrower', 'Wider', 'Unchanged', 'Disappear'], 1, 'β ∝ D.'],
    ['Which colour gives the widest fringes (same d, D)?', ['Violet', 'Green', 'Red', 'Blue'], 2, 'Red has the longest λ; β ∝ λ.'],
    ['Sources must be coherent, meaning they have:', ['Equal colour only', 'Constant phase difference', 'Different frequencies', 'Random phase'], 1, 'A constant phase relation gives a stable pattern.'],
    ['Path difference for small angles is approximately:', ['Δ ≈ dy/D', 'Δ ≈ Dy/d', 'Δ ≈ λy/D', 'Δ ≈ d/y'], 0, 'Δ = d sinθ ≈ d tanθ = dy/D.'],
    ['Intensity at the central point (y = 0) is:', ['Zero', 'Half of maximum', 'Maximum', 'Undefined'], 2, 'Δ = 0, so waves are in phase: I = Imax.']];
  let i = 0, score = 0, locked = false; const $ = id => document.getElementById(id);
  function show() {
    locked = false; const q = Q[i]; $('prog').textContent = `Question ${i + 1} of ${Q.length} · Score ${score}`;
    $('q').textContent = q[0]; $('fb').textContent = ''; $('next').style.display = 'none';
    $('opts').innerHTML = q[1].map((o, k) => `<button class="opt" data-k="${k}">${o}</button>`).join('');
    document.querySelectorAll('.opt').forEach(b => b.onclick = () => pick(+b.dataset.k));
  }
  function pick(k) {
    if (locked) return; locked = true; const q = Q[i], ok = k === q[2]; if (ok) score++;
    document.querySelectorAll('.opt').forEach((b, j) => { if (j === q[2]) b.classList.add('good'); else if (j === k) b.classList.add('bad'); });
    $('fb').textContent = (ok ? '✔ Correct. ' : '✘ Incorrect. ') + q[3]; $('next').style.display = 'inline-block';
    $('next').textContent = i === Q.length - 1 ? 'See result' : 'Next';
  }
  $('next').onclick = () => { i++; if (i < Q.length) show(); else { $('box').style.display = 'none'; $('result').style.display = 'block';
    $('score').textContent = `${score} / ${Q.length} (${Math.round(score / Q.length * 100)}%)`; } };
  $('restart').onclick = () => { i = 0; score = 0; $('box').style.display = 'block'; $('result').style.display = 'none'; show(); };
  show();
})();
