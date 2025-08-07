// Параллакс-эффект
document.addEventListener('scroll', function() {
    // Эффект параллакса для фона
    const sections = document.querySelectorAll('.fullscreen-section');
    const scrollPosition = window.pageYOffset;
    
    sections.forEach(section => {
        const speed = 0.5;
        const offset = scrollPosition * speed;
        section.style.backgroundPositionY = `calc(50% + ${offset}px)`;
    });
    
    // Изменение навигации при скролле
    const nav = document.querySelector('nav');
    if (scrollPosition > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    
    // Анимация появления текста
    animateContent();
});

// Анимация плавного появления контента
function animateContent() {
    const contentBlocks = document.querySelectorAll('.content');
    const windowHeight = window.innerHeight;
    const scrollPosition = window.pageYOffset;
    
    contentBlocks.forEach(block => {
        const blockPosition = block.getBoundingClientRect().top + scrollPosition;
        const blockHeight = block.offsetHeight;
        
        // Если блок в зоне видимости
        if (scrollPosition > blockPosition - windowHeight + blockHeight / 2) {
            block.classList.add('visible');
        }
    });
}

// Плавный скролл по якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Запуск анимации при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    animateContent();
});
