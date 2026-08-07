document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("review-form");
    const grid = document.getElementById("review-grid");
    const mensaje = document.getElementById("form-mensaje");

    const STORAGE_KEY = "matuteReviews";

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

    function cargarReseñasGuardadas() {
        const guardadas = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        guardadas.forEach((reseña) => {
            grid.prepend(crearTarjeta(reseña));
        });
    }

    function guardarReseña(reseña) {
        const guardadas = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        guardadas.push(reseña);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(guardadas));
    }

    cargarReseñasGuardadas();

    form.addEventListener("submit", (e) => {
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
        };

        grid.prepend(crearTarjeta(reseña));
        guardarReseña(reseña);

        form.reset();
        mensaje.textContent = "¡Gracias por tu reseña!";
        mensaje.style.color = "#1B4F82";
    });
});