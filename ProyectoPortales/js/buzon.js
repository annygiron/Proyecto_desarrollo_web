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
    apiKey: "AIzaSyDv4CIvUMlSNS7YcfbPtaPR_H7D-H7h9ow",
    authDomain: "bateriasmatute-d7a0b.firebaseapp.com",
    projectId: "bateriasmatute-d7a0b",
    storageBucket: "bateriasmatute-d7a0b.firebasestorage.app",
    messagingSenderId: "315889890596",
    appId: "1:315889890596:web:3b2dd93b74b0fb6d5e6fb1"
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

    let ultimoLeido = Number(localStorage.getItem("buzonUltimoLeido") || 0);
    let mensajesActuales = [];

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

        mensajesActuales = mensajes;

        const noLeidos = mensajes.filter((m) => m.creado > ultimoLeido).length;

        if (noLeidos > 0) {
            buzonBadge.textContent = noLeidos;
            buzonBadge.classList.remove("hidden");
        } else {
            buzonBadge.classList.add("hidden");
        }
    };

    const q = query(mensajesRef, orderBy("creado", "asc"));
    onSnapshot(q, (snapshot) => {
        const mensajes = snapshot.docs.map((doc) => doc.data());
        buzonRender(mensajes);
    }, (error) => {
        console.error("Error leyendo mensajes de Firestore:", error);
    });

    buzonBtn.addEventListener("click", () => {
        buzonPanel.classList.toggle("hidden");

        if (!buzonPanel.classList.contains("hidden") && mensajesActuales.length > 0) {
            ultimoLeido = Math.max(...mensajesActuales.map((m) => m.creado));
            localStorage.setItem("buzonUltimoLeido", ultimoLeido);
            buzonBadge.classList.add("hidden");
        }
    });

    document.getElementById("buzonCerrar").addEventListener("click", () => {
        buzonPanel.classList.add("hidden");
    });

    form.addEventListener("formularioValido", async () => {
        try {
            await addDoc(mensajesRef, {
                nombre: nombre.value.trim(),
                correo: correo.value.trim(),
                telefono: telefono.value.trim(),
                mensaje: mensaje.value.trim(),
                fecha: new Date().toLocaleString("es-HN"),
                creado: Date.now()
            });
            buzonPanel.classList.remove("hidden");
            form.reset();
        } catch (error) {
            console.error("Error guardando el mensaje:", error);
        }
    });
});