// Проверка мобильного устройства
function isMobile() {
  return window.innerWidth <= 768;
}

// Параллакс-эффект (только для десктопа)
function setupParallax() {
  if (!isMobile()) {
    document.addEventListener('scroll', function() {
      const sections = document.querySelectorAll('.fullscreen-section');
      const scrollPosition = window.pageYOffset;
      
      sections.forEach(section => {
        const speed = 0.3; // Меньшая скорость для плавности
        const offset = scrollPosition * speed;
        section.style.backgroundPositionY = `calc(50% + ${offset}px)`;
      });
    });
  }
}

// Анимация появления контента
function animateContent() {
  const contentBlocks = document.querySelectorAll('.content');
  const windowHeight = window.innerHeight;
  const scrollPosition = window.pageYOffset;
  
  contentBlocks.forEach(block => {
    const blockPosition = block.getBoundingClientRect().top + scrollPosition;
    
    if (scrollPosition > blockPosition - windowHeight + 100) {
      block.classList.add('visible');
    }
  });
}

// Плавный скролл
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    });
  });
}

// Изменение навигации при скролле
function setupNavbar() {
  window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.pageYOffset > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
  setupParallax();
  setupSmoothScroll();
  setupNavbar();
  animateContent(); // Первая проверка при загрузке
});

// Проверка при скролле
window.addEventListener('scroll', function() {
  animateContent();
});
