// language.js
// This script handles language switching for the portfolio website

// Cargar el idioma por defecto al iniciar
async function loadLanguage(lang) {
    try {
        const res = await fetch(`./languages/${lang}.json`);
        const translations = await res.json();
        changeLanguageContent(translations);
    } catch (error) {
        console.error("Error loading language file:", error);
    }
}

function changeLanguageContent(translations) {
    const elements = document.querySelectorAll("[data-section][data-value]");

    elements.forEach(el => {
        const section = el.getAttribute("data-section");
        const value = el.getAttribute("data-value");
        const translation = translations?.[section]?.[value];

        if (!translation) return;

        // Si tiene hijos como <span> o <i>, solo reemplazamos el contenido respetando íconos
        const childNodes = Array.from(el.childNodes);
        const icons = childNodes.filter(node => node.nodeType === 1 && node.tagName === "I");

        // Reemplazar el HTML principal con traducción
        el.innerHTML = translation;

        // Volver a agregar íconos si existían
        icons.forEach(icon => el.appendChild(icon));
    });
}

// Detectar selección de idioma por botón y guardar en localStorage
document.querySelectorAll(".btn-lang").forEach(button => {
    button.addEventListener("click", () => {
        const selectedLang = button.getAttribute("data-language");
        const selectedFlag = button.getAttribute("data-flag");

        // Guardar en localStorage
        localStorage.setItem("lang", selectedLang);
        localStorage.setItem("flag", selectedFlag);

        // Cambiar bandera activa si aplica
        const activeFlag = document.getElementById("activeFlag");
        if (activeFlag && selectedFlag) {
            activeFlag.src = selectedFlag;
        }

        // Cargar contenido traducido
        loadLanguage(selectedLang);
    });
});

// Cargar idioma guardado al iniciar página
window.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem("lang") || "es"; // default "es"
    const savedFlag = localStorage.getItem("flag");

    if (savedFlag) {
        const activeFlag = document.getElementById("activeFlag");
        if (activeFlag) activeFlag.src = savedFlag;
    }

    loadLanguage(savedLang);
});