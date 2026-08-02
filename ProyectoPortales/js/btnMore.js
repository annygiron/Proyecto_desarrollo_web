document.addEventListener("DOMContentLoaded", () => {
    const moreButtons = document.querySelectorAll(".more-button");
    moreButtons.forEach((moreButton) => {
        moreButton.addEventListener("click", () => {
            const servicio = moreButton.closest(".servicio");
            const serviceBody = servicio.querySelector(".service-body");
            const serviceTitle = servicio.querySelector(".service-title");
            serviceBody.classList.toggle("hidden");
            moreButton.classList.toggle("minimize");
            serviceTitle.classList.toggle("active");
        });
    });
});