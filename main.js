(() => {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Typed role line ----------
  const typedEl = document.getElementById('typed');
  const roles = ['computer science @ UCF', 'full-stack developer', 'robotics + AI enthusiast', 'building things from scratch'];
  let ri = 0, ci = 0, del = false, hold = 0;
  if (reduce) {
    typedEl.textContent = roles[0];
  } else {
    setInterval(() => {
      const w = roles[ri];
      if (!del) {
        if (ci < w.length) ci++;
        else if (++hold > 22) { del = true; hold = 0; }
      } else {
        ci -= 2;
        if (ci <= 0) { ci = 0; del = false; ri = (ri + 1) % roles.length; }
      }
      typedEl.textContent = w.slice(0, ci);
    }, 70);
  }

  // ---------- Eastern time clock ----------
  const clocks = document.querySelectorAll('[data-clock]');
  const fmt = () => {
    try { return new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour12: false }); }
    catch (e) { return new Date().toTimeString().slice(0, 8); }
  };
  const tickClock = () => { const t = fmt(); clocks.forEach((el) => { el.textContent = t; }); };
  tickClock();
  setInterval(tickClock, 1000);

  // ---------- Code rain (speeds up while scrolling) ----------
  const c = document.getElementById('rain');
  const wrap = document.getElementById('rain-wrap');
  if (reduce || !c || !wrap) return;

  const RAIN_COLOR = '#2F8BFF';
  const RAIN_SPEED = 1;
  const ctx = c.getContext('2d');
  const fs = 16;
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01{}[]<>/=;:+*#$&ABCDEF0123456789'.split('');
  let drops = [];
  let boost = 0;
  let lastY = null;

  window.addEventListener('scroll', () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    if (lastY !== null) boost = Math.min(8, boost + Math.abs(y - lastY) / 40);
    lastY = y;
  }, { passive: true });

  const resize = () => {
    c.width = wrap.clientWidth;
    c.height = wrap.clientHeight;
    const cols = Math.ceil(c.width / fs);
    const perCol = Math.max(1, Math.ceil(c.height / 1100));
    drops = [];
    for (let i = 0; i < cols; i++) {
      for (let k = 0; k < perCol; k++) {
        drops.push({ x: i * fs, y: Math.random() * c.height, s: 0.7 + Math.random() * 0.9 });
      }
    }
    ctx.fillStyle = '#05070B';
    ctx.fillRect(0, 0, c.width, c.height);
  };
  if (window.ResizeObserver) new ResizeObserver(resize).observe(wrap);
  else window.addEventListener('resize', resize);
  resize();

  let last = 0;
  const frame = (t) => {
    requestAnimationFrame(frame);
    if (t - last < 50) return;
    last = t;
    const speed = RAIN_SPEED * (1 + boost * 0.35);
    boost *= 0.9;
    ctx.fillStyle = 'rgba(5,7,11,0.09)';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.font = '500 ' + fs + 'px "JetBrains Mono", monospace';
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i];
      ctx.fillStyle = RAIN_COLOR;
      ctx.fillText(chars[(Math.random() * chars.length) | 0], d.x, d.y + fs);
      ctx.fillStyle = Math.random() > 0.9 ? '#F2FAFF' : '#A9D6FF';
      ctx.fillText(chars[(Math.random() * chars.length) | 0], d.x, d.y);
      d.y -= fs * d.s * speed * 0.6;
      if (d.y < -fs * 2 && Math.random() > 0.96) {
        d.y = c.height + Math.random() * 300;
        d.s = 0.7 + Math.random() * 0.9;
      }
    }
  };
  requestAnimationFrame(frame);
})();
