// buzon.js — Bandeja de mensajes de contacto (solo va en contacto.html)

const BUZON_STORAGE_KEY = "buzonMensajes";

const buzonGetMensajes = () => {
    try {
        return JSON.parse(localStorage.getItem(BUZON_STORAGE_KEY)) || [];
    } catch {
        return [];
    }
};

const buzonGuardarMensajes = (mensajes) => {
    localStorage.setItem(BUZON_STORAGE_KEY, JSON.stringify(mensajes));
};

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const telefono = document.getElementById("telefono");
    const mensaje = document.getElementById("mensaje");

    const isEmptyRegex = /^\s*$/;
    const isValidEmailRegex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;

    // --- Construcción del widget ---
    const buzonBtn = document.createElement("button");
    buzonBtn.id = "buzonBtn";
    buzonBtn.type = "button";
    buzonBtn.innerHTML = "✉️";
    buzonBtn.setAttribute("aria-label", "Abrir bandeja de mensajes");

    const buzonBadge = document.createElement("span");
    buzonBadge.id = "buzonBadge";
    buzonBadge.classList.add("hidden");
    buzonBtn.appendChild(buzonBadge);

    const buzonPanel = document.createElement("div");
    buzonPanel.id = "buzonPanel";
    buzonPanel.classList.add("hidden");
    buzonPanel.innerHTML = `
        <div id="buzonPanelHeader">
            <h3>Bandeja de entrada</h3>
            <button id="buzonCerrar" type="button" aria-label="Cerrar bandeja">✕</button>
        </div>
        <div id="buzonLista"></div>
    `;

    document.body.appendChild(buzonBtn);
    document.body.appendChild(buzonPanel);

    // --- Render de mensajes ---
    const buzonRender = () => {
        const mensajes = buzonGetMensajes();
        const lista = document.getElementById("buzonLista");
        lista.innerHTML = "";

        if (mensajes.length === 0) {
            lista.innerHTML = `<p class="buzonVacio">No hay mensajes todavía.</p>`;
        } else {
            mensajes.slice().reverse().forEach((m) => {
                const item = document.createElement("div");
                item.classList.add("buzonMsg");
                item.innerHTML = `
                    <strong>${m.nombre}</strong> — ${m.correo}<br>
                    ${m.telefono ? `📞 ${m.telefono}<br>` : ""}
                    ${m.mensaje}
                    <span class="buzonMsg-fecha">${m.fecha}</span>
                `;
                lista.appendChild(item);
            });
        }

        if (mensajes.length > 0) {
            buzonBadge.textContent = mensajes.length;
            buzonBadge.classList.remove("hidden");
        } else {
            buzonBadge.classList.add("hidden");
        }
    };

    buzonRender();

    buzonBtn.addEventListener("click", () => {
        buzonPanel.classList.toggle("hidden");
    });

    document.getElementById("buzonCerrar").addEventListener("click", () => {
        buzonPanel.classList.add("hidden");
    });

    // --- Captura del mensaje al enviar el formulario ---
    form.addEventListener("submit", () => {
        const nombreValido = !isEmptyRegex.test(nombre.value);
        const correoValido = isValidEmailRegex.test(correo.value);
        const mensajeValido = !isEmptyRegex.test(mensaje.value);

        if (!nombreValido || !correoValido || !mensajeValido) return;

        const mensajes = buzonGetMensajes();
        mensajes.push({
            nombre: nombre.value.trim(),
            correo: correo.value.trim(),
            telefono: telefono.value.trim(),
            mensaje: mensaje.value.trim(),
            fecha: new Date().toLocaleString("es-HN")
        });
        buzonGuardarMensajes(mensajes);
        buzonRender();
        buzonPanel.classList.remove("hidden");
    }, true);
});