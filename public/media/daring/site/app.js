// Royal Daring - sponsors landing
// Curtain entrance + counter animation + scroll reveal

(function () {
  // ========= 1. Curtain entrance =========
  const curtain = document.getElementById("curtain");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobileViewport = window.matchMedia("(max-width: 720px)").matches;

  // ========= 2. Hero - split words & animate history counter =========
  const heroH1 = document.querySelector(".hero__h1");
  let wordIdx = 0;
  if (heroH1) {
    heroH1.querySelectorAll(".line:not(.line--num)").forEach(line => {
      const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT);
      const tns = [];
      let n;
      while ((n = walker.nextNode())) tns.push(n);
      tns.forEach(tn => {
        const parts = tn.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach(p => {
          if (!p) return;
          if (/^\s+$/.test(p)) {
            frag.appendChild(document.createTextNode(p));
          } else {
            const s = document.createElement("span");
            s.className = "word";
            s.style.setProperty("--w", wordIdx++);
            s.textContent = p;
            // si le text node était dans un <em>, on garde le contexte parent
            frag.appendChild(s);
          }
        });
        tn.parentNode.replaceChild(frag, tn);
      });
    });
    heroH1.classList.add("is-split");
  }

  const animateHeroNumber = () => {
    const bigNum = document.querySelector(".big-num");
    if (!bigNum) return;
    const target = parseInt(bigNum.dataset.target || bigNum.textContent || "100", 10);
    const duration = mobileViewport ? 650 : 1100;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      bigNum.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(tick);
      else bigNum.textContent = String(target);
    };
    requestAnimationFrame(tick);
  };

  const triggerReveal = () => {
    document.body.classList.add("is-revealed");
    if (!reduceMotion) {
      // Démarre le compteur au moment où la ligne chiffrée arrive.
      const bigNum = document.querySelector(".big-num");
      if (bigNum) bigNum.textContent = "0";
      setTimeout(animateHeroNumber, mobileViewport ? 120 : 330);
    }
  };

  if (curtain && !reduceMotion && !mobileViewport) {
    // Laisse jouer l'animation du crest + filet (~1.3s) avant d'ouvrir
    setTimeout(() => {
      curtain.classList.add("is-out");
      triggerReveal();
    }, 1350);
    // Retire l'élément après la sortie pour libérer le DOM
    setTimeout(() => { curtain.remove(); }, 2900);
  } else {
    if (curtain) curtain.remove();
    triggerReveal();
  }

  const counters = document.querySelectorAll("[data-count]");
  const reveals  = document.querySelectorAll(".sponsor-proof, .kpi, .pillar, .aud-card, .mockup-card, .pack, .contact-card, .biz__card, .biz__events li, .social__kpis > div");
  reveals.forEach(el => el.setAttribute("data-reveal", ""));

  const formatNumber = (n, decimals) => {
    if (decimals > 0) return n.toFixed(decimals).replace(".", ",");
    return Math.round(n).toLocaleString("fr-BE");
  };

  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1500;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const value = target * eased;
      el.textContent = formatNumber(value, decimals) + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = formatNumber(target, decimals) + suffix;
    };
    requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animateCount);
    reveals.forEach(el => el.classList.add("is-in"));
    return;
  }

  const counterObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObs.observe(c));

  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(el => revealObs.observe(el));

  // ========= Print : forcer valeurs finales + visibilité =========
  window.addEventListener("beforeprint", () => {
    document.body.classList.add("is-revealed");
    counters.forEach(el => {
      const target = parseFloat(el.dataset.count);
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const suffix = el.dataset.suffix || "";
      el.textContent = formatNumber(target, decimals) + suffix;
    });
    const bigNum = document.querySelector(".big-num");
    if (bigNum) bigNum.textContent = bigNum.dataset.target || "100";
    reveals.forEach(el => el.classList.add("is-in"));
  });

  // ========= Burger menu mobile =========
  const burger = document.getElementById("nav-burger");
  const mobileMenu = document.getElementById("mobile-menu");
  if (burger && mobileMenu) {
    const toggleMenu = (open) => {
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open);
      mobileMenu.classList.toggle("is-open", open);
      mobileMenu.setAttribute("aria-hidden", !open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", () => {
      toggleMenu(!burger.classList.contains("is-open"));
    });
    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => toggleMenu(false));
    });
  }

  // ========= Résumé packs mobile =========
  const packTabs = document.querySelectorAll("[data-pack-target]");
  const packs = document.querySelectorAll("[data-pack]");
  if (packTabs.length && packs.length) {
    const packsGrid = document.querySelector(".packs");
    if (packsGrid) packsGrid.classList.add("is-filtered");
    const setActivePack = (target) => {
      packTabs.forEach(tab => {
        const active = tab.dataset.packTarget === target;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-pressed", active);
      });
      packs.forEach(pack => {
        pack.classList.toggle("is-active", pack.dataset.pack === target);
      });
    };
    setActivePack("bronze");
    packTabs.forEach(tab => {
      tab.addEventListener("click", () => setActivePack(tab.dataset.packTarget));
    });
  }
})();
