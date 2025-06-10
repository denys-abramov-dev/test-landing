class Carousel {
    constructor(containerSelector, slideSelector, dotClassName) {
        this.carouselContainer = document.querySelector(containerSelector);
        this.carouselTrack = this.carouselContainer.querySelector('.feedback__carousel-track');
        this.slides = this.carouselContainer.querySelectorAll(slideSelector);
        this.dotClassName = dotClassName;
        this.dotsContainer = null;
        this.dots = [];
        this.activeSlideIndex = 0;
        this.autoSlideInterval = null;
        this.init();
    }

    throttle(callback, delay) {
        let lastCall = 0;
        return (...args) => {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                callback.apply(this, args);
            }
        };
    }

    init() {
        this.initDots();
        this.setupInitialState();
        this.addEventListeners();
        this.startAutoSlide();
    }

    initDots() {
        this.dotsContainer = document.createElement('div');
        this.dotsContainer.classList.add('feedback__carousel-dots-container');

        this.dots = Array.from(this.slides).map((_, idx) => {
            const dot = document.createElement('button');
            dot.classList.add(this.dotClassName);
            dot.setAttribute('data-slide-index', idx);
            this.dotsContainer.appendChild(dot);
            return dot;
        });

        this.carouselContainer.appendChild(this.dotsContainer);
    }

    setupInitialState() {
        this.activeSlideIndex = Math.floor(this.slides.length / 2);
        this.updateCarousel(this.activeSlideIndex);
    }

    getSlideOffset(index) {
        if (!this.slides[index]) return 0;
        const containerWidth = this.carouselContainer.offsetWidth;
        const slideWidth = this.slides[index].offsetWidth;
        return (containerWidth / 2) - (slideWidth / 2) - (index * slideWidth);
    }

    slideTo(index) {
        const offsetLeft = this.getSlideOffset(index);
        this.carouselTrack.style.transform = `translateX(${offsetLeft}px)`;
    }

    updateActiveDot(newIndex) {
        if (this.dots[this.activeSlideIndex]) {
            this.dots[this.activeSlideIndex].classList.remove('active');
        }
        if (this.dots[newIndex]) {
            this.dots[newIndex].classList.add('active');
        }
        this.activeSlideIndex = newIndex;
    }

    updateSlidesClass(activeSlideIndex) {
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'previous', 'next');
            if (activeSlideIndex - 1 === index) slide.classList.add('previous');
            if (activeSlideIndex + 1 === index) slide.classList.add('next');
            if (activeSlideIndex === index) slide.classList.add('active');
        });
    }

    updateCarousel(index) {
        console.log(`Updating carousel to slide index: ${index}`);
        this.slideTo(index);
        this.updateActiveDot(index);
        this.updateSlidesClass(index);
    }

    handleDotsClick(event) {
        const { target } = event;
        const slideIndex = target.dataset.slideIndex;
        if (slideIndex !== undefined) {
            const index = parseInt(slideIndex, 10);
            if (index !== this.activeSlideIndex) {
                this.updateCarousel(index);
            }
        }
    }

    handleWheel(event) {
        if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
            if (event.deltaX > 0 && this.activeSlideIndex < this.slides.length - 1) {
                this.updateCarousel(this.activeSlideIndex + 1);
            } else if (event.deltaX < 0 && this.activeSlideIndex > 0) {
                this.updateCarousel(this.activeSlideIndex - 1);
            }
        }
    }

    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            const nextIndex = (this.activeSlideIndex + 1) % this.slides.length;
            this.updateCarousel(nextIndex);
        }, 10000);
    }

    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    addEventListeners() {
        if (this.dotsContainer) {
            this.dotsContainer.addEventListener('click', this.handleDotsClick.bind(this));
        }

        if (this.carouselTrack) {
            this.carouselTrack.addEventListener(
                'wheel',
                this.throttle(this.handleWheel.bind(this), 1000),
                { passive: false }
            );
        }

        this.slides.forEach((slide, index) => {
            slide.addEventListener('click', () => {
                if (index !== this.activeSlideIndex) {
                    this.updateCarousel(index);
                }
            });
        });

        const throttledResizeHandler = this.throttle(() => {
            this.updateCarousel(this.activeSlideIndex);
        }, 300);

        window.addEventListener('resize', throttledResizeHandler);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const SLIDE_CLASS_NAME = '.slide';
    const DOT_CLASS_NAME = 'feedback__carousel-dot';
    new Carousel('.feedback__carousel', SLIDE_CLASS_NAME, DOT_CLASS_NAME);
});