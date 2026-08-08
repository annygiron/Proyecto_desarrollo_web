const isEmptyRegex = /^\s*$/;
const isValidEmailRegex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const mensaje = document.getElementById("mensaje");
    let fieldErrors = {};

    form.addEventListener("submit", (e) => {
    e.preventDefault();
    validateFormulario();
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

        if (!isValidEmailRegex.test(correo.value)) {
            showError(correo, "¡Ingresa un correo válido!");
            hasError = true;
            if (!focused) { focused = true; correo.focus(); }
        }

        if (isEmptyRegex.test(mensaje.value)) {
            showError(mensaje, "¡El mensaje no puede estar vacío!");
            hasError = true;
            if (!focused) { focused = true; mensaje.focus(); }
        }

        return !hasError;
    };
});