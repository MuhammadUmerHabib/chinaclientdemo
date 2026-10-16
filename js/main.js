/* ==========================================================================
   7 Star Engineering Kinetics: behaviour
   Everything works without JS except: the mobile menu (needs toggle),
   the logo marquee loop (shows one set), and scroll reveal (content is
   visible by default; JS only adds the entrance animation).
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  /* ---------- Header shadow after scrolling ---------- */
  function onScroll() {
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  function setNav(open) {
    if (!header || !toggle) return;
    header.classList.toggle('is-nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNav(!header.classList.contains('is-nav-open'));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setNav(false);
      });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setNav(false);
    });

    // Close the drawer when the page grows back to desktop width
    var desktop = window.matchMedia('(min-width: 1180px)');
    var closeOnDesktop = function (e) {
      if (e.matches) setNav(false);
    };
    if (desktop.addEventListener) {
      desktop.addEventListener('change', closeOnDesktop);
    } else {
      desktop.addListener(closeOnDesktop);
    }
  }

  /* ---------- Highlight the section in view in the menu ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var sections = navLinks
    .map(function (a) {
      return document.querySelector(a.getAttribute('href'));
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealItems = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var reveal = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealItems.forEach(function (el) {
      reveal.observe(el);
    });
  } else {
    revealItems.forEach(function (el) {
      el.classList.add('is-in');
    });
  }

  /* ---------- Logo marquee: duplicate the set for a seamless loop ---------- */
  var track = document.querySelector('.marquee__track');
  if (track) {
    var originals = Array.prototype.slice.call(track.children);
    originals.forEach(function (node) {
      var copy = node.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      track.appendChild(copy);
    });
  }

  /* ---------- FAQ: one answer open at a time ---------- */
  var faqItems = Array.prototype.slice.call(document.querySelectorAll('.faq__list details'));
  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      faqItems.forEach(function (other) {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ---------- Copy buttons (contact details) ---------- */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    var label = btn.textContent;
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var show = function (message, done) {
        btn.textContent = message;
        btn.classList.toggle('is-done', done);
        window.setTimeout(function () {
          btn.textContent = label;
          btn.classList.remove('is-done');
        }, 1600);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () {
            show('Copied', true);
          },
          function () {
            show('Select text', false);
          }
        );
      } else {
        show('Select text', false);
      }
    });
  });
})();
