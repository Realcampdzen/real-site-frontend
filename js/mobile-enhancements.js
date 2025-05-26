// Mobile UX Enhancements for AI Studio

// ===== MOBILE DETECTION AND OPTIMIZATION =====

const isMobile = () => {
  return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

const isAndroid = () => {
  return /Android/.test(navigator.userAgent);
};

// ===== TOUCH GESTURE SUPPORT =====

class TouchGestureHandler {
  constructor() {
    this.startX = 0;
    this.startY = 0;
    this.endX = 0;
    this.endY = 0;
    this.minSwipeDistance = 50;
    this.maxSwipeTime = 300;
    this.startTime = 0;
    
    this.init();
  }
  
  init() {
    if (!isMobile()) return;
    
    document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
  }
  
  handleTouchStart(e) {
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
    this.startTime = Date.now();
  }
  
  handleTouchMove(e) {
    // Предотвращаем стандартное поведение для горизонтальных свайпов
    const deltaX = Math.abs(e.touches[0].clientX - this.startX);
    const deltaY = Math.abs(e.touches[0].clientY - this.startY);
    
    if (deltaX > deltaY && deltaX > 10) {
      e.preventDefault();
    }
  }
  
  handleTouchEnd(e) {
    this.endX = e.changedTouches[0].clientX;
    this.endY = e.changedTouches[0].clientY;
    
    const timeDiff = Date.now() - this.startTime;
    if (timeDiff > this.maxSwipeTime) return;
    
    this.detectSwipe();
  }
  
  detectSwipe() {
    const deltaX = this.endX - this.startX;
    const deltaY = this.endY - this.startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    
    if (absDeltaX < this.minSwipeDistance && absDeltaY < this.minSwipeDistance) return;
    
    if (absDeltaX > absDeltaY) {
      // Горизонтальный свайп
      if (deltaX > 0) {
        this.handleSwipeRight();
      } else {
        this.handleSwipeLeft();
      }
    } else {
      // Вертикальный свайп
      if (deltaY > 0) {
        this.handleSwipeDown();
      } else {
        this.handleSwipeUp();
      }
    }
  }
  
  handleSwipeLeft() {
    // Закрытие мобильного меню
    const mobileNav = document.getElementById('mobile-nav');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    
    if (mobileNav && mobileNav.classList.contains('active')) {
      mobileNav.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
    }
    
    // Переключение слайдов в testimonials
    this.nextTestimonial();
  }
  
  handleSwipeRight() {
    // Открытие мобильного меню (если курсор близко к краю)
    if (this.startX < 50) {
      const mobileNav = document.getElementById('mobile-nav');
      const mobileMenuBtn = document.getElementById('mobile-menu-btn');
      
      if (mobileNav && !mobileNav.classList.contains('active')) {
        mobileNav.classList.add('active');
        mobileMenuBtn.classList.add('active');
      }
    }
    
    // Переключение слайдов в testimonials
    this.prevTestimonial();
  }
  
  handleSwipeUp() {
    // Скрытие адресной строки на мобильных
    if (window.scrollY === 0) {
      window.scrollTo(0, 1);
    }
  }
  
  handleSwipeDown() {
    // Закрытие чатов при свайпе вниз в верхней части
    if (this.startY < 100) {
      this.closeActiveChats();
    }
  }
  
  nextTestimonial() {
    const event = new CustomEvent('testimonialNext');
    document.dispatchEvent(event);
  }
  
  prevTestimonial() {
    const event = new CustomEvent('testimonialPrev');
    document.dispatchEvent(event);
  }
  
  closeActiveChats() {
    const chats = [
      '.chat-overlay',
      '.hipych-widget',
      '.bro-cat-widget',
      '.ai-assistant-widget'
    ];
    
    chats.forEach(selector => {
      const chat = document.querySelector(selector);
      if (chat && (chat.classList.contains('active') || !chat.classList.contains('hidden'))) {
        const closeBtn = chat.querySelector('[class*="close"]');
        if (closeBtn) {
          closeBtn.click();
        }
      }
    });
  }
}

// ===== IMPROVED MOBILE NAVIGATION =====

class MobileNavigation {
  constructor() {
    this.init();
  }
  
  init() {
    if (!isMobile()) return;
    
    this.addTouchFeedback();
    this.improveScrollBehavior();
    this.addAutoClose();
  }
  
  addTouchFeedback() {
    const touchElements = document.querySelectorAll(`
      .btn-primary, .btn-secondary, .try-assistant-btn,
      .mobile-nav-link, .quick-btn, .hipych-quick-btn, .bro-cat-quick-btn
    `);
    
    touchElements.forEach(element => {
      element.addEventListener('touchstart', () => {
        element.style.transform = 'scale(0.95)';
        element.style.opacity = '0.8';
      }, { passive: true });
      
      element.addEventListener('touchend', () => {
        setTimeout(() => {
          element.style.transform = '';
          element.style.opacity = '';
        }, 150);
      }, { passive: true });
    });
  }
  
  improveScrollBehavior() {
    // Плавная прокрутка к активным элементам
    const links = document.querySelectorAll('.mobile-nav-link, .nav-link');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            this.scrollToElement(target);
          }
        }
      });
    });
  }
  
  scrollToElement(element) {
    const offset = isMobile() ? 80 : 100;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
  
  addAutoClose() {
    // Автоматическое закрытие меню при скролле
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      const mobileNav = document.getElementById('mobile-nav');
      const mobileMenuBtn = document.getElementById('mobile-menu-btn');
      
      if (mobileNav && mobileNav.classList.contains('active')) {
        if (Math.abs(currentScrollY - lastScrollY) > 50) {
          mobileNav.classList.remove('active');
          mobileMenuBtn.classList.remove('active');
        }
      }
      
      lastScrollY = currentScrollY;
    }, { passive: true });
  }
}

// ===== CHAT OPTIMIZATION FOR MOBILE =====

class MobileChatOptimizer {
  constructor() {
    this.init();
  }
  
  init() {
    if (!isMobile()) return;
    
    this.optimizeInputs();
    this.addFullscreenMode();
    this.improveScrolling();
    this.preventZoom();
  }
  
  optimizeInputs() {
    const inputs = document.querySelectorAll(`
      .chat-input, .hipych-input, .bro-cat-input, #chat-input,
      .ai-assistant-input
    `);
    
    inputs.forEach(input => {
      // Предотвращаем zoom на iOS
      input.setAttribute('autocomplete', 'off');
      input.setAttribute('autocorrect', 'off');
      input.setAttribute('autocapitalize', 'off');
      input.setAttribute('spellcheck', 'false');
      
      // Улучшаем фокус
      input.addEventListener('focus', () => {
        if (isIOS()) {
          // Небольшая задержка для iOS
          setTimeout(() => {
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
        }
      });
    });
  }
  
  addFullscreenMode() {
    const chatTriggers = document.querySelectorAll(`
      .hipych-trigger, .bro-cat-trigger, #open-ai-assistant,
      #open-ai-assistant-2
    `);
    
    chatTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        setTimeout(() => {
          this.makeFullscreen();
        }, 100);
      });
    });
  }
  
  makeFullscreen() {
    const chats = document.querySelectorAll(`
      .chat-container, .hipych-widget, .bro-cat-widget,
      .ai-assistant-widget
    `);
    
    chats.forEach(chat => {
      if (chat.classList.contains('active') || !chat.classList.contains('hidden')) {
        chat.style.cssText = `
          width: 100vw !important;
          height: 100vh !important;
          max-height: none !important;
          border-radius: 0 !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          z-index: 9999 !important;
        `;
        
        // Скрываем адресную строку
        this.hideAddressBar();
      }
    });
  }
  
  hideAddressBar() {
    if (isMobile()) {
      setTimeout(() => {
        window.scrollTo(0, 1);
      }, 100);
    }
  }
  
  improveScrolling() {
    const chatMessages = document.querySelectorAll(`
      .chat-messages, .hipych-messages, .bro-cat-messages,
      .ai-assistant-messages
    `);
    
    chatMessages.forEach(container => {
      container.style.webkitOverflowScrolling = 'touch';
      
      // Автоматический скролл к последнему сообщению
      const observer = new MutationObserver(() => {
        container.scrollTop = container.scrollHeight;
      });
      
      observer.observe(container, { childList: true });
    });
  }
  
  preventZoom() {
    // Предотвращаем zoom при двойном нажатии
    let lastTouchEnd = 0;
    
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, { passive: false });
  }
}

// ===== PERFORMANCE OPTIMIZATION =====

class MobilePerformanceOptimizer {
  constructor() {
    this.init();
  }
  
  init() {
    if (!isMobile()) return;
    
    this.optimizeAnimations();
    this.lazyLoadImages();
    this.throttleScrollEvents();
    this.optimizeParticles();
  }
  
  optimizeAnimations() {
    // Отключаем анимации частиц на слабых устройствах
    const isLowEnd = navigator.hardwareConcurrency <= 2 || 
                     navigator.deviceMemory <= 2;
    
    if (isLowEnd) {
      const particleCanvas = document.getElementById('particle-canvas');
      if (particleCanvas) {
        particleCanvas.style.display = 'none';
      }
      
      // Упрощаем CSS анимации
      document.documentElement.style.setProperty('--animation-speed', '0.1s');
    }
  }
  
  lazyLoadImages() {
    const images = document.querySelectorAll('img');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });
      
      images.forEach(img => imageObserver.observe(img));
    }
  }
  
  throttleScrollEvents() {
    let ticking = false;
    
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Обновляем scroll progress
          this.updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
  }
  
  updateScrollProgress() {
    const scrollProgress = document.getElementById('scroll-progress');
    if (!scrollProgress) return;
    
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    scrollProgress.style.width = `${Math.min(scrollPercent, 100)}%`;
  }
  
  optimizeParticles() {
    // Уменьшаем количество частиц на мобильных
    if (window.particleSystem) {
      window.particleSystem.maxParticles = Math.min(50, window.particleSystem.maxParticles);
    }
  }
}

// ===== ACCESSIBILITY IMPROVEMENTS =====

class MobileAccessibility {
  constructor() {
    this.init();
  }
  
  init() {
    this.improveFormLabels();
    this.addSkipLinks();
    this.enhanceFocus();
    this.addAriaLabels();
  }
  
  improveFormLabels() {
    const inputs = document.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      if (!input.getAttribute('aria-label') && !input.getAttribute('placeholder')) {
        input.setAttribute('aria-label', 'Введите текст');
      }
    });
  }
  
  addSkipLinks() {
    if (document.querySelector('.skip-link')) return;
    
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Перейти к основному содержанию';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--bg-primary);
      color: var(--text-primary);
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 10000;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
  
  enhanceFocus() {
    // Улучшаем видимость фокуса
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('using-keyboard');
    });
  }
  
  addAriaLabels() {
    // Добавляем ARIA метки для важных элементов
    const elements = [
      { selector: '.mobile-menu-btn', label: 'Открыть меню' },
      { selector: '.chat-close', label: 'Закрыть чат' },
      { selector: '.hipych-close', label: 'Закрыть чат с Хипычем' },
      { selector: '.bro-cat-close', label: 'Закрыть чат с Бро Котом' },
      { selector: '.back-to-top', label: 'Вернуться наверх' }
    ];
    
    elements.forEach(({ selector, label }) => {
      const element = document.querySelector(selector);
      if (element && !element.getAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
      }
    });
  }
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', () => {
  if (isMobile()) {
    console.log('🚀 Initializing mobile enhancements...');
    
    // Инициализируем все мобильные улучшения
    new TouchGestureHandler();
    new MobileNavigation();
    new MobileChatOptimizer();
    new MobilePerformanceOptimizer();
    new MobileAccessibility();
    
    // Добавляем класс для мобильных устройств
    document.body.classList.add('mobile-device');
    
    if (isIOS()) {
      document.body.classList.add('ios-device');
    }
    
    if (isAndroid()) {
      document.body.classList.add('android-device');
    }
    
    console.log('✅ Mobile enhancements loaded successfully');
  }
});

// ===== UTILS =====

// Функция для добавления CSS стилей для мобильных устройств
function addMobileStyles() {
  if (!isMobile()) return;
  
  const mobileCSS = document.createElement('link');
  mobileCSS.rel = 'stylesheet';
  mobileCSS.href = 'css/mobile-improvements.css';
  document.head.appendChild(mobileCSS);
}

// Функция для оптимизации изображений
function optimizeImages() {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    if (isMobile() && img.src.includes('avatar')) {
      // Заменяем большие аватары на мобильные версии
      const mobileSrc = img.src.replace('.jpg', '-mobile.jpg');
      img.src = mobileSrc;
    }
  });
}

// Функция для обнаружения orientation changes
function handleOrientationChange() {
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      // Пересчитываем размеры после поворота
      window.dispatchEvent(new Event('resize'));
      
      // Скрываем адресную строку
      if (isMobile()) {
        window.scrollTo(0, 1);
      }
    }, 100);
  });
}

// Инициализация дополнительных функций
document.addEventListener('DOMContentLoaded', () => {
  addMobileStyles();
  optimizeImages();
  handleOrientationChange();
});

// Экспорт для использования в других файлах
window.MobileEnhancements = {
  isMobile,
  isIOS,
  isAndroid,
  TouchGestureHandler,
  MobileNavigation,
  MobileChatOptimizer,
  MobilePerformanceOptimizer,
  MobileAccessibility
}; 