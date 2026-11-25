/* Standalone theme control for engineering pages; compatible with al-folio data-theme. */
(function () {
  function init() {
    var btn = document.getElementById('am-theme-button');
    if (!btn) return;
    var root = document.documentElement;
    function refresh() {
      var dark = root.getAttribute('data-theme') === 'dark';
      btn.setAttribute('aria-pressed', String(dark));
      btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.innerHTML = dark ? '☀ <span>Light mode</span>' : '☾ <span>Dark mode</span>';
    }
    /* Respect any preference already loaded by the original theme. */
    if (!root.getAttribute('data-theme')) {
      var saved;
      try { saved = window.localStorage.getItem('theme'); } catch(e) {}
      var dark = saved === 'dark' || (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      root.setAttribute('data-theme', dark ? 'dark' : 'light');
    }
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { window.localStorage.setItem('theme', next); } catch(e) {}
      refresh();
    });
    new MutationObserver(refresh).observe(root, {attributes:true,attributeFilter:['data-theme']});
    refresh();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
