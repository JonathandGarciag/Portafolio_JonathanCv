const I18N_DEFAULT_LANG = "es";
const I18N_STORAGE_KEY = "portfolio-lang";

window.i18n = {
  lang: I18N_DEFAULT_LANG,
  translations: {},

  async setLanguage(lang) {
    const nextLang = ["es", "en"].includes(lang) ? lang : I18N_DEFAULT_LANG;
    const response = await fetch(`./assets/i18n/${nextLang}.json`, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`No se pudo cargar el idioma: ${nextLang}`);
    }

    this.translations = await response.json();
    this.lang = nextLang;

    localStorage.setItem(I18N_STORAGE_KEY, nextLang);
    document.documentElement.lang = nextLang;

    this.applyTranslations();
    this.updateSwitcherUI();

    document.dispatchEvent(
      new CustomEvent("languageChanged", { detail: { lang: nextLang } })
    );
  },

  t(key, fallback = "") {
    const value = key
      .split(".")
      .reduce((acc, part) => acc && acc[part], this.translations);

    return value ?? fallback;
  },

  applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const value = this.t(key, el.textContent.trim());
      el.textContent = value;
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.dataset.i18nHtml;
      const value = this.t(key, el.innerHTML.trim());
      el.innerHTML = value;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      const value = this.t(key, el.getAttribute("placeholder") || "");
      el.setAttribute("placeholder", value);
    });

    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.dataset.i18nAlt;
      const value = this.t(key, el.getAttribute("alt") || "");
      el.setAttribute("alt", value);
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      const key = el.dataset.i18nAriaLabel;
      const value = this.t(key, el.getAttribute("aria-label") || "");
      el.setAttribute("aria-label", value);
    });
  },

  updateSwitcherUI() {
    document.querySelectorAll("[data-lang-switch]").forEach((button) => {
      const isActive = button.dataset.langSwitch === this.lang;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  },

  initSwitcher() {
    document.querySelectorAll("[data-lang-switch]").forEach((button) => {
      if (button.dataset.bound === "true") return;

      button.dataset.bound = "true";
      button.addEventListener("click", () => {
        this.setLanguage(button.dataset.langSwitch);
      });
    });

    this.updateSwitcherUI();
  },

  async init() {
    const savedLang = localStorage.getItem(I18N_STORAGE_KEY) || I18N_DEFAULT_LANG;

    this.initSwitcher();
    await this.setLanguage(savedLang);
  },
};

window.i18n.init().catch((error) => {
  console.error("[i18n] error:", error);
});