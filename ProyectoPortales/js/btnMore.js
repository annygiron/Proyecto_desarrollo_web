document.addEventListener("DOMContentLoaded", () => {
    const moreButtons = document.querySelectorAll(".more-button");
    moreButtons.forEach((moreButton) => {
        moreButton.addEventListener("click", () => {
            const servicio = moreButton.closest(".servicio");
            const serviceBody = servicio.querySelector(".service-body");
            serviceBody.classList.toggle("hidden");
            moreButton.classList.toggle("minimize");
        });
    });
});