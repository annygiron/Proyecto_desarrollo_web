document.addEventListener("DOMContentLoaded", ()=>{
    // Instanciando el Carusel
    let caruselInstance = new Carusel(".carusel");

    let hmbButton = document.querySelector("header .hmb-button");
    let nav = document.querySelector("header nav");
    hmbButton.addEventListener("click", (e)=>{
        e.preventDefault();
        e.stopPropagation();
        nav.classList.toggle("hidden");
    });
});
