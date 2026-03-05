// js/layout-loader.js
// Carga layout por partials y garantiza que los scripts se ejecuten
// DESPUÉS de inyectar el HTML.
(async function loadLayout() {
  const sidebarSlot = document.getElementById("sidebar-slot");
  const topbarSlot  = document.getElementById("topbar-slot");
  const mainSlot    = document.getElementById("main-slot");
  const footerSlot  = document.getElementById("footer-slot");

  const fetchText = async (path) => {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(`No se pudo cargar: ${path} (${res.status})`);
    return await res.text();
  };

  const setHTML = (el, html) => {
    if (el) el.innerHTML = html;
  };

  const loadScriptFromNode = (oldScriptEl) => {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");

      // ✅ Mantener orden (Swiper -> emailjs -> medium-zoom -> script.js -> slider.js)
      // cuando se inyectan scripts dinámicamente.
      s.async = false;

      // Copiar atributos
      for (const { name, value } of Array.from(oldScriptEl.attributes)) {
        if (name === "src") continue;
        s.setAttribute(name, value);
      }

      const src = oldScriptEl.getAttribute("src");
      if (src) {
        // ✅ NO reescribir rutas. En este repo los scripts viven en assets/js/
        s.src = src;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error(`No se pudo cargar script: ${src}`));
      } else {
        // script inline
        s.textContent = oldScriptEl.textContent || "";
      }

      document.body.appendChild(s);

      // Inline se ejecuta al append; resolvemos inmediatamente después.
      if (!src) resolve();
    });
  };

  // Inserta HTML y ejecuta scripts que vengan dentro (porque innerHTML NO ejecuta <script>)
  const insertHTMLAndRunScripts = async (html) => {
    const tpl = document.createElement("template");
    tpl.innerHTML = html;

    // 1) Insertar primero lo que NO sea script
    const frag = document.createDocumentFragment();
    Array.from(tpl.content.childNodes).forEach((node) => {
      if (node.nodeName.toLowerCase() !== "script") frag.appendChild(node);
    });
    document.body.appendChild(frag);

    // 2) Ejecutar scripts (en orden)
    const scripts = tpl.content.querySelectorAll("script");
    for (const sc of Array.from(scripts)) {
      await loadScriptFromNode(sc);
    }
  };

  try {
    // 1) Layout (sidebar, topbar, footer)
    const [sidebarHTML, topbarHTML, footerHTML] = await Promise.all([
      fetchText("./partials/sidebar.html"),
      fetchText("./partials/topbar.html"),
      fetchText("./partials/footer.html"),
    ]);

    setHTML(sidebarSlot, sidebarHTML);
    setHTML(topbarSlot,  topbarHTML);
    setHTML(footerSlot,  footerHTML);

    // 2) Main (secciones en orden)
    const sectionFiles = [
      "./partials/home.html",
      "./partials/about.html",
      "./partials/skills.html",
      "./partials/training.html",
      "./partials/viewer.html",
      "./partials/projects.html",
      "./partials/modals.html",
      "./partials/certificate.html",
    ];

    const sectionsHTML = await Promise.all(sectionFiles.map(fetchText));
    setHTML(mainSlot, sectionsHTML.join("\n"));

    // 3) Anti-debug (si existe como js)
    try {
      const sc = document.createElement("script");
      sc.setAttribute("src", "./assets/js/anti-debug.js");
      await loadScriptFromNode(sc); // usa tu helper y respeta el orden (async=false)
    } catch (e) {
      console.warn("[layout-loader] anti-debug no cargó", e);
    }

    // 4) Scripts (al final)
    try {
      const scriptsHTML = await fetchText("./partials/scripts.html");
      await insertHTMLAndRunScripts(scriptsHTML);
    } catch (_) {
      console.warn("[layout-loader] No existe partials/scripts.html");
    }

  } catch (err) {
    console.error("[layout-loader] error:", err);
    if (mainSlot) mainSlot.innerHTML = "<div style='padding:16px'>❌ Error cargando partials. Mirá consola.</div>";
  }
})();