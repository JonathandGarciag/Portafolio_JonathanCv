document.addEventListener('contextmenu', e => e.preventDefault());

document.addEventListener('keydown', e => {
    if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
    (e.ctrlKey && e.key === 'U')
    ) {
    e.preventDefault();
    }
});

var _0xabc1=["\x48\x6F\x6C\x61\x20\x6D\x75\x6E\x64\x6F"];console["\x6C\x6F\x67"](_0xabc1[0]);

// Bloquear Ctrl+U / Cmd+U (View Source)
(function () {
  function blockViewSource(e) {
    const key = (e.key || "").toLowerCase();

    // Windows/Linux: Ctrl+U  |  Mac: Cmd+U
    if ((e.ctrlKey || e.metaKey) && key === "u") {
      e.preventDefault();
      e.stopPropagation();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      return false;
    }
  }

  // Captura en fase "capture" para ganarle a otros listeners
  window.addEventListener("keydown", blockViewSource, true);
  document.addEventListener("keydown", blockViewSource, true);
})();