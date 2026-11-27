(() => {
  const field = document.querySelector("[data-aurora-bars]");
  if (!field) return;

  const track = document.createElement("div");
  track.className = "hero-aurora-bars";
  track.setAttribute("aria-hidden", "true");
  const count = 34;
  const bars = Array.from({ length: count }, () => {
    const bar = document.createElement("span");
    bar.className = "hero-aurora-bar";
    track.append(bar);
    return bar;
  });
  field.append(track);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let visible = true;
  let frame = 0;

  function paint(time = 0) {
    bars.forEach((bar, index) => {
      const x = index / Math.max(1, count - 1);
      const envelope = 0.22 + 0.78 * Math.sin(Math.PI * x);
      const broad = Math.sin(time * 0.00026 + x * 5.1);
      const detail = Math.sin(time * 0.00017 - x * 9.4);
      const small = Math.cos(time * 0.00043 + x * 15.7);
      const wave = 0.52 + broad * 0.24 + detail * 0.15 + small * 0.06;
      const height = Math.max(0.12, Math.min(0.94, 0.13 + envelope * wave * 0.88));
      bar.style.height = `${height * 100}%`;
      bar.style.opacity = `${0.5 + envelope * 0.5}`;
    });
  }

  function stop() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  }

  function animate(time) {
    paint(time);
    if (visible && !document.hidden && !reducedMotion.matches) {
      frame = requestAnimationFrame(animate);
    } else {
      frame = 0;
    }
  }

  function update() {
    stop();
    if (visible && !document.hidden && !reducedMotion.matches) {
      frame = requestAnimationFrame(animate);
    } else {
      paint(0);
    }
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }, { threshold: 0.01 });
    observer.observe(field);
  }
  document.addEventListener("visibilitychange", update);
  reducedMotion.addEventListener?.("change", update);
  update();
})();
