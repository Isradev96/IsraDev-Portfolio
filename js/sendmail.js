const form = document.querySelector("form");
const formName = document.getElementById("name");
const formEmail = document.getElementById("email");
const formSubject = document.getElementById("subject");
const formMessage = document.getElementById("message");


    async function sendMail() {

        let params = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            subject: document.getElementById("subject").value,
            message: document.getElementById("message").value
        }

        try {
            // Enviar el correo usando EmailJS
            const response = await emailjs.send("service_55ewc5b","template_rdzkrp6", params);
    
            // Verificar si la respuesta es exitosa
            if (response.status === 200 || response.ok) {
                Swal.fire({
                    title: "¡Mensaje Enviado!",
                    text: "Tu mensaje ha sido enviado correctamente.",
                    icon: "success"
                });
            } else {
                // Si la respuesta no fue exitosa
                Swal.fire({
                    title: "¡Ups!",
                    text: "Hubo un problema al enviar tu mensaje. Intenta de nuevo más tarde.",
                    icon: "error"
                });
            }
        } catch (error) {
            // En caso de error al intentar enviar el correo (error en la red o en el servidor)
            console.error("Error al enviar el correo:", error);  // Puedes imprimir el error en consola para más detalles
    
            // Mostrar mensaje de error genérico si hubo un fallo con la solicitud
            Swal.fire({
                title: "¡Error!",
                text: "Hubo un error al conectar con el servidor. Intenta nuevamente más tarde.",
                icon: "error"
            });
    
            // En el caso de que el error sea un problema con la red, por ejemplo, puedes ser más específico:
            if (error.message.includes("NetworkError")) {
                Swal.fire({
                    title: "¡Error de Red!",
                    text: "Parece haber un problema con tu conexión. Verifica tu conexión a internet y vuelve a intentarlo.",
                    icon: "error"
                });
            }
        }
    }

function checkInput() {
    const items = document.querySelectorAll(".item");

    for (const item of items) {
        if (item.value == "") {
            item.classList.add("error");
            item.parentElement.classList.add("error");
        }

        if(items[1].value != "") {
            checkEmail();
        }

        items[1].addEventListener("keyup", () => {
            checkEmail();
        });

        item.addEventListener("keyup", () => {
            if (item.value != "") {
                item.classList.remove("error");
                item.parentElement.classList.remove("error");

            }
            else {
                item.classList.add("error");
                item.parentElement.classList.add("error");
            }
        });
    }
}

function checkEmail(){
    const emailRegex = /^([a-z\d\.-_]+)@([a-z\d-]+)\.([a-z]{2,3})(\.[a-z]{2,3})?$/;
    const errorTxtEmail = document.querySelector(".error-txt.email");

    if(!formEmail.value.match(emailRegex)) {

        formEmail.classList.add("error");
        formEmail.parentElement.classList.add("error");

        if(formEmail.value != "") {
            errorTxtEmail.innerText = "Ingrese un formato de correo válido";
        }
        else{
            errorTxtEmail.innerText = "El campo correo es requerido";
        }
    }
    else{
        formEmail.classList.remove("error");
        formEmail.parentElement.classList.remove("error");
    }

}


form.addEventListener("submit", (e) =>{
    e.preventDefault();

    checkInput();

    if(!formName.classList.contains("error") && !formEmail.classList.contains("error") &&
        !formSubject.classList.contains("error") && !formMessage.classList.contains("error") ) {

            sendMail();
            form.reset();
            return false;
        }
});