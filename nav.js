/* Metonym site nav — hamburger "More" dropdown toggle + nav-bar "For your team" auto-close.
   Used on every page. Pure vanilla; no dependencies. */
(function() {
  function init() {
    // === Hamburger ☰ dropdown ===
    var btn = document.querySelector('.nav-hamburger');
    var menu = document.getElementById('nav-more');

    if (btn && menu) {
      function closeMenu() {
        btn.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
      }
      function openMenu() {
        btn.setAttribute('aria-expanded', 'true');
        menu.hidden = false;
      }
      function toggleMenu() {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        if (expanded) closeMenu(); else openMenu();
      }
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
      });
      // Close on outside click
      document.addEventListener('click', function(e) {
        if (menu.hidden) return;
        if (menu.contains(e.target) || btn.contains(e.target)) return;
        closeMenu();
      });
      // Close on Escape
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !menu.hidden) {
          closeMenu();
          btn.focus();
        }
      });
    }

    // === Nav-bar "For your team" dropdown auto-close ===
    var navDropdown = document.querySelector('.nav-links .nav-dropdown');
    if (navDropdown) {
      // Close on outside click
      document.addEventListener('click', function(e) {
        if (!navDropdown.open) return;
        if (navDropdown.contains(e.target)) return;
        navDropdown.open = false;
      });
      // Close on Escape
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navDropdown.open) {
          navDropdown.open = false;
          var summary = navDropdown.querySelector('summary');
          if (summary) summary.focus();
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
