class Carusel {
    root = null;
    trail = null;
    slides = null;
    slidesCount = 0;
    intervalTime = 0;
    currentIndex = 0;
    direction = 1;
    btnLeft = null;
    btnRight = null;
    timeoutId = null;
    onProcess = false;
    indexedButtons = null;
    indexedButtonsItems = [];


    constructor(rootSelector, tickSecond = 3) {
        this.root = document.querySelector(rootSelector);
        if (!this.root) {
            throw new Error("No se encuentra el elemento root del carusel");
        }
        this.trail = this.root.querySelector(".carusel-trail");
        this.slides = this.root.querySelectorAll(".carusel-trail>section");
        this.slidesCount = this.slides.length;
        if (this.slidesCount < 3) {
            throw new Error("Mínimo son 3 elementos en carusel");
        }
        this.generateClonesUX();
        this.generateLateralsUX();
        this.generateIndexedUX();
        this.intervalTime = tickSecond * 1000;
        this.tick();
    }

    generateIndexedUX() {
        this.indexedButtons = document.createElement("DIV");
        this.indexedButtons.classList.add("carusel-indexed-btns");

        for (let i = 0; i < this.slidesCount; i++) {
            let btnIdx = document.createElement("DIV");
            if (i === 0) {
                // 1 == "1"
                // 1 === "1"
                // 1 === 1
                btnIdx.classList.add("current");
            }
            btnIdx.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.onProcess = true;
                this.clearTimeout();
                this.currentIndex = i;
                this.moveSlide();
            });
            this.indexedButtons.appendChild(btnIdx);
            this.indexedButtonsItems.push(btnIdx);
        }
        this.root.appendChild(this.indexedButtons);
    }

    updateCurrentIndexedBtn() {
        this.indexedButtonsItems.forEach((o) => {
            o.classList.remove("current");
        });
        let activeIndex = this.currentIndex - 1;

        if (activeIndex >= this.slidesCount) {
            activeIndex = 0;
        }
        if (activeIndex < 0) {
            activeIndex = this.slidesCount - 1;
        }

        if (this.indexedButtonsItems[activeIndex]) {
            this.indexedButtonsItems[activeIndex].classList.add("current");
        }
    }
    generateLateralsUX() {
        this.btnLeft = document.createElement("DIV");
        this.btnRight = document.createElement("DIV");

        this.btnLeft.innerHTML = "&lt;";
        this.btnRight.innerHTML = "&gt";

        this.btnLeft.classList.add(
            "carusel-btn",
            "carusel-btn-left"
        );
        this.btnRight.classList.add(
            "carusel-btn",
            "carusel-btn-right"
        );
        this.btnLeft.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.onProcess) {
                return;
            }
            this.onProcess = true;
            this.clearTimeout();
            this.currentIndex--;
            this.moveSlide();
        });

        this.btnRight.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (this.onProcess) {
                return;
            }
            this.onProcess = true;
            this.clearTimeout();
            this.currentIndex++;
            this.moveSlide();
        });
        this.root.appendChild(this.btnLeft);
        this.root.appendChild(this.btnRight);
    }

    clearTimeout() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }
    tick() {
        this.timeoutId = setTimeout(
            (() => {
                this.onProcess = true;
                this.currentIndex += this.direction;
                this.moveSlide();
            }).bind(this)
            , this.intervalTime
        );
    }

    moveSlide() {
        this.trail.style.transition = "transform 1s ease";
        this.trail.style.transform = `translateX(-${this.currentIndex * 100}%)`;

        this.updateCurrentIndexedBtn();

        setTimeout(() => {
            this.onProcess = false;
        }, 1000);

        this.tick();
    }

    generateClonesUX() {
        let firstClone = this.slides[0].cloneNode(true);
        let lastClone = this.slides[this.slidesCount - 1].cloneNode(true);

        this.trail.appendChild(firstClone);
        this.trail.insertBefore(lastClone, this.slides[0]);

        this.trail.style.transition = "none";
        this.trail.style.transform = `translateX(-100%)`;

        this.trail.addEventListener("transitionend", () => {
            if (this.currentIndex >= this.slidesCount + 1) {
                this.trail.style.transition = "none";
                this.currentIndex = 1;
                this.trail.style.transform = `translateX(-100%)`;
            }
            if (this.currentIndex <= 0) {
                this.trail.style.transition = "none";
                this.currentIndex = this.slidesCount;
                this.trail.style.transform = `translateX(-${this.slidesCount * 100}%)`;
            }
        });
    }
}