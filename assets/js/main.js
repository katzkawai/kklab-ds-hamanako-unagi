(() => {
  'use strict';

  window.__revealReady = true;

  const body = document.body;
  const header = document.getElementById('site-header');
  const nav = document.getElementById('site-nav');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const progressBar = document.querySelector('.scroll-progress span');

  /* ---------- Mobile navigation ---------- */

  const main = document.getElementById('main');
  const footer = document.querySelector('.site-footer');

  const setMenu = (open) => {
    body.classList.toggle('menu-open', open);
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.querySelector('.nav-toggle-label').textContent = open ? '閉じる' : 'メニュー';
    if (main) main.inert = open;
    if (footer) footer.inert = open;
  };

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      setMenu(!nav.classList.contains('is-open'));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => setMenu(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        navToggle.focus();
      }
    });

    const desktopQuery = window.matchMedia('(min-width: 901px)');
    const handleDesktop = (event) => {
      if (event.matches) setMenu(false);
    };
    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener('change', handleDesktop);
    } else {
      desktopQuery.addListener(handleDesktop);
    }
  }

  /* ---------- Header state and scroll progress ---------- */

  let ticking = false;

  const updateScrollUI = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    header.classList.toggle('is-scrolled', scrollY > 40);

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(scrollY / scrollable, 1) : 0;
    if (progressBar) progressBar.style.width = `${ratio * 100}%`;

    ticking = false;
  };

  const requestScrollUpdate = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  };

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  window.addEventListener('resize', requestScrollUpdate);
  updateScrollUI();

  /* ---------- Scroll reveal ---------- */

  const revealItems = Array.from(document.querySelectorAll('[data-reveal]'));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  /* ---------- Active navigation link ---------- */

  const sections = Array.from(document.querySelectorAll('main section[id]'));

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navLinks.forEach((link) => {
            const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
            link.classList.toggle('is-active', isCurrent);
          });
        });
      },
      { rootMargin: '-38% 0px -52% 0px', threshold: 0 }
    );

    sections.forEach((section) => {
      if (section.id !== 'top') sectionObserver.observe(section);
    });
  }

  /* ---------- FAQ: keep one panel open at a time ---------- */

  const faqItems = Array.from(document.querySelectorAll('.faq-item'));

  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });
})();
