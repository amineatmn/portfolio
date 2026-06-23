/* Portfolio — Drone Tech interactions */
(function () {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Navbar scroll state + mobile toggle ---- */
  const nav = document.querySelector(".nav");
  const prog = document.querySelector(".scroll-prog");
  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", y > 30);
    if (prog) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  /* ---- Reveal on scroll ---- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* ---- Animated counters ---- */
  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || "";
          const dec = (el.dataset.count.split(".")[1] || "").length;
          if (reduceMotion) { el.textContent = target.toFixed(dec) + suffix; co.unobserve(el); return; }
          const dur = 1300; const t0 = performance.now();
          function step(t) {
            const p = Math.min((t - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = (target * eased).toFixed(dec) + suffix;
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
          co.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => co.observe(el));
  }

  /* ---- Typewriter (hero role) ---- */
  const tw = document.querySelector("[data-typewriter]");
  if (tw) {
    let phrases;
    try { phrases = JSON.parse(tw.dataset.typewriter); } catch (e) { phrases = []; }
    const cursor = document.createElement("span");
    cursor.className = "cursor"; cursor.textContent = "_";
    if (reduceMotion || !phrases.length) {
      tw.textContent = phrases[0] || tw.textContent;
      tw.appendChild(cursor);
    } else {
      let pi = 0, ci = 0, deleting = false;
      const out = document.createElement("span");
      tw.textContent = ""; tw.appendChild(out); tw.appendChild(cursor);
      function tick() {
        const word = phrases[pi];
        out.textContent = word.slice(0, ci);
        if (!deleting) {
          if (ci < word.length) { ci++; setTimeout(tick, 55); }
          else { deleting = true; setTimeout(tick, 1600); }
        } else {
          if (ci > 0) { ci--; setTimeout(tick, 28); }
          else { deleting = false; pi = (pi + 1) % phrases.length; setTimeout(tick, 280); }
        }
      }
      tick();
    }
  }

  /* ---- Random PCB trace "live" pulses ---- */
  if (!reduceMotion) {
    const traces = document.querySelectorAll(".pcb-trace");
    const pads = document.querySelectorAll(".pcb-pad");
    function flicker() {
      traces.forEach((t) => { if (Math.random() > 0.55) t.classList.add("live"); else t.classList.remove("live"); });
      pads.forEach((p) => { if (Math.random() > 0.5) p.classList.add("pulse"); else p.classList.remove("pulse"); });
    }
    flicker();
    setInterval(flicker, 2600);
  }

  /* ---- Lightbox for galleries ---- */
  const lb = document.querySelector(".lightbox");
  if (lb) {
    const lbImg = lb.querySelector("img");
    document.querySelectorAll("[data-lightbox]").forEach((img) => {
      img.addEventListener("click", () => {
        lbImg.src = img.dataset.full || img.src;
        lb.classList.add("open");
      });
    });
    function close() { lb.classList.remove("open"); }
    lb.addEventListener("click", (e) => { if (e.target !== lbImg) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }
})();
