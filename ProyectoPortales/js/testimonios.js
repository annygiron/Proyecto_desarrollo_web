import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBG7uDmLYfNliXs4qFe7zAIQ_UqYEWelrg",
    authDomain: "bateriasmatute.firebaseapp.com",
    projectId: "bateriasmatute",
    storageBucket: "bateriasmatute.firebasestorage.app",
    messagingSenderId: "916121024310",
    appId: "1:916121024310:web:1126982bb12f1518a72597",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "default");
const reviewsCollection = collection(db, "reviews");

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("review-form");
    const grid = document.getElementById("review-grid");
    const mensaje = document.getElementById("form-mensaje");

    function crearTarjeta({ nombre, calificacion, comentario, fecha }) {
        const card = document.createElement("section");
        card.className = "review-card";
        card.innerHTML = `
            <div class="review-card_header">
                <span class="review-card_nombre">${nombre}</span>
                <span class="review-card_estrellas">${"★".repeat(calificacion)}${"☆".repeat(5 - calificacion)}</span>
            </div>
            <div class="review-card_body">
                <p>"${comentario}"</p>
            </div>
            <div class="review-card_footer">
                <span class="review-card_fecha">${fecha}</span>
            </div>
        `;
        return card;
    }

    const reviewsQuery = query(reviewsCollection, orderBy("creadoEn", "desc"));
    onSnapshot(
        reviewsQuery,
        (snapshot) => {
            grid.innerHTML = "";
            snapshot.forEach((doc) => {
                grid.appendChild(crearTarjeta(doc.data()));
            });
        },
        (error) => {
            alert("ERROR AL LEER RESEÑAS: " + error.message);
        }
    );

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = document.getElementById("review-name").value.trim();
        const comentario = document.getElementById("review-comment").value.trim();
        const estrellaSeleccionada = form.querySelector('input[name="rating"]:checked');

        if (!nombre || !comentario || !estrellaSeleccionada) {
            mensaje.textContent = "Por favor completa tu nombre, comentario y calificación.";
            mensaje.style.color = "#b00020";
            return;
        }

        const reseña = {
            nombre,
            calificacion: Number(estrellaSeleccionada.value),
            comentario,
            fecha: new Date().toLocaleDateString("es-HN"),
            creadoEn: serverTimestamp(),
        };

        try {
            await addDoc(reviewsCollection, reseña);
            form.reset();
            mensaje.textContent = "¡Gracias por tu reseña!";
            mensaje.style.color = "#1B4F82";
        } catch (error) {
            alert("ERROR AL GUARDAR: " + error.message);
            mensaje.textContent = "Hubo un problema al enviar tu reseña. Intenta de nuevo.";
            mensaje.style.color = "#b00020";
        }
    });
});