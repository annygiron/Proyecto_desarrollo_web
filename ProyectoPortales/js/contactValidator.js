const isEmptyRegex = /^\s*$/;
const isValidEmailRegex = /^[\w.\-]+@(gmail|outlook|yahoo)\.com$/;
const isValidPhoneRegex = /^[892]\d{7}$/;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const telefono = document.getElementById("telefono");
    const mensaje = document.getElementById("mensaje");
    let fieldErrors = {};

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (validateFormulario()) {
            form.dispatchEvent(new CustomEvent("formularioValido"));
        }
    });

    const showError = (field, message) => {
        const parent = field.parentElement;
        if (fieldErrors[field.id]) return;

        parent.classList.add("error");
        const errorSpan = document.createElement("SPAN");
        errorSpan.classList.add("contact_error");
        errorSpan.innerHTML = message;
        fieldErrors[field.id] = errorSpan;
        parent.appendChild(errorSpan);

        const changeHandler = () => {
            parent.classList.remove("error");
            errorSpan.remove();
            field.removeEventListener("input", changeHandler);
            delete fieldErrors[field.id];
        };
        field.addEventListener("input", changeHandler);
    };

    const validateFormulario = () => {
        let focused = false;
        let hasError = false;

        if (isEmptyRegex.test(nombre.value)) {
            showError(nombre, "¡El nombre no puede estar vacío!");
            hasError = true;
            if (!focused) { focused = true; nombre.focus(); }
        }

        if (!isValidEmailRegex.test(correo.value.trim())) {
            showError(correo, "¡Solo se aceptan correos @gmail.com, @outlook.com o @yahoo.com!");
            hasError = true;
            if (!focused) { focused = true; correo.focus(); }
        }

        if (isEmptyRegex.test(mensaje.value)) {
            showError(mensaje, "¡El mensaje no puede estar vacío!");
            hasError = true;
            if (!focused) { focused = true; mensaje.focus(); }
        }

        if (!isEmptyRegex.test(telefono.value) && !isValidPhoneRegex.test(telefono.value.trim())) {
            showError(telefono, "¡El teléfono debe tener 8 dígitos y empezar con 8, 9 o 2!");
            hasError = true;
            if (!focused) { focused = true; telefono.focus(); }
        }

        return !hasError;
    };
});