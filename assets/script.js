/* =========================================================
   浜名湖うなぎ — interactions
   ========================================================= */

(function () {
  "use strict";

  const header = document.getElementById("header");
  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("navToggle");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopQuery = window.matchMedia("(min-width: 981px)");

  /* ---------- header state ---------- */
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- mobile navigation ---------- */
  const closeNav = (returnFocus) => {
    if (!nav || !navToggle) return;
    nav.classList.remove("is-open");
    header.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "メニューを開く");
    if (returnFocus) navToggle.focus();
  };

  const openNav = () => {
    if (!nav || !navToggle) return;
    nav.classList.add("is-open");
    header.classList.add("is-open");
    document.body.classList.add("is-locked");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "メニューを閉じる");

    const firstLink = nav.querySelector("a");
    if (firstLink) {
      window.setTimeout(() => firstLink.focus({ preventScroll: true }), 120);
    }
  };

  if (nav && navToggle) {
    navToggle.addEventListener("click", () => {
      if (navToggle.getAttribute("aria-expanded") === "true") {
        closeNav(false);
      } else {
        openNav();
      }
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => closeNav(false));
    });

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(event.target) || header.contains(event.target)) return;
      closeNav(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeNav(true);
      }
    });

    window.addEventListener("resize", () => {
      if (desktopQuery.matches && nav.classList.contains("is-open")) {
        closeNav(false);
      }
    });
  }

  /* ---------- reveal on scroll ---------- */
  const revealItems = Array.from(document.querySelectorAll(".reveal"));

  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  /* ---------- hero parallax ---------- */
  const heroArt = document.querySelector(".hero-art");
  let ticking = false;

  const updateParallax = () => {
    if (heroArt) {
      if (desktopQuery.matches && !reduceMotion.matches) {
        const offset = Math.min(window.scrollY, window.innerHeight);
        heroArt.style.transform = `translateY(${offset * 0.08}px)`;
      } else {
        heroArt.style.transform = "";
      }
    }
    ticking = false;
  };

  if (heroArt) {
    updateParallax();
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", updateParallax);
  }

  /* ---------- scroll spy ---------- */
  const sections = Array.from(document.querySelectorAll("main section[id]")).filter(
    (section) => section.querySelector("h2")
  );
  const navLinks = nav ? Array.from(nav.querySelectorAll('a[href^="#"]')) : [];

  const setCurrent = (id) => {
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-current", active);
      if (active) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  if ("IntersectionObserver" in window && sections.length && navLinks.length) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );

    sections.forEach((section) => spyObserver.observe(section));
  }

  /* ---------- FAQ: one answer at a time ---------- */
  const faqItems = Array.from(document.querySelectorAll(".faq-item"));
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item && other.open) other.open = false;
      });
    });
  });

  /* ---------- footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- respond to motion preference changes ---------- */
  const syncMotionPreference = () => {
    if (reduceMotion.matches) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      if (heroArt) heroArt.style.transform = "";
    }
  };

  if (typeof reduceMotion.addEventListener === "function") {
    reduceMotion.addEventListener("change", syncMotionPreference);
  }
})();
