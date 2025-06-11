class MobileMenu {
    constructor() {
        this.menu = document.querySelector('.header__mobile-menu');
        this.menuButton = document.querySelector('.header__mobile-menu-button');
        this.closeButton = document.querySelector('.header__mobile-close-button');
        this.init();
    }

    init() {
        this.menuButton.addEventListener('click', this.handleToggleMenu.bind(this));
        this.closeButton.addEventListener('click', this.handleCloseMenu.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleToggleMenu() {
        if (this.menu.classList.contains('open')) {
            this.menu.classList.remove('open');
            return
        }
        this.menu.classList.add('open');
    }

    handleCloseMenu() {
        this.menu.classList.remove('open');
    }

    handleResize() {
        this.handleCloseMenu();
    }


}

new MobileMenu();