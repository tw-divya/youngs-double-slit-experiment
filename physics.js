/* physics.js - all YDSE equations, SI units internally */
const Physics = {
  toSI(nm, mm, m) { return { lambda: nm * 1e-9, d: mm * 1e-3, D: m }; },
  fringeWidth: (l, d, D) => l * D / d,            // beta = lambda D / d
  bright: (m, l, d, D) => m * l * D / d,          // y_m = m lambda D / d
  dark: (m, l, d, D) => (m + 0.5) * l * D / d,    // y = (m+1/2) lambda D / d
  pathDiff: (d, y, D) => d * y / D,               // small-angle: delta = d y / D
  intensity: (y, l, d, D) => Math.cos(Math.PI * d * y / (l * D)) ** 2, // I/Imax
  wavelengthToRGB(w) {
    let r = 0, g = 0, b = 0;
    if (w < 440) { r = (440 - w) / 60; b = 1; }
    else if (w < 490) { g = (w - 440) / 50; b = 1; }
    else if (w < 510) { g = 1; b = (510 - w) / 20; }
    else if (w < 580) { r = (w - 510) / 70; g = 1; }
    else if (w < 645) { r = 1; g = (645 - w) / 65; }
    else { r = 1; }
    let f = w < 420 ? 0.3 + 0.7 * (w - 400) / 20 : w > 700 ? 0.3 : w > 645 ? 0.3 + 0.7 * (700 - w) / 55 : 1;
    return [r, g, b].map(c => Math.round(255 * Math.pow(c * f, 0.8)));
  }
};
if (typeof module !== 'undefined') module.exports = Physics;
