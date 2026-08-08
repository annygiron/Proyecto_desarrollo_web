// buzon.js — Bandeja de mensajes de contacto (Firebase Firestore)

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBG7uDmLYfNliXs4qFe7zAIQ_UqYEWelrg",
    authDomain: "bateriasmatute.firebaseapp.com",
    projectId: "bateriasmatute",
    storageBucket: "bateriasmatute.firebasestorage.app",
    messagingSenderId: "916121024310",
    appId: "1:916121024310:web:1126982bb12f1518a72597"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const mensajesRef = collection(db, "mensajes");

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const telefono = document.getElementById("telefono");
    const mensaje = document.getElementById("mensaje");

    const isEmptyRegex = /^\s*$/;
    const isValidEmailRegex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;

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
        <div id="buzonLista"><p class="buzonVacio">Cargando mensajes...</p></div>
    `;

    document.body.appendChild(buzonBtn);
    document.body.appendChild(buzonPanel);

    const buzonRender = (mensajes) => {
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

    const q = query(mensajesRef, orderBy("creado", "asc"));
    onSnapshot(q, (snapshot) => {
        const mensajes = snapshot.docs.map((doc) => doc.data());
        buzonRender(mensajes);
    });

    buzonBtn.addEventListener("click", () => {
        buzonPanel.classList.toggle("hidden");
    });

    document.getElementById("buzonCerrar").addEventListener("click", () => {
        buzonPanel.classList.add("hidden");
    });

    form.addEventListener("submit", async () => {
        const nombreValido = !isEmptyRegex.test(nombre.value);
        const correoValido = isValidEmailRegex.test(correo.value);
        const mensajeValido = !isEmptyRegex.test(mensaje.value);

        if (!nombreValido || !correoValido || !mensajeValido) return;

        await addDoc(mensajesRef, {
            nombre: nombre.value.trim(),
            correo: correo.value.trim(),
            telefono: telefono.value.trim(),
            mensaje: mensaje.value.trim(),
            fecha: new Date().toLocaleString("es-HN"),
            creado: Date.now()
        });

        buzonPanel.classList.remove("hidden");
    }, true);
});