/* Metonym site nav — hamburger "More" dropdown toggle.
   Used on every page. Pure vanilla; no dependencies. */
(function() {
  function init() {
    var btn = document.querySelector('.nav-hamburger');
    var menu = document.getElementById('nav-more');
    if (!btn || !menu) return;

    function close() {
      btn.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
    }
    function open() {
      btn.setAttribute('aria-expanded', 'true');
      menu.hidden = false;
    }
    function toggle() {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      if (expanded) close(); else open();
    }

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggle();
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
      if (menu.hidden) return;
      if (menu.contains(e.target) || btn.contains(e.target)) return;
      close();
    });

    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && !menu.hidden) {
        close();
        btn.focus();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
