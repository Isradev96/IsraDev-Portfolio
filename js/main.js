let translations = {}; // Guardará la traducción cargada
let currentLang = 'es';

// --- Cambio de idioma ---
async function loadLanguage(lang) {
    try {
        const res = await fetch(`./languages/${lang}.json`);
        translations = await res.json(); // Guardamos para uso posterior
        currentLang = lang;
        changeLanguageContent(translations);
    } catch (error) {
        console.error("Error loading language file:", error);
    }
}

function changeLanguageContent(translations) {
    const elements = document.querySelectorAll("[data-section][data-value], [data-section][data-placeholder]");

    elements.forEach(el => {
        const section = el.getAttribute("data-section");

        // Traducción del contenido (texto interno)
        const valueKey = el.getAttribute("data-value");
        if (valueKey) {
            const translation = translations?.[section]?.[valueKey];
            if (translation) {
                const childNodes = Array.from(el.childNodes);
                const icons = childNodes.filter(node => node.nodeType === 1 && node.tagName === "I");
                el.innerHTML = translation;
                icons.forEach(icon => el.appendChild(icon));
            }
        }

        // Traducción del placeholder
        const placeholderKey = el.getAttribute("data-placeholder");
        if (placeholderKey && el.placeholder !== undefined) {
            const placeholderTranslation = translations?.[section]?.[placeholderKey];
            if (placeholderTranslation) {
                el.placeholder = placeholderTranslation;
            }
        }
    });
}


document.querySelectorAll(".btn-lang").forEach(button => {
    button.addEventListener("click", () => {
        const selectedLang = button.getAttribute("data-language");
        const selectedFlag = button.getAttribute("data-flag");

        localStorage.setItem("lang", selectedLang);
        localStorage.setItem("flag", selectedFlag);

        const activeFlag = document.getElementById("activeFlag");
        if (activeFlag && selectedFlag) {
            activeFlag.src = selectedFlag;
        }

        loadLanguage(selectedLang);
    });
});

window.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem("lang") || "es";
    const savedFlag = localStorage.getItem("flag");

    if (savedFlag) {
        const activeFlag = document.getElementById("activeFlag");
        if (activeFlag) activeFlag.src = savedFlag;
    }

    loadLanguage(savedLang);
});


// --- Validación y Envío del Formulario ---
const form = document.querySelector("form");
const formName = document.getElementById("name");
const formEmail = document.getElementById("email");
const formSubject = document.getElementById("subject");
const formMessage = document.getElementById("message");

async function sendMail() {
    let params = {
        name: formName.value,
        email: formEmail.value,
        subject: formSubject.value,
        message: formMessage.value
    }

    try {
        const response = await emailjs.send("service_55ewc5b", "template_rdzkrp6", params);

        if (response.status === 200 || response.ok) {
            Swal.fire({
                title: translations.alerts?.successTitle || "¡Mensaje Enviado!",
                text: translations.alerts?.successText || "Tu mensaje ha sido enviado correctamente.",
                icon: "success"
            });
        } else {
            Swal.fire({
                title: translations.alerts?.failTitle || "¡Ups!",
                text: translations.alerts?.failText || "Hubo un problema al enviar tu mensaje.",
                icon: "error"
            });
        }
    } catch (error) {
        console.error("Error al enviar el correo:", error);

        Swal.fire({
            title: translations.alerts?.errorTitle || "¡Error!",
            text: translations.alerts?.errorText || "Hubo un error al conectar con el servidor.",
            icon: "error"
        });

        if (error.message.includes("NetworkError")) {
            Swal.fire({
                title: translations.alerts?.networkTitle || "¡Error de Red!",
                text: translations.alerts?.networkText || "Verifica tu conexión a internet.",
                icon: "error"
            });
        }
    }
}

function checkInput() {
    const items = document.querySelectorAll(".item");

    for (const item of items) {
        const errorContainer = item.parentElement.querySelector(".error-txt");
        if (item.value === "") {
            item.classList.add("error");
            item.parentElement.classList.add("error");

            if (errorContainer) {
                const fieldKey = item.getAttribute("id");
                errorContainer.innerText = translations.errors?.[fieldKey]?.required || "Este campo es obligatorio";
            }
        }

        item.addEventListener("keyup", () => {
            if (item.value !== "") {
                item.classList.remove("error");
                item.parentElement.classList.remove("error");
            } else {
                item.classList.add("error");
                item.parentElement.classList.add("error");

                if (errorContainer) {
                    const fieldKey = item.getAttribute("id");
                    errorContainer.innerText = translations.errors?.[fieldKey]?.required || "Este campo es obligatorio";
                }
            }
        });
    }

    // Validación especial para email
    checkEmail();
    formEmail.addEventListener("keyup", checkEmail);
}

function checkEmail() {
    const emailRegex = /^([a-z\d\.-_]+)@([a-z\d-]+)\.([a-z]{2,3})(\.[a-z]{2,3})?$/;
    const errorTxtEmail = document.querySelector(".error-txt.email");

    if (!formEmail.value.match(emailRegex)) {
        formEmail.classList.add("error");
        formEmail.parentElement.classList.add("error");

        if (formEmail.value !== "") {
            errorTxtEmail.innerText = translations.errors?.email?.invalid || "Ingrese un formato de correo válido";
        } else {
            errorTxtEmail.innerText = translations.errors?.email?.required || "El campo correo es requerido";
        }
    } else {
        formEmail.classList.remove("error");
        formEmail.parentElement.classList.remove("error");
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    checkInput();

    if (
        !formName.classList.contains("error") &&
        !formEmail.classList.contains("error") &&
        !formSubject.classList.contains("error") &&
        !formMessage.classList.contains("error")
    ) {
        sendMail();
        form.reset();
    }
});
