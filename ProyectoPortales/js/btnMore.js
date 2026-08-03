/*document.addEventListener("DOMContentLoaded", () => {
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
});*/

document.addEventListener('DOMContentLoaded', () => {
    const serviceTitles = document.querySelectorAll('.service-title');

    serviceTitles.forEach(title => {
        title.addEventListener('click', () => {
            const servicio = title.closest('.servicio');
            const serviceBody = servicio.querySelector('.service-body');
            const moreButton = title.querySelector('.more-button');
            const serviceTitle = title;
            serviceBody.classList.toggle('hidden');
            servicio.classList.toggle('active');
            serviceTitle.classList.toggle('active');
            
            if (moreButton) {
                moreButton.classList.toggle('minimize');
            }
        });
    });
});